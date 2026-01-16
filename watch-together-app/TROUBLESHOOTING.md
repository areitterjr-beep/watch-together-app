# Troubleshooting Guide

## Blank Screen Issues

### 1. Check if Dependencies are Installed

Make sure you've installed all dependencies:

```bash
cd watch-together-frontend
npm install
```

If you see errors, try:
```bash
rm -rf node_modules package-lock.json
npm install
```

### 2. Check if the Dev Server is Running

The frontend server should be running. Check your terminal:

```bash
cd watch-together-frontend
npm run dev
```

You should see:
```
✓ Ready on http://localhost:3002
```

### 3. Check Browser Console

Open your browser's developer console (F12 or Cmd+Option+I on Mac) and check for errors:

- **Network errors**: Check if the server is running
- **JavaScript errors**: Check for import/module errors
- **CORS errors**: Make sure backend CORS is configured

### 4. Common Issues

#### Issue: "Module not found" errors

**Solution**: Make sure all dependencies are installed:
```bash
npm install
```

#### Issue: "Cannot connect to server"

**Solution**: 
1. Check if backend is running on port 3003
2. Check `.env.local` has correct `NEXT_PUBLIC_SOCKET_URL`
3. Check browser console for connection errors

#### Issue: Blank screen with no errors

**Possible causes**:
- React component error (check browser console)
- CSS not loading (check if Tailwind is configured)
- Missing environment variables

**Solution**:
1. Check browser console for errors
2. Check terminal for build errors
3. Try hard refresh (Cmd+Shift+R or Ctrl+Shift+R)
4. Clear browser cache

#### Issue: Import errors with `@/components` or `@/hooks`

**Solution**: Check `tsconfig.json` has:
```json
"paths": {
  "@/*": ["./*"]
}
```

#### Issue: Tailwind CSS not working

**Solution**: 
1. Make sure `tailwind.config.js` exists
2. Check `postcss.config.js` is configured
3. Make sure `app/globals.css` imports Tailwind directives

### 5. Check Terminal Output

Look for errors in your terminal when running `npm run dev`:

- **Build errors**: TypeScript/compilation errors
- **Port already in use**: Another process is using port 3002
- **Missing dependencies**: Install missing packages

### 6. Verify Installation

Run these commands to verify everything is set up:

```bash
# Check Node.js version (should be 18+)
node --version

# Check npm version
npm --version

# Check if dependencies are installed
cd watch-together-frontend
ls node_modules  # Should show many directories

# Try building
npm run build
```

### 7. Common Error Messages

#### "Port 3002 is already in use"

**Solution**: 
- Change port in `package.json`: `"dev": "next dev -p 3003"`
- Or kill the process using port 3002

#### "Cannot find module 'socket.io-client'"

**Solution**:
```bash
npm install socket.io-client
```

#### "Cannot find module 'simple-peer'"

**Solution**:
```bash
npm install simple-peer
npm install --save-dev @types/simple-peer
```

#### "NEXT_PUBLIC_SOCKET_URL is not defined"

**Solution**: Create `.env.local` file:
```env
NEXT_PUBLIC_SOCKET_URL=http://localhost:3003
```

### 8. Reset Everything

If nothing works, try a clean reset:

```bash
cd watch-together-frontend

# Remove all generated files
rm -rf .next node_modules package-lock.json

# Reinstall
npm install

# Start dev server
npm run dev
```

### 9. Check Browser Compatibility

Make sure you're using a modern browser:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### 10. Still Having Issues?

Check:
1. **Browser console** for JavaScript errors
2. **Network tab** for failed requests
3. **Terminal** for server errors
4. **Node.js version** (should be 18+)

Common fixes:
- Clear browser cache
- Try incognito/private mode
- Try a different browser
- Restart the dev server
- Check firewall/antivirus isn't blocking
