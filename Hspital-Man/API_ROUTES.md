# Hospital-Man API Routes Documentation

## API Gateway Base URL: `http://localhost:5000`

All routes are accessible through the API Gateway which routes requests to the appropriate microservices.

---

## 🏥 Patient Service Routes
**Base Path:** `/patients`

### Core CRUD Operations
- `GET /patients` - Get all patients
- `GET /patients/{id}` - Get patient by ID
- `POST /patients` - Create new patient
- `PUT /patients/{id}` - Update patient
- `DELETE /patients/{id}` - Delete patient

### Patient Management
- `GET /patients/search?name={name}&email={email}&phone={phone}` - Search patients
- `GET /patients/{id}/medical-history` - Get patient medical history
- `GET /patients/statistics` - Get patient statistics

---

## 📅 Appointment Service Routes
**Base Path:** `/appointments`

### Core CRUD Operations
- `GET /appointments` - Get all appointments
- `GET /appointments/{id}` - Get appointment by ID
- `POST /appointments` - Create new appointment
- `PUT /appointments/{id}` - Update appointment
- `DELETE /appointments/{id}` - Delete appointment

### Appointment Management
- `GET /appointments/patient/{patientId}` - Get appointments by patient
- `GET /appointments/doctor/{doctorId}` - Get appointments by doctor
- `GET /appointments/date/{date}` - Get appointments by date
- `PUT /appointments/{id}/status` - Update appointment status
- `GET /appointments/upcoming` - Get upcoming appointments
- `GET /appointments/statistics` - Get appointment statistics

---

## 👨‍⚕️ Doctor Service Routes
**Base Path:** `/doctors`

### Core CRUD Operations
- `GET /doctors` - Get all active doctors
- `GET /doctors/{id}` - Get doctor by ID
- `POST /doctors` - Create new doctor
- `PUT /doctors/{id}` - Update doctor
- `DELETE /doctors/{id}` - Deactivate doctor (soft delete)

### Doctor Management
- `GET /doctors/search?name={name}&specialization={spec}&department={dept}` - Search doctors
- `GET /doctors/specialization/{specialization}` - Get doctors by specialization
- `GET /doctors/department/{department}` - Get doctors by department
- `GET /doctors/statistics` - Get doctor statistics

---

## 📋 Medical Records Service Routes
**Base Path:** `/records`

### Core CRUD Operations
- `GET /records` - Get all medical records
- `GET /records/{id}` - Get medical record by ID
- `POST /records` - Create new medical record
- `PUT /records/{id}` - Update medical record
- `DELETE /records/{id}` - Delete medical record

### Medical Records Management
- `GET /records/patient/{patientId}` - Get records by patient
- `GET /records/doctor/{doctorId}` - Get records by doctor
- `GET /records/search?diagnosis={diagnosis}&treatment={treatment}` - Search records
- `GET /records/patient/{patientId}/latest` - Get latest record for patient
- `GET /records/statistics` - Get medical records statistics

---

## 📦 Inventory Service Routes
**Base Path:** `/inventory`

### Core CRUD Operations
- `GET /inventory` - Get all inventory items
- `GET /inventory/{id}` - Get inventory item by ID
- `POST /inventory` - Create new inventory item
- `PUT /inventory/{id}` - Update inventory item
- `DELETE /inventory/{id}` - Delete inventory item

### Inventory Management
- `GET /inventory/search?name={name}` - Search inventory items
- `GET /inventory/low-stock?threshold={threshold}` - Get low stock items
- `GET /inventory/category/{category}` - Get items by category
- `GET /inventory/expiring?days={days}` - Get expiring items
- `GET /inventory/expired` - Get expired items
- `PUT /inventory/{id}/quantity` - Update item quantity
- `POST /inventory/{id}/restock` - Restock item
- `POST /inventory/{id}/consume` - Consume item stock
- `GET /inventory/statistics` - Get inventory statistics

---

## 💰 Billing Service Routes
**Base Path:** `/billing`

### Core CRUD Operations
- `GET /billing` - Get all bills
- `GET /billing/{id}` - Get bill by ID
- `POST /billing` - Create new bill
- `PUT /billing/{id}` - Update bill
- `DELETE /billing/{id}` - Delete bill

### Billing Management
- `GET /billing/patient/{patientId}` - Get bills by patient
- `GET /billing/unpaid` - Get unpaid bills
- `GET /billing/overdue?days={days}` - Get overdue bills
- `PUT /billing/{id}/pay` - Mark bill as paid
- `POST /billing/patient/{patientId}/generate` - Generate new bill for patient
- `GET /billing/statistics` - Get billing statistics
- `GET /billing/revenue/monthly?year={year}` - Get monthly revenue

---

## 📊 Analytics Service Routes
**Base Path:** `/analytics`

### Dashboard & Analytics
- `GET /analytics/dashboard` - Get dashboard metrics
- `GET /analytics/patients/count` - Get total patient count
- `GET /analytics/patients/demographics` - Get patient demographics
- `GET /analytics/patients/growth?months={months}` - Get patient growth data
- `GET /analytics/patients/blood-groups` - Get blood group distribution
- `GET /analytics/patients/insurance` - Get insurance statistics
- `GET /analytics/health` - Service health check

---

## 🔧 Service Ports

When running services individually (not through API Gateway):

- **API Gateway**: `http://localhost:5000`
- **Patient Service**: `http://localhost:5001`
- **Appointment Service**: `http://localhost:5002`
- **Medical Record Service**: `http://localhost:5003`
- **Inventory Service**: `http://localhost:5004`
- **Billing Service**: `http://localhost:5005`
- **Analytics Service**: `http://localhost:5006`
- **Doctor Service**: `http://localhost:5007`

---

## 📝 Request/Response Examples

### Create Patient
```json
POST /patients
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@email.com",
  "phone": "+1234567890",
  "dateOfBirth": "1990-01-01T00:00:00Z",
  "gender": "Male",
  "bloodGroup": "O+",
  "address": "123 Main St, City, State",
  "emergencyContact": "Jane Doe",
  "emergencyPhone": "+1234567891",
  "allergies": "None",
  "chronicConditions": "None",
  "insuranceProvider": "Health Insurance Co",
  "insuranceNumber": "INS123456"
}
```

### Create Appointment
```json
POST /appointments
{
  "patientId": "guid-here",
  "doctorId": "guid-here",
  "appointmentDate": "2024-01-15T10:00:00Z",
  "reason": "Regular checkup",
  "appointmentType": "Consultation",
  "durationMinutes": 30,
  "fee": 100.00
}
```

### Create Doctor
```json
POST /doctors
{
  "firstName": "Dr. Sarah",
  "lastName": "Smith",
  "email": "dr.smith@hospital.com",
  "phone": "+1234567892",
  "specialization": "Cardiology",
  "licenseNumber": "LIC123456",
  "dateOfBirth": "1980-05-15T00:00:00Z",
  "department": "Cardiology",
  "consultationFee": 150.00,
  "qualifications": "MD, FACC",
  "experienceYears": 15
}
```

### Create Inventory Item
```json
POST /inventory
{
  "name": "Paracetamol 500mg",
  "quantity": 1000,
  "price": 0.50,
  "category": "Medicine",
  "description": "Pain relief medication",
  "supplier": "Pharma Corp",
  "expiryDate": "2025-12-31T00:00:00Z",
  "batchNumber": "BATCH001",
  "minimumStock": 100,
  "maximumStock": 5000,
  "unit": "tablets",
  "location": "Pharmacy-A1"
}
```

---

## 🔐 Authentication & Authorization

Currently, the API does not implement authentication. In a production environment, you should add:

- JWT token authentication
- Role-based access control (RBAC)
- API key management
- Rate limiting
- CORS configuration

---

## 📈 Status Codes

- `200 OK` - Successful GET requests
- `201 Created` - Successful POST requests
- `204 No Content` - Successful PUT/DELETE requests
- `400 Bad Request` - Invalid request data
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

---

## 🧪 Testing

Use tools like Postman, Insomnia, or curl to test the API endpoints. Each service also provides Swagger documentation when running individually at `/swagger` endpoint.