// Static data only - no database functions for client components
import type { Medicine, Pharmacy, Order, Prescription } from './types';

export const initialPharmacies: Pharmacy[] = [
  { id: 'p1', name: 'HealthFirst Pharmacy', address: '123 Wellness Ave, Mediville', logoUrl: 'https://picsum.photos/100/100', licenseUrl: '', rating: 4.5, email: 'health@first.com', password: 'password123' },
  { id: 'p2', name: 'CarePlus Drugs', address: '456 Cure St, Healthburg', logoUrl: 'https://picsum.photos/100/100', licenseUrl: '', rating: 4.8, email: 'care@plus.com', password: 'password123' },
  { id: 'p3', name: 'The Medicine Shoppe', address: '789 Remedy Rd, Pharmatown', logoUrl: 'https://picsum.photos/100/100', licenseUrl: '', rating: 4.2, email: 'medicine@shoppe.com', password: 'password123' },
];

export const initialMedicines: Medicine[] = [
  {
    id: 'm1',
    name: 'Paracetamol 500mg',
    description: 'A common pain reliever and fever reducer. Effective for headaches, muscle aches, and colds.',
    price: 5.99,
    stock: 150,
    expirationDate: '2025-12-31',
    imageUrl: 'https://picsum.photos/400/300',
    pharmacyId: 'p1',
    category: 'Pain Relief',
  },
  {
    id: 'm2',
    name: 'Ibuprofen 200mg',
    description: 'A nonsteroidal anti-inflammatory drug (NSAID) used for treating pain, fever, and inflammation.',
    price: 8.50,
    stock: 200,
    expirationDate: '2026-06-30',
    imageUrl: 'https://picsum.photos/400/300',
    pharmacyId: 'p2',
    category: 'Pain Relief',
  },
  {
    id: 'm3',
    name: 'Amoxicillin 250mg',
    description: 'An antibiotic used to treat a number of bacterial infections. Requires a prescription.',
    price: 15.75,
    stock: 50,
    expirationDate: '2025-08-15',
    imageUrl: 'https://picsum.photos/400/300',
    pharmacyId: 'p1',
    category: 'Antibiotics',
  },
  {
    id: 'm4',
    name: 'Cetirizine 10mg',
    description: 'An antihistamine used to relieve allergy symptoms such as watery eyes, runny nose, itching eyes/nose, and sneezing.',
    price: 12.25,
    stock: 80,
    expirationDate: '2026-01-20',
    imageUrl: 'https://picsum.photos/400/300',
    pharmacyId: 'p3',
    category: 'Allergy',
  },
  {
    id: 'm5',
    name: 'Vitamin D3 1000IU',
    description: 'A supplement that helps the body absorb calcium, crucial for bone health.',
    price: 9.99,
    stock: 300,
    expirationDate: '2027-03-01',
    imageUrl: 'https://picsum.photos/400/300',
    pharmacyId: 'p2',
    category: 'Vitamins',
  },
  {
    id: 'm6',
    name: 'Lisinopril 10mg',
    description: 'An ACE inhibitor used to treat high blood pressure and heart failure. Requires a prescription.',
    price: 22.00,
    stock: 45,
    expirationDate: '2025-11-22',
    imageUrl: 'https://picsum.photos/400/300',
    pharmacyId: 'p3',
    category: 'Cardiovascular',
  },
];

export const featuredPharmacies = initialPharmacies.slice(0, 3);

// Static orders data for dashboard
const initialOrders: Order[] = [
  {
    id: 'ORD-001',
    date: '2023-10-26',
    status: 'Delivered',
    total: 21.74,
    items: [
      { id: 'oi1', medicineId: 'm1', name: 'Paracetamol 500mg', quantity: 1 },
      { id: 'oi2', medicineId: 'm4', name: 'Cetirizine 10mg', quantity: 1 },
    ],
  },
  {
    id: 'ORD-002',
    date: '2023-11-15',
    status: 'Shipped',
    total: 9.99,
    items: [{ id: 'oi3', medicineId: 'm5', name: 'Vitamin D3 1000IU', quantity: 1 }],
  },
  {
    id: 'ORD-003',
    date: '2023-12-01',
    status: 'Processing',
    total: 30.75,
    items: [{ id: 'oi4', medicineId: 'm3', name: 'Amoxicillin 250mg', quantity: 2 }],
  },
];

// Static prescriptions data for dashboard
const initialPrescriptions: Prescription[] = [
  { id: 'PRE-001', date: '2023-10-25', fileName: 'scan_2023_10_25.pdf', status: 'Approved' },
  { id: 'PRE-002', date: '2023-11-20', fileName: 'doctor_note.jpg', status: 'Pending Review' },
  { id: 'PRE-003', date: '2023-12-05', fileName: 'prescription_dec.png', status: 'Rejected' },
];

// Static functions for client components
export function getOrders(): Order[] {
  return initialOrders;
}

export function getPrescriptions(): Prescription[] {
  return initialPrescriptions;
}

export function getMedicines(): Medicine[] {
  return initialMedicines;
}

export function getPharmacies(): Pharmacy[] {
  return initialPharmacies;
}