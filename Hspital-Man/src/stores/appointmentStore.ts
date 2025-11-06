import { create } from 'zustand';

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: string;
  time: string;
  type: string;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  notes?: string;
}

interface AppointmentStore {
  appointments: Appointment[];
  addAppointment: (appointment: Appointment) => void;
  updateAppointment: (id: string, appointment: Partial<Appointment>) => void;
  deleteAppointment: (id: string) => void;
  getAppointmentsByDate: (date: string) => Appointment[];
}

export const useAppointmentStore = create<AppointmentStore>((set, get) => ({
  appointments: [
    {
      id: '1',
      patientId: '1',
      patientName: 'John Doe',
      doctorId: 'D1',
      doctorName: 'Dr. Sarah Williams',
      date: '2024-11-05',
      time: '09:00',
      type: 'Consultation',
      status: 'confirmed',
      notes: 'Regular checkup',
    },
    {
      id: '2',
      patientId: '2',
      patientName: 'Sarah Smith',
      doctorId: 'D2',
      doctorName: 'Dr. Michael Chen',
      date: '2024-11-05',
      time: '10:30',
      type: 'Follow-up',
      status: 'pending',
    },
    {
      id: '3',
      patientId: '3',
      patientName: 'Robert Johnson',
      doctorId: 'D1',
      doctorName: 'Dr. Sarah Williams',
      date: '2024-11-05',
      time: '14:00',
      type: 'Check-up',
      status: 'confirmed',
    },
  ],

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

  getAppointmentsByDate: (date) =>
    get().appointments.filter((a) => a.date === date),
}));
