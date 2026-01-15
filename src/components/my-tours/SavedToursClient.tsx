"use client";

import { useEffect, useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { BookOpen, Trash2 } from "lucide-react";
import type { TourItineraryOutput } from "@/ai/flows/personalized-tour-itinerary";

type SavedTour = {
  id: string;
  title: string;
  itinerary: TourItineraryOutput;
  savedAt: string;
};

export function SavedToursClient() {
  const [savedTours, setSavedTours] = useState<SavedTour[]>([]);
  const [isClient, setIsClient] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
    try {
      const tours = JSON.parse(localStorage.getItem("savedTours") || "[]");
      setSavedTours(tours);
    } catch (error) {
      console.error("Failed to load tours from localStorage", error);
    }
  }, []);

  const deleteTour = (id: string) => {
    const updatedTours = savedTours.filter(tour => tour.id !== id);
    setSavedTours(updatedTours);
    localStorage.setItem("savedTours", JSON.stringify(updatedTours));
    toast({
      title: "Tour Deleted",
      description: "The itinerary has been removed from your saved tours.",
    });
  };

  if (!isClient) {
    return (
        <div className="w-full max-w-4xl mx-auto space-y-4">
            {Array.from({length: 3}).map((_, i) => (
                <div key={i} className="h-12 w-full bg-muted animate-pulse rounded-md"></div>
            ))}
        </div>
    );
  }

  if (savedTours.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center p-8 border-2 border-dashed rounded-lg">
        <BookOpen className="h-16 w-16 text-muted-foreground mb-4"/>
        <h3 className="text-xl font-semibold">No Saved Tours Yet</h3>
        <p className="text-muted-foreground">Use the AI Planner to create and save your perfect trip!</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Accordion type="single" collapsible className="w-full">
        {savedTours.map((tour) => (
          <AccordionItem value={tour.id} key={tour.id}>
            <div className="flex justify-between items-center w-full">
              <AccordionTrigger className="hover:no-underline flex-grow pr-4">
                  <div className="text-left">
                      <span className="font-semibold text-lg">{tour.title}</span>
                      <p className="text-sm text-muted-foreground">Saved on {new Date(tour.id).toLocaleDateString()}</p>
                  </div>
              </AccordionTrigger>
              <Button variant="ghost" size="icon" onClick={() => deleteTour(tour.id)} className="mr-2 flex-shrink-0">
                  <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
            <AccordionContent>
                <div className="prose prose-sm max-w-none text-foreground whitespace-pre-wrap rounded-md bg-muted p-4">
                  {tour.itinerary.itinerary}
                </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
