'use server';
/**
 * @fileOverview An AI-powered recommendation flow for suggesting nearby attractions, restaurants, and activities.
 *
 * - aiPoweredRecommendations - A function that generates personalized recommendations based on location and preferences.
 * - AiPoweredRecommendationsInput - The input type for the aiPoweredRecommendations function.
 * - AiPoweredRecommendationsOutput - The return type for the aiPoweredRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiPoweredRecommendationsInputSchema = z.object({
  latitude: z.number().describe('The latitude of the user.'),
  longitude: z.number().describe('The longitude of the user.'),
  interests: z.string().describe('The user interests, separated by commas.'),
  budget: z.string().describe('The budget of the user (e.g., low, medium, high).'),
  duration: z.string().describe('The duration of the trip (e.g., 1 day, 3 days, 1 week).'),
});
export type AiPoweredRecommendationsInput = z.infer<typeof AiPoweredRecommendationsInputSchema>;

const AiPoweredRecommendationsOutputSchema = z.object({
  recommendations: z.array(
    z.object({
      name: z.string().describe('The name of the recommended place.'),
      type: z.string().describe('The type of the recommendation (e.g., attraction, restaurant, activity).'),
      description: z.string().describe('A short description of the recommendation.'),
      address: z.string().describe('The address of the recommended place.'),
      rating: z.number().describe('The rating of the recommended place.'),
      imageUrl: z.string().describe('A URL of an image of the recommended place.'),
    })
  ).describe('A list of AI-powered recommendations based on the user preferences.'),
});
export type AiPoweredRecommendationsOutput = z.infer<typeof AiPoweredRecommendationsOutputSchema>;

export async function aiPoweredRecommendations(input: AiPoweredRecommendationsInput): Promise<AiPoweredRecommendationsOutput> {
  return aiPoweredRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiPoweredRecommendationsPrompt',
  input: {schema: AiPoweredRecommendationsInputSchema},
  output: {schema: AiPoweredRecommendationsOutputSchema},
  prompt: `You are an AI tour guide expert specializing in providing personalized recommendations to tourists.

  Based on the user's current location (latitude: {{{latitude}}}, longitude: {{{longitude}}}), interests ({{{interests}}}), budget ({{{budget}}}), and duration ({{{duration}}}), generate a list of recommendations for nearby attractions, restaurants, and activities.

  Prioritize the recommendations based on popularity, user reviews, and relevance to the user's interests. Provide a variety of options to ensure a comprehensive and engaging experience for the user. The recommendations should be tailored to Sri Lanka.

  Ensure that each recommendation includes the name, type, description, address, rating, and image URL of the recommended place. Return the recommendations as a JSON array.
  Here are the user's details:
  - Latitude: {{latitude}}
  - Longitude: {{longitude}}
  - Interests: {{interests}}
  - Budget: {{budget}}
  - Duration: {{duration}}
  Follow these instructions precisely.
  `,
});

const aiPoweredRecommendationsFlow = ai.defineFlow(
  {
    name: 'aiPoweredRecommendationsFlow',
    inputSchema: AiPoweredRecommendationsInputSchema,
    outputSchema: AiPoweredRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
