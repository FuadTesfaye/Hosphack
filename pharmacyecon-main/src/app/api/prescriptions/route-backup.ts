import { NextRequest, NextResponse } from 'next/server';

// Fallback in-memory storage
const mockPrescriptions = [
  {
    id: '1',
    patientName: 'John Doe',
    email: 'john@example.com',
    phone: '555-1234',
    notes: 'Regular prescription',
    pharmacyId: 'pharmacy1',
    pharmacyName: 'HealthFirst Pharmacy',
    files: '["prescription1.pdf"]',
    status: 'Pending Review',
    uploadDate: new Date('2024-01-15'),
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const pharmacyId = searchParams.get('pharmacyId');
    
    let prescriptions = mockPrescriptions;
    if (pharmacyId) {
      prescriptions = mockPrescriptions.filter(p => p.pharmacyId === pharmacyId);
    }
    
    return NextResponse.json(prescriptions);
  } catch (error) {
    console.error('Error fetching prescriptions:', error);
    return NextResponse.json({ error: 'Failed to fetch prescriptions' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, status } = await request.json();
    
    const prescription = mockPrescriptions.find(p => p.id === id);
    if (prescription) {
      prescription.status = status;
      prescription.updatedAt = new Date();
    }
    
    return NextResponse.json({ success: true, prescription });
  } catch (error) {
    console.error('Error updating prescription:', error);
    return NextResponse.json({ error: 'Failed to update prescription' }, { status: 500 });
  }
}