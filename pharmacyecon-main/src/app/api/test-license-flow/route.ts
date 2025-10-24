import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { action, customerEmail } = await request.json();
    
    if (action === 'create-test-license') {
      // Create a test license request
      const testLicenseData = {
        medicineId: 'test-med-' + Date.now(),
        medicineName: 'Test Licensed Medicine',
        customerEmail: customerEmail || 'test@example.com',
        licenseImageUrl: 'https://picsum.photos/400/300',
        pharmacyId: 'test-pharmacy-1'
      };
      
      const licenseResponse = await fetch(`${request.nextUrl.origin}/api/license-requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testLicenseData)
      });
      
      if (!licenseResponse.ok) {
        throw new Error('Failed to create license request');
      }
      
      const licenseResult = await licenseResponse.json();
      
      // Immediately approve it
      const approvalResponse = await fetch(`${request.nextUrl.origin}/api/license-requests`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: licenseResult.id,
          status: 'approved'
        })
      });
      
      if (!approvalResponse.ok) {
        throw new Error('Failed to approve license');
      }
      
      const approvalResult = await approvalResponse.json();
      
      // Check if it was added to cart
      const cartResponse = await fetch(`${request.nextUrl.origin}/api/customer-cart?email=${encodeURIComponent(testLicenseData.customerEmail)}`);
      const cartItems = cartResponse.ok ? await cartResponse.json() : [];
      
      return NextResponse.json({
        success: true,
        licenseId: licenseResult.id,
        cartItems: cartItems.length,
        message: `Test license created and approved. Cart has ${cartItems.length} items.`,
        cartContents: cartItems.map(item => ({ name: item.name, approved: item.isApproved }))
      });
    }
    
    if (action === 'check-cart') {
      const email = customerEmail || 'test@example.com';
      const cartResponse = await fetch(`${request.nextUrl.origin}/api/customer-cart?email=${encodeURIComponent(email)}`);
      const cartItems = cartResponse.ok ? await cartResponse.json() : [];
      
      return NextResponse.json({
        email,
        cartItems: cartItems.length,
        items: cartItems.map(item => ({
          name: item.name,
          approved: item.isApproved || item.licenseApproved,
          addedAt: item.addedAt
        }))
      });
    }
    
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Test license flow error:', error);
    return NextResponse.json({
      error: 'Test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}