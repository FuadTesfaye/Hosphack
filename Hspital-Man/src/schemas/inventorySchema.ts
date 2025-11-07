import { z } from "zod";

export const inventorySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  quantity: z.number().min(0, "Quantity must be positive"),
  price: z.number().min(0, "Price must be positive"),
  category: z.string().min(2, "Category is required"),
  description: z.string().optional(),
  supplier: z.string().optional(),
  expiryDate: z.string().optional(),
  batchNumber: z.string().optional(),
  minimumStock: z.number().min(0, "Minimum stock must be positive"),
  maximumStock: z.number().min(1, "Maximum stock must be positive"),
  unit: z.string().min(1, "Unit is required"),
  location: z.string().optional(),
});

export type InventoryFormData = z.infer<typeof inventorySchema>;

export interface InventoryItem extends InventoryFormData {
  id: string;
  isActive: boolean;
  createdDate: string;
  lastUpdated?: string;
}