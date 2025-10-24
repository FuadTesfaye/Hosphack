import { NextRequest, NextResponse } from 'next/server';
import { SimplePharmacyStorage } from '@/lib/simple-pharmacy-storage';
import { promises as fs } from 'fs';
import path from 'path';

async function saveUploadedFile(file: File): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  
  const fileName = `pharmacy-${Date.now()}-${file.name}`;
  const uploadDir = path.join(process.cwd(), 'public/uploads');
  const filePath = path.join(uploadDir, fileName);
  
  await fs.writeFile(filePath, buffer);
  return `/uploads/${fileName}`;
}

export async function GET() {
  try {
    const pharmacies = SimplePharmacyStorage.getAll();
    console.log(`📋 Returning ${pharmacies.length} pharmacies`);
    return NextResponse.json(pharmacies);
  } catch (error) {
    console.error('GET pharmacies error:', error);
    return NextResponse.json({ error: 'Failed to fetch pharmacies' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  console.log('=== POST PHARMACY START ===');
  
  try {
    const contentType = request.headers.get('content-type') || '';
    console.log('Content-Type:', contentType);
    
    let data: any = {};
    
    if (contentType.includes('multipart/form-data')) {
      console.log('Processing FormData');
      const formData = await request.formData();
      
      for (const [key, value] of formData.entries()) {
        if (key !== 'logo' && key !== 'license') {
          if (key === 'rating') {
            data[key] = parseFloat(value as string) || 0;
          } else {
            data[key] = value as string;
          }
        }
      }
      
      const logoFile = formData.get('logo') as File;
      if (logoFile && logoFile.size > 0) {
        data.logoUrl = await saveUploadedFile(logoFile);
      }
      
      const licenseFile = formData.get('license') as File;
      if (licenseFile && licenseFile.size > 0) {
        data.licenseUrl = await saveUploadedFile(licenseFile);
      }
      
      // Store password as plain text for simple authentication
    } else {
      console.log('Processing JSON');
      data = await request.json();
      console.log('Received data:', data);
      
      // Store password as plain text for simple authentication
    }
    
    console.log('Data after processing:', { ...data, password: data.password ? '[HASHED]' : 'none' });
    
    // Validate required fields
    if (!data.name?.trim() || !data.address?.trim() || !data.phone?.trim() || !data.email?.trim() || !data.password?.trim()) {
      console.log('Validation failed');
      return NextResponse.json({
        error: 'Missing required fields',
        details: 'Name, address, phone, email, and password are required'
      }, { status: 400 });
    }
    
    const pharmacyData = {
      name: data.name.trim(),
      address: data.address.trim(),
      phone: data.phone.trim(),
      email: data.email.trim(),
      password: data.password,
      logoUrl: data.logoUrl || 'https://picsum.photos/100/100',
      licenseUrl: data.licenseUrl || '',
      rating: Number(data.rating) || 0
    };
    
    console.log('Creating pharmacy with simple storage:', { ...pharmacyData, password: '[HIDDEN]' });
    
    // Save to simple storage
    const pharmacy = SimplePharmacyStorage.create(pharmacyData);
    
    console.log('Pharmacy created successfully');
    
    // Return pharmacy data including password for admin display
    return NextResponse.json(pharmacy, { status: 201 });
  } catch (error) {
    console.error('=== POST PHARMACY ERROR ===');
    console.error('Error:', error);
    
    // Handle unique constraint error
    if (error instanceof Error && error.message.includes('Unique constraint failed on the constraint: `pharmacies_email_key`')) {
      return NextResponse.json({
        error: 'Email already exists',
        details: 'A pharmacy with this email is already registered. Please use a different email.'
      }, { status: 409 });
    }
    
    return NextResponse.json({
      error: 'Failed to create pharmacy',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  console.log('=== PUT PHARMACY START ===');
  
  try {
    const contentType = request.headers.get('content-type') || '';
    console.log('Content-Type:', contentType);
    
    let data: any = {};
    let id: string;
    
    if (contentType.includes('multipart/form-data')) {
      console.log('Processing FormData for update');
      const formData = await request.formData();
      id = formData.get('id') as string;
      
      for (const [key, value] of formData.entries()) {
        if (key !== 'id' && key !== 'logo' && key !== 'license') {
          if (key === 'rating') {
            data[key] = parseFloat(value as string) || 0;
          } else {
            data[key] = value as string;
          }
        }
      }
      
      const logoFile = formData.get('logo') as File;
      if (logoFile && logoFile.size > 0) {
        data.logoUrl = await saveUploadedFile(logoFile);
      }
      
      const licenseFile = formData.get('license') as File;
      if (licenseFile && licenseFile.size > 0) {
        data.licenseUrl = await saveUploadedFile(licenseFile);
      }
    } else {
      console.log('Processing JSON for update');
      const body = await request.json();
      ({ id, ...data } = body);
      console.log('Received update data:', { id, ...data, password: data.password ? '[HIDDEN]' : 'none' });
    }
    
    if (!id) {
      console.log('Missing pharmacy ID');
      return NextResponse.json({ error: 'Pharmacy ID is required' }, { status: 400 });
    }
    
    console.log(`Updating pharmacy ${id} with:`, { ...data, password: data.password ? '[HIDDEN]' : 'none' });
    
    const pharmacy = SimplePharmacyStorage.update(id, data);
    if (!pharmacy) {
      console.log(`Pharmacy not found: ${id}`);
      return NextResponse.json({ error: 'Pharmacy not found' }, { status: 404 });
    }
    
    console.log('Pharmacy updated successfully:', pharmacy.name);
    
    // Return pharmacy data including password for admin display
    return NextResponse.json(pharmacy);
  } catch (error) {
    console.error('=== PUT PHARMACY ERROR ===');
    console.error('Error:', error);
    return NextResponse.json({
      error: 'Failed to update pharmacy',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }
    
    const success = SimplePharmacyStorage.delete(id);
    if (!success) {
      return NextResponse.json({ error: 'Pharmacy not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE pharmacy error:', error);
    return NextResponse.json({ error: 'Failed to delete pharmacy' }, { status: 500 });
  }
}