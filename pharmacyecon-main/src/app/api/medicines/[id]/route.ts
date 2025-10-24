import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const medicine = await prisma.medicine.findUnique({
      where: { id }
    });

    if (!medicine) {
      return NextResponse.json({ error: 'Medicine not found' }, { status: 404 });
    }

    return NextResponse.json(medicine);
  } catch (error) {
    console.error('Get medicine API error:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch medicine',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}