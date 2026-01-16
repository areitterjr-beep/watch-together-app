# How to Start the Server Manually

The server needs to be started in your terminal. Here's how:

## Quick Start

Open a terminal and run:

```bash
cd /Users/allenreitter/my-health-app/watch-together-frontend
npm run dev
```

## What Should Happen

You should see output like:
```
✓ Ready in X ms
✓ Ready on http://localhost:3002
```

Then open your browser and go to:
```
http://localhost:3002
```

## If You See Errors

1. **Make sure dependencies are installed**:
   ```bash
   npm install
   ```

2. **Clear cache and try again**:
   ```bash
   rm -rf .next
   npm run dev
   ```

3. **Check for port conflicts**:
   ```bash
   # Kill process on port 3002 if needed
   lsof -ti:3002 | xargs kill -9
   npm run dev
   ```

## Current Status

- ✅ Dependencies: INSTALLED (node_modules exists)
- ❌ Server: NOT RUNNING (needs to be started manually)
