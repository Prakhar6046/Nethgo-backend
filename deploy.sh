#!/bin/bash

# Deployment script for NCC Backend
# Usage: ./deploy.sh

set -e

echo "🚀 Starting deployment process..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Are you in the right directory?"
    exit 1
fi

# Install dependencies
print_status "Installing dependencies..."
npm ci

# Build TypeScript
print_status "Building TypeScript..."
npm run build

if [ ! -d "build" ]; then
    print_error "Build directory not found. Build failed!"
    exit 1
fi

# Create logs directory if it doesn't exist
if [ ! -d "logs" ]; then
    print_status "Creating logs directory..."
    mkdir -p logs
fi

# Stop existing PM2 process
print_status "Stopping existing PM2 process..."
pm2 stop ncc-backend 2>/dev/null || print_warning "No existing PM2 process found"

# Start the application with PM2
print_status "Starting application with PM2..."
pm2 start ecosystem.config.js

# Save PM2 configuration
print_status "Saving PM2 configuration..."
pm2 save

# Show status
print_status "Deployment completed! Current status:"
pm2 status

print_status "Application logs:"
echo "  - View logs: pm2 logs ncc-backend"
echo "  - View status: pm2 status"
echo "  - Restart app: pm2 restart ncc-backend"
echo "  - Stop app: pm2 stop ncc-backend"

print_status "✅ Deployment successful!"
