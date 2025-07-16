#!/bin/bash

echo "Building Excel Comparison Tool..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is not installed or not in PATH"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo "Node.js version: $(node --version)"

# Install dependencies
echo "Installing dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "Error: Failed to install dependencies"
    exit 1
fi

# Build the application
echo "Building application..."
npm run build
if [ $? -ne 0 ]; then
    echo "Error: Build failed"
    exit 1
fi

echo ""
echo "Build completed successfully!"
echo ""
echo "The application is ready for deployment."
echo "Files are located in the 'dist' folder."
echo ""
echo "Deployment options:"
echo "1. Static hosting: Upload contents of 'dist' folder to your web server"
echo "2. Docker: docker build -t excel-comparison-tool ."
echo "3. Local preview: npm run preview"
echo "" 