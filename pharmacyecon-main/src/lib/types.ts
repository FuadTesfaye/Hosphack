export interface Medicine {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  expirationDate: string;
  imageUrl: string;
  pharmacyId: string;
  category: string;
  requiresLicense: boolean;
}

export interface LicenseRequest {
  id: string;
  medicineId: string;
  medicineName: string;
  customerEmail: string;
  licenseImageUrl: string;
  status: 'pending' | 'approved' | 'rejected';
  pharmacyId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Pharmacy {
  id: string;
  name: string;
  address: string;
  phone: string;
  logoUrl: string;
  licenseUrl: string;
  rating: number;
  email: string;
  password: string;
  permissions: string;
}

export interface Order {
  id: string;
  date: string;
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  total: number;
  items: OrderItem[];
}

export interface OrderItem {
  id: string;
  medicineId: string;
  name: string;
  quantity: number;
}

export interface Prescription {
  id: string;
  patientName: string;
  email: string;
  phone: string;
  notes: string;
  pharmacyId: string;
  pharmacyName: string;
  files: string;
  status: 'Pending Review' | 'Approved' | 'Rejected';
  uploadDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CartItem extends Medicine {
    quantity: number;
    pharmacyName?: string;
}
