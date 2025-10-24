import { NextRequest, NextResponse } from 'next/server';

// Global storage for approved medicines
declare global {
  var approvedMedicines: any[] | undefined;
}

if (!global.approvedMedicines) {
  global.approvedMedicines = [];
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const customerEmail = searchParams.get('email');
    
    let approvedMedicines = global.approvedMedicines || [];
    
    // Filter by customer email if provided
    if (customerEmail) {
      approvedMedicines = approvedMedicines.filter(m => m.customerEmail === customerEmail);
    }
    
    return NextResponse.json(approvedMedicines);
  } catch (error) {
    console.error('GET approved medicines error:', error);
    return NextResponse.json([], { status: 200 });
  }
}