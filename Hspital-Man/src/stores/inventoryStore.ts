import { create } from 'zustand';

export interface MedicineItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  expiryDate: string;
  supplier: string;
  price: number;
  minStockLevel: number;
  batchNumber: string;
  location: string;
}

interface InventoryStore {
  medicines: MedicineItem[];
  addMedicine: (medicine: MedicineItem) => void;
  updateMedicine: (id: string, medicine: Partial<MedicineItem>) => void;
  deleteMedicine: (id: string) => void;
  getLowStockItems: () => MedicineItem[];
  getExpiringItems: (days: number) => MedicineItem[];
}

export const useInventoryStore = create<InventoryStore>((set, get) => ({
  medicines: [
    {
      id: '1',
      name: 'Paracetamol 500mg',
      category: 'Analgesics',
      quantity: 500,
      unit: 'tablets',
      expiryDate: '2025-12-31',
      supplier: 'PharmaCorp',
      price: 0.15,
      minStockLevel: 200,
      batchNumber: 'PCM-2024-001',
      location: 'Shelf A-12',
    },
    {
      id: '2',
      name: 'Amoxicillin 250mg',
      category: 'Antibiotics',
      quantity: 150,
      unit: 'capsules',
      expiryDate: '2025-06-30',
      supplier: 'MediSupply Co',
      price: 0.45,
      minStockLevel: 100,
      batchNumber: 'AMX-2024-045',
      location: 'Shelf B-05',
    },
    {
      id: '3',
      name: 'Insulin Glargine',
      category: 'Antidiabetic',
      quantity: 45,
      unit: 'vials',
      expiryDate: '2025-03-15',
      supplier: 'DiabetesCare Inc',
      price: 25.00,
      minStockLevel: 30,
      batchNumber: 'INS-2024-089',
      location: 'Refrigerator R-02',
    },
    {
      id: '4',
      name: 'Aspirin 100mg',
      category: 'Cardiovascular',
      quantity: 800,
      unit: 'tablets',
      expiryDate: '2026-08-20',
      supplier: 'PharmaCorp',
      price: 0.10,
      minStockLevel: 300,
      batchNumber: 'ASP-2024-123',
      location: 'Shelf A-15',
    },
    {
      id: '5',
      name: 'Omeprazole 20mg',
      category: 'Gastrointestinal',
      quantity: 180,
      unit: 'capsules',
      expiryDate: '2025-02-28',
      supplier: 'MediSupply Co',
      price: 0.35,
      minStockLevel: 150,
      batchNumber: 'OMP-2024-067',
      location: 'Shelf C-08',
    },
  ],

  addMedicine: (medicine) =>
    set((state) => ({
      medicines: [...state.medicines, medicine],
    })),

  updateMedicine: (id, updatedMedicine) =>
    set((state) => ({
      medicines: state.medicines.map((m) =>
        m.id === id ? { ...m, ...updatedMedicine } : m
      ),
    })),

  deleteMedicine: (id) =>
    set((state) => ({
      medicines: state.medicines.filter((m) => m.id !== id),
    })),

  getLowStockItems: () =>
    get().medicines.filter((m) => m.quantity <= m.minStockLevel),

  getExpiringItems: (days) => {
    const today = new Date();
    const futureDate = new Date(today.getTime() + days * 24 * 60 * 60 * 1000);
    return get().medicines.filter((m) => {
      const expiryDate = new Date(m.expiryDate);
      return expiryDate <= futureDate && expiryDate >= today;
    });
  },
}));
