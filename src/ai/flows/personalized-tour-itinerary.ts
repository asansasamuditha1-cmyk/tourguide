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
      'Preferred travel style (e.g., relaxing, adventurous, cultural exploration). Examples: Relaxing beach vacation, Adventurous hiking trip, Cultural exploration of historical sites'
    ),
});
export type TourItineraryInput = z.infer<typeof TourItineraryInputSchema>;

const TourItineraryOutputSchema = z.object({
  itinerary: z.string().describe('A detailed tour itinerary for Sri Lanka formatted in Markdown.'),
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
  prompt: `You are an expert travel agent creating a professional and visually stunning tour plan for Sri Lanka. The output must be in Markdown format.

**Instructions for the AI:**

1.  **Title:** Start with a catchy, descriptive title for the tour.
2.  **Overall Tone:** Write in an enthusiastic, inviting, and professional tone.
3.  **Structure each day:**
    *   Use a main heading for each day (e.g., '### Day 1: Colombo's Coastal Charms 🌊'). Use a relevant emoji.
    *   Break down each day into **Morning**, **Afternoon**, and **Evening** with subheadings.
    *   Use bullet points for activities, sights, and dining suggestions.
    *   Use **bold text** to highlight key locations, activities, or restaurant names.
4.  **Content for each entry:**
    *   Provide brief, enticing descriptions.
    *   Suggest accommodations and restaurants that fit the user's **budget**.
5.  **Pro-Tips:** After each day's plan, include a '💡 **Pro-Tip**:' section with useful advice (e.g., "Book Sigiriya tickets online to avoid queues.").
6.  **Formatting:** Ensure the entire response is clean, well-spaced, and easy to read.

**User Preferences:**
- **Interests:** {{{interests}}}
- **Budget:** {{{budget}}}
- **Duration:** {{{duration}}}
- **Location Preferences:** {{{locationPreferences}}}
- **Travel Style:** {{{travelStyle}}}

Generate a detailed and attractive itinerary following these instructions precisely.
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
