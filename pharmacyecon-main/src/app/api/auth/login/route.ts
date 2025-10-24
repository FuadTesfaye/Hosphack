import { NextRequest, NextResponse } from 'next/server';
import { SimplePharmacyStorage } from '@/lib/simple-pharmacy-storage';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    console.log(`🔐 Login attempt for: ${email}`);

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    // Authenticate using simple storage
    const pharmacy = SimplePharmacyStorage.authenticate(email, password);

    if (!pharmacy) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Remove password from response for security
    const { password: _, ...pharmacyData } = pharmacy;
    
    console.log(`✅ Login successful for: ${pharmacy.name}`);
    
    return NextResponse.json({ 
      success: true, 
      pharmacy: pharmacyData 
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ 
      error: 'Login failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}