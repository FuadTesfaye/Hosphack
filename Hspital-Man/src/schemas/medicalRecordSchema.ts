import { z } from "zod";

export const medicalRecordSchema = z.object({
  patientId: z.string().min(1, "Patient is required"),
  doctorId: z.string().min(1, "Doctor is required"),
  visitDate: z.string().min(1, "Visit date is required"),
  diagnosis: z.string().min(5, "Diagnosis must be at least 5 characters"),
  treatment: z.string().min(5, "Treatment must be at least 5 characters"),
  notes: z.string().optional(),
});

export type MedicalRecordFormData = z.infer<typeof medicalRecordSchema>;

export interface MedicalRecord extends MedicalRecordFormData {
  id: string;
}