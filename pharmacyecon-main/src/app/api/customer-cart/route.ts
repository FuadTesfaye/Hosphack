import { NextRequest, NextResponse } from 'next/server';
import { persistentStorage } from '@/lib/persistent-storage';

// Shared cart storage - this should match the one in license-requests
declare global {
  var customerCarts: { [email: string]: any[] } | undefined;
}

// Ensure global storage is initialized
if (!global.customerCarts) {
  global.customerCarts = {};
}

// Always use the global reference directly
const getCustomerCarts = () => {
  if (!global.customerCarts) {
    global.customerCarts = {};
  }
  return global.customerCarts;
};

const customerCarts = getCustomerCarts();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const customerEmail = searchParams.get('email');
    const debug = searchParams.get('debug');
    
    // Load from persistent storage
    const carts = persistentStorage.getCustomerCarts();
    
    // Sync with global storage for compatibility
    if (typeof global !== 'undefined') {
      global.customerCarts = carts;
    }
    
    // Debug endpoint to see all carts
    if (debug === 'all') {
      console.log('📋 All customer carts (persistent):', Object.keys(carts).map(email => ({
        email,
        items: carts[email]?.length || 0
      })));
      return NextResponse.json({
        totalCustomers: Object.keys(carts).length,
        carts: Object.keys(carts).map(email => ({
          email,
          items: carts[email]?.length || 0,
          itemNames: carts[email]?.map(item => item.name) || [],
          approvedItems: carts[email]?.filter(item => item.isApproved || item.licenseApproved).length || 0
        })),
        source: 'persistent-storage'
      });
    }
    
    if (!customerEmail) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }
    
    // Get cart from persistent storage
    const cart = persistentStorage.getCustomerCart(customerEmail);
    console.log(`🛍️ Loading cart for ${customerEmail}: ${cart.length} items (from persistent storage)`);
    
    if (cart.length > 0) {
      console.log(`📋 Cart items:`, cart.map(item => `${item.name} (${item.isApproved || item.licenseApproved ? 'APPROVED' : 'REGULAR'})`));
    } else {
      console.log(`⚠️ No items found for ${customerEmail}. Available emails:`, Object.keys(carts));
      console.log(`🔍 Available carts:`, Object.keys(carts).map(email => ({
        email,
        items: carts[email]?.length || 0,
        approved: carts[email]?.filter(item => item.isApproved || item.licenseApproved).length || 0
      })));
    }
    
    return NextResponse.json(cart);
  } catch (error) {
    console.error('GET customer cart error:', error);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { customerEmail, medicine, test } = await request.json();
    
    // Test endpoint to manually add approved item
    if (test === 'add-approved') {
      if (!customerEmail) {
        return NextResponse.json({ error: 'Email required for test' }, { status: 400 });
      }
      
      const carts = getCustomerCarts();
      if (!carts[customerEmail]) {
        carts[customerEmail] = [];
      }
      
      const testItem = {
        id: 'test-medicine-123',
        name: 'Test Approved Medicine',
        price: 29.99,
        imageUrl: 'https://picsum.photos/400/300',
        description: 'Test approved prescription medicine',
        category: 'Prescription',
        requiresLicense: true,
        quantity: 1,
        isApproved: true,
        licenseApproved: true,
        approvedAt: new Date().toISOString(),
        addedAt: new Date().toISOString()
      };
      
      carts[customerEmail].push(testItem);
      global.customerCarts = carts;
      console.log(`🧪 TEST: Added approved item to cart for ${customerEmail}`);
      
      return NextResponse.json({ 
        success: true, 
        message: 'Test approved item added',
        cartSize: carts[customerEmail].length 
      });
    }
    
    if (!customerEmail || !medicine) {
      return NextResponse.json({ error: 'Email and medicine are required' }, { status: 400 });
    }
    
    const carts = getCustomerCarts();
    if (!carts[customerEmail]) {
      carts[customerEmail] = [];
    }
    
    // Add medicine to cart
    const cartItem = {
      ...medicine,
      quantity: 1,
      addedAt: new Date().toISOString()
    };
    
    carts[customerEmail].push(cartItem);
    global.customerCarts = carts;
    console.log(`➕ Added item to cart for ${customerEmail}: ${medicine.name}`);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('POST customer cart error:', error);
    return NextResponse.json({ error: 'Failed to add to cart' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { action, customerEmail, orderData } = await request.json();
    console.log(`📦 PUT request - Action: ${action}, Customer: ${customerEmail}`);
    
    if (action === 'create-order') {
      if (!customerEmail || !orderData) {
        console.error('❌ Missing required data:', { customerEmail: !!customerEmail, orderData: !!orderData });
        return NextResponse.json({ error: 'Email and order data required' }, { status: 400 });
      }
      
      // Get cart from both global and persistent storage
      const globalCarts = getCustomerCarts();
      let cart = globalCarts[customerEmail] || [];
      
      // If global cart is empty, try persistent storage
      if (cart.length === 0 && typeof window !== 'undefined') {
        const persistentCart = persistentStorage.getCustomerCart(customerEmail);
        if (persistentCart.length > 0) {
          cart = persistentCart;
          // Sync to global storage
          globalCarts[customerEmail] = cart;
          global.customerCarts = globalCarts;
          console.log(`🔄 Synced ${cart.length} items from persistent storage to global`);
        }
      }
      
      console.log(`🛍️ Cart for ${customerEmail}: ${cart.length} items`);
      console.log(`📋 Cart items:`, cart.map(item => ({ name: item.name, price: item.price, quantity: item.quantity })));
      
      if (cart.length === 0) {
        console.error('❌ Cart is empty for customer:', customerEmail);
        console.log('🔍 Available customers:', Object.keys(globalCarts));
        return NextResponse.json({ error: 'Cart is empty. Please add items to cart before ordering.' }, { status: 400 });
      }
      
      // Group items by pharmacy
      const itemsByPharmacy = cart.reduce((acc, item) => {
        const pharmacyId = item.pharmacyId || 'default';
        if (!acc[pharmacyId]) {
          acc[pharmacyId] = {
            pharmacyId,
            pharmacyName: item.pharmacyName || 'MediLink Pharmacy',
            items: [],
            total: 0
          };
        }
        acc[pharmacyId].items.push(item);
        acc[pharmacyId].total += item.price * item.quantity;
        return acc;
      }, {} as any);
      
      const createdOrders = [];
      
      // Access orders storage directly
      declare global {
        var ordersStorage: any[] | undefined;
      }
      
      if (!global.ordersStorage) {
        global.ordersStorage = [];
      }
      
      // Create orders for each pharmacy
      for (const pharmacyGroup of Object.values(itemsByPharmacy) as any[]) {
        const newOrder = {
          id: Math.random().toString(36).substr(2, 9),
          customerEmail,
          customerName: orderData.customerName || 'Customer',
          customerPhone: orderData.customerPhone || '+1234567890',
          customerAge: orderData.customerAge || '',
          customerLocation: orderData.customerLocation || '',
          pharmacyId: pharmacyGroup.pharmacyId,
          pharmacyName: pharmacyGroup.pharmacyName,
          status: 'PROCESSING',
          total: pharmacyGroup.total,
          createdAt: new Date(),
          updatedAt: new Date(),
          items: pharmacyGroup.items.map((item: any) => ({
            id: Math.random().toString(36).substr(2, 9),
            medicineId: item.id,
            medicineName: item.name,
            quantity: item.quantity,
            price: item.price,
            createdAt: new Date(),
            updatedAt: new Date()
          }))
        };
        
        global.ordersStorage.push(newOrder);
        createdOrders.push(newOrder);
        console.log(`✅ Order created for pharmacy ${pharmacyGroup.pharmacyName}: ${newOrder.id}`);
        console.log(`📊 Total orders in storage now: ${global.ordersStorage.length}`);
      }
      
      // Clear the cart after successful order creation
      if (createdOrders.length > 0) {
        globalCarts[customerEmail] = [];
        global.customerCarts = globalCarts;
        
        // Also clear persistent storage
        if (typeof window !== 'undefined') {
          persistentStorage.clearCustomerCart(customerEmail);
        }
        
        console.log(`🛒 Cart cleared for ${customerEmail} after creating ${createdOrders.length} orders`);
        console.log(`📋 Final orders storage count: ${global.ordersStorage.length}`);
        console.log(`🔍 Created order IDs:`, createdOrders.map(o => o.id));
      }
      
      return NextResponse.json({ 
        success: true, 
        orders: createdOrders,
        message: `${createdOrders.length} orders created successfully` 
      });
    }
    
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('PUT customer cart error:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const customerEmail = searchParams.get('email');
    const medicineId = searchParams.get('medicineId');
    
    if (!customerEmail || !medicineId) {
      return NextResponse.json({ error: 'Email and medicineId are required' }, { status: 400 });
    }
    
    const carts = getCustomerCarts();
    if (carts[customerEmail]) {
      carts[customerEmail] = carts[customerEmail].filter(item => item.id !== medicineId);
      global.customerCarts = carts;
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE customer cart error:', error);
    return NextResponse.json({ error: 'Failed to remove from cart' }, { status: 500 });
  }
}