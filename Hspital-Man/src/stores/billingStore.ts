import { create } from 'zustand';
import { Bill } from '../schemas/billingSchema';

interface BillingStore {
  bills: Bill[];
  loading: boolean;
  error: string | null;
  setBills: (bills: Bill[]) => void;
  addBill: (bill: Bill) => void;
  updateBill: (id: string, bill: Partial<Bill>) => void;
  deleteBill: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useBillingStore = create<BillingStore>((set) => ({
  bills: [],
  loading: false,
  error: null,
  
  setBills: (bills) => set({ bills }),
  
  addBill: (bill) =>
    set((state) => ({
      bills: [...state.bills, bill],
    })),
    
  updateBill: (id, updatedBill) =>
    set((state) => ({
      bills: state.bills.map((b) =>
        b.id === id ? { ...b, ...updatedBill } : b
      ),
    })),
    
  deleteBill: (id) =>
    set((state) => ({
      bills: state.bills.filter((b) => b.id !== id),
    })),
    
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));