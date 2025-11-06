# 🐳 Docker Setup Guide - Hosphack Healthcare Platform

## Quick Start

```bash
# Start all services
./start-all.sh

# Or manually with docker-compose
docker-compose up --build -d
```

## 🌐 Service Access Points

| Service | Port | URL | API Docs | Health Check |
|---------|------|-----|----------|--------------|
| **Service Dashboard** | 80 | http://localhost | - | - |
| **Hospital EMR** | 5000 | http://localhost:5000 | http://localhost:5000/api-docs | http://localhost:5000/health |
| **Telemedicine Frontend** | 3000 | http://localhost:3000 | - | - |
| **Telemedicine API** | 3001 | http://localhost:3001 | http://localhost:3001/api-docs | http://localhost:3001/health |
| **VideoSDK Telehealth** | 3002 | http://localhost:3002 | http://localhost:3002/api/docs | http://localhost:3002/api/health |
| **Pharmacy Management** | 3003 | http://localhost:3003 | http://localhost:3003/api/docs | http://localhost:3003/api/health |

## 🗄️ Database Ports

| Database | Port | Connection |
|----------|------|------------|
| **Hospital EMR DB** | 1433 | SQL Server |
| **Telemedicine DB** | 5436 | PostgreSQL |
| **VideoSDK DB** | 5435 | PostgreSQL |
| **Pharmacy DB** | 5434 | PostgreSQL |
| **Redis Cache** | 6379 | Redis |

## 📊 Swagger API Documentation

Each backend service includes comprehensive Swagger/OpenAPI documentation:

### Hospital EMR API
- **URL**: http://localhost:5000/api-docs
- **Format**: JSON OpenAPI 3.0 specification
- **Features**: Hospital management endpoints

### Telemedicine API  
- **URL**: http://localhost:3001/api-docs
- **Format**: Swagger UI interface
- **Features**: Patient/Doctor management, appointments, chat

### VideoSDK Telehealth API
- **URL**: http://localhost:3002/api/docs
- **Format**: JSON OpenAPI 3.0 specification  
- **Features**: Video consultation, tRPC procedures

### Pharmacy Management API
- **URL**: http://localhost:3003/api/docs
- **Format**: JSON OpenAPI 3.0 specification
- **Features**: Medicine management, pharmacy operations

## 🔧 Docker Commands

```bash
# Start all services
docker-compose up -d

# Build and start (rebuild images)
docker-compose up --build -d

# Stop all services
docker-compose down

# View logs for all services
docker-compose logs -f

# View logs for specific service
docker-compose logs -f telemedicine-backend

# Restart specific service
docker-compose restart telemedicine-backend

# Check service status
docker-compose ps

# Remove all containers and volumes
docker-compose down -v
```

## 🏥 Service Details

### Hospital EMR (Port 5000)
- **Technology**: Nginx serving static content
- **Database**: SQL Server (Port 1433)
- **Features**: Hospital management interface
- **Health Check**: GET /health

### Telemedicine Platform
- **Frontend** (Port 3000): Next.js application
- **Backend** (Port 3001): Node.js/Express API
- **Database**: PostgreSQL (Port 5436)
- **Features**: Patient/doctor portal, video consultations
- **Health Check**: GET /health (API only)

### VideoSDK Telehealth (Port 3002)
- **Technology**: Next.js with Zoom SDK
- **Database**: PostgreSQL (Port 5435)
- **Features**: Advanced video consultations, tRPC API
- **Health Check**: GET /api/health

### Pharmacy Management (Port 3003)
- **Technology**: Next.js with Prisma ORM
- **Database**: PostgreSQL (Port 5434)
- **Features**: Medicine management, pharmacy operations
- **Health Check**: GET /api/health

## 🔍 Troubleshooting

### Service Not Starting
```bash
# Check container logs
docker-compose logs [service-name]

# Check if ports are available
netstat -tulpn | grep :3001

# Restart specific service
docker-compose restart [service-name]
```

### Database Connection Issues
```bash
# Check database container status
docker-compose ps

# Connect to database directly
docker-compose exec telemedicine-db psql -U telemedicine_user -d telemedicine
```

### API Documentation Not Loading
```bash
# Verify service is running
curl http://localhost:3001/health

# Check if Swagger dependencies are installed
docker-compose exec telemedicine-backend npm list swagger-ui-express
```

## 🌐 Network Configuration

All services run on the `hosphack-network` Docker network, allowing internal communication between containers.

### Internal Service URLs
- `hospital-emr:80`
- `telemedicine-backend:3001`
- `telemedicine-frontend:3000`
- `videosdk-telehealth:3000`
- `pharmacy-app:3000`

## 📈 Monitoring

### Health Checks
All services include health check endpoints that return JSON status:

```json
{
  "status": "ok",
  "message": "Service is healthy",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Service Status Dashboard
Visit http://localhost for a comprehensive overview of all running services with direct links to applications and documentation.

## 🔒 Security Notes

- All services run in isolated Docker containers
- Database credentials are configured via environment variables
- No SSL/HTTPS configured (development setup)
- Default ports are exposed for development access

## 📝 Environment Variables

Key environment variables are configured in `docker-compose.yml`:

- Database connection strings
- JWT secrets for authentication
- Service-specific configuration
- Port mappings

## 🚀 Production Deployment

For production deployment:

1. Configure SSL certificates
2. Use environment-specific configuration files
3. Set up proper database backups
4. Configure monitoring and logging
5. Use Docker secrets for sensitive data
6. Set up load balancing if needed

## 📞 Support

If you encounter issues:

1. Check the service logs: `docker-compose logs -f [service]`
2. Verify all containers are running: `docker-compose ps`
3. Test individual service health endpoints
4. Restart problematic services: `docker-compose restart [service]`