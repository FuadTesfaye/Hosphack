// Simple in-memory medicine storage for development
export interface SimpleMedicine {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  expirationDate: string;
  imageUrl: string;
  category: string;
  pharmacyId: string;
  requiresLicense: boolean;
  createdAt: string;
  updatedAt: string;
}

declare global {
  var simpleMedicines: SimpleMedicine[] | undefined;
}

if (!global.simpleMedicines) {
  global.simpleMedicines = [
    {
      id: 'medicine-1',
      name: 'Paracetamol 500mg',
      description: 'Pain reliever and fever reducer',
      price: 5.99,
      stock: 100,
      expirationDate: '2025-12-31',
      imageUrl: 'https://picsum.photos/400/300',
      category: 'Pain Relief',
      pharmacyId: 'pharmacy-1',
      requiresLicense: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];
}

export class SimpleMedicineStorage {
  static getAll(): SimpleMedicine[] {
    return global.simpleMedicines || [];
  }

  static getById(id: string): SimpleMedicine | null {
    const medicines = this.getAll();
    return medicines.find(m => m.id === id) || null;
  }

  static getByPharmacy(pharmacyId: string): SimpleMedicine[] {
    const medicines = this.getAll();
    return medicines.filter(m => m.pharmacyId === pharmacyId);
  }

  static create(data: Omit<SimpleMedicine, 'id' | 'createdAt' | 'updatedAt'>): SimpleMedicine {
    const medicines = this.getAll();

    const newMedicine: SimpleMedicine = {
      ...data,
      id: 'medicine-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    medicines.push(newMedicine);
    global.simpleMedicines = medicines;
    
    console.log(`✅ Created medicine: ${newMedicine.name} for pharmacy ${newMedicine.pharmacyId}`);
    return newMedicine;
  }

  static update(id: string, data: Partial<Omit<SimpleMedicine, 'id' | 'createdAt'>>): SimpleMedicine | null {
    const medicines = this.getAll();
    const index = medicines.findIndex(m => m.id === id);
    
    if (index === -1) {
      return null;
    }

    medicines[index] = {
      ...medicines[index],
      ...data,
      updatedAt: new Date().toISOString()
    };

    global.simpleMedicines = medicines;
    
    console.log(`✅ Updated medicine: ${medicines[index].name}`);
    return medicines[index];
  }

  static delete(id: string): boolean {
    const medicines = this.getAll();
    const index = medicines.findIndex(m => m.id === id);
    
    if (index === -1) {
      return false;
    }

    const deleted = medicines.splice(index, 1)[0];
    global.simpleMedicines = medicines;
    
    console.log(`✅ Deleted medicine: ${deleted.name}`);
    return true;
  }
}