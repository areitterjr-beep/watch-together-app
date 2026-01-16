# Quick Start Guide

Get the Watch Together app running in 5 minutes!

## Step 1: Install Backend Dependencies

```bash
cd watch-together-backend
npm install
```

## Step 2: Start Backend Server

```bash
npm run dev
```

You should see:
```
✅ Connected to MongoDB (if configured)
🚀 Watch Together Server running on port 3003
```

## Step 3: Install Frontend Dependencies

Open a **new terminal** and run:

```bash
cd watch-together-frontend
npm install
```

## Step 4: Configure Frontend

Create `.env.local` file:

```bash
echo "NEXT_PUBLIC_SOCKET_URL=http://localhost:3003" > .env.local
```

## Step 5: Start Frontend

```bash
npm run dev
```

You should see:
```
✓ Ready on http://localhost:3002
```

## Step 6: Open in Browser

1. Go to `http://localhost:3002`
2. Enter your name
3. Click "Create Room"
4. Share the room ID with friends!

## Testing with Multiple Users

1. Open `http://localhost:3002` in multiple browser windows/tabs
2. Create a room in one window
3. Join the same room in other windows
4. Add a YouTube video URL
5. Watch together! 🎉

## Troubleshooting

**Backend won't start:**
- Make sure port 3003 is not in use
- Check that Node.js 18+ is installed

**Frontend won't connect:**
- Make sure backend is running
- Check `.env.local` has correct `NEXT_PUBLIC_SOCKET_URL`
- Check browser console for errors

**Video not playing:**
- Make sure it's a valid YouTube URL
- Check browser console for errors
- Try a different video

**WebRTC not working:**
- Grant camera/microphone permissions
- Check browser console
- Try a different browser
