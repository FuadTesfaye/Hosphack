// Simple in-memory pharmacy storage for development
export interface SimplePharmacy {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  password: string; // Plain text for development
  permissions: string;
  logoUrl: string;
  licenseUrl: string;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

declare global {
  var simplePharmacies: SimplePharmacy[] | undefined;
}

if (!global.simplePharmacies) {
  global.simplePharmacies = [
    {
      id: 'pharmacy-1',
      name: 'Test Pharmacy',
      address: '123 Test Street, Test City',
      phone: '+1234567890',
      email: 'test@pharmacy.com',
      password: 'test123',
      permissions: 'dashboard,medicines,orders,prescriptions',
      logoUrl: 'https://picsum.photos/100/100',
      licenseUrl: 'https://picsum.photos/200/150',
      rating: 4.5,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];
}

export class SimplePharmacyStorage {
  static getAll(): SimplePharmacy[] {
    return global.simplePharmacies || [];
  }

  static getById(id: string): SimplePharmacy | null {
    const pharmacies = this.getAll();
    return pharmacies.find(p => p.id === id) || null;
  }

  static getByEmail(email: string): SimplePharmacy | null {
    const pharmacies = this.getAll();
    return pharmacies.find(p => p.email === email) || null;
  }

  static create(data: Omit<SimplePharmacy, 'id' | 'createdAt' | 'updatedAt'>): SimplePharmacy {
    const pharmacies = this.getAll();
    
    // Check if email already exists
    if (pharmacies.find(p => p.email === data.email)) {
      throw new Error('Email already exists');
    }

    const newPharmacy: SimplePharmacy = {
      ...data,
      id: 'pharmacy-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    pharmacies.push(newPharmacy);
    global.simplePharmacies = pharmacies;
    
    console.log(`✅ Created pharmacy: ${newPharmacy.name} (${newPharmacy.email})`);
    return newPharmacy;
  }

  static update(id: string, data: Partial<Omit<SimplePharmacy, 'id' | 'createdAt'>>): SimplePharmacy | null {
    const pharmacies = this.getAll();
    const index = pharmacies.findIndex(p => p.id === id);
    
    if (index === -1) {
      return null;
    }

    pharmacies[index] = {
      ...pharmacies[index],
      ...data,
      updatedAt: new Date().toISOString()
    };

    global.simplePharmacies = pharmacies;
    
    console.log(`✅ Updated pharmacy: ${pharmacies[index].name}`);
    return pharmacies[index];
  }

  static delete(id: string): boolean {
    const pharmacies = this.getAll();
    const index = pharmacies.findIndex(p => p.id === id);
    
    if (index === -1) {
      return false;
    }

    const deleted = pharmacies.splice(index, 1)[0];
    global.simplePharmacies = pharmacies;
    
    console.log(`✅ Deleted pharmacy: ${deleted.name}`);
    return true;
  }

  static authenticate(email: string, password: string): SimplePharmacy | null {
    const pharmacy = this.getByEmail(email);
    
    if (!pharmacy) {
      console.log(`❌ No pharmacy found with email: ${email}`);
      return null;
    }

    if (pharmacy.password !== password) {
      console.log(`❌ Invalid password for: ${email}`);
      return null;
    }

    console.log(`✅ Authentication successful for: ${pharmacy.name}`);
    return pharmacy;
  }
}