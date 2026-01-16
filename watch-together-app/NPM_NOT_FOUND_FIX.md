# Fix: npm Command Not Found

## Problem

You're seeing `zsh: command not found: npm` because Node.js/npm is not in your PATH, but NVM is installed.

## Solution

You need to load NVM first, then npm will be available.

### Option 1: Use the Setup Script (Easiest)

Run this in your terminal:

```bash
cd /Users/allenreitter/my-health-app/watch-together-frontend
./setup-nvm.sh
```

This script will:
1. Load NVM
2. Set up Node.js
3. Install dependencies (if needed)
4. Start the server

### Option 2: Manual Setup

Run these commands one by one:

```bash
# 1. Load NVM
source ~/.nvm/nvm.sh

# 2. Use Node.js
nvm use node

# 3. Verify npm works
npm --version

# 4. Navigate to project
cd /Users/allenreitter/my-health-app/watch-together-frontend

# 5. Start server
npm run dev
```

### Option 3: Add NVM to Your Shell Profile (Permanent Fix)

To make npm available automatically, add this to your `~/.zshrc`:

```bash
# Add to ~/.zshrc
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
```

Then reload:
```bash
source ~/.zshrc
```

## Quick Test

After loading NVM, test if npm works:

```bash
source ~/.nvm/nvm.sh
nvm use node
npm --version
```

You should see a version number like `11.6.2` or similar.

## Then Start the Server

Once npm is working:

```bash
cd /Users/allenreitter/my-health-app/watch-together-frontend
npm run dev
```

## Summary

**The issue:** npm isn't in your PATH because NVM needs to be loaded first.

**The fix:** Run `source ~/.nvm/nvm.sh` before using npm, or use the `setup-nvm.sh` script I created.

Try the setup script first - it's the easiest! 🚀
