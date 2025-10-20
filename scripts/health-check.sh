#!/bin/bash

# Health Check Script for Hosphack Healthcare Platform
# This script checks the health of all services

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[✓]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[⚠]${NC} $1"
}

print_error() {
    echo -e "${RED}[✗]${NC} $1"
}

# Function to check HTTP endpoint
check_endpoint() {
    local url=$1
    local service_name=$2
    local timeout=${3:-10}
    
    if curl -f -s --max-time $timeout "$url" > /dev/null 2>&1; then
        print_success "$service_name is healthy ($url)"
        return 0
    else
        print_error "$service_name is not responding ($url)"
        return 1
    fi
}

# Function to check database connection
check_database() {
    local container_name=$1
    local service_name=$2
    
    if docker exec "$container_name" pg_isready > /dev/null 2>&1; then
        print_success "$service_name database is healthy"
        return 0
    elif docker exec "$container_name" /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "$SA_PASSWORD" -Q "SELECT 1" > /dev/null 2>&1; then
        print_success "$service_name database is healthy"
        return 0
    else
        print_error "$service_name database is not responding"
        return 1
    fi
}

# Function to check Docker container status
check_container() {
    local container_name=$1
    local service_name=$2
    
    if docker ps --filter "name=$container_name" --filter "status=running" | grep -q "$container_name"; then
        print_success "$service_name container is running"
        return 0
    else
        print_error "$service_name container is not running"
        return 1
    fi
}

# Main health check function
main_health_check() {
    print_status "Starting Hosphack Healthcare Platform Health Check..."
    echo ""
    
    local overall_status=0
    
    # Check Docker containers
    print_status "Checking Docker containers..."
    check_container "hosphack-telemedicine-db" "Telemedicine Database" || overall_status=1
    check_container "hosphack-telehealth-db" "Telehealth Database" || overall_status=1
    check_container "hosphack-telemedicine-api" "Telemedicine API" || overall_status=1
    check_container "hosphack-telemedicine-web" "Telemedicine Frontend" || overall_status=1
    check_container "hosphack-videosdk-telehealth" "VideoSDK Telehealth" || overall_status=1
    echo ""
    
    # Check databases
    print_status "Checking database connections..."
    check_database "hosphack-telemedicine-db" "Telemedicine" || overall_status=1
    check_database "hosphack-telehealth-db" "Telehealth" || overall_status=1
    echo ""
    
    # Check HTTP endpoints
    print_status "Checking HTTP endpoints..."
    check_endpoint "http://localhost:5000" "Hospital EMR" || overall_status=1
    check_endpoint "http://localhost:3001/health" "Telemedicine API" || overall_status=1
    check_endpoint "http://localhost:3000" "Telemedicine Frontend" || overall_status=1
    check_endpoint "http://localhost:3002" "VideoSDK Telehealth" || overall_status=1
    echo ""
    
    # Check with Nginx (if running)
    if docker ps --filter "name=hosphack-nginx" --filter "status=running" | grep -q "hosphack-nginx"; then
        print_status "Checking Nginx endpoints..."
        check_endpoint "http://emr.localhost" "Hospital EMR (via Nginx)" || overall_status=1
        check_endpoint "http://telemedicine.localhost" "Telemedicine (via Nginx)" || overall_status=1
        check_endpoint "http://api.telemedicine.localhost" "Telemedicine API (via Nginx)" || overall_status=1
        check_endpoint "http://videosdk.localhost" "VideoSDK (via Nginx)" || overall_status=1
        echo ""
    fi
    
    # Overall status
    if [ $overall_status -eq 0 ]; then
        print_success "All services are healthy!"
    else
        print_error "Some services are not healthy. Check the logs for more details."
        echo ""
        print_status "To check logs, run:"
        echo "  docker-compose logs [service-name]"
        echo ""
        print_status "To restart services, run:"
        echo "  docker-compose restart [service-name]"
    fi
    
    return $overall_status
}

# Function to show detailed status
detailed_status() {
    print_status "Detailed Service Status:"
    echo ""
    
    # Docker containers status
    docker-compose ps
    echo ""
    
    # Resource usage
    print_status "Resource Usage:"
    docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}"
    echo ""
    
    # Disk usage
    print_status "Docker Disk Usage:"
    docker system df
}

# Function to run continuous monitoring
monitor() {
    local interval=${1:-30}
    print_status "Starting continuous monitoring (checking every ${interval}s)..."
    print_status "Press Ctrl+C to stop"
    
    while true; do
        clear
        echo "$(date): Hosphack Health Check"
        echo "================================"
        main_health_check
        sleep $interval
    done
}

# Function to show help
show_help() {
    echo "Hosphack Healthcare Platform Health Check Script"
    echo ""
    echo "Usage: $0 [COMMAND] [OPTIONS]"
    echo ""
    echo "Commands:"
    echo "  check     - Run health check once (default)"
    echo "  status    - Show detailed service status"
    echo "  monitor   - Continuous monitoring (default: 30s interval)"
    echo "  help      - Show this help message"
    echo ""
    echo "Options:"
    echo "  -i, --interval SECONDS    Set monitoring interval (default: 30)"
    echo ""
    echo "Examples:"
    echo "  $0                    # Run health check"
    echo "  $0 status            # Show detailed status"
    echo "  $0 monitor           # Start monitoring"
    echo "  $0 monitor -i 60     # Monitor every 60 seconds"
}

# Parse command line arguments
COMMAND="check"
INTERVAL=30

while [[ $# -gt 0 ]]; do
    case $1 in
        check|status|monitor|help)
            COMMAND=$1
            shift
            ;;
        -i|--interval)
            INTERVAL=$2
            shift 2
            ;;
        -h|--help)
            COMMAND="help"
            shift
            ;;
        *)
            print_error "Unknown option: $1"
            show_help
            exit 1
            ;;
    esac
done

# Execute command
case $COMMAND in
    "check")
        main_health_check
        ;;
    "status")
        detailed_status
        ;;
    "monitor")
        monitor $INTERVAL
        ;;
    "help")
        show_help
        ;;
    *)
        print_error "Unknown command: $COMMAND"
        show_help
        exit 1
        ;;
esac