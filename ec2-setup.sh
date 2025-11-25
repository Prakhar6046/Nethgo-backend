#!/bin/bash

# EC2 Setup Script for NCC Backend
# Run this script once on your EC2 server to set up the environment

set -e

echo "🚀 Setting up EC2 server for NCC Backend deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

# Check if running as ubuntu user
if [ "$USER" != "ubuntu" ]; then
    print_warning "This script should be run as the ubuntu user. Current user: $USER"
fi

print_header "1. Updating system packages..."
sudo apt update && sudo apt upgrade -y

print_header "2. Installing essential packages..."
sudo apt install -y curl wget git build-essential

print_header "3. Installing Node.js 18..."
# Check if Node.js is already installed
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    print_status "Node.js is already installed: $NODE_VERSION"
    
    # Check if it's version 18 or higher
    if [[ "$NODE_VERSION" < "v18" ]]; then
        print_warning "Node.js version is less than 18. Installing Node.js 18..."
        # Install Node.js 18
        curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
        sudo apt-get install -y nodejs
    fi
else
    print_status "Installing Node.js 18..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

# Verify installation
NODE_VERSION=$(node --version)
NPM_VERSION=$(npm --version)
print_status "Node.js installed: $NODE_VERSION"
print_status "npm installed: $NPM_VERSION"

print_header "4. Installing PM2 globally..."
if command -v pm2 &> /dev/null; then
    PM2_VERSION=$(pm2 --version)
    print_status "PM2 is already installed: $PM2_VERSION"
else
    sudo npm install -g pm2
    PM2_VERSION=$(pm2 --version)
    print_status "PM2 installed: $PM2_VERSION"
fi

print_header "5. Setting up PM2 to start on boot..."
pm2 startup | grep -E "sudo.*pm2.*startup" | bash || true

print_header "6. Creating application directory..."
mkdir -p ~/NCC-Backend-
cd ~/NCC-Backend-

# Create logs directory
mkdir -p logs

print_header "7. Setting up proper permissions..."
# Ensure the ubuntu user owns the application directory
sudo chown -R ubuntu:ubuntu ~/NCC-Backend-

print_header "8. Configuring Nginx (if needed)..."
# Check if nginx is installed and configured
if command -v nginx &> /dev/null; then
    print_status "Nginx is installed"
    
    # Test nginx configuration
    if sudo nginx -t &> /dev/null; then
        print_status "Nginx configuration is valid"
    else
        print_warning "Nginx configuration has issues. Please check manually."
    fi
else
    print_warning "Nginx is not installed. Install it if you need reverse proxy functionality."
fi

print_header "9. Setting up firewall (UFW)..."
if command -v ufw &> /dev/null; then
    # Allow SSH, HTTP, and HTTPS
    sudo ufw allow ssh
    sudo ufw allow 80/tcp
    sudo ufw allow 443/tcp
    
    # Optionally allow direct access to Node.js port (usually not needed with nginx)
    # sudo ufw allow 5000/tcp
    
    print_status "Firewall rules configured"
else
    print_warning "UFW firewall is not available"
fi

print_header "10. Creating environment file template..."
cat > .env.example << EOF
# Copy this file to .env and fill in your actual values

NODE_ENV=production
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/your_database
# or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database

# JWT
JWT_SECRET=your_super_secret_jwt_key_here

# Email configuration (if using nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Stripe (if using)
STRIPE_SECRET_KEY=sk_live_or_test_key_here

# Other environment variables
# Add any other environment variables your app needs
EOF

print_status "Environment file template created at .env.example"

print_header "11. Testing PM2..."
# Create a simple test app to verify PM2 works
cat > test-app.js << EOF
const http = require('http');
const server = http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('PM2 test successful!');
});
server.listen(3001, () => {
  console.log('Test server running on port 3001');
});
EOF

# Start test app with PM2
pm2 start test-app.js --name "test-app"
sleep 2

# Check if test app is running
if pm2 list | grep -q "test-app"; then
    print_status "PM2 test successful"
    pm2 delete test-app
    rm test-app.js
else
    print_error "PM2 test failed"
fi

print_header "Setup completed!"
echo ""
print_status "✅ Your EC2 server is now ready for NCC Backend deployment!"
echo ""
echo "Next steps:"
echo "1. Set up your GitHub secrets:"
echo "   - EC2_HOST: $(curl -s http://169.254.169.254/latest/meta-data/public-ipv4 2>/dev/null || echo 'your-ec2-ip')"
echo "   - EC2_USERNAME: ubuntu"
echo "   - EC2_SSH_KEY: (your private SSH key content)"
echo ""
echo "2. Create your .env file:"
echo "   cp .env.example .env"
echo "   nano .env  # Edit with your actual values"
echo ""
echo "3. Push your code to GitHub to trigger the deployment!"
echo ""
print_status "Installation summary:"
echo "  - Node.js: $(node --version)"
echo "  - npm: $(npm --version)"
echo "  - PM2: $(pm2 --version)"
echo "  - Application directory: ~/NCC-Backend-"
echo ""
print_status "PM2 management commands:"
echo "  - View status: pm2 status"
echo "  - View logs: pm2 logs ncc-backend"
echo "  - Restart app: pm2 restart ncc-backend"
echo "  - Stop app: pm2 stop ncc-backend"
