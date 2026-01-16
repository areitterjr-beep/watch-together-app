# Install Dependencies - Manual Steps

Due to npm permission issues in the automated environment, please run these commands manually in your terminal.

## Quick Install (Recommended)

Run this script:

```bash
cd /Users/allenreitter/my-health-app/watch-together-frontend
./install-and-start.sh
```

## Manual Steps

If the script doesn't work, follow these steps:

### Step 1: Navigate to Frontend Directory

```bash
cd /Users/allenreitter/my-health-app/watch-together-frontend
```

### Step 2: Fix npm Cache Permissions (if needed)

If you see permission errors, run:

```bash
sudo chown -R $(whoami) ~/.npm
```

### Step 3: Install Dependencies

```bash
npm install
```

This will take 2-5 minutes. Wait for it to complete.

### Step 4: Clear Cache and Start Server

```bash
rm -rf .next
npm run dev
```

### Step 5: Open Browser

Go to: `http://localhost:3002`

## Troubleshooting

### "npm: command not found"

Make sure Node.js is installed and in your PATH:

```bash
# Check if Node.js is installed
node --version
npm --version

# If not found, install Node.js from https://nodejs.org/
```

### Permission Errors

```bash
# Fix npm cache permissions
sudo chown -R $(whoami) ~/.npm

# Or use a different cache location
npm install --cache .npm-cache
```

### Port Already in Use

If port 3002 is already in use:

```bash
# Find and kill the process
lsof -ti:3002 | xargs kill -9

# Or change the port in package.json
```

## After Installation

Once `npm install` completes successfully:

1. ✅ `node_modules` directory will exist
2. ✅ All packages will be installed
3. ✅ Next.js can compile the app
4. ✅ 500 errors should be resolved

## Verify Installation

Check if dependencies are installed:

```bash
ls node_modules | head -10
```

You should see directories like:
- `react`
- `next`
- `socket.io-client`
- `simple-peer`
- etc.

Once dependencies are installed, the app should work! 🎉
