#!/bin/bash

# Watch Together Backend - Start Server Script

cd "$(dirname "$0")"

echo "🔧 Setting up backend server..."

# Source NVM if available
if [ -f ~/.nvm/nvm.sh ]; then
    source ~/.nvm/nvm.sh
    nvm use node 2>/dev/null || nvm use --lts 2>/dev/null
    echo "✅ NVM loaded"
fi

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install dependencies"
        exit 1
    fi
    echo "✅ Dependencies installed"
else
    echo "✅ Dependencies already installed"
fi

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file..."
    cat > .env << EOF
PORT=3003
FRONTEND_URL=http://localhost:3002
EOF
    echo "✅ Created .env file"
fi

# Start server
echo ""
echo "🚀 Starting backend server on port 3003..."
echo "📱 Frontend should connect to: http://localhost:3003"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

npm run dev
