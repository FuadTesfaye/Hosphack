#!/bin/bash

echo "🏥 Starting Hosphack Healthcare Platform - All Services"
echo "======================================================"

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Check if Docker Compose is available
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose not found. Please install Docker Compose."
    exit 1
fi

echo "🔧 Building and starting all services..."

# Stop any existing containers
echo "🛑 Stopping existing containers..."
docker-compose down

# Build and start all services
echo "🚀 Building and starting services..."
docker-compose up --build -d

# Wait for services to start
echo "⏳ Waiting for services to start..."
sleep 45

# Check service health
echo "🔍 Checking service health..."

services=(
    "http://localhost:4000/health:Hospital EMR API"
    "http://localhost:5000/health:Hospital EMR Frontend"
    "http://localhost:3001/health:Telemedicine API"
    "http://localhost:3000:Telemedicine Frontend"
    "http://localhost:4002/health:VideoSDK API"
    "http://localhost:3002:VideoSDK Frontend"
    "http://localhost:4003/health:Pharmacy API"
    "http://localhost:3003:Pharmacy Frontend"
)

for service in "${services[@]}"; do
    url=$(echo $service | cut -d: -f1-2)
    name=$(echo $service | cut -d: -f3)
    
    if curl -f -s "$url" > /dev/null 2>&1; then
        echo "✅ $name is healthy"
    else
        echo "⚠️  $name is not responding (may still be starting)"
    fi
done

echo ""
echo "🎉 Hosphack Healthcare Platform is running!"
echo "=========================================="
echo ""
echo "📊 Main Dashboard: http://localhost"
echo ""
echo "🏥 HOSPITAL EMR SYSTEM:"
echo "   • Frontend:     http://localhost:5001"
echo "   • Backend API:  http://localhost:4000"
echo "   • API Docs:     http://localhost:4000/api-docs"
echo "   • Health:       http://localhost:4000/health"
echo ""
echo "💊 TELEMEDICINE PLATFORM:"
echo "   • Frontend:     http://localhost:3100"
echo "   • Backend API:  http://localhost:3001"
echo "   • API Docs:     http://localhost:3001/api-docs"
echo "   • Health:       http://localhost:3001/health"
echo ""
echo "📹 VIDEOSDK TELEHEALTH:"
echo "   • Frontend:     http://localhost:3200"
echo "   • Backend API:  http://localhost:4002"
echo "   • API Docs:     http://localhost:4002/api-docs"
echo "   • Health:       http://localhost:4002/health"
echo ""
echo "💊 PHARMACY MANAGEMENT:"
echo "   • Frontend:     http://localhost:3300"
echo "   • Backend API:  http://localhost:4003"
echo "   • API Docs:     http://localhost:4003/api-docs"
echo "   • Health:       http://localhost:4003/health"
echo ""
echo "🗄️  DATABASES:"
echo "   • SQL Server:   localhost:1433 (Hospital EMR)"
echo "   • PostgreSQL:   localhost:5436 (Telemedicine)"
echo "   • PostgreSQL:   localhost:5435 (VideoSDK)"
echo "   • PostgreSQL:   localhost:5434 (Pharmacy)"
echo "   • Redis:        localhost:6379 (Cache)"
echo ""
echo "🔧 MANAGEMENT COMMANDS:"
echo "   • View logs:    docker-compose logs -f [service-name]"
echo "   • Stop all:     docker-compose down"
echo "   • Restart:      docker-compose restart [service-name]"
echo "   • Status:       docker-compose ps"
echo ""