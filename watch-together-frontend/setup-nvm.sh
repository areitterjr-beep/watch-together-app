#!/bin/bash

# Setup NVM and start the server

echo "🔧 Setting up Node.js environment..."

# Source NVM
if [ -f ~/.nvm/nvm.sh ]; then
    source ~/.nvm/nvm.sh
    echo "✅ NVM loaded"
else
    echo "❌ NVM not found at ~/.nvm/nvm.sh"
    echo "Please install NVM first: https://github.com/nvm-sh/nvm"
    exit 1
fi

# Use Node.js
nvm use node 2>/dev/null || nvm use --lts 2>/dev/null || nvm use default 2>/dev/null

# Check Node.js and npm
echo "Node.js version: $(node --version)"
echo "npm version: $(npm --version)"

# Navigate to project directory
cd "$(dirname "$0")"

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Clear cache
echo "🧹 Clearing Next.js cache..."
rm -rf .next

# Start server
echo "🚀 Starting development server..."
echo "📱 Server will be available at: http://localhost:3002"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

npm run dev
