import { create } from 'zustand';

export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  bloodGroup?: string;
  address: string;
  emergencyContact: string;
  emergencyPhone: string;
  allergies?: string;
  chronicConditions?: string;
  insuranceProvider?: string;
  insuranceNumber?: string;
  registrationDate: string;
}

interface PatientStore {
  patients: Patient[];
  setPatients: (patients: Patient[]) => void;
  addPatient: (patient: Patient) => void;
  updatePatient: (id: string, patient: Partial<Patient>) => void;
  deletePatient: (id: string) => void;
  getPatient: (id: string) => Patient | undefined;
  searchPatients: (query: string) => Patient[];
}

export const usePatientStore = create<PatientStore>((set, get) => ({
  patients: [
    {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '+1234567890',
      dateOfBirth: '1985-06-15',
      gender: 'Male',
      bloodGroup: 'A+',
      address: '123 Main St, New York, NY 10001',
      emergencyContact: 'Jane Doe',
      emergencyPhone: '+1234567891',
      allergies: 'Penicillin',
      chronicConditions: 'Hypertension',
      insuranceProvider: 'HealthCare Plus',
      insuranceNumber: 'HC123456',
      registrationDate: '2024-01-15',
    },
    {
      id: '2',
      firstName: 'Sarah',
      lastName: 'Smith',
      email: 'sarah.smith@example.com',
      phone: '+1234567892',
      dateOfBirth: '1990-03-22',
      gender: 'Female',
      bloodGroup: 'O-',
      address: '456 Oak Ave, Los Angeles, CA 90001',
      emergencyContact: 'Michael Smith',
      emergencyPhone: '+1234567893',
      allergies: 'None',
      insuranceProvider: 'MediCare',
      insuranceNumber: 'MC789012',
      registrationDate: '2024-02-20',
    },
    {
      id: '3',
      firstName: 'Robert',
      lastName: 'Johnson',
      email: 'robert.j@example.com',
      phone: '+1234567894',
      dateOfBirth: '1978-11-08',
      gender: 'Male',
      bloodGroup: 'B+',
      address: '789 Pine Rd, Chicago, IL 60601',
      emergencyContact: 'Lisa Johnson',
      emergencyPhone: '+1234567895',
      chronicConditions: 'Diabetes Type 2',
      insuranceProvider: 'HealthCare Plus',
      insuranceNumber: 'HC345678',
      registrationDate: '2024-03-10',
    },
  ],
  
  setPatients: (patients) => set({ patients }),
  
  addPatient: (patient) =>
    set((state) => ({
      patients: [...state.patients, patient],
    })),
    
  updatePatient: (id, updatedPatient) =>
    set((state) => ({
      patients: state.patients.map((p) =>
        p.id === id ? { ...p, ...updatedPatient } : p
      ),
    })),
    
  deletePatient: (id) =>
    set((state) => ({
      patients: state.patients.filter((p) => p.id !== id),
    })),
    
  getPatient: (id) => get().patients.find((p) => p.id === id),
  
  searchPatients: (query) => {
    const lowerQuery = query.toLowerCase();
    return get().patients.filter(
      (p) =>
        p.firstName.toLowerCase().includes(lowerQuery) ||
        p.lastName.toLowerCase().includes(lowerQuery) ||
        p.email.toLowerCase().includes(lowerQuery) ||
        p.phone.includes(query)
    );
  },
}));
