#!/bin/bash

# Watch Together Frontend - Install and Start Script

echo "🔧 Installing dependencies..."

# Source NVM if available
if [ -f ~/.nvm/nvm.sh ]; then
    source ~/.nvm/nvm.sh
    nvm use node 2>/dev/null || nvm use --lts 2>/dev/null || nvm use default 2>/dev/null
fi

# Fix npm cache permissions if needed
if [ -d ~/.npm ] && [ ! -w ~/.npm ]; then
    echo "⚠️  Fixing npm cache permissions..."
    sudo chown -R $(whoami) ~/.npm 2>/dev/null || echo "Could not fix permissions. You may need to run: sudo chown -R $(whoami) ~/.npm"
fi

# Install dependencies
echo "📦 Running npm install (this may take a few minutes)..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully!"
    
    # Clear Next.js cache
    echo "🧹 Clearing Next.js cache..."
    rm -rf .next
    
    # Start dev server
    echo "🚀 Starting development server..."
    npm run dev
else
    echo "❌ Failed to install dependencies"
    echo ""
    echo "If you see permission errors, try:"
    echo "  sudo chown -R $(whoami) ~/.npm"
    echo ""
    echo "Then run this script again."
    exit 1
fi
