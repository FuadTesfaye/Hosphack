# Hosphack - Healthcare Management System Suite

A comprehensive healthcare management platform consisting of three integrated applications for complete hospital and telemedicine operations.

## 🏥 Project Overview

This repository contains three main healthcare applications:

1. **Hospital Management EMR** - Complete hospital management system
2. **Telemedicine App** - Virtual healthcare consultation platform  
3. **VideoSDK Web Telehealth** - Advanced video consultation system

---

## 📁 Project Structure

```
Hosphack/
├── hospital-management-emr-master/    # .NET Core EMR System
├── Telemedicine-App/                  # Node.js + Next.js Telemedicine Platform
├── VideoSDK-Web-Telehealth/          # Next.js + Zoom SDK Video Platform
└── README.md                          # This file
```

---

## 🚀 Quick Start Guide

### Prerequisites

- **For Hospital EMR**: .NET Core SDK, SQL Server, IIS (optional)
- **For Telemedicine App**: Node.js 16+, PostgreSQL
- **For VideoSDK Telehealth**: Node.js 18+, PostgreSQL, Zoom SDK Account

---

## 1️⃣ Hospital Management EMR

### Overview
Enterprise-grade hospital management system with 40+ modules covering all aspects of hospital operations.

### Technology Stack
- **Backend**: .NET Framework 4.6.1, C#
- **Frontend**: Angular, JavaScript
- **Database**: SQL Server
- **Architecture**: Multi-tier enterprise application

### Key Features
- Patient Registration & Management
- Appointment Scheduling
- Billing & Accounting
- Inventory Management
- Pharmacy Module
- Laboratory Management
- Nursing Module
- Medical Records
- Reporting & Dashboard

### Docker Setup (Recommended)

1. **Using Docker Compose**
   ```bash
   # Start Hospital EMR with database
   docker-compose up hospital-emr emr-db
   ```

2. **Access Application**
   - URL: `http://localhost:5000`
   - With Nginx: `http://emr.localhost`
   - Demo credentials: `admin` / `pass123`

### Manual Setup (Alternative)

#### Prerequisites
- Visual Studio 2019/2022
- .NET Framework 4.6.1 SDK
- SQL Server 2016+

#### Installation Steps

1. **Navigate to Project**
   ```bash
   cd hospital-management-emr-master
   ```

2. **Database Setup**
   ```sql
   -- Run SQL scripts in order:
   -- 1. Database/1. Admin-Db/1. DanpheAdmin_CompleteDB.sql
   -- 2. Database/2. EMR-Db/DanpheInternationalDB/[scripts]
   ```

3. **Build Solution**
   ```bash
   cd Code/Solutions
   dotnet restore DanpheEMR.sln
   dotnet build DanpheEMR.sln
   ```

4. **Configure Connection Strings**
   - Update `appsettings.json` in `Code/Websites/DanpheEMR/`
   - Set database connections for Admin and EMR databases

5. **Run Application**
   ```bash
   dotnet run --project Code/Websites/DanpheEMR/DanpheEMR.csproj
   ```

---

## 2️⃣ Telemedicine App

### Overview
Full-stack telemedicine platform with separate backend API and frontend application.

### Technology Stack
- **Backend**: Node.js, Express.js
- **Frontend**: Next.js, TypeScript, React
- **Database**: PostgreSQL
- **Video**: Agora SDK
- **Styling**: Tailwind CSS

### Project Structure
```
Telemedicine-App/
├── BE/                    # Backend API (Node.js/Express)
├── telemedapp/           # Frontend App (Next.js)
└── .env                  # Environment variables
```

### Setup Instructions

#### Backend Setup (BE/)

1. **Navigate to Backend**
   ```bash
   cd Telemedicine-App/BE
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   # Create .env file with:
   DATABASE_URL=postgresql://username:password@localhost:5432/telemedicine
   JWT_SECRET=your_jwt_secret
   SENDGRID_API_KEY=your_sendgrid_key
   TWILIO_ACCOUNT_SID=your_twilio_sid
   TWILIO_AUTH_TOKEN=your_twilio_token
   ```

4. **Database Setup**
   ```bash
   # Create PostgreSQL database
   createdb telemedicine
   # Run database migrations (if available)
   ```

5. **Start Backend Server**
   ```bash
   npm start          # Production
   npm run dev        # Development with auto-reload
   ```

#### Frontend Setup (telemedapp/)

1. **Navigate to Frontend**
   ```bash
   cd Telemedicine-App/telemedapp
   ```

2. **Install Dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Setup**
   ```bash
   # Create .env.local file with:
   NEXT_PUBLIC_API_URL=http://localhost:3001
   NEXT_PUBLIC_AGORA_APP_ID=your_agora_app_id
   ```

4. **Start Frontend Server**
   ```bash
   npm run dev        # Development server
   npm run build      # Production build
   npm start          # Production server
   ```

5. **Access Application**
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:3001`

### Docker Deployment

#### Backend Dockerfile
```dockerfile
# Telemedicine-App/BE/Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3001
CMD ["npm", "start"]
```

#### Frontend Dockerfile
```dockerfile
# Telemedicine-App/telemedapp/Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

#### Docker Compose
```yaml
# Telemedicine-App/docker-compose.yml
version: '3.8'
services:
  backend:
    build: ./BE
    ports:
      - "3001:3001"
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/telemedicine
    depends_on:
      - db
  
  frontend:
    build: ./telemedapp
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:3001
    depends_on:
      - backend
  
  db:
    image: postgres:14
    environment:
      - POSTGRES_DB=telemedicine
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

---

## 3️⃣ VideoSDK Web Telehealth

### Overview
Advanced telehealth platform built with Zoom Video SDK for high-quality video consultations.

### Technology Stack
- **Framework**: Next.js 14, TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Video**: Zoom Video SDK
- **API**: tRPC
- **Styling**: Tailwind CSS + shadcn/ui
- **File Storage**: AWS S3 compatible

### Setup Instructions

1. **Navigate to Project**
   ```bash
   cd VideoSDK-Web-Telehealth
   ```

2. **Install Dependencies**
   ```bash
   bun install
   # or
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   
   Configure the following variables:
   ```env
   # Database
   DATABASE_URL='postgresql://username:password@localhost:5432/telehealth'
   DATABASE_DIRECT_URL='postgresql://username:password@localhost:5432/telehealth'
   
   # NextAuth
   NEXTAUTH_SECRET="your-secret-key"
   NEXTAUTH_URL="http://localhost:3000"
   
   # Zoom SDK Credentials
   ZOOM_SDK_KEY="your-zoom-sdk-key"
   ZOOM_SDK_SECRET="your-zoom-sdk-secret"
   ZOOM_API_KEY="your-zoom-api-key"
   ZOOM_API_SECRET="your-zoom-api-secret"
   
   # GitHub OAuth (or other provider)
   GITHUB_CLIENT_ID="your-github-client-id"
   GITHUB_CLIENT_SECRET="your-github-client-secret"
   
   # S3 Storage
   S3_ENDPOINT="your-s3-endpoint"
   S3_BUCKET="your-bucket-name"
   S3_ACCESS_KEY_ID="your-access-key"
   S3_SECRET_ACCESS_KEY="your-secret-key"
   ```

4. **Database Setup**
   ```bash
   # Push database schema
   bunx prisma db push
   
   # Seed database with sample data
   bunx prisma db seed
   
   # Open Prisma Studio (optional)
   bunx prisma studio
   ```

5. **Start Development Server**
   ```bash
   bun dev
   # or
   npm run dev
   ```

6. **Access Application**
   - URL: `http://localhost:3000`

### Production Deployment

1. **Build Application**
   ```bash
   bun run build
   ```

2. **Start Production Server**
   ```bash
   bun start
   ```

### Docker Deployment
```dockerfile
# VideoSDK-Web-Telehealth/Dockerfile
FROM node:18-alpine
WORKDIR /app

# Install dependencies
COPY package*.json ./
COPY bun.lock ./
RUN npm install -g bun
RUN bun install

# Copy source code
COPY . .

# Generate Prisma client
RUN bunx prisma generate

# Build application
RUN bun run build

EXPOSE 3000
CMD ["bun", "start"]
```

---

## 🔧 Development Guidelines

### Code Standards
- Follow TypeScript/JavaScript ES6+ standards
- Use meaningful variable and function names
- Implement proper error handling
- Add comments for complex logic

### Database Management
- Use migrations for schema changes
- Implement proper indexing
- Regular backups for production
- Use connection pooling

### Security Best Practices
- Implement proper authentication
- Use HTTPS in production
- Sanitize user inputs
- Regular security audits
- Environment variable management

---

## 🚀 Deployment Options

### Cloud Deployment

#### AWS Deployment
```bash
# For Next.js apps
npm install -g @aws-amplify/cli
amplify init
amplify add hosting
amplify publish
```

#### Vercel Deployment (Next.js apps)
```bash
npm install -g vercel
vercel --prod
```

#### Docker Compose for Full Stack
```yaml
version: '3.8'
services:
  emr-db:
    image: mcr.microsoft.com/mssql/server:2019-latest
    environment:
      - ACCEPT_EULA=Y
      - SA_PASSWORD=YourPassword123
    
  telemedicine-db:
    image: postgres:14
    environment:
      - POSTGRES_DB=telemedicine
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    
  telehealth-db:
    image: postgres:14
    environment:
      - POSTGRES_DB=telehealth
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
```

---

## 📊 Monitoring & Analytics

### Health Checks
- Implement `/health` endpoints
- Monitor database connections
- Track API response times
- Set up alerting systems

### Logging
- Structured logging with timestamps
- Error tracking and reporting
- User activity monitoring
- Performance metrics

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

## 📝 License

This project is licensed under the MIT License - see individual project LICENSE files for details.

---

## 🆘 Support & Contact

- **Hospital EMR Support**: shiv_koirala@yahoo.com
- **Telemedicine App**: mahmoud2abdalfattah@gmail.com
- **VideoSDK Issues**: Check Zoom SDK documentation

---

## 🔗 Useful Links

- [Hospital EMR Demo](http://202.51.74.168:302) (admin/pass123)
- [Telemedicine Live Demo](https://telemedicine-mansy.vercel.app)
- [Zoom Video SDK Documentation](https://developers.zoom.us/docs/video-sdk/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)

---

## 📈 Roadmap

- [ ] Microservices architecture implementation
- [ ] Mobile app integration
- [ ] AI-powered diagnostics
- [ ] Blockchain for medical records
- [ ] IoT device integration
- [ ] Multi-language support
- [ ] Advanced analytics dashboard

---

*Last updated: $(date)*