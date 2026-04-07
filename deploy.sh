#!/bin/bash

# ============================================
# EMPOWER App Deployment Script (Linux/Mac)
# ============================================

echo ""
echo "========================================"
echo "EMPOWER Financial Freedom Application"
echo "========================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed or not in PATH"
    echo "Please install Node.js from https://nodejs.org"
    exit 1
fi

echo "✓ Node.js detected:"
node --version

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "ERROR: npm is not installed or not in PATH"
    exit 1
fi

echo "✓ npm detected:"
npm --version
echo ""

# Install dependencies
echo "Installing dependencies..."
echo ""
npm install

if [ $? -ne 0 ]; then
    echo ""
    echo "ERROR: Failed to install dependencies"
    exit 1
fi

echo ""
echo "✓ Dependencies installed successfully"
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo "WARNING: .env file not found!"
    echo "Please create a .env file with your configuration:"
    echo ""
    echo "  ADMIN_EMAIL=your-email@gmail.com"
    echo "  EMAIL_SERVICE=gmail"
    echo "  EMAIL_USER=your-email@gmail.com"
    echo "  EMAIL_PASSWORD=your-app-password"
    echo "  SMTP_HOST=smtp.gmail.com"
    echo "  SMTP_PORT=587"
    echo ""
    echo "For now, starting server without email notifications..."
    echo ""
fi

# Start the server
echo ""
echo "========================================"
echo "Starting EMPOWER Backend Server"
echo "========================================"
echo ""
echo "Server will run on http://localhost:3000"
echo "Press Ctrl+C to stop the server"
echo ""

npm start
