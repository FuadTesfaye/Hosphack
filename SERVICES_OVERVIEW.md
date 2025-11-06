# 🏥 Hosphack Healthcare Platform - Services Overview

## 🚀 Quick Start

```bash
# Start all services
./start-all.sh

# Or manually
docker-compose up --build -d
```

## 📊 Service Architecture

The platform consists of **4 main healthcare applications**, each with separate frontend and backend services:

### 🏥 Hospital EMR System
- **Frontend**: Port 5000 - Hospital management interface
- **Backend API**: Port 4000 - EMR data management API
- **Database**: SQL Server (Port 1433)
- **Technology**: Node.js + Express API, Static Frontend

### 💊 Telemedicine Platform  
- **Frontend**: Port 3000 - Patient/Doctor portal (Next.js)
- **Backend API**: Port 3001 - Consultation management API
- **Database**: PostgreSQL (Port 5436)
- **Technology**: Next.js Frontend, Node.js + Express API

### 📹 VideoSDK Telehealth
- **Frontend**: Port 3002 - Video consultation interface (Next.js + Zoom SDK)
- **Backend API**: Port 4002 - Video session management API
- **Database**: PostgreSQL (Port 5435)
- **Technology**: Next.js + Zoom SDK, Node.js API

### 💊 Pharmacy Management
- **Frontend**: Port 3003 - Pharmacy operations interface (Next.js + Prisma)
- **Backend API**: Port 4003 - Medicine & inventory management API
- **Database**: PostgreSQL (Port 5434)
- **Technology**: Next.js + Prisma, Node.js API

## 🌐 Access Points

| Service | Frontend | Backend API | API Documentation | Health Check |
|---------|----------|-------------|-------------------|--------------|
| **Dashboard** | http://localhost | - | - | - |
| **Hospital EMR** | http://localhost:5000 | http://localhost:4000 | http://localhost:4000/api-docs | http://localhost:4000/health |
| **Telemedicine** | http://localhost:3000 | http://localhost:3001 | http://localhost:3001/api-docs | http://localhost:3001/health |
| **VideoSDK** | http://localhost:3002 | http://localhost:4002 | http://localhost:4002/api-docs | http://localhost:4002/health |
| **Pharmacy** | http://localhost:3003 | http://localhost:4003 | http://localhost:4003/api-docs | http://localhost:4003/health |

## 📚 API Documentation Features

Each backend service includes comprehensive **Swagger/OpenAPI 3.0** documentation:

### Hospital EMR API (Port 4000)
- Patient management endpoints
- Appointment scheduling
- Medical records management
- Billing and accounting APIs

### Telemedicine API (Port 3001)
- Patient/Doctor registration
- Consultation booking
- Chat and messaging
- Medical document upload

### VideoSDK API (Port 4002)
- Video session management
- Zoom SDK token generation
- Consultation scheduling
- Recording management

### Pharmacy API (Port 4003)
- Medicine inventory management
- Prescription processing
- Pharmacy operations
- Stock management

## 🗄️ Database Configuration

| Database | Port | Type | Usage |
|----------|------|------|-------|
| **emr-db** | 1433 | SQL Server | Hospital EMR data |
| **telemedicine-db** | 5436 | PostgreSQL | Telemedicine platform data |
| **telehealth-db** | 5435 | PostgreSQL | VideoSDK consultation data |
| **pharmacy-db** | 5434 | PostgreSQL | Pharmacy management data |
| **redis** | 6379 | Redis | Caching layer |

## 🐳 Docker Services

### Frontend Services
- `hospital-emr-frontend` (Port 5000)
- `telemedicine-frontend` (Port 3000)
- `videosdk-telehealth` (Port 3002)
- `pharmacy-app` (Port 3003)

### Backend API Services
- `hospital-emr-backend` (Port 4000)
- `telemedicine-backend` (Port 3001)
- `videosdk-backend` (Port 4002)
- `pharmacy-backend` (Port 4003)

### Database Services
- `emr-db` (SQL Server)
- `telemedicine-db` (PostgreSQL)
- `telehealth-db` (PostgreSQL)
- `pharmacy-db` (PostgreSQL)
- `redis` (Redis Cache)

### Infrastructure Services
- `nginx` (Reverse Proxy & Dashboard)

## 🔧 Management Commands

```bash
# View all running services
docker-compose ps

# View logs for specific service
docker-compose logs -f hospital-emr-backend
docker-compose logs -f telemedicine-frontend

# Restart specific service
docker-compose restart pharmacy-backend

# Stop all services
docker-compose down

# Rebuild and restart specific service
docker-compose up --build -d hospital-emr-backend

# Remove all containers and volumes
docker-compose down -v
```

## 🔍 Health Monitoring

All backend services include health check endpoints:

```bash
# Check all backend services
curl http://localhost:4000/health  # Hospital EMR API
curl http://localhost:3001/health  # Telemedicine API
curl http://localhost:4002/health  # VideoSDK API
curl http://localhost:4003/health  # Pharmacy API
```

Health check response format:
```json
{
  "status": "ok",
  "message": "Service is healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "service": "service-name",
  "port": 4000
}
```

## 🚀 Development Workflow

### Adding New Features
1. Modify the appropriate backend API
2. Update Swagger documentation
3. Test API endpoints
4. Update frontend to consume new APIs
5. Rebuild containers: `docker-compose up --build -d [service-name]`

### Debugging Issues
1. Check service logs: `docker-compose logs -f [service-name]`
2. Verify health endpoints
3. Check database connections
4. Review API documentation

## 🔒 Security Features

- CORS enabled for cross-origin requests
- Helmet.js for security headers
- JWT authentication support
- Input validation and sanitization
- Health check endpoints for monitoring

## 📈 Scalability

Each service can be scaled independently:

```bash
# Scale specific services
docker-compose up --scale telemedicine-backend=3 -d
docker-compose up --scale pharmacy-app=2 -d
```

## 🌍 Production Deployment

For production deployment:

1. Configure environment-specific variables
2. Set up SSL/TLS certificates
3. Configure load balancing
4. Set up monitoring and logging
5. Configure database backups
6. Use Docker secrets for sensitive data

## 📞 Support

- **Service Dashboard**: http://localhost
- **Individual API Documentation**: Available at each service's `/api-docs` endpoint
- **Health Checks**: Available at each backend service's `/health` endpoint