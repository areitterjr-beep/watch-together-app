# Backend Server Required!

## The Problem

You're seeing "Connecting to server..." because the **backend server is not running**.

The frontend (port 3002) is trying to connect to the backend (port 3003), but the backend server isn't started.

## Solution: Start the Backend Server

You need **TWO terminals** running:

### Terminal 1: Frontend (Already Running)
```bash
# This should already be running
cd /Users/allenreitter/my-health-app/watch-together-frontend
npm run dev
```

### Terminal 2: Backend (You Need to Start This)

**Open a NEW terminal window** and run:

```bash
cd /Users/allenreitter/my-health-app/watch-together-backend
./start-backend.sh
```

Or manually:

```bash
# 1. Load NVM
source ~/.nvm/nvm.sh
nvm use node

# 2. Navigate to backend
cd /Users/allenreitter/my-health-app/watch-together-backend

# 3. Install dependencies (first time only)
npm install

# 4. Start server
npm run dev
```

## What You Should See

### Backend Terminal:
```
✅ Connected to MongoDB (if configured)
🚀 Watch Together Server running on port 3003
📱 Frontend: http://localhost:3002
```

### Frontend Terminal:
```
✓ Ready on http://localhost:3002
```

## After Starting Backend

1. Go back to your browser
2. Refresh the page (or go back to home and create a room again)
3. The "Connecting to server..." should change to show the room interface

## Quick Start (Both Servers)

If you want to start both at once, open **two terminal windows**:

**Terminal 1 (Frontend):**
```bash
source ~/.nvm/nvm.sh && nvm use node
cd /Users/allenreitter/my-health-app/watch-together-frontend
npm run dev
```

**Terminal 2 (Backend):**
```bash
source ~/.nvm/nvm.sh && nvm use node
cd /Users/allenreitter/my-health-app/watch-together-backend
./start-backend.sh
```

## Summary

- ✅ Frontend: Running on port 3002
- ❌ Backend: **NOT running** - needs to be started
- 🔧 Fix: Start backend server in a new terminal

Once both servers are running, the app will work! 🎉
