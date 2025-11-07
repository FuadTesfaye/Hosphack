import { create } from 'zustand';
import { Appointment } from '../schemas/appointmentSchema';

interface AppointmentStore {
  appointments: Appointment[];
  loading: boolean;
  error: string | null;
  setAppointments: (appointments: Appointment[]) => void;
  addAppointment: (appointment: Appointment) => void;
  updateAppointment: (id: string, appointment: Partial<Appointment>) => void;
  deleteAppointment: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useAppointmentStore = create<AppointmentStore>((set) => ({
  appointments: [],
  loading: false,
  error: null,
  
  setAppointments: (appointments) => set({ appointments }),
  
  addAppointment: (appointment) =>
    set((state) => ({
      appointments: [...state.appointments, appointment],
    })),
    
  updateAppointment: (id, updatedAppointment) =>
    set((state) => ({
      appointments: state.appointments.map((a) =>
        a.id === id ? { ...a, ...updatedAppointment } : a
      ),
    })),
    
  deleteAppointment: (id) =>
    set((state) => ({
      appointments: state.appointments.filter((a) => a.id !== id),
    })),
    
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));