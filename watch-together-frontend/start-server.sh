#!/bin/bash

# Watch Together - Start Server Script

cd "$(dirname "$0")"

echo "🚀 Starting Watch Together server..."
echo ""

# Source NVM if available
if [ -f ~/.nvm/nvm.sh ]; then
    source ~/.nvm/nvm.sh
    nvm use node 2>/dev/null || nvm use --lts 2>/dev/null
fi

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "❌ Dependencies not installed!"
    echo "Running npm install..."
    npm install
fi

# Clear cache
echo "🧹 Clearing cache..."
rm -rf .next

# Start server
echo "✅ Starting development server..."
echo "📱 Server will be available at: http://localhost:3002"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

npm run dev
