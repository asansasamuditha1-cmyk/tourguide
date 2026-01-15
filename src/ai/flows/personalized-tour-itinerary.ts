'use server';
/**
 * @fileOverview AI-powered trip planner flow for generating personalized Sri Lanka tour itineraries.
 *
 * - generateTourItinerary - A function that generates a personalized tour itinerary.
 * - TourItineraryInput - The input type for the generateTourItinerary function.
 * - TourItineraryOutput - The return type for the generateTourItinerary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TourItineraryInputSchema = z.object({
  interests: z
    .string()
    .describe('User interests (e.g., history, nature, beaches).'),
  budget: z.string().describe('User budget (e.g., low, medium, high).'),
  duration: z.string().describe('Trip duration in days (e.g., 3 days, 1 week).'),
  locationPreferences: z
    .string()
    .describe('Preferred regions or cities in Sri Lanka (e.g., Kandy, Colombo).'),
  travelStyle: z
    .string()
    .describe(
      'Preferred travel style (e.g., relaxing, adventurous, cultural exploration).
  ' + ' Examples: Relaxing beach vacation, Adventurous hiking trip, Cultural exploration of historical sites'
    ),
});
export type TourItineraryInput = z.infer<typeof TourItineraryInputSchema>;

const TourItineraryOutputSchema = z.object({
  itinerary: z.string().describe('A detailed tour itinerary for Sri Lanka.'),
});
export type TourItineraryOutput = z.infer<typeof TourItineraryOutputSchema>;

export async function generateTourItinerary(
  input: TourItineraryInput
): Promise<TourItineraryOutput> {
  return generateTourItineraryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'tourItineraryPrompt',
  input: {schema: TourItineraryInputSchema},
  output: {schema: TourItineraryOutputSchema},
  prompt: `You are an expert travel agent specializing in Sri Lanka tours. Generate a personalized tour itinerary based on the user's preferences.

Consider real-time data such as weather, traffic, and event schedules when creating the itinerary.

Interests: {{{interests}}}
Budget: {{{budget}}}
Duration: {{{duration}}}
Location Preferences: {{{locationPreferences}}}
Travel Style: {{{travelStyle}}}

Provide a detailed itinerary including specific places to visit, activities, and estimated time for each activity. Suggest accommodations and restaurants appropriate for the specified budget.
`,
});

const generateTourItineraryFlow = ai.defineFlow(
  {
    name: 'generateTourItineraryFlow',
    inputSchema: TourItineraryInputSchema,
    outputSchema: TourItineraryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
