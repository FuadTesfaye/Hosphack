#!/bin/bash

# Hosphack Healthcare Platform Setup Script
# This script helps set up the entire healthcare platform

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    # Check for Docker
    if ! command_exists docker; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    # Check for Docker Compose
    if ! command_exists docker-compose && ! docker compose version >/dev/null 2>&1; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    
    # Check for Node.js
    if ! command_exists node; then
        print_warning "Node.js is not installed. Some manual setup steps may be required."
    fi
    
    # Check for .NET (for EMR)
    if ! command_exists dotnet; then
        print_warning ".NET SDK is not installed. Hospital EMR will need manual setup."
    fi
    
    print_success "Prerequisites check completed"
}

# Function to setup environment files
setup_environment() {
    print_status "Setting up environment files..."
    
    # Copy main environment file
    if [ ! -f .env ]; then
        cp .env.example .env
        print_success "Created main .env file from template"
        print_warning "Please edit .env file with your actual configuration values"
    else
        print_warning ".env file already exists, skipping..."
    fi
    
    # Setup Telemedicine App environment
    if [ ! -f Telemedicine-App/.env ]; then
        cat > Telemedicine-App/.env << EOF
DATABASE_URL=postgresql://telemedicine_user:telemedicine_pass@localhost:5432/telemedicine
JWT_SECRET=your_jwt_secret_here
SENDGRID_API_KEY=your_sendgrid_key
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
PORT=3001
EOF
        print_success "Created Telemedicine App .env file"
    fi
    
    # Setup Telemedicine Frontend environment
    if [ ! -f Telemedicine-App/telemedapp/.env.local ]; then
        cat > Telemedicine-App/telemedapp/.env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_AGORA_APP_ID=your_agora_app_id
EOF
        print_success "Created Telemedicine Frontend .env.local file"
    fi
    
    # Setup VideoSDK environment
    if [ ! -f VideoSDK-Web-Telehealth/.env ]; then
        cp VideoSDK-Web-Telehealth/.env.example VideoSDK-Web-Telehealth/.env
        print_success "Created VideoSDK .env file from template"
    fi
}

# Function to setup databases
setup_databases() {
    print_status "Setting up databases..."
    
    # Start database containers
    docker-compose up -d emr-db telemedicine-db telehealth-db
    
    # Wait for databases to be ready
    print_status "Waiting for databases to be ready..."
    sleep 30
    
    # Setup Telemedicine database (if migrations exist)
    if [ -d "Telemedicine-App/BE/migrations" ]; then
        print_status "Running Telemedicine database migrations..."
        cd Telemedicine-App/BE
        npm install
        npm run migrate || print_warning "Migration failed or not available"
        cd ../..
    fi
    
    # Setup VideoSDK database
    print_status "Setting up VideoSDK database..."
    cd VideoSDK-Web-Telehealth
    if command_exists bun; then
        bun install
        bunx prisma db push
        bunx prisma db seed
    elif command_exists npm; then
        npm install
        npx prisma db push
        npx prisma db seed
    fi
    cd ..
    
    print_success "Database setup completed"
}

# Function to build Docker images
build_images() {
    print_status "Building Docker images..."
    
    # Build all images
    docker-compose build
    
    print_success "Docker images built successfully"
}

# Function to start all services
start_services() {
    print_status "Starting all services..."
    
    # Start all services
    docker-compose up -d
    
    # Wait for services to be ready
    print_status "Waiting for services to start..."
    sleep 60
    
    print_success "All services started successfully"
}

# Function to show service status
show_status() {
    print_status "Service Status:"
    docker-compose ps
    
    echo ""
    print_status "Access URLs:"
    echo "🏥 Hospital EMR: http://localhost:5000"
    echo "📱 Telemedicine Frontend: http://localhost:3000"
    echo "🔌 Telemedicine API: http://localhost:3001"
    echo "📹 VideoSDK Telehealth: http://localhost:3002"
    echo "🗄️  Database Admin (optional): Install pgAdmin or similar"
    echo ""
    print_status "With Nginx (if configured):"
    echo "🏥 Hospital EMR: http://emr.localhost"
    echo "📱 Telemedicine: http://telemedicine.localhost"
    echo "🔌 API: http://api.telemedicine.localhost"
    echo "📹 VideoSDK: http://videosdk.localhost"
}

# Function to stop all services
stop_services() {
    print_status "Stopping all services..."
    docker-compose down
    print_success "All services stopped"
}

# Function to clean up everything
cleanup() {
    print_status "Cleaning up..."
    docker-compose down -v --remove-orphans
    docker system prune -f
    print_success "Cleanup completed"
}

# Function to show help
show_help() {
    echo "Hosphack Healthcare Platform Setup Script"
    echo ""
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  setup     - Full setup (check prerequisites, setup env, build, start)"
    echo "  env       - Setup environment files only"
    echo "  db        - Setup databases only"
    echo "  build     - Build Docker images only"
    echo "  start     - Start all services"
    echo "  stop      - Stop all services"
    echo "  status    - Show service status and URLs"
    echo "  cleanup   - Stop services and clean up volumes"
    echo "  help      - Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 setup     # Full setup"
    echo "  $0 start     # Start services"
    echo "  $0 status    # Check status"
}

# Main script logic
case "${1:-setup}" in
    "setup")
        print_status "Starting full Hosphack setup..."
        check_prerequisites
        setup_environment
        setup_databases
        build_images
        start_services
        show_status
        print_success "Hosphack setup completed!"
        print_warning "Don't forget to configure your .env files with actual values"
        ;;
    "env")
        setup_environment
        ;;
    "db")
        setup_databases
        ;;
    "build")
        build_images
        ;;
    "start")
        start_services
        show_status
        ;;
    "stop")
        stop_services
        ;;
    "status")
        show_status
        ;;
    "cleanup")
        cleanup
        ;;
    "help"|"-h"|"--help")
        show_help
        ;;
    *)
        print_error "Unknown command: $1"
        show_help
        exit 1
        ;;
esac