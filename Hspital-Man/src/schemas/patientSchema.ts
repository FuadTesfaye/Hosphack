import { z } from 'zod';

export const patientSchema = z.object({
  firstName: z.string()
    .min(1, 'First name is required')
    .max(50, 'First name must be less than 50 characters')
    .regex(/^[a-zA-Z\s-]+$/, 'First name can only contain letters, spaces, and hyphens'),
  
  lastName: z.string()
    .min(1, 'Last name is required')
    .max(50, 'Last name must be less than 50 characters')
    .regex(/^[a-zA-Z\s-]+$/, 'Last name can only contain letters, spaces, and hyphens'),
  
  email: z.string()
    .email('Invalid email address')
    .max(255, 'Email must be less than 255 characters'),
  
  phone: z.string()
    .min(10, 'Phone number must be at least 10 digits')
    .max(15, 'Phone number must be less than 15 digits')
    .regex(/^[+]?[\d\s-()]+$/, 'Invalid phone number format'),
  
  dateOfBirth: z.string()
    .min(1, 'Date of birth is required'),
  
  gender: z.enum(['Male', 'Female', 'Other'], {
    errorMap: () => ({ message: 'Please select a gender' }),
  }),
  
  bloodGroup: z.string().optional(),
  
  address: z.string()
    .min(1, 'Address is required')
    .max(200, 'Address must be less than 200 characters'),
  
  emergencyContact: z.string()
    .min(1, 'Emergency contact name is required')
    .max(100, 'Emergency contact name must be less than 100 characters'),
  
  emergencyPhone: z.string()
    .min(10, 'Emergency phone must be at least 10 digits')
    .max(15, 'Emergency phone must be less than 15 digits')
    .regex(/^[+]?[\d\s-()]+$/, 'Invalid phone number format'),
  
  allergies: z.string()
    .max(500, 'Allergies must be less than 500 characters')
    .optional(),
  
  chronicConditions: z.string()
    .max(500, 'Chronic conditions must be less than 500 characters')
    .optional(),
  
  insuranceProvider: z.string()
    .max(100, 'Insurance provider must be less than 100 characters')
    .optional(),
  
  insuranceNumber: z.string()
    .max(50, 'Insurance number must be less than 50 characters')
    .optional(),
});

export type PatientFormData = z.infer<typeof patientSchema>;
