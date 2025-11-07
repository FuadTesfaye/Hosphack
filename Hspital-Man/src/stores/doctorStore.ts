import { create } from 'zustand';
import { Doctor } from '../schemas/doctorSchema';

interface DoctorStore {
  doctors: Doctor[];
  loading: boolean;
  error: string | null;
  setDoctors: (doctors: Doctor[]) => void;
  addDoctor: (doctor: Doctor) => void;
  updateDoctor: (id: string, doctor: Partial<Doctor>) => void;
  deleteDoctor: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useDoctorStore = create<DoctorStore>((set) => ({
  doctors: [],
  loading: false,
  error: null,
  
  setDoctors: (doctors) => set({ doctors }),
  
  addDoctor: (doctor) =>
    set((state) => ({
      doctors: [...state.doctors, doctor],
    })),
    
  updateDoctor: (id, updatedDoctor) =>
    set((state) => ({
      doctors: state.doctors.map((d) =>
        d.id === id ? { ...d, ...updatedDoctor } : d
      ),
    })),
    
  deleteDoctor: (id) =>
    set((state) => ({
      doctors: state.doctors.map((d) =>
        d.id === id ? { ...d, isActive: false } : d
      ),
    })),
    
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));