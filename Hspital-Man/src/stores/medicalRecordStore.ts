import { create } from 'zustand';
import { MedicalRecord } from '../schemas/medicalRecordSchema';

interface MedicalRecordStore {
  records: MedicalRecord[];
  loading: boolean;
  error: string | null;
  setRecords: (records: MedicalRecord[]) => void;
  addRecord: (record: MedicalRecord) => void;
  updateRecord: (id: string, record: Partial<MedicalRecord>) => void;
  deleteRecord: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useMedicalRecordStore = create<MedicalRecordStore>((set) => ({
  records: [],
  loading: false,
  error: null,
  
  setRecords: (records) => set({ records }),
  
  addRecord: (record) =>
    set((state) => ({
      records: [...state.records, record],
    })),
    
  updateRecord: (id, updatedRecord) =>
    set((state) => ({
      records: state.records.map((r) =>
        r.id === id ? { ...r, ...updatedRecord } : r
      ),
    })),
    
  deleteRecord: (id) =>
    set((state) => ({
      records: state.records.filter((r) => r.id !== id),
    })),
    
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));