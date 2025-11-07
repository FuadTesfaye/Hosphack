import { z } from "zod";

export const billingSchema = z.object({
  patientId: z.string().min(1, "Patient is required"),
  amount: z.number().min(0.01, "Amount must be greater than 0"),
  description: z.string().min(5, "Description is required").optional(),
});

export type BillingFormData = z.infer<typeof billingSchema>;

export interface Bill extends BillingFormData {
  id: string;
  billingDate: string;
  isPaid: boolean;
}