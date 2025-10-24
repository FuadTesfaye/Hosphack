import { NextRequest, NextResponse } from 'next/server';
import { persistentStorage } from '@/lib/persistent-storage';

// Simple in-memory storage (database disabled for now)
let licenseRequests: any[] = [];
let prisma: any = null;

// Add some test data
if (licenseRequests.length === 0) {
  licenseRequests.push({
    id: 'test-1',
    medicineId: 'med-1',
    medicineName: 'Sample Medicine',
    customerEmail: 'sample@test.com',
    licenseImageUrl: 'https://picsum.photos/400/300',
    status: 'pending',
    pharmacyId: 'pharmacy-1',
    createdAt: new Date(),
    updatedAt: new Date()
  });
}

// Shared cart storage - this should match the one in customer-cart
declare global {
  var customerCarts: { [email: string]: any[] } | undefined;
}

if (!global.customerCarts) {
  global.customerCarts = {};
}

// Force reference to global storage
const getCustomerCarts = () => {
  if (!global.customerCarts) {
    global.customerCarts = {};
  }
  return global.customerCarts;
};

// Ensure both APIs use the same storage reference
const ensureSharedStorage = () => {
  if (!global.customerCarts) {
    global.customerCarts = {};
  }
  // Force the customer-cart API to use the same reference
  return global.customerCarts;
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const pharmacyId = searchParams.get('pharmacyId');
    const debug = searchParams.get('debug');
    
    // Merge in-memory and persistent storage
    let allRequests = [...licenseRequests];
    
    // Add any requests from persistent storage that aren't in memory
    if (typeof window !== 'undefined') {
      const persistentRequests = persistentStorage.getLicenseRequests();
      persistentRequests.forEach(persistentReq => {
        if (!allRequests.find(memReq => memReq.id === persistentReq.id)) {
          allRequests.push(persistentReq);
        }
      });
    }
    
    // Debug endpoint
    if (debug === 'all') {
      console.log('🔍 DEBUG: All license requests');
      console.log('📊 In-memory requests:', licenseRequests.length);
      console.log('📊 Total merged requests:', allRequests.length);
      
      return NextResponse.json({
        inMemory: licenseRequests,
        merged: allRequests,
        total: allRequests.length
      });
    }
    
    // Filter by pharmacy if specified
    const filteredRequests = pharmacyId && pharmacyId !== 'all' 
      ? allRequests.filter(r => r.pharmacyId === pharmacyId)
      : allRequests;
    
    console.log(`📊 Loaded ${filteredRequests.length} requests (${licenseRequests.length} in-memory + merged) for pharmacy ${pharmacyId}`);
    console.log(`✅ Returning ${filteredRequests.length} license requests`);
    
    return NextResponse.json(filteredRequests);
  } catch (error) {
    console.error('❌ License requests API error:', error);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    console.log('📝 Creating license request:', data);
    
    // Create request in in-memory storage first
    const newRequest = {
      id: 'req_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      medicineId: data.medicineId,
      medicineName: data.medicineName,
      customerEmail: data.customerEmail,
      licenseImageUrl: data.licenseImageUrl,
      status: 'pending',
      pharmacyId: data.pharmacyId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Add to in-memory storage
    licenseRequests.push(newRequest);
    
    // Also save to persistent storage if available
    if (typeof window !== 'undefined') {
      persistentStorage.addLicenseRequest({
        medicineId: data.medicineId,
        medicineName: data.medicineName,
        customerEmail: data.customerEmail,
        licenseImageUrl: data.licenseImageUrl,
        status: 'pending',
        pharmacyId: data.pharmacyId
      });
    }
    
    console.log('✅ License request created:', newRequest.id);
    console.log('📊 Total in-memory requests:', licenseRequests.length);
    console.log('📋 All requests:', licenseRequests.map(r => ({ id: r.id, medicine: r.medicineName, customer: r.customerEmail, status: r.status })));
    
    return NextResponse.json({ id: newRequest.id, success: true }, { status: 201 });
  } catch (error) {
    console.error('❌ POST license request error:', error);
    return NextResponse.json({ 
      error: 'Failed to create license request',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, status } = await request.json();
    console.log(`🔄 Processing license approval: ID=${id}, Status=${status}`);
    
    // Find and update in in-memory storage first
    const requestIndex = licenseRequests.findIndex(r => r.id === id);
    let licenseRequest = null;
    
    if (requestIndex !== -1) {
      licenseRequest = licenseRequests[requestIndex];
      licenseRequest.status = status;
      licenseRequest.updatedAt = new Date().toISOString();
      console.log(`📝 Updated in-memory license request ${id} to: ${status}`);
    }
    
    if (!licenseRequest) {
      console.error(`❌ License request not found in memory: ${id}`);
      return NextResponse.json({ error: 'License request not found' }, { status: 404 });
    }
    
    console.log(`📋 Request details:`, {
      medicineId: licenseRequest.medicineId,
      medicineName: licenseRequest.medicineName,
      customerEmail: licenseRequest.customerEmail,
      pharmacyId: licenseRequest.pharmacyId
    });
    
    // If approved, add to customer cart using global storage
    let customerCartSize = 0;
    if (status === 'approved') {
      const carts = ensureSharedStorage();
      
      if (!carts[licenseRequest.customerEmail]) {
        carts[licenseRequest.customerEmail] = [];
      }
      
      // Check if medicine is already in cart
      const existingItem = carts[licenseRequest.customerEmail].find(
        item => item.id === licenseRequest.medicineId
      );
      
      if (!existingItem) {
        const approvedMedicine = {
          id: licenseRequest.medicineId,
          name: licenseRequest.medicineName,
          price: 29.99,
          imageUrl: 'https://picsum.photos/400/300?random=' + Date.now(),
          description: `Licensed prescription medicine: ${licenseRequest.medicineName}`,
          category: 'Prescription',
          requiresLicense: true,
          stock: 25,
          expirationDate: '2025-12-31',
          pharmacyId: licenseRequest.pharmacyId,
          pharmacyName: 'Licensed Pharmacy',
          quantity: 1,
          isApproved: true,
          licenseApproved: true,
          licenseRequestId: licenseRequest.id,
          approvedAt: new Date().toISOString(),
          addedAt: new Date().toISOString(),
          customerEmail: licenseRequest.customerEmail
        };
        
        carts[licenseRequest.customerEmail].push(approvedMedicine);
        global.customerCarts = carts;
        
        console.log(`✅ Medicine "${licenseRequest.medicineName}" approved and added to cart`);
      }
      
      customerCartSize = carts[licenseRequest.customerEmail]?.length || 0;
      console.log(`🛍️ Customer ${licenseRequest.customerEmail} now has ${customerCartSize} items in cart`);
    } else if (status === 'rejected') {
      console.log(`❌ License REJECTED for medicine "${licenseRequest.medicineName}" - customer: ${licenseRequest.customerEmail}`);
    }
    
    // Also update persistent storage if available
    if (typeof window !== 'undefined') {
      persistentStorage.updateLicenseRequestStatus(id, status);
    }
    
    return NextResponse.json({ 
      success: true, 
      licenseRequestId: id,
      status: status,
      customerEmail: licenseRequest.customerEmail,
      cartItems: customerCartSize,
      message: status === 'approved' ? `Medicine "${licenseRequest.medicineName}" approved and added to cart` : `License request ${status}`,
      debug: {
        inMemoryRequests: licenseRequests.length,
        cartSize: customerCartSize,
        requestFound: true
      }
    });
  } catch (error) {
    console.error('❌ PUT license request error:', error);
    return NextResponse.json({ 
      error: 'Failed to update license request',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

