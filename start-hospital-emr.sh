#!/bin/bash

# Quick Start Script for Hospital EMR System
set -e

echo "🏥 Starting Hospital EMR System..."
echo "=================================="

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

echo "✅ Docker is running"

# Navigate to Hospital EMR directory
cd /home/fuaxz/INSA/Hosphack/hospital-management-emr-master

echo "🔨 Building Hospital EMR Docker image..."
docker build -f Dockerfile.linux -t hospital-emr:latest .

echo "🗄️ Starting SQL Server database..."
docker run -d \
    --name hospital-emr-db \
    -e "ACCEPT_EULA=Y" \
    -e "SA_PASSWORD=HospitalEMR123!" \
    -e "MSSQL_PID=Express" \
    -p 1433:1433 \
    --network bridge \
    mcr.microsoft.com/mssql/server:2019-latest || echo "Database container already exists"

echo "⏳ Waiting for database to be ready..."
sleep 30

echo "🚀 Starting Hospital EMR application..."
docker run -d \
    --name hospital-emr-app \
    -p 5000:5000 \
    -e "ASPNETCORE_ENVIRONMENT=Production" \
    -e "ASPNETCORE_URLS=http://+:5000" \
    -e "ConnectionStrings__DefaultConnection=Server=host.docker.internal,1433;Database=DanpheEMR;User Id=sa;Password=HospitalEMR123!;TrustServerCertificate=true;" \
    --network bridge \
    hospital-emr:latest || echo "Application container already exists"

echo "⏳ Waiting for application to start..."
sleep 20

echo ""
echo "🎉 Hospital EMR System is starting!"
echo "=================================="
echo "🌐 Web Access: http://localhost:5000"
echo "📚 API Docs: http://localhost:5000/swagger"
echo "❤️ Health Check: http://localhost:5000/health"
echo "🗄️ Database: localhost:1433 (sa/HospitalEMR123!)"
echo ""
echo "📋 Default Login Credentials:"
echo "   Username: admin"
echo "   Password: pass123"
echo ""

# Test if the application is responding
echo "🔍 Testing application health..."
if curl -f http://localhost:5000/health > /dev/null 2>&1; then
    echo "✅ Application is healthy and responding!"
else
    echo "⚠️ Application might still be starting. Please wait a moment and try accessing http://localhost:5000"
fi

echo ""
echo "📊 Container Status:"
docker ps --filter "name=hospital-emr"

echo ""
echo "🛑 To stop the system, run:"
echo "   docker stop hospital-emr-app hospital-emr-db"
echo "   docker rm hospital-emr-app hospital-emr-db"