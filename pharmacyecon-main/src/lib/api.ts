import type { Medicine, Pharmacy, Order, Prescription } from './types';

// Medicine API calls
export async function getMedicines(): Promise<Medicine[]> {
  const response = await fetch('/api/medicines');
  if (!response.ok) throw new Error('Failed to fetch medicines');
  return response.json();
}

export async function addMedicine(data: Omit<Medicine, 'id'>, imageFile?: File): Promise<Medicine> {
  console.log('➕ Adding new medicine:', { ...data, pharmacyId: data.pharmacyId });
  
  try {
    if (imageFile) {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value.toString());
      });
      formData.append('image', imageFile);
      
      const response = await fetch('/api/medicines', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('Add medicine error (FormData):', errorData);
        throw new Error(errorData.error || errorData.details || `Failed to add medicine (${response.status})`);
      }
      
      const result = await response.json();
      console.log('✅ Medicine added successfully:', result.name);
      return result;
    } else {
      console.log('📤 Sending JSON request for new medicine');
      
      const response = await fetch('/api/medicines', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      console.log('📥 Response status:', response.status, response.statusText);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('Add medicine error (JSON):', errorData);
        throw new Error(errorData.error || errorData.details || `Failed to add medicine (${response.status})`);
      }
      
      const result = await response.json();
      console.log('✅ Medicine added successfully:', result.name);
      return result;
    }
  } catch (error) {
    console.error('❌ addMedicine client error:', error);
    throw error;
  }
}

export async function updateMedicine(id: string, data: Partial<Omit<Medicine, 'id'>>, imageFile?: File): Promise<Medicine> {
  if (imageFile) {
    const formData = new FormData();
    formData.append('id', id);
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        formData.append(key, value.toString());
      }
    });
    formData.append('image', imageFile);
    
    const response = await fetch('/api/medicines', {
      method: 'PUT',
      body: formData,
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      console.error('Update medicine client error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData
      });
      throw new Error(errorData.error || `Failed to update medicine (${response.status})`);
    }
    
    return response.json();
  } else {
    const response = await fetch('/api/medicines', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...data }),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      console.error('Update medicine client error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData
      });
      throw new Error(errorData.error || `Failed to update medicine (${response.status})`);
    }
    
    return response.json();
  }
}

export async function deleteMedicine(id: string): Promise<void> {
  const response = await fetch(`/api/medicines?id=${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete medicine');
}

// Pharmacy API calls
export async function getPharmacies(): Promise<Pharmacy[]> {
  const response = await fetch('/api/pharmacies');
  if (!response.ok) throw new Error('Failed to fetch pharmacies');
  return response.json();
}

export async function addPharmacy(data: Omit<Pharmacy, 'id'>, logoFile?: File, licenseFile?: File): Promise<Pharmacy> {
  console.log('➕ Adding new pharmacy:', { ...data, password: data.password ? '[HIDDEN]' : 'none' });
  
  try {
    if (logoFile || licenseFile) {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value.toString());
      });
      if (logoFile) formData.append('logo', logoFile);
      if (licenseFile) formData.append('license', licenseFile);
      
      const response = await fetch('/api/pharmacies', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('Add pharmacy error (FormData):', error);
        throw new Error(error.error || error.details || `Failed to add pharmacy (${response.status})`);
      }
      
      const result = await response.json();
      console.log('✅ Pharmacy added successfully:', result.name);
      return result;
    } else {
      console.log('📤 Sending JSON request for new pharmacy');
      
      const response = await fetch('/api/pharmacies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      console.log('📥 Response status:', response.status, response.statusText);
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('Add pharmacy error (JSON):', error);
        throw new Error(error.error || error.details || `Failed to add pharmacy (${response.status})`);
      }
      
      const result = await response.json();
      console.log('✅ Pharmacy added successfully:', result.name);
      return result;
    }
  } catch (error) {
    console.error('❌ addPharmacy client error:', error);
    throw error;
  }
}

export async function updatePharmacy(id: string, data: Partial<Omit<Pharmacy, 'id'>>, logoFile?: File, licenseFile?: File): Promise<Pharmacy> {
  console.log(`🔄 Updating pharmacy ${id} with data:`, { ...data, password: data.password ? '[HIDDEN]' : 'none' });
  
  try {
    if (logoFile || licenseFile) {
      const formData = new FormData();
      formData.append('id', id);
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined) {
          formData.append(key, value.toString());
        }
      });
      if (logoFile) formData.append('logo', logoFile);
      if (licenseFile) formData.append('license', licenseFile);
      
      const response = await fetch('/api/pharmacies', {
        method: 'PUT',
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('Update pharmacy error (FormData):', {
          status: response.status,
          statusText: response.statusText,
          error: errorData
        });
        throw new Error(errorData.error || errorData.details || `Failed to update pharmacy (${response.status})`);
      }
      
      return response.json();
    } else {
      const requestBody = { id, ...data };
      console.log('📤 Sending JSON request:', { ...requestBody, password: requestBody.password ? '[HIDDEN]' : 'none' });
      
      const response = await fetch('/api/pharmacies', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });
      
      console.log('📥 Response status:', response.status, response.statusText);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('Update pharmacy error (JSON):', {
          status: response.status,
          statusText: response.statusText,
          error: errorData
        });
        throw new Error(errorData.error || errorData.details || `Failed to update pharmacy (${response.status})`);
      }
      
      const result = await response.json();
      console.log('✅ Pharmacy updated successfully:', result.name);
      return result;
    }
  } catch (error) {
    console.error('❌ updatePharmacy client error:', error);
    throw error;
  }
}

export async function deletePharmacy(id: string): Promise<void> {
  const response = await fetch(`/api/pharmacies?id=${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete pharmacy');
}

// Order API calls
export async function getOrders(): Promise<Order[]> {
  const response = await fetch('/api/orders');
  if (!response.ok) throw new Error('Failed to fetch orders');
  return response.json();
}

export async function updateOrderStatus(id: string, status: Order['status']): Promise<Order> {
  const response = await fetch('/api/orders', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, status }),
  });
  if (!response.ok) throw new Error('Failed to update order status');
  return response.json();
}

export async function deleteOrder(id: string): Promise<void> {
  const response = await fetch(`/api/orders?id=${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete order');
}

// Prescription API calls
export async function getPrescriptions(): Promise<Prescription[]> {
  const response = await fetch('/api/prescriptions');
  if (!response.ok) throw new Error('Failed to fetch prescriptions');
  return response.json();
}

export async function updatePrescriptionStatus(id: string, status: Prescription['status']): Promise<Prescription> {
  const response = await fetch('/api/prescriptions', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, status: status.toUpperCase().replace(' ', '_') }),
  });
  if (!response.ok) throw new Error('Failed to update prescription status');
  return response.json();
}

export async function deletePrescription(id: string): Promise<void> {
  const response = await fetch(`/api/prescriptions?id=${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete prescription');
}

// Login API
export async function login(email: string, password: string): Promise<{ success: boolean; pharmacy?: any }> {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.details || 'Login failed');
  }
  
  return response.json();
}