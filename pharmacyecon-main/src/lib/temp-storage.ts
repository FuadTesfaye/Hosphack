// Temporary in-memory storage (replace with proper database later)
export let licenseRequests: any[] = [];
export let customerCarts: { [email: string]: any[] } = {};

export function addToCustomerCart(customerEmail: string, medicine: any) {
  if (!customerCarts[customerEmail]) {
    customerCarts[customerEmail] = [];
  }
  
  const cartItem = {
    ...medicine,
    quantity: 1,
    addedAt: new Date()
  };
  
  customerCarts[customerEmail].push(cartItem);
  return cartItem;
}