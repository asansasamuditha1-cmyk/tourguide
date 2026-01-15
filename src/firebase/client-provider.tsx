
"use client";
import { firebaseApp, auth, db } from ".";
import { FirebaseProvider } from "./provider";

export function FirebaseClientProvider({ children }: { children: React.ReactNode }) {
    return (
        <FirebaseProvider value={{ firebaseApp, auth, db }}>
            {children}
        </FirebaseProvider>
    );
}
