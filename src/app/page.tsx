import { RecommendationEngine } from "@/components/recommendations/RecommendationEngine";
import { Suspense } from "react";

export default function Home() {
  return (
    <div className="space-y-8">
      <section className="text-center">
        <h1 className="text-4xl font-bold font-headline tracking-tight text-primary">Discover Sri Lanka</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Let our AI guide you to the best spots near you.
        </p>
      </section>
      <Suspense fallback={<p>Loading recommendations...</p>}>
        <RecommendationEngine />
      </Suspense>
    </div>
  );
}
