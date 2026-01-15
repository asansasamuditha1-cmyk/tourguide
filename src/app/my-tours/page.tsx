
"use client";

import { SavedToursClient } from "@/components/my-tours/SavedToursClient";
import { useUser } from "@/firebase/auth/use-user";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { Suspense, useEffect } from "react";

export default function MyToursPage() {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login?redirect=/my-tours");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoaderCircle className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <div className="space-y-8">
      <section className="text-center">
        <h1 className="text-4xl font-bold font-headline tracking-tight text-primary">My Saved Tours</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Your personalized Sri Lankan adventures, ready for offline access.
        </p>
      </section>
      <Suspense fallback={<p>Loading saved tours...</p>}>
        <SavedToursClient />
      </Suspense>
    </div>
  );
}
