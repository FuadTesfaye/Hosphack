import { NextRequest, NextResponse } from 'next/server';
import { SimpleMedicineStorage } from '@/lib/simple-medicine-storage';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET() {
  try {
    const medicines = SimpleMedicineStorage.getAll();
    console.log(`📋 Returning ${medicines.length} medicines`);
    return NextResponse.json(medicines);
  } catch (error) {
    console.error('GET medicines error:', error);
    return NextResponse.json({ error: 'Failed to fetch medicines' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || '';
    let data: any = {};
    
    if (contentType.includes('multipart/form-data')) {
      // Handle file upload
      const formData = await request.formData();
      
      // Extract form fields
      for (const [key, value] of formData.entries()) {
        if (key !== 'image') {
          if (key === 'price' || key === 'stock') {
            data[key] = parseFloat(value as string) || 0;
          } else if (key === 'requiresLicense') {
            data[key] = value === 'true';
          } else {
            data[key] = value as string;
          }
        }
      }
      
      // Handle image file
      const imageFile = formData.get('image') as File;
      if (imageFile && imageFile.size > 0) {
        data.imageUrl = await saveUploadedFile(imageFile);
      } else {
        data.imageUrl = 'https://picsum.photos/400/300';
      }
    } else {
      // Handle JSON data (fallback)
      data = await request.json();
    }
    
    console.log('Creating medicine with simple storage:', { ...data, pharmacyId: data.pharmacyId });
    
    // Validate required fields
    if (!data.name?.trim() || !data.pharmacyId?.trim()) {
      return NextResponse.json({
        error: 'Missing required fields',
        details: 'Name and pharmacy ID are required'
      }, { status: 400 });
    }
    
    const medicine = SimpleMedicineStorage.create({
      name: data.name.trim(),
      description: data.description || '',
      price: Number(data.price) || 0,
      stock: Number(data.stock) || 0,
      expirationDate: data.expirationDate || '2025-12-31',
      imageUrl: data.imageUrl || 'https://picsum.photos/400/300',
      category: data.category || 'General',
      pharmacyId: data.pharmacyId.trim(),
      requiresLicense: Boolean(data.requiresLicense)
    });
    
    console.log('Medicine created successfully:', medicine.name);
    return NextResponse.json(medicine);
  } catch (error) {
    console.error('Create medicine API error:', error);
    return NextResponse.json({ 
      error: 'Failed to create medicine',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

async function saveUploadedFile(file: File): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  
  const fileName = `medicine-${Date.now()}-${file.name}`;
  const uploadDir = path.join(process.cwd(), 'public/uploads');
  const filePath = path.join(uploadDir, fileName);
  
  await fs.writeFile(filePath, buffer);
  return `/uploads/${fileName}`;
}

export async function PUT(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || '';
    
    let data: any = {};
    let id: string;
    
    if (contentType.includes('multipart/form-data')) {
      // Handle file upload
      const formData = await request.formData();
      
      id = formData.get('id') as string;
      
      // Extract form fields
      for (const [key, value] of formData.entries()) {
        if (key !== 'id' && key !== 'image') {
          if (key === 'price' || key === 'stock') {
            data[key] = parseFloat(value as string) || 0;
          } else if (key === 'requiresLicense') {
            data[key] = value === 'true';
          } else {
            data[key] = value as string;
          }
        }
      }
      
      // Handle image file
      const imageFile = formData.get('image') as File;
      if (imageFile && imageFile.size > 0) {
        data.imageUrl = await saveUploadedFile(imageFile);
      }
    } else {
      // Handle JSON data (fallback)
      const body = await request.json();
      ({ id, ...data } = body);
    }
    
    // Validate required fields
    if (!id) {
      console.error('Update medicine error: Missing ID');
      return NextResponse.json({ error: 'Medicine ID is required' }, { status: 400 });
    }
    
    console.log('Updating medicine:', { id, data });
    const medicine = SimpleMedicineStorage.update(id, data);
    
    if (!medicine) {
      console.error('Update medicine error: Medicine not found for ID:', id);
      return NextResponse.json({ error: 'Medicine not found' }, { status: 404 });
    }
    
    console.log('Medicine updated successfully:', medicine.name);
    return NextResponse.json(medicine);
  } catch (error) {
    console.error('Update medicine API error:', error);
    return NextResponse.json({ 
      error: 'Failed to update medicine', 
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
    const success = SimpleMedicineStorage.delete(id);
    if (!success) {
      return NextResponse.json({ error: 'Medicine not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete medicine' }, { status: 500 });
  }
}