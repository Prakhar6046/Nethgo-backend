# GitHub Actions CI/CD Setup for NCC Backend

This guide will help you set up automated deployment to your AWS EC2 instance using GitHub Actions.

## Prerequisites

1. **AWS EC2 Instance** - Your server should be running Ubuntu with:
   - Node.js 18+ installed
   - PM2 installed globally (`npm install -g pm2`)
   - Nginx configured (as shown in your current setup)

2. **GitHub Repository** - Your code should be hosted on GitHub

## Setup Instructions

### 1. EC2 Server Preparation

First, ensure your EC2 server has the necessary tools:

```bash
# Connect to your EC2 instance
ssh -i your-key.pem ubuntu@your-ec2-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18 (if not already installed)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 globally
sudo npm install -g pm2

# Setup PM2 to start on boot
pm2 startup
# Follow the instructions shown after running the above command

# Create application directory (if it doesn't exist)
mkdir -p ~/NCC-Backend-
cd ~/NCC-Backend-

# Create logs directory
mkdir -p logs
```

### 2. GitHub Secrets Configuration

In your GitHub repository, go to **Settings** → **Secrets and variables** → **Actions** and add the following secrets:

#### Required Secrets:

1. **`EC2_HOST`**
   - Value: Your EC2 instance public IP or domain name
   - Example: `3.85.123.456` or `api.nethgo.com`

2. **`EC2_USERNAME`**
   - Value: `ubuntu` (default for Ubuntu EC2 instances)

3. **`EC2_SSH_KEY`**
   - Value: Your private SSH key content (the .pem file content)
   - **Important**: Copy the entire content including `-----BEGIN RSA PRIVATE KEY-----` and `-----END RSA PRIVATE KEY-----`

#### How to get your SSH key:

```bash
# On your local machine, display your private key
cat path/to/your-key.pem

# Copy the entire output and paste it as the EC2_SSH_KEY secret
```

### 3. Environment Variables (Optional)

If your application uses environment variables, create a `.env` file on your EC2 server:

```bash
# On your EC2 server
cd ~/NCC-Backend-
nano .env

# Add your environment variables
NODE_ENV=production
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
# Add other variables as needed
```

### 4. Initial Manual Deployment (First Time Only)

For the first deployment, you might want to do it manually to ensure everything works:

```bash
# On your EC2 server
cd ~/NCC-Backend-

# Clone your repository (if not done already)
git clone https://github.com/your-username/your-repo.git .

# Install dependencies
npm ci --only=production

# Build the application
npm run build

# Start with PM2
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save
```

### 5. Workflow Trigger

The GitHub Actions workflow will automatically trigger on:
- **Push to main branch** - Will run tests and deploy
- **Pull request to main** - Will run tests only

## Deployment Process

When you push to the main branch, the workflow will:

1. **Test Phase**:
   - Install dependencies
   - Build TypeScript
   - Run tests (if available)

2. **Deploy Phase** (only on main branch):
   - Build the application
   - Create deployment package
   - Copy files to EC2
   - Stop current application
   - Extract new files
   - Install production dependencies
   - Start application with PM2

## Manual Deployment Script

For manual deployments, you can use the included `deploy.sh` script:

```bash
# On your EC2 server
cd ~/NCC-Backend-
./deploy.sh
```

## Monitoring and Troubleshooting

### PM2 Commands

```bash
# View application status
pm2 status

# View logs
pm2 logs ncc-backend

# Restart application
pm2 restart ncc-backend

# Stop application
pm2 stop ncc-backend

# Monitor in real-time
pm2 monit
```

### Common Issues

1. **Permission Denied**: Ensure your SSH key has correct permissions (600)
2. **Port Already in Use**: Check if another process is using port 5000
3. **Build Failures**: Check the GitHub Actions logs for detailed error messages
4. **Connection Issues**: Verify your EC2 security group allows SSH (port 22) and HTTP/HTTPS traffic

### File Structure After Deployment

```
~/NCC-Backend-/
├── build/              # Compiled JavaScript files
├── logs/               # PM2 logs
├── node_modules/       # Production dependencies
├── ecosystem.config.js # PM2 configuration
├── package.json
├── package-lock.json
└── .env               # Environment variables (if used)
```

## Security Considerations

1. **SSH Key**: Never commit your private SSH key to the repository
2. **Environment Variables**: Use GitHub Secrets for sensitive data
3. **EC2 Security**: Ensure your security group only allows necessary ports
4. **Regular Updates**: Keep your EC2 instance and dependencies updated

## Nginx Configuration

Your current Nginx configuration should work with this setup. The application runs on port 5000 and Nginx proxies requests to it.

If you need to modify Nginx configuration:

```bash
# Edit Nginx configuration
sudo nano /etc/nginx/sites-enabled/default

# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

## Support

If you encounter issues:

1. Check GitHub Actions logs in your repository
2. Check PM2 logs: `pm2 logs ncc-backend`
3. Check Nginx logs: `sudo tail -f /var/log/nginx/error.log`
4. Verify EC2 connectivity and permissions

---

**Note**: Make sure to replace placeholder values (like `your-username`, `your-repo`, etc.) with your actual values before deployment.
