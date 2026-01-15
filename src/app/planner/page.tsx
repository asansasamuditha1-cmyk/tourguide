import { PlannerClient } from "@/components/planner/PlannerClient";

export default function PlannerPage() {
  return (
    <div className="space-y-8">
      <section className="text-center">
        <h1 className="text-4xl font-bold font-headline tracking-tight text-primary">AI-Powered Tour Planner</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Craft your perfect Sri Lankan adventure. Just tell us what you love!
        </p>
      </section>
      <PlannerClient />
    </div>
  );
}
