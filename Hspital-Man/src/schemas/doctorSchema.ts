import { z } from "zod";

export const doctorSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  specialization: z.string().min(2, "Specialization is required"),
  licenseNumber: z.string().min(5, "License number is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  department: z.string().min(2, "Department is required"),
  consultationFee: z.number().min(0, "Fee must be positive"),
  qualifications: z.string().min(2, "Qualifications are required"),
  experienceYears: z.number().min(0, "Experience must be positive"),
});

export type DoctorFormData = z.infer<typeof doctorSchema>;

export interface Doctor extends DoctorFormData {
  id: string;
  isActive: boolean;
  joinDate: string;
}