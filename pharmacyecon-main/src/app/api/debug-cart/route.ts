import { NextRequest, NextResponse } from 'next/server';

// Access the same global cart storage
declare global {
  var customerCarts: { [email: string]: any[] } | undefined;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    
    if (!global.customerCarts) {
      global.customerCarts = {};
    }
    
    const carts = global.customerCarts;
    
    if (email) {
      // Debug specific customer cart
      const customerCart = carts[email] || [];
      return NextResponse.json({
        email,
        cartExists: !!carts[email],
        itemCount: customerCart.length,
        items: customerCart.map(item => ({
          id: item.id,
          name: item.name,
          isApproved: item.isApproved,
          licenseApproved: item.licenseApproved,
          approvedAt: item.approvedAt,
          addedAt: item.addedAt
        })),
        fullItems: customerCart
      });
    }
    
    // Debug all carts
    return NextResponse.json({
      totalCustomers: Object.keys(carts).length,
      customers: Object.keys(carts),
      allCarts: Object.keys(carts).map(customerEmail => ({
        email: customerEmail,
        itemCount: carts[customerEmail]?.length || 0,
        items: carts[customerEmail]?.map(item => ({
          name: item.name,
          approved: item.isApproved || item.licenseApproved
        })) || []
      }))
    });
  } catch (error) {
    console.error('Debug cart error:', error);
    return NextResponse.json({
      error: 'Debug failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}