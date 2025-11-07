# Hospital-Man - Modern Hospital Management System

A comprehensive microservices-based hospital management system built with .NET Core backend services and a React TypeScript frontend. The system provides complete healthcare facility management including patient registration, appointments, medical records, inventory, billing, and analytics.

## 🏥 System Overview

Hospital-Man is designed as a distributed system using microservices architecture to ensure scalability, maintainability, and fault tolerance. Each service handles a specific domain of hospital operations while communicating through an API Gateway and message broker.

## 🏗️ Architecture

### Microservices Architecture
- **API Gateway**: Centralized entry point using Ocelot for routing and load balancing
- **Patient Service**: Patient registration, profile management, and demographics
- **Appointment Service**: Scheduling, booking, and appointment management
- **Medical Record Service**: Electronic health records and medical history
- **Inventory Service**: Medical supplies, equipment, and pharmacy inventory
- **Billing Service**: Financial transactions, invoicing, and payment processing
- **Analytics Service**: Reporting, dashboards, and business intelligence

### Technology Stack

#### Backend Services (.NET Core)
- **Framework**: .NET 8.0
- **Database**: PostgreSQL with Entity Framework Core
- **Message Broker**: RabbitMQ for inter-service communication
- **API Gateway**: Ocelot for request routing
- **Architecture Pattern**: Clean Architecture (Domain, Application, Infrastructure layers)

#### Frontend (React SPA)
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Library**: shadcn/ui components with Radix UI primitives
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **HTTP Client**: Axios with React Query for data fetching
- **Routing**: React Router DOM
- **Form Handling**: React Hook Form with Zod validation

## 📁 Project Structure

```
Hspital-Man/
├── services/                          # Backend microservices
│   ├── ApiGateway/                    # Ocelot API Gateway
│   ├── PatientService/                # Patient management service
│   │   └── src/
│   │       ├── PatientService.Api/           # REST API controllers
│   │       ├── PatientService.Application/   # Business logic & interfaces
│   │       ├── PatientService.Domain/        # Domain entities & events
│   │       └── PatientService.Infrastructure/ # Data access & external services
│   ├── AppointmentService/            # Appointment scheduling service
│   ├── MedicalRecordService/          # Medical records service
│   ├── InventoryService/              # Inventory management service
│   ├── BillingService/                # Billing and payments service
│   ├── AnalyticsService/              # Analytics and reporting service
│   └── docker-compose.yml             # Infrastructure services
├── src/                               # React frontend application
│   ├── components/                    # Reusable UI components
│   │   ├── ui/                       # shadcn/ui component library
│   │   ├── AppSidebar.tsx            # Main navigation sidebar
│   │   ├── Layout.tsx                # Application layout wrapper
│   │   └── StatCard.tsx              # Dashboard statistics card
│   ├── pages/                        # Application pages/routes
│   │   ├── Dashboard.tsx             # Main dashboard with analytics
│   │   ├── Patients.tsx              # Patient listing and search
│   │   ├── PatientRegistration.tsx   # New patient registration form
│   │   ├── PatientDetail.tsx         # Individual patient profile
│   │   ├── Appointments.tsx          # Appointment management
│   │   ├── MedicalRecords.tsx        # Medical records listing
│   │   ├── Inventory.tsx             # Inventory management
│   │   ├── Billing.tsx               # Billing and invoicing
│   │   └── Analytics.tsx             # Reports and analytics
│   ├── stores/                       # Zustand state management
│   ├── lib/                          # Utility functions and API client
│   └── schemas/                      # Zod validation schemas
└── public/                           # Static assets
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and npm/yarn
- **.NET 8.0 SDK**
- **Docker & Docker Compose** (for infrastructure)
- **PostgreSQL** (or use Docker)
- **RabbitMQ** (or use Docker)

### Quick Start with Docker

1. **Start Infrastructure Services**
   ```bash
   cd services
   docker-compose up -d
   ```
   This starts PostgreSQL and RabbitMQ containers.

2. **Start Backend Services**
   ```bash
   # Start each service in separate terminals
   cd services/ApiGateway && dotnet run
   cd services/PatientService/src/PatientService.Api && dotnet run
   cd services/AppointmentService/src/AppointmentService.Api && dotnet run
   cd services/MedicalRecordService/src/MedicalRecordService.Api && dotnet run
   cd services/InventoryService/src/InventoryService.Api && dotnet run
   cd services/BillingService/src/BillingService.Api && dotnet run
   cd services/AnalyticsService/src/AnalyticsService.Api && dotnet run
   ```

3. **Start Frontend Application**
   ```bash
   npm install
   npm run dev
   ```

4. **Access the Application**
   - Frontend: http://localhost:5173
   - API Gateway: http://localhost:5000
   - RabbitMQ Management: http://localhost:15672 (user/password)

### Manual Setup

#### Backend Services Setup

1. **Database Setup**
   ```bash
   # Create PostgreSQL database
   createdb hospital_db
   ```

2. **Configure Connection Strings**
   Update `appsettings.json` in each service:
   ```json
   {
     "ConnectionStrings": {
       "DefaultConnection": "Host=localhost;Database=hospital_db;Username=user;Password=password"
     }
   }
   ```

3. **Run Database Migrations**
   ```bash
   # For each service with migrations
   cd services/PatientService/src/PatientService.Api
   dotnet ef database update
   ```

4. **Start Services**
   Each service runs on a different port:
   - API Gateway: 5000
   - Patient Service: 5001
   - Appointment Service: 5002
   - Medical Record Service: 5003
   - Inventory Service: 5004
   - Billing Service: 5005
   - Analytics Service: 5006

#### Frontend Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Configuration**
   Create `.env.local`:
   ```env
   VITE_API_BASE_URL=http://localhost:5000
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

## 🔧 Development

### Backend Development

#### Adding New Services
1. Create service following Clean Architecture pattern
2. Add route configuration in API Gateway `ocelot.json`
3. Implement domain events for inter-service communication
4. Add database migrations if needed

#### Service Communication
- **Synchronous**: HTTP calls through API Gateway
- **Asynchronous**: RabbitMQ message broker for domain events
- **Event-Driven**: Services publish events when domain changes occur

### Frontend Development

#### Adding New Features
1. Create page components in `src/pages/`
2. Add routes in `App.tsx`
3. Create reusable components in `src/components/`
4. Implement state management with Zustand stores
5. Add API calls in `src/lib/api.ts`

#### UI Components
- Built with shadcn/ui for consistent design system
- Fully accessible components using Radix UI primitives
- Customizable with Tailwind CSS
- Form validation using React Hook Form + Zod

## 📊 Key Features

### Patient Management
- Complete patient registration with demographics
- Medical history and chronic conditions tracking
- Insurance information management
- Emergency contact details

### Appointment System
- Doctor-patient appointment scheduling
- Appointment status tracking
- Calendar integration
- Automated notifications

### Medical Records
- Electronic health records (EHR)
- Diagnosis and treatment documentation
- Medical notes and observations
- Visit history tracking

### Inventory Management
- Medical supplies tracking
- Equipment management
- Stock level monitoring
- Automated reorder alerts

### Billing & Finance
- Patient billing and invoicing
- Payment processing
- Insurance claim management
- Financial reporting

### Analytics & Reporting
- Patient demographics analytics
- Appointment statistics
- Revenue reporting
- Operational dashboards

## 🔒 Security Features

- **API Gateway**: Centralized authentication and authorization
- **Input Validation**: Comprehensive validation using Zod schemas
- **CORS Configuration**: Proper cross-origin resource sharing setup
- **Database Security**: Parameterized queries preventing SQL injection
- **Environment Variables**: Sensitive configuration externalized

## 🚀 Deployment

### Docker Deployment

1. **Build Services**
   ```bash
   # Build all services
   docker-compose -f docker-compose.prod.yml build
   ```

2. **Deploy Stack**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

### Cloud Deployment

- **Azure**: Deploy using Azure Container Instances or AKS
- **AWS**: Use ECS or EKS for container orchestration
- **Google Cloud**: Deploy on GKE or Cloud Run

## 🧪 Testing

### Backend Testing
```bash
# Run unit tests for all services
dotnet test

# Run tests for specific service
cd services/PatientService
dotnet test
```

### Frontend Testing
```bash
# Run frontend tests
npm test

# Run with coverage
npm run test:coverage
```

## 📈 Monitoring & Observability

- **Health Checks**: Built-in health endpoints for all services
- **Logging**: Structured logging with Serilog
- **Metrics**: Application performance monitoring
- **Distributed Tracing**: Request tracing across services

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow Clean Architecture principles for backend services
- Use TypeScript for type safety in frontend
- Write unit tests for business logic
- Follow conventional commit messages
- Ensure code passes linting and formatting checks

## 📝 API Documentation

Each service exposes Swagger/OpenAPI documentation:
- Patient Service: http://localhost:5001/swagger
- Appointment Service: http://localhost:5002/swagger
- Medical Record Service: http://localhost:5003/swagger
- Inventory Service: http://localhost:5004/swagger
- Billing Service: http://localhost:5005/swagger
- Analytics Service: http://localhost:5006/swagger

## 🔧 Configuration

### Environment Variables

#### Backend Services
```env
ConnectionStrings__DefaultConnection=Host=localhost;Database=hospital_db;Username=user;Password=password
RabbitMQ__ConnectionString=amqp://user:password@localhost:5672
CORS__AllowedOrigins=http://localhost:5173
```

#### Frontend
```env
VITE_API_BASE_URL=http://localhost:5000
VITE_APP_NAME=Hospital-Man
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the documentation in the `/docs` folder
- Review the API documentation via Swagger endpoints

---

*Hospital-Man - Modernizing healthcare management through technology*
