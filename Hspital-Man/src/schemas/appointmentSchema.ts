import { z } from "zod";

export const appointmentSchema = z.object({
  patientId: z.string().min(1, "Patient is required"),
  doctorId: z.string().min(1, "Doctor is required"),
  appointmentDate: z.string().min(1, "Appointment date is required"),
  reason: z.string().min(5, "Reason must be at least 5 characters"),
  appointmentType: z.enum(["Consultation", "FollowUp", "Emergency", "Surgery"]),
  durationMinutes: z.number().min(15, "Duration must be at least 15 minutes"),
  fee: z.number().min(0, "Fee must be positive").optional(),
  notes: z.string().optional(),
});

export type AppointmentFormData = z.infer<typeof appointmentSchema>;

export interface Appointment extends AppointmentFormData {
  id: string;
  status: "Scheduled" | "Confirmed" | "InProgress" | "Completed" | "Cancelled" | "NoShow";
  createdDate: string;
  completedDate?: string;
}