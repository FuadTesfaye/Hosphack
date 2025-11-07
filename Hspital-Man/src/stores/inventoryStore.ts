import { create } from 'zustand';
import { InventoryItem } from '../schemas/inventorySchema';

interface InventoryStore {
  items: InventoryItem[];
  loading: boolean;
  error: string | null;
  setItems: (items: InventoryItem[]) => void;
  addItem: (item: InventoryItem) => void;
  updateItem: (id: string, item: Partial<InventoryItem>) => void;
  deleteItem: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useInventoryStore = create<InventoryStore>((set) => ({
  items: [],
  loading: false,
  error: null,
  
  setItems: (items) => set({ items }),

  addItem: (item) =>
    set((state) => ({
      items: [...state.items, item],
    })),

  updateItem: (id, updatedItem) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, ...updatedItem } : item
      ),
    })),

  deleteItem: (id) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, isActive: false } : item
      ),
    })),
    
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));