import { NextRequest, NextResponse } from 'next/server';

// In-memory storage for orders when database is unavailable
declare global {
  var ordersStorage: any[] | undefined;
}

if (!global.ordersStorage) {
  global.ordersStorage = [
    {
      id: 'test-order-1',
      customerEmail: 'test@example.com',
      customerName: 'John Doe',
      customerPhone: '+1234567890',
      customerAge: '35',
      customerLocation: '123 Main St, City',
      pharmacyId: 'p1',
      pharmacyName: 'HealthFirst Pharmacy',
      status: 'PROCESSING',
      total: 25.99,
      createdAt: new Date(),
      updatedAt: new Date(),
      items: [
        {
          id: 'item-1',
          medicineId: 'm1',
          medicineName: 'Paracetamol 500mg',
          quantity: 2,
          price: 5.99
        }
      ]
    },
    {
      id: 'test-order-2',
      customerEmail: 'jane@example.com',
      customerName: 'Jane Smith',
      customerPhone: '+1234567891',
      customerAge: '28',
      customerLocation: '456 Oak Ave, Town',
      pharmacyId: 'p2',
      pharmacyName: 'CarePlus Drugs',
      status: 'SHIPPED',
      total: 18.50,
      createdAt: new Date(),
      updatedAt: new Date(),
      items: [
        {
          id: 'item-2',
          medicineId: 'm2',
          medicineName: 'Ibuprofen 200mg',
          quantity: 1,
          price: 8.50
        }
      ]
    }
  ];
}

const ordersStorage = global.ordersStorage;

// Try to use Prisma, fallback to in-memory storage
let prisma: any = null;
try {
  const { PrismaClient } = require('@prisma/client');
  prisma = new PrismaClient();
} catch (error) {
  console.log('Database not available, using in-memory storage');
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    console.log('📦 Creating order:', {
      customerEmail: data.customerEmail,
      pharmacyId: data.pharmacyId,
      pharmacyName: data.pharmacyName,
      itemCount: data.items?.length || 0
    });
    
    const orderData = {
      id: Math.random().toString(36).substr(2, 9),
      customerEmail: data.customerEmail || 'customer@example.com',
      customerName: data.customerName || 'Customer',
      customerPhone: data.customerPhone || '+1234567890',
      customerAge: data.customerAge || '',
      customerLocation: data.customerLocation || '',
      pharmacyId: data.pharmacyId || 'default',
      pharmacyName: data.pharmacyName || 'MediLink Pharmacy',
      status: 'PROCESSING',
      total: data.total || 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      items: (data.items || []).map((item: any) => ({
        id: Math.random().toString(36).substr(2, 9),
        medicineId: item.medicineId || item.id,
        medicineName: item.name,
        quantity: item.quantity || 1,
        price: item.price || 0,
        createdAt: new Date(),
        updatedAt: new Date()
      }))
    };

    if (prisma) {
      try {
        const order = await prisma.order.create({
          data: {
            customerEmail: data.customerEmail,
            customerName: data.customerName,
            customerPhone: data.customerPhone,
            customerAge: data.customerAge || '',
            customerLocation: data.customerLocation || '',
            pharmacyId: data.pharmacyId,
            pharmacyName: data.pharmacyName,
            status: 'PROCESSING',
            total: data.total,
            items: {
              create: data.items.map((item: any) => ({
                medicineId: item.medicineId,
                medicineName: item.name,
                quantity: item.quantity,
                price: item.price
              }))
            }
          },
          include: {
            items: true
          }
        });
        return NextResponse.json({ success: true, order });
      } catch (dbError) {
        console.log('Database error, falling back to in-memory storage');
      }
    }
    
    // Fallback to in-memory storage
    ordersStorage.push(orderData);
    console.log('✅ Order created successfully:', orderData.id, 'for pharmacy:', orderData.pharmacyName);
    console.log('📊 Total orders in storage:', ordersStorage.length);
    return NextResponse.json({ success: true, order: orderData });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const pharmacyId = searchParams.get('pharmacyId');
    const debug = searchParams.get('debug');
    
    console.log('🔍 Fetching orders:', { pharmacyId, totalInStorage: ordersStorage.length });
    
    if (debug === 'all') {
      console.log('📊 All orders in storage:', ordersStorage.map(o => ({
        id: o.id,
        pharmacyId: o.pharmacyId,
        pharmacyName: o.pharmacyName,
        customerName: o.customerName,
        total: o.total
      })));
      return NextResponse.json({
        totalOrders: ordersStorage.length,
        orders: ordersStorage,
        pharmacyFilter: pharmacyId
      });
    }
    
    if (prisma) {
      try {
        const orders = await prisma.order.findMany({
          where: pharmacyId ? { pharmacyId } : {},
          include: {
            items: true
          },
          orderBy: { createdAt: 'desc' }
        });
        console.log('💾 Database orders found:', orders.length);
        return NextResponse.json(orders);
      } catch (dbError) {
        console.log('Database error, falling back to in-memory storage');
      }
    }
    
    // Fallback to in-memory storage
    let orders = [...ordersStorage];
    if (pharmacyId) {
      const filteredOrders = orders.filter(order => order.pharmacyId === pharmacyId);
      console.log(`🎯 Filtered orders for pharmacy ${pharmacyId}:`, filteredOrders.length, 'out of', orders.length);
      orders = filteredOrders;
    }
    orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    console.log('✅ Returning orders:', orders.length);
    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    // Always return empty array instead of error to prevent frontend crashes
    return NextResponse.json([]);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, status } = await request.json();
    
    if (prisma) {
      try {
        const order = await prisma.order.update({
          where: { id },
          data: { status }
        });
        return NextResponse.json({ success: true, order });
      } catch (dbError) {
        console.log('Database error, falling back to in-memory storage');
      }
    }
    
    // Fallback to in-memory storage
    const orderIndex = ordersStorage.findIndex(order => order.id === id);
    if (orderIndex !== -1) {
      ordersStorage[orderIndex].status = status;
      ordersStorage[orderIndex].updatedAt = new Date();
      return NextResponse.json({ success: true, order: ordersStorage[orderIndex] });
    }
    
    return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }
    
    if (prisma) {
      try {
        await prisma.order.delete({
          where: { id }
        });
        return NextResponse.json({ success: true });
      } catch (dbError) {
        console.log('Database error, falling back to in-memory storage');
      }
    }
    
    // Fallback to in-memory storage
    const orderIndex = ordersStorage.findIndex(order => order.id === id);
    if (orderIndex !== -1) {
      ordersStorage.splice(orderIndex, 1);
      return NextResponse.json({ success: true });
    }
    
    return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  } catch (error) {
    console.error('Error deleting order:', error);
    return NextResponse.json({ error: 'Failed to delete order' }, { status: 500 });
  }
}