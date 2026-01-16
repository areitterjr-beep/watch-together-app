# Fixing Blank Screen Issue

## Quick Diagnosis Steps

### Step 1: Check if Dependencies are Installed

Go to the frontend directory and check if `node_modules` exists:

```bash
cd watch-together-frontend
ls node_modules
```

If `node_modules` doesn't exist or is empty, install dependencies:

```bash
npm install
```

Wait for installation to complete (this may take a few minutes).

### Step 2: Check if Dev Server is Running

Make sure the development server is running:

```bash
cd watch-together-frontend
npm run dev
```

You should see output like:
```
✓ Ready in X ms
✓ Ready on http://localhost:3002
```

If you see errors, note them down.

### Step 3: Check Browser Console

1. Open your browser
2. Go to `http://localhost:3002`
3. Open Developer Tools (F12 or Cmd+Option+I on Mac)
4. Check the **Console** tab for errors
5. Check the **Network** tab for failed requests

Common errors you might see:
- `Module not found` - Dependencies not installed
- `Failed to fetch` - Backend not running
- `Cannot read property` - Component error

### Step 4: Check Environment Variables

Create a `.env.local` file in the `watch-together-frontend` directory:

```bash
cd watch-together-frontend
echo "NEXT_PUBLIC_SOCKET_URL=http://localhost:3003" > .env.local
```

### Step 5: Check Terminal Output

Look at the terminal where you ran `npm run dev`. Check for:
- Build errors
- Compilation errors
- TypeScript errors
- Missing module errors

## Most Common Fixes

### Fix 1: Install Dependencies

```bash
cd watch-together-frontend
rm -rf node_modules package-lock.json
npm install
```

### Fix 2: Create Environment File

```bash
cd watch-together-frontend
cat > .env.local << EOF
NEXT_PUBLIC_SOCKET_URL=http://localhost:3003
EOF
```

### Fix 3: Clear Next.js Cache

```bash
cd watch-together-frontend
rm -rf .next
npm run dev
```

### Fix 4: Check Port Availability

If port 3002 is in use, you'll see an error. You can change the port:

Edit `package.json`:
```json
"dev": "next dev -p 3003"
```

Or kill the process using port 3002:
```bash
# Find the process
lsof -ti:3002
# Kill it
kill -9 $(lsof -ti:3002)
```

### Fix 5: Full Reset

If nothing works, try a complete reset:

```bash
cd watch-together-frontend

# Remove everything
rm -rf node_modules .next package-lock.json

# Reinstall
npm install

# Start fresh
npm run dev
```

## Still Seeing Blank Screen?

1. **Check the browser URL**: Make sure you're going to `http://localhost:3002` (not 3000 or 3001)

2. **Try a different browser**: Sometimes browser cache causes issues. Try:
   - Chrome in incognito mode
   - Firefox
   - Safari

3. **Check browser console**: The console will show JavaScript errors that explain why the page is blank

4. **Check Network tab**: Make sure requests to `localhost:3002` are successful (status 200)

5. **Verify the page loads**: Even if blank, check if you see HTML in the page source (Right-click → View Page Source)

## Getting Help

If you're still stuck, provide:
1. Output from `npm run dev` terminal
2. Browser console errors (screenshot or copy text)
3. Browser Network tab errors
4. Your Node.js version: `node --version`
5. Your npm version: `npm --version`
