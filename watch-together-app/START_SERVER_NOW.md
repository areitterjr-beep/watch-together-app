# Start the Server - Simple Instructions

I've created a simple script to start the server. Please run it in your terminal.

## Option 1: Use the Script (Easiest)

Open a terminal and run:

```bash
cd /Users/allenreitter/my-health-app/watch-together-frontend
./start-server.sh
```

## Option 2: Manual Command

Or run this directly:

```bash
cd /Users/allenreitter/my-health-app/watch-together-frontend
npm run dev
```

## What Will Happen

1. Server will start compiling (takes 15-30 seconds first time)
2. You'll see output like:
   ```
   ✓ Ready in X ms
   ✓ Ready on http://localhost:3002
   ```
3. **Keep the terminal open** - the server needs to stay running!
4. Open your browser to: `http://localhost:3002`

## Important Notes

- ✅ Dependencies are installed (ready to go!)
- ⚠️ **Keep the terminal open** - closing it stops the server
- ⏳ First start takes 15-30 seconds to compile
- 🔄 Wait for "Ready on http://localhost:3002" message

## If You See Errors

Check the terminal output - it will show any errors. Common issues:

1. **Port in use**: Kill the process: `lsof -ti:3002 | xargs kill -9`
2. **Dependencies missing**: Run `npm install` first
3. **Build errors**: Check the terminal for specific error messages

## Summary

**Run this in your terminal:**
```bash
cd /Users/allenreitter/my-health-app/watch-together-frontend
./start-server.sh
```

Then open `http://localhost:3002` in your browser!
