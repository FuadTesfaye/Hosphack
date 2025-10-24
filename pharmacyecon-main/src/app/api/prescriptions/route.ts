import { NextRequest, NextResponse } from 'next/server';

// In-memory storage for prescriptions
declare global {
  var prescriptionsStorage: any[] | undefined;
}

if (!global.prescriptionsStorage) {
  global.prescriptionsStorage = [
    {
      id: '1',
      patientName: 'John Doe',
      email: 'john@example.com',
      phone: '555-1234',
      notes: 'Regular prescription',
      pharmacyId: 'p1',
      pharmacyName: 'HealthFirst Pharmacy',
      files: '["prescription1.pdf"]',
      status: 'Pending Review',
      uploadDate: new Date('2024-01-15'),
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15')
    }
  ];
}

const prescriptionsStorage = global.prescriptionsStorage;

let prisma: any;
try {
  const { PrismaClient } = require('@prisma/client');
  prisma = new PrismaClient();
} catch (error) {
  console.warn('Prisma not available, using in-memory storage');
  prisma = null;
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    console.log('📝 Creating prescription:', {
      patientName: data.patientName,
      pharmacyId: data.pharmacyId,
      pharmacyName: data.pharmacyName,
      email: data.email
    });
    console.log('🔍 Full prescription data:', data);
    
    const prescriptionData = {
      id: Math.random().toString(36).substr(2, 9),
      patientName: data.patientName,
      email: data.email,
      phone: data.phone,
      notes: data.notes || '',
      pharmacyId: data.pharmacyId,
      pharmacyName: data.pharmacyName,
      files: JSON.stringify(data.files || []),
      status: 'Pending Review',
      uploadDate: data.uploadDate ? new Date(data.uploadDate) : new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    if (prisma) {
      try {
        const prescription = await prisma.prescription.create({
          data: prescriptionData
        });
        console.log('✅ Prescription created in database:', prescription.id);
        return NextResponse.json({ success: true, id: prescription.id });
      } catch (dbError) {
        console.log('Database error, falling back to in-memory storage');
      }
    }
    
    // Fallback to in-memory storage
    prescriptionsStorage.push(prescriptionData);
    console.log('✅ Prescription created in memory:', prescriptionData.id);
    console.log('📊 Total prescriptions in storage:', prescriptionsStorage.length);
    
    return NextResponse.json({ success: true, id: prescriptionData.id });
  } catch (error) {
    console.error('Error creating prescription:', error);
    return NextResponse.json({ error: 'Failed to submit prescription' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const pharmacyId = searchParams.get('pharmacyId');
    
    console.log('🔍 Fetching prescriptions for pharmacy:', pharmacyId);
    
    if (prisma) {
      try {
        const prescriptions = await prisma.prescription.findMany({
          where: pharmacyId ? { pharmacyId } : {},
          orderBy: { createdAt: 'desc' }
        });
        console.log('💾 Database prescriptions found:', prescriptions.length);
        return NextResponse.json(prescriptions);
      } catch (dbError) {
        console.log('Database error, falling back to in-memory storage');
      }
    }
    
    // Fallback to in-memory storage
    let prescriptions = [...prescriptionsStorage];
    console.log('📋 All prescriptions in storage:', prescriptionsStorage.map(p => ({ id: p.id, pharmacyId: p.pharmacyId, pharmacyName: p.pharmacyName })));
    
    if (pharmacyId) {
      const beforeFilter = prescriptions.length;
      prescriptions = prescriptions.filter(p => p.pharmacyId === pharmacyId);
      console.log(`🎯 Filtering for pharmacy ID: ${pharmacyId}`);
      console.log(`📊 Before filter: ${beforeFilter}, After filter: ${prescriptions.length}`);
      console.log('🔍 Matching prescriptions:', prescriptions.map(p => ({ id: p.id, pharmacyId: p.pharmacyId })));
    }
    prescriptions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    console.log('✅ Returning prescriptions:', prescriptions.length);
    return NextResponse.json(prescriptions);
  } catch (error) {
    console.error('Error fetching prescriptions:', error);
    return NextResponse.json([], { status: 200 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, status } = await request.json();
    
    const validStatuses = ['Pending Review', 'Approved', 'Rejected'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }
    
    if (prisma) {
      try {
        const prescription = await prisma.prescription.update({
          where: { id },
          data: { status, updatedAt: new Date() }
        });
        return NextResponse.json({ success: true, prescription });
      } catch (dbError) {
        console.log('Database error, falling back to in-memory storage');
      }
    }
    
    // Fallback to in-memory storage
    const prescriptionIndex = prescriptionsStorage.findIndex(p => p.id === id);
    if (prescriptionIndex !== -1) {
      prescriptionsStorage[prescriptionIndex].status = status;
      prescriptionsStorage[prescriptionIndex].updatedAt = new Date();
      return NextResponse.json({ success: true, prescription: prescriptionsStorage[prescriptionIndex] });
    }
    
    return NextResponse.json({ error: 'Prescription not found' }, { status: 404 });
  } catch (error) {
    console.error('Error updating prescription:', error);
    return NextResponse.json({ error: 'Failed to update prescription' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Prescription ID is required' }, { status: 400 });
    }
    
    if (prisma) {
      try {
        await prisma.prescription.delete({ where: { id } });
        return NextResponse.json({ success: true });
      } catch (dbError) {
        console.log('Database error, falling back to in-memory storage');
      }
    }
    
    // Fallback to in-memory storage
    const prescriptionIndex = prescriptionsStorage.findIndex(p => p.id === id);
    if (prescriptionIndex !== -1) {
      prescriptionsStorage.splice(prescriptionIndex, 1);
      return NextResponse.json({ success: true });
    }
    
    return NextResponse.json({ error: 'Prescription not found' }, { status: 404 });
  } catch (error) {
    console.error('Error deleting prescription:', error);
    return NextResponse.json({ error: 'Failed to delete prescription' }, { status: 500 });
  }
}