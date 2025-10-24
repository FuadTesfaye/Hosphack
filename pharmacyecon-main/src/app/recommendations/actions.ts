'use server';

import { getMedicineRecommendations, MedicineRecommendationsInput, MedicineRecommendationsOutput } from '@/ai/flows/medicine-recommendations';
import { z } from 'zod';

const FormSchema = z.object({
  prescribedMedication: z.string().min(1, 'Prescribed medication is required.'),
  searchHistory: z.string().min(1, 'Search history is required.'),
});

interface RecommendationsState {
    message?: string;
    recommendations?: MedicineRecommendationsOutput;
    error?: string;
}

export async function getRecommendationsAction(
  prevState: RecommendationsState,
  formData: FormData
): Promise<RecommendationsState> {
  
  const validatedFields = FormSchema.safeParse({
    prescribedMedication: formData.get('prescribedMedication'),
    searchHistory: formData.get('searchHistory'),
  });

  if (!validatedFields.success) {
    return {
      error: 'Invalid input. Please check the fields and try again.',
    };
  }

  try {
    const input: MedicineRecommendationsInput = validatedFields.data;
    const recommendations = await getMedicineRecommendations(input);
    return {
        message: 'Recommendations generated successfully.',
        recommendations,
    };
  } catch (e) {
    console.error(e);
    return { error: 'Failed to get recommendations. Please try again later.' };
  }
}
