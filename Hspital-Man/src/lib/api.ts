import axios from 'axios';

export const API_GATEWAY_URL = "http://localhost:5000";

const api = axios.create({
  baseURL: API_GATEWAY_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Patient API
export const patientApi = {
  getAll: () => api.get('/patients'),
  getById: (id: string) => api.get(`/patients/${id}`),
  create: (patient: any) => api.post('/patients', patient),
  update: (id: string, patient: any) => api.put(`/patients/${id}`, patient),
  delete: (id: string) => api.delete(`/patients/${id}`),
  search: (params: { name?: string; email?: string; phone?: string }) => 
    api.get('/patients/search', { params }),
  getMedicalHistory: (id: string) => api.get(`/patients/${id}/medical-history`),
  getStatistics: () => api.get('/patients/statistics'),
};

// Doctor API
export const doctorApi = {
  getAll: () => api.get('/doctors'),
  getById: (id: string) => api.get(`/doctors/${id}`),
  create: (doctor: any) => api.post('/doctors', doctor),
  update: (id: string, doctor: any) => api.put(`/doctors/${id}`, doctor),
  delete: (id: string) => api.delete(`/doctors/${id}`),
  search: (params: { name?: string; specialization?: string; department?: string }) => 
    api.get('/doctors/search', { params }),
  getBySpecialization: (specialization: string) => api.get(`/doctors/specialization/${specialization}`),
  getByDepartment: (department: string) => api.get(`/doctors/department/${department}`),
  getStatistics: () => api.get('/doctors/statistics'),
};

// Appointment API
export const appointmentApi = {
  getAll: () => api.get('/appointments'),
  getById: (id: string) => api.get(`/appointments/${id}`),
  create: (appointment: any) => api.post('/appointments', appointment),
  update: (id: string, appointment: any) => api.put(`/appointments/${id}`, appointment),
  delete: (id: string) => api.delete(`/appointments/${id}`),
  getByPatient: (patientId: string) => api.get(`/appointments/patient/${patientId}`),
  getByDoctor: (doctorId: string) => api.get(`/appointments/doctor/${doctorId}`),
  getByDate: (date: string) => api.get(`/appointments/date/${date}`),
  updateStatus: (id: string, status: string) => api.put(`/appointments/${id}/status`, status),
  getUpcoming: () => api.get('/appointments/upcoming'),
  getStatistics: () => api.get('/appointments/statistics'),
};

// Medical Records API
export const medicalRecordApi = {
  getAll: () => api.get('/records'),
  getById: (id: string) => api.get(`/records/${id}`),
  create: (record: any) => api.post('/records', record),
  update: (id: string, record: any) => api.put(`/records/${id}`, record),
  delete: (id: string) => api.delete(`/records/${id}`),
  getByPatient: (patientId: string) => api.get(`/records/patient/${patientId}`),
  getByDoctor: (doctorId: string) => api.get(`/records/doctor/${doctorId}`),
  search: (params: { diagnosis?: string; treatment?: string }) => 
    api.get('/records/search', { params }),
  getLatestByPatient: (patientId: string) => api.get(`/records/patient/${patientId}/latest`),
  getStatistics: () => api.get('/records/statistics'),
};

// Inventory API
export const inventoryApi = {
  getAll: () => api.get('/inventory'),
  getById: (id: string) => api.get(`/inventory/${id}`),
  create: (item: any) => api.post('/inventory', item),
  update: (id: string, item: any) => api.put(`/inventory/${id}`, item),
  delete: (id: string) => api.delete(`/inventory/${id}`),
  search: (params: { name?: string }) => api.get('/inventory/search', { params }),
  getLowStock: (threshold?: number) => api.get('/inventory/low-stock', { params: { threshold } }),
  getByCategory: (category: string) => api.get(`/inventory/category/${category}`),
  getExpiring: (days?: number) => api.get('/inventory/expiring', { params: { days } }),
  getExpired: () => api.get('/inventory/expired'),
  updateQuantity: (id: string, quantity: number) => api.put(`/inventory/${id}/quantity`, quantity),
  restock: (id: string, quantity: number) => api.post(`/inventory/${id}/restock`, quantity),
  consume: (id: string, quantity: number) => api.post(`/inventory/${id}/consume`, quantity),
  getStatistics: () => api.get('/inventory/statistics'),
};

// Billing API
export const billingApi = {
  getAll: () => api.get('/billing'),
  getById: (id: string) => api.get(`/billing/${id}`),
  create: (bill: any) => api.post('/billing', bill),
  update: (id: string, bill: any) => api.put(`/billing/${id}`, bill),
  delete: (id: string) => api.delete(`/billing/${id}`),
  getByPatient: (patientId: string) => api.get(`/billing/patient/${patientId}`),
  getUnpaid: () => api.get('/billing/unpaid'),
  getOverdue: (days?: number) => api.get('/billing/overdue', { params: { days } }),
  markAsPaid: (id: string) => api.put(`/billing/${id}/pay`),
  generateBill: (patientId: string, amount: number) => api.post(`/billing/patient/${patientId}/generate`, amount),
  getStatistics: () => api.get('/billing/statistics'),
  getMonthlyRevenue: (year?: number) => api.get('/billing/revenue/monthly', { params: { year } }),
};

// Analytics API
export const analyticsApi = {
  getDashboard: () => api.get('/analytics/dashboard'),
  getPatientsCount: () => api.get('/analytics/patients/count'),
  getPatientDemographics: () => api.get('/analytics/patients/demographics'),
  getPatientGrowth: (months?: number) => api.get('/analytics/patients/growth', { params: { months } }),
  getBloodGroups: () => api.get('/analytics/patients/blood-groups'),
  getInsuranceStats: () => api.get('/analytics/patients/insurance'),
  getHealth: () => api.get('/analytics/health'),
};

export default api;
