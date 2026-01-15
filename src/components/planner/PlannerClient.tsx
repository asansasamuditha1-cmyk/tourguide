"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LoaderCircle } from "lucide-react";
import { generateTourItinerary, type TourItineraryOutput } from "@/ai/flows/personalized-tour-itinerary";
import { useToast } from "@/hooks/use-toast";
import { ItineraryDisplay } from "./ItineraryDisplay";

const plannerSchema = z.object({
  interests: z.string().min(3, "Tell us your interests (e.g., history, nature)."),
  budget: z.enum(["low", "medium", "high"]),
  duration: z.string().min(3, "How long is your trip? (e.g., 3 days)"),
  locationPreferences: z.string().min(3, "Any preferred cities or regions?"),
  travelStyle: z.string().min(3, "Describe your travel style (e.g., relaxing, adventurous)."),
});

type PlannerFormValues = z.infer<typeof plannerSchema>;

export function PlannerClient() {
  const [itinerary, setItinerary] = useState<TourItineraryOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<PlannerFormValues>({
    resolver: zodResolver(plannerSchema),
    defaultValues: {
      interests: "history, nature, beaches",
      budget: "medium",
      duration: "7 days",
      locationPreferences: "Kandy, Ella, Mirissa",
      travelStyle: "A mix of cultural exploration and relaxation",
    },
  });

  const onSubmit = async (data: PlannerFormValues) => {
    setIsLoading(true);
    setItinerary(null);
    try {
      const result = await generateTourItinerary(data);
      setItinerary(result);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "AI Error",
        description: "Failed to generate an itinerary. Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid gap-8 md:grid-cols-12">
      <div className="md:col-span-4 lg:col-span-3">
        <Card>
          <CardHeader>
            <CardTitle>Trip Details</CardTitle>
            <CardDescription>Fill this out to generate your tour.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField control={form.control} name="interests" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Interests</FormLabel>
                    <FormControl><Input placeholder="e.g., history, nature" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="budget" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Budget</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="duration" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Trip Duration</FormLabel>
                    <FormControl><Input placeholder="e.g., 7 days" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="locationPreferences" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Locations</FormLabel>
                    <FormControl><Input placeholder="e.g., Kandy, Colombo" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                 <FormField control={form.control} name="travelStyle" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Travel Style</FormLabel>
                    <FormControl><Input placeholder="e.g., adventurous" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <Button type="submit" className="w-full bg-accent hover:bg-accent/90" disabled={isLoading}>
                  {isLoading && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                  Generate Itinerary
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
      <div className="md:col-span-8 lg:col-span-9">
        {isLoading && (
          <div className="flex items-center justify-center h-full rounded-lg border-2 border-dashed p-8">
            <div className="text-center">
              <LoaderCircle className="mx-auto h-12 w-12 animate-spin text-primary mb-4" />
              <h3 className="text-xl font-semibold">Our AI is planning your trip...</h3>
              <p className="text-muted-foreground">This may take a moment.</p>
            </div>
          </div>
        )}
        {itinerary ? (
          <ItineraryDisplay itinerary={itinerary} title={form.getValues("duration") + " Trip"} />
        ) : !isLoading && (
          <div className="flex items-center justify-center h-full rounded-lg border-2 border-dashed p-8 text-center">
            <div>
              <h3 className="text-xl font-semibold">Your personalized itinerary will appear here.</h3>
              <p className="text-muted-foreground">Let's get planning!</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
