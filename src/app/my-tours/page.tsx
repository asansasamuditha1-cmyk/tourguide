import { SavedToursClient } from "@/components/my-tours/SavedToursClient";
import { Suspense } from "react";

export default function MyToursPage() {
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
