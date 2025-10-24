// Persistent storage utility for approved medicines and license requests
export interface ApprovedMedicine {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  description: string;
  category: string;
  requiresLicense: boolean;
  stock: number;
  expirationDate: string;
  pharmacyId: string;
  pharmacyName: string;
  quantity: number;
  isApproved: boolean;
  licenseApproved: boolean;
  licenseRequestId: string;
  approvedAt: string;
  addedAt: string;
  customerEmail: string;
}

export interface LicenseRequest {
  id: string;
  medicineId: string;
  medicineName: string;
  customerEmail: string;
  licenseImageUrl: string;
  status: 'pending' | 'approved' | 'rejected';
  pharmacyId: string;
  createdAt: string;
  updatedAt: string;
}

class PersistentStorage {
  private readonly APPROVED_MEDICINES_KEY = 'pharmacy_approved_medicines';
  private readonly LICENSE_REQUESTS_KEY = 'pharmacy_license_requests';
  private readonly CUSTOMER_CARTS_KEY = 'pharmacy_customer_carts';

  // License Requests Management
  getLicenseRequests(): LicenseRequest[] {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(this.LICENSE_REQUESTS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  saveLicenseRequests(requests: LicenseRequest[]): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(this.LICENSE_REQUESTS_KEY, JSON.stringify(requests));
    } catch (error) {
      console.error('Failed to save license requests:', error);
    }
  }

  addLicenseRequest(request: Omit<LicenseRequest, 'id' | 'createdAt' | 'updatedAt'>): LicenseRequest {
    const requests = this.getLicenseRequests();
    const newRequest: LicenseRequest = {
      ...request,
      id: 'req_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    requests.push(newRequest);
    this.saveLicenseRequests(requests);
    return newRequest;
  }

  updateLicenseRequestStatus(id: string, status: 'approved' | 'rejected'): LicenseRequest | null {
    const requests = this.getLicenseRequests();
    const requestIndex = requests.findIndex(r => r.id === id);
    
    if (requestIndex === -1) return null;
    
    requests[requestIndex].status = status;
    requests[requestIndex].updatedAt = new Date().toISOString();
    
    // If approved, add to customer cart
    if (status === 'approved') {
      this.addApprovedMedicineToCart(requests[requestIndex]);
    }
    
    this.saveLicenseRequests(requests);
    return requests[requestIndex];
  }

  // Customer Carts Management
  getCustomerCarts(): { [email: string]: ApprovedMedicine[] } {
    if (typeof window === 'undefined') return {};
    try {
      const stored = localStorage.getItem(this.CUSTOMER_CARTS_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  }

  saveCustomerCarts(carts: { [email: string]: ApprovedMedicine[] }): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(this.CUSTOMER_CARTS_KEY, JSON.stringify(carts));
    } catch (error) {
      console.error('Failed to save customer carts:', error);
    }
  }

  getCustomerCart(email: string): ApprovedMedicine[] {
    const carts = this.getCustomerCarts();
    return carts[email] || [];
  }

  addApprovedMedicineToCart(licenseRequest: LicenseRequest): void {
    const carts = this.getCustomerCarts();
    
    if (!carts[licenseRequest.customerEmail]) {
      carts[licenseRequest.customerEmail] = [];
    }

    // Check if already exists
    const existingIndex = carts[licenseRequest.customerEmail].findIndex(
      item => item.id === licenseRequest.medicineId
    );

    if (existingIndex === -1) {
      const approvedMedicine: ApprovedMedicine = {
        id: licenseRequest.medicineId,
        name: licenseRequest.medicineName,
        price: 29.99,
        imageUrl: 'https://picsum.photos/400/300?random=' + Date.now(),
        description: `Licensed prescription medicine: ${licenseRequest.medicineName}`,
        category: 'Prescription',
        requiresLicense: true,
        stock: 25,
        expirationDate: '2025-12-31',
        pharmacyId: licenseRequest.pharmacyId,
        pharmacyName: 'Licensed Pharmacy',
        quantity: 1,
        isApproved: true,
        licenseApproved: true,
        licenseRequestId: licenseRequest.id,
        approvedAt: new Date().toISOString(),
        addedAt: new Date().toISOString(),
        customerEmail: licenseRequest.customerEmail
      };

      carts[licenseRequest.customerEmail].push(approvedMedicine);
      this.saveCustomerCarts(carts);
      
      console.log(`✅ Added approved medicine to persistent storage for ${licenseRequest.customerEmail}`);
    }
  }

  removeFromCustomerCart(email: string, medicineId: string): void {
    const carts = this.getCustomerCarts();
    if (carts[email]) {
      carts[email] = carts[email].filter(item => item.id !== medicineId);
      this.saveCustomerCarts(carts);
    }
  }

  clearCustomerCart(email: string): void {
    const carts = this.getCustomerCarts();
    if (carts[email]) {
      carts[email] = [];
      this.saveCustomerCarts(carts);
    }
  }

  // Sync with global storage (for API compatibility)
  syncToGlobal(): void {
    if (typeof window !== 'undefined' && typeof global !== 'undefined') {
      // Sync customer carts
      if (!global.customerCarts) {
        global.customerCarts = {};
      }
      
      const localCarts = this.getCustomerCarts();
      Object.assign(global.customerCarts, localCarts);
      
      console.log('🔄 Synced localStorage to global storage');
    }
  }

  syncFromGlobal(): void {
    if (typeof window !== 'undefined' && typeof global !== 'undefined' && global.customerCarts) {
      this.saveCustomerCarts(global.customerCarts);
      console.log('🔄 Synced global storage to localStorage');
    }
  }
}

export const persistentStorage = new PersistentStorage();