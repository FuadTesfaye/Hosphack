// This is a server-side file.
'use server';

/**
 * @fileOverview AI-driven medicine recommendations flow.
 *
 * This file contains the Genkit flow for providing AI-driven medicine recommendations based on user search history.
 * It suggests relevant alternatives to prescribed medications using an LLM.
 *
 * - `getMedicineRecommendations` - A function that takes a user's search history and returns medicine recommendations.
 * - `MedicineRecommendationsInput` - The input type for the `getMedicineRecommendations` function.
 * - `MedicineRecommendationsOutput` - The return type for the `getMedicineRecommendations` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MedicineRecommendationsInputSchema = z.object({
  searchHistory: z
    .string()
    .describe('The user search history, as a string of comma separated medicine names.'),
  prescribedMedication: z.string().describe('The name of the prescribed medication.'),
});
export type MedicineRecommendationsInput = z.infer<typeof MedicineRecommendationsInputSchema>;

const MedicineRecommendationsOutputSchema = z.object({
  recommendedAlternatives: z
    .string()
    .describe('A list of recommended alternative medications, separated by commas.'),
  reasoning: z.string().describe('The reasoning behind the recommendations.'),
});
export type MedicineRecommendationsOutput = z.infer<typeof MedicineRecommendationsOutputSchema>;

export async function getMedicineRecommendations(input: MedicineRecommendationsInput): Promise<MedicineRecommendationsOutput> {
  return medicineRecommendationsFlow(input);
}

const medicineRecommendationsPrompt = ai.definePrompt({
  name: 'medicineRecommendationsPrompt',
  input: {schema: MedicineRecommendationsInputSchema},
  output: {schema: MedicineRecommendationsOutputSchema},
  prompt: `You are an AI assistant specialized in providing medicine recommendations.

  Based on the user's search history and prescribed medication, suggest relevant alternatives.
  Explain the reasoning behind your recommendations.

  User Search History: {{{searchHistory}}}
  Prescribed Medication: {{{prescribedMedication}}}

  Provide the recommendations in a comma-separated list, and explain your reasoning.`,
});

const medicineRecommendationsFlow = ai.defineFlow(
  {
    name: 'medicineRecommendationsFlow',
    inputSchema: MedicineRecommendationsInputSchema,
    outputSchema: MedicineRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await medicineRecommendationsPrompt(input);
    return output!;
  }
);
