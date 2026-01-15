"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LoaderCircle, Navigation, Compass } from "lucide-react";
import { aiPoweredRecommendations, type AiPoweredRecommendationsOutput } from "@/ai/flows/ai-powered-recommendations";
import { useToast } from "@/hooks/use-toast";
import { RecommendationCard } from "./RecommendationCard";

const recommendationSchema = z.object({
  interests: z.string().min(3, "Please tell us what you're interested in."),
  budget: z.enum(["low", "medium", "high"]),
  duration: z.string().min(1, "Please enter trip duration."),
});

type RecommendationFormValues = z.infer<typeof recommendationSchema>;

export function RecommendationEngine() {
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<AiPoweredRecommendationsOutput["recommendations"]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<RecommendationFormValues>({
    resolver: zodResolver(recommendationSchema),
    defaultValues: {
      interests: "history, food",
      budget: "medium",
      duration: "1 day",
    },
  });

  const getLocation = () => {
    setIsLoading(true);
    setLocationError(null);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setIsLoading(false);
      },
      (error) => {
        setLocationError(error.message);
        toast({
          variant: "destructive",
          title: "Location Error",
          description: "Could not get your location. Please enable location services and try again.",
        });
        setIsLoading(false);
      }
    );
  };

  useEffect(() => {
    // Automatically get location on component mount
    getLocation();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async (data: RecommendationFormValues) => {
    if (!location) {
      toast({
        variant: "destructive",
        title: "Location Missing",
        description: "Please enable location to get recommendations.",
      });
      return;
    }
    setIsLoading(true);
    setRecommendations([]);
    try {
      const result = await aiPoweredRecommendations({ ...data, ...location });
      if (result.recommendations && result.recommendations.length > 0) {
        setRecommendations(result.recommendations);
      } else {
        toast({
          title: "No Recommendations Found",
          description: "We couldn't find any recommendations for your preferences. Try something different!",
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "AI Error",
        description: "Failed to get recommendations from the AI. Please try again later.",
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
            <CardTitle>Your Preferences</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Location</h3>
                  {location ? (
                    <p className="text-sm text-muted-foreground p-2 bg-muted rounded-md">
                      Lat: {location.latitude.toFixed(4)}, Lon: {location.longitude.toFixed(4)}
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground">{locationError || "Waiting for location..."}</p>
                  )}
                  <Button type="button" variant="outline" size="sm" onClick={getLocation} disabled={isLoading}>
                    <Navigation className="mr-2 h-4 w-4"/>
                    {isLoading ? "Getting Location..." : "Refresh Location"}
                  </Button>
                </div>
                <FormField
                  control={form.control}
                  name="interests"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Interests</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., beaches, temples, hiking" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="budget"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Budget</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your budget" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 2 hours, half day, 1 day" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full bg-accent hover:bg-accent/90" disabled={isLoading || !location}>
                  {isLoading ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Find Recommendations
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
      <div className="md:col-span-8 lg:col-span-9">
        {isLoading && recommendations.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
             {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i}>
                    <div className="w-full h-40 bg-muted animate-pulse"></div>
                    <CardHeader>
                        <div className="h-6 w-3/4 bg-muted animate-pulse rounded"></div>
                    </CardHeader>
                    <CardContent>
                        <div className="h-4 w-full bg-muted animate-pulse rounded mb-2"></div>
                        <div className="h-4 w-2/3 bg-muted animate-pulse rounded"></div>
                    </CardContent>
                </Card>
             ))}
          </div>
        ) : recommendations.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendations.map((rec, index) => (
              <RecommendationCard key={index} recommendation={rec} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center p-8 border-2 border-dashed rounded-lg">
            <Compass className="h-16 w-16 text-muted-foreground mb-4"/>
            <h3 className="text-xl font-semibold">Ready to Explore?</h3>
            <p className="text-muted-foreground">Fill in your preferences and get personalized recommendations.</p>
          </div>
        )}
      </div>
    </div>
  );
}
