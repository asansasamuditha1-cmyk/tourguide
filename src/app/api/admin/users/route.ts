
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import * as admin from 'firebase-admin';

// This is the shape of the user object the client expects
type AppUser = {
  uid: string;
  email: string | undefined;
  displayName: string | undefined;
  photoURL: string | undefined;
  metadata: {
    lastSignInTime: string | undefined;
  };
  customClaims: { [key: string]: any } | undefined;
};


// =================================================================================
// IMPORTANT: BACKEND SETUP REQUIRED
// =================================================================================
// This endpoint requires a secure backend setup with the Firebase Admin SDK.
// The following code is a template. To make it functional, you must:
//
// 1. GENERATE A SERVICE ACCOUNT KEY:
//    - Go to your Firebase Project Settings > Service accounts.
//    - Click "Generate new private key" and download the JSON file.
//
// 2. SET ENVIRONMENT VARIABLES SECURELY:
//    - DO NOT commit the JSON file to your repository.
//    - Copy the contents of the downloaded JSON file.
//    - Create a new file named `.env.local` in the root of your project.
//    - Add the following line to `.env.local`, pasting the JSON content inside the quotes:
//      FIREBASE_SERVICE_ACCOUNT_KEY='<PASTE YOUR SERVICE ACCOUNT JSON HERE>'
//
// 3. (FOR PRODUCTION) CONFIGURE YOUR HOSTING ENVIRONMENT:
//    - When you deploy your app, you must set the FIREBASE_SERVICE_ACCOUNT_KEY
//      environment variable in your hosting provider's settings (e.g., Vercel, Netlify).
//
// 4. UNCOMMENT THE CODE in `initializeFirebaseAdmin` function below.
// =================================================================================

function initializeFirebaseAdmin() {
  // --- UNCOMMENT THE FOLLOWING CODE ONCE YOU HAVE SET YOUR ENVIRONMENT VARIABLE ---
  /*
  if (admin.apps.length === 0) {
    const serviceAccountString = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

    if (!serviceAccountString) {
      throw new Error('The FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not set. See instructions in src/app/api/admin/users/route.ts');
    }
    
    try {
      const serviceAccount = JSON.parse(serviceAccountString);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    } catch(e) {
        console.error('Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY. Make sure it is a valid JSON string.', e);
        throw new Error('Firebase Admin initialization failed.');
    }
  }
  */
}


export async function GET(request: Request) {
  try {
    initializeFirebaseAdmin();
    
    // --- THIS IS A PLACEHOLDER - REMOVE AFTER SETUP ---
    // The following block will be active until the Admin SDK is initialized.
    // It returns a placeholder response for UI development.
    // Once you uncomment the `initializeFirebaseAdmin` logic, this `if` block can be removed.
    if (admin.apps.length === 0) {
      console.warn("Firebase Admin SDK not initialized. Returning placeholder data. See instructions in src/app/api/admin/users/route.ts");
      const placeholderUsers: AppUser[] = [
        { uid: '1', email: 'jane.doe@example.com', displayName: 'Jane Doe', photoURL: '', metadata: { lastSignInTime: new Date().toISOString() }, customClaims: { isAdmin: true } },
        { uid: '2', email: 'john.smith@example.com', displayName: 'John Smith', photoURL: '', metadata: { lastSignInTime: new Date(Date.now() - 86400000).toISOString() }, customClaims: {} },
      ];
      return NextResponse.json(placeholderUsers);
    }
    // --- END OF PLACEHOLDER ---


    // Get the authorization token from the request headers
    const headersList = headers();
    const authorization = headersList.get('authorization');
    if (!authorization || !authorization.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized: No token provided' }, { status: 401 });
    }
    const idToken = authorization.split('Bearer ')[1];

    // Verify the token and check for admin custom claim
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    if (decodedToken.isAdmin !== true) {
      return NextResponse.json({ error: 'Forbidden: User is not an admin' }, { status: 403 });
    }

    // If the user is an admin, list all users
    const userRecords = await admin.auth().listUsers();

    const users: AppUser[] = userRecords.users.map(user => ({
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      metadata: {
        lastSignInTime: user.metadata.lastSignInTime,
      },
      customClaims: user.customClaims
    }));

    return NextResponse.json(users);

  } catch (error: any) {
    console.error('API Error:', error);
    if (error.code === 'auth/id-token-expired') {
      return NextResponse.json({ error: 'Unauthorized: Token expired' }, { status: 401 });
    }
    return NextResponse.json({ error: error.message || 'An internal server error occurred.' }, { status: 500 });
  }
}
