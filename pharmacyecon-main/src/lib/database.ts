import { prisma } from './db';
import type { Medicine, Pharmacy, Order, Prescription } from './types';

// Pharmacy operations
export async function getPharmacies(): Promise<Pharmacy[]> {
  try {
    const pharmacies = await prisma.pharmacy.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return pharmacies || [];
  } catch (error) {
    console.error('Database error in getPharmacies:', error);
    return [];
  }
}

export async function addPharmacy(data: Omit<Pharmacy, 'id'>): Promise<Pharmacy> {
  const pharmacy = await prisma.pharmacy.create({
    data: {
      name: data.name,
      address: data.address,
      phone: data.phone,
      email: data.email,
      password: data.password,
      permissions: data.permissions || '',
      logoUrl: data.logoUrl || 'https://picsum.photos/100/100',
      licenseUrl: data.licenseUrl || '',
      rating: data.rating || 0
    }
  });
  return pharmacy;
}

export async function updatePharmacy(id: string, data: Partial<Omit<Pharmacy, 'id'>>): Promise<Pharmacy | null> {
  const pharmacy = await prisma.pharmacy.update({
    where: { id },
    data
  });
  return pharmacy;
}

export async function deletePharmacy(id: string): Promise<void> {
  await prisma.pharmacy.delete({
    where: { id }
  });
}

// Medicine operations
export async function getMedicines(): Promise<Medicine[]> {
  try {
    const medicines = await prisma.medicine.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return medicines || [];
  } catch (error) {
    console.error('Database error in getMedicines:', error);
    return [];
  }
}

export async function addMedicine(data: Omit<Medicine, 'id'>): Promise<Medicine> {
  const medicine = await prisma.medicine.create({
    data: {
      name: data.name,
      description: data.description,
      price: data.price,
      stock: data.stock,
      expirationDate: data.expirationDate,
      imageUrl: data.imageUrl,
      category: data.category,
      pharmacyId: data.pharmacyId,
      requiresLicense: data.requiresLicense || false
    }
  });
  return medicine;
}

export async function updateMedicine(id: string, data: Partial<Omit<Medicine, 'id'>>): Promise<Medicine | null> {
  try {
    // Check if medicine exists first
    const existingMedicine = await prisma.medicine.findUnique({
      where: { id }
    });
    
    if (!existingMedicine) {
      console.error('Medicine not found for update:', id);
      return null;
    }
    
    const medicine = await prisma.medicine.update({
      where: { id },
      data
    });
    
    return medicine;
  } catch (error) {
    console.error('Database update medicine error:', error);
    throw error;
  }
}

export async function deleteMedicine(id: string): Promise<void> {
  await prisma.medicine.delete({
    where: { id }
  });
}

// Order operations
export async function getOrders(): Promise<Order[]> {
  const orders = await prisma.order.findMany({
    include: {
      items: true
    },
    orderBy: { createdAt: 'desc' }
  });
  
  return orders.map(order => ({
    ...order,
    status: order.status.toLowerCase().replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) as Order['status']
  }));
}

export async function addOrder(data: Omit<Order, 'id'>): Promise<Order> {
  const order = await prisma.order.create({
    data: {
      date: data.date,
      status: data.status.toUpperCase().replace(' ', '_') as any,
      total: data.total,
      items: {
        create: data.items.map(item => ({
          medicineId: item.medicineId,
          name: item.name,
          quantity: item.quantity
        }))
      }
    },
    include: {
      items: true
    }
  });
  
  return {
    ...order,
    status: order.status.toLowerCase().replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) as Order['status']
  };
}

export async function updateOrderStatus(id: string, status: Order['status']): Promise<Order | null> {
  const order = await prisma.order.update({
    where: { id },
    data: {
      status: status.toUpperCase().replace(' ', '_') as any
    },
    include: {
      items: true
    }
  });
  
  return {
    ...order,
    status: order.status.toLowerCase().replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) as Order['status']
  };
}

export async function deleteOrder(id: string): Promise<void> {
  await prisma.order.delete({
    where: { id }
  });
}

// Prescription operations
export async function getPrescriptions(): Promise<Prescription[]> {
  const prescriptions = await prisma.prescription.findMany({
    orderBy: { createdAt: 'desc' }
  });
  
  return prescriptions.map(prescription => ({
    ...prescription,
    status: prescription.status.toLowerCase().replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) as Prescription['status']
  }));
}

export async function addPrescription(data: Omit<Prescription, 'id'>): Promise<Prescription> {
  const prescription = await prisma.prescription.create({
    data: {
      ...data,
      status: data.status.toUpperCase().replace(' ', '_') as any
    }
  });
  
  return {
    ...prescription,
    status: prescription.status.toLowerCase().replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) as Prescription['status']
  };
}

export async function updatePrescriptionStatus(id: string, status: Prescription['status']): Promise<Prescription | null> {
  const prescription = await prisma.prescription.update({
    where: { id },
    data: {
      status: status.toUpperCase().replace(' ', '_') as any
    }
  });
  
  return {
    ...prescription,
    status: prescription.status.toLowerCase().replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) as Prescription['status']
  };
}

export async function deletePrescription(id: string): Promise<void> {
  await prisma.prescription.delete({
    where: { id }
  });
}

// License Request operations
export async function getLicenseRequests(): Promise<any[]> {
  const requests = await prisma.licenseRequest.findMany({
    include: {
      pharmacy: true
    },
    orderBy: { createdAt: 'desc' }
  });
  return requests;
}

export async function addLicenseRequest(data: any): Promise<any> {
  console.log('Database addLicenseRequest called with:', data);
  
  try {
    const request = await prisma.licenseRequest.create({
      data: {
        medicineId: data.medicineId,
        medicineName: data.medicineName,
        customerEmail: data.customerEmail,
        licenseImageUrl: data.licenseImageUrl,
        status: 'PENDING',
        pharmacyId: data.pharmacyId
      }
    });
    
    console.log('License request created successfully:', request);
    return request;
  } catch (error) {
    console.error('Database error in addLicenseRequest:', error);
    throw error;
  }
}

export async function updateLicenseRequestStatus(id: string, status: 'APPROVED' | 'REJECTED'): Promise<any> {
  const request = await prisma.licenseRequest.update({
    where: { id },
    data: { status }
  });
  return request;
}

export async function getLicenseRequestsByPharmacy(pharmacyId: string): Promise<any[]> {
  const requests = await prisma.licenseRequest.findMany({
    where: pharmacyId === 'all' ? {} : { pharmacyId },
    include: {
      pharmacy: true
    },
    orderBy: { createdAt: 'desc' }
  });
  return requests;
}

export async function getLicenseRequestsByCustomer(customerEmail: string, medicineId?: string): Promise<any[]> {
  const where: any = { customerEmail };
  if (medicineId) {
    where.medicineId = medicineId;
  }
  
  const requests = await prisma.licenseRequest.findMany({
    where,
    orderBy: { createdAt: 'desc' }
  });
  return requests;
}

// Seed function to populate initial data
export async function seedDatabase() {
  // Clear existing data
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.medicine.deleteMany();
  await prisma.pharmacy.deleteMany();
  await prisma.prescription.deleteMany();

  // Create pharmacies with login credentials
  const pharmacies = await prisma.pharmacy.createMany({
    data: [
      { 
        name: 'HealthFirst Pharmacy', 
        address: '123 Wellness Ave, Mediville', 
        phone: '555-0101', 
        email: 'admin@healthfirst.com',
        password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password123
        logoUrl: 'https://picsum.photos/100/100', 
        rating: 4.5 
      },
      { 
        name: 'CarePlus Drugs', 
        address: '456 Cure St, Healthburg', 
        phone: '555-0102', 
        email: 'admin@careplus.com',
        password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password123
        logoUrl: 'https://picsum.photos/100/100', 
        rating: 4.8 
      },
      { 
        name: 'The Medicine Shoppe', 
        address: '789 Remedy Rd, Pharmatown', 
        phone: '555-0103', 
        email: 'admin@medicineshoppe.com',
        password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password123
        logoUrl: 'https://picsum.photos/100/100', 
        rating: 4.2 
      },
    ]
  });

  const createdPharmacies = await prisma.pharmacy.findMany();

  // Create medicines
  await prisma.medicine.createMany({
    data: [
      {
        name: 'Paracetamol 500mg',
        description: 'A common pain reliever and fever reducer. Effective for headaches, muscle aches, and colds.',
        price: 5.99,
        stock: 150,
        expirationDate: '2025-12-31',
        imageUrl: 'https://picsum.photos/400/300',
        pharmacyId: createdPharmacies[0].id,
        category: 'Pain Relief',
      },
      {
        name: 'Ibuprofen 200mg',
        description: 'A nonsteroidal anti-inflammatory drug (NSAID) used for treating pain, fever, and inflammation.',
        price: 8.50,
        stock: 200,
        expirationDate: '2026-06-30',
        imageUrl: 'https://picsum.photos/400/300',
        pharmacyId: createdPharmacies[1].id,
        category: 'Pain Relief',
      },
      {
        name: 'Amoxicillin 250mg',
        description: 'An antibiotic used to treat a number of bacterial infections. Requires a prescription.',
        price: 15.75,
        stock: 50,
        expirationDate: '2025-08-15',
        imageUrl: 'https://picsum.photos/400/300',
        pharmacyId: createdPharmacies[0].id,
        category: 'Antibiotics',
      },
      {
        name: 'Cetirizine 10mg',
        description: 'An antihistamine used to relieve allergy symptoms such as watery eyes, runny nose, itching eyes/nose, and sneezing.',
        price: 12.25,
        stock: 80,
        expirationDate: '2026-01-20',
        imageUrl: 'https://picsum.photos/400/300',
        pharmacyId: createdPharmacies[2].id,
        category: 'Allergy',
      },
      {
        name: 'Vitamin D3 1000IU',
        description: 'A supplement that helps the body absorb calcium, crucial for bone health.',
        price: 9.99,
        stock: 300,
        expirationDate: '2027-03-01',
        imageUrl: 'https://picsum.photos/400/300',
        pharmacyId: createdPharmacies[1].id,
        category: 'Vitamins',
      },
      {
        name: 'Lisinopril 10mg',
        description: 'An ACE inhibitor used to treat high blood pressure and heart failure. Requires a prescription.',
        price: 22.00,
        stock: 45,
        expirationDate: '2025-11-22',
        imageUrl: 'https://picsum.photos/400/300',
        pharmacyId: createdPharmacies[2].id,
        category: 'Cardiovascular',
      },
    ]
  });

  const createdMedicines = await prisma.medicine.findMany();

  // Create orders
  const order1 = await prisma.order.create({
    data: {
      customerEmail: 'john.doe@email.com',
      customerName: 'John Doe',
      customerPhone: '555-1234',
      pharmacyId: createdPharmacies[0].id,
      pharmacyName: createdPharmacies[0].name,
      status: 'DELIVERED',
      total: 18.24,
      items: {
        create: [
          { medicineId: createdMedicines[0].id, medicineName: 'Paracetamol 500mg', quantity: 1, price: 5.99 },
          { medicineId: createdMedicines[3].id, medicineName: 'Cetirizine 10mg', quantity: 1, price: 12.25 },
        ]
      }
    }
  });

  const order2 = await prisma.order.create({
    data: {
      customerEmail: 'jane.smith@email.com',
      customerName: 'Jane Smith',
      customerPhone: '555-5678',
      pharmacyId: createdPharmacies[1].id,
      pharmacyName: createdPharmacies[1].name,
      status: 'SHIPPED',
      total: 9.99,
      items: {
        create: [
          { medicineId: createdMedicines[4].id, medicineName: 'Vitamin D3 1000IU', quantity: 1, price: 9.99 }
        ]
      }
    }
  });

  const order3 = await prisma.order.create({
    data: {
      customerEmail: 'bob.wilson@email.com',
      customerName: 'Bob Wilson',
      customerPhone: '555-9012',
      pharmacyId: createdPharmacies[2].id,
      pharmacyName: createdPharmacies[2].name,
      status: 'PROCESSING',
      total: 31.50,
      items: {
        create: [
          { medicineId: createdMedicines[2].id, medicineName: 'Amoxicillin 250mg', quantity: 2, price: 15.75 }
        ]
      }
    }
  });

  // Create prescriptions
  await prisma.prescription.createMany({
    data: [
      { 
        patientName: 'John Doe',
        email: 'john.doe@email.com',
        phone: '555-1234',
        notes: 'Regular prescription refill',
        pharmacyId: createdPharmacies[0].id,
        pharmacyName: createdPharmacies[0].name,
        files: JSON.stringify(['scan_2023_10_25.pdf']),
        status: 'APPROVED',
        uploadDate: new Date('2023-10-25')
      },
      { 
        patientName: 'Jane Smith',
        email: 'jane.smith@email.com',
        phone: '555-5678',
        notes: 'New prescription from Dr. Johnson',
        pharmacyId: createdPharmacies[1].id,
        pharmacyName: createdPharmacies[1].name,
        files: JSON.stringify(['doctor_note.jpg']),
        status: 'PENDING_REVIEW',
        uploadDate: new Date('2023-11-20')
      },
      { 
        patientName: 'Bob Wilson',
        email: 'bob.wilson@email.com',
        phone: '555-9012',
        notes: 'Prescription unclear, needs verification',
        pharmacyId: createdPharmacies[2].id,
        pharmacyName: createdPharmacies[2].name,
        files: JSON.stringify(['prescription_dec.png']),
        status: 'REJECTED',
        uploadDate: new Date('2023-12-05')
      },
    ]
  });

  console.log('Database seeded successfully!');
}