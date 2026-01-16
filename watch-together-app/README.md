# Watch Together App - Complete Setup Guide

A real-time streaming and video chat application that allows friends to watch TV shows, movies, and videos together while chatting.

## 🎯 Features

- 🎥 **Video Streaming**: Watch YouTube videos together with synchronized playback
- 💬 **Video/Audio Chat**: WebRTC-based peer-to-peer video and audio calls
- 🔊 **Audio Control**: Mute/unmute stream audio, talk over content
- ⏯️ **Synchronized Playback**: Real-time playback control synchronization
- 🎮 **Playback Controls**: Play, pause, seek together
- 👥 **Room Management**: Create/join watch rooms with friends
- 🎨 **Teams/Zoom-like UI**: Modern video conferencing interface

## 📋 Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Modern browser with WebRTC support (Chrome, Firefox, Safari, Edge)
- Microphone and camera (for video chat)

## 🚀 Quick Start

### 1. Backend Setup

```bash
cd watch-together-backend
npm install
```

Create a `.env` file:
```env
PORT=3003
FRONTEND_URL=http://localhost:3002
MONGODB_URI=mongodb://localhost:27017/watchtogether
```

Start the backend:
```bash
npm run dev
```

The backend will run on `http://localhost:3003`

### 2. Frontend Setup

```bash
cd watch-together-frontend
npm install
```

Create a `.env.local` file:
```env
NEXT_PUBLIC_SOCKET_URL=http://localhost:3003
```

Start the frontend:
```bash
npm run dev
```

The frontend will run on `http://localhost:3002`

### 3. Open the App

1. Open your browser and go to `http://localhost:3002`
2. Enter your name
3. Click "Create Room" to create a new room or "Join Room" to join an existing one
4. Share the room ID with friends to watch together!

## 📖 How to Use

### Creating a Room

1. Enter your name on the home page
2. Click "Create Room"
3. You'll be the host and can control playback
4. Share the room ID (in the URL) with friends

### Joining a Room

1. Enter your name on the home page
2. Enter the room ID shared by the host
3. Click "Join Room"

### In the Room

**As Host:**
- Click "Add Video" to add a YouTube URL
- Control playback (play/pause/seek)
- Your controls affect everyone in the room
- Mute/unmute your microphone or camera

**As Participant:**
- Watch the synchronized video
- Chat with others
- Use video/audio chat
- Playback is automatically synced with the host

### Controls

- **Microphone Button**: Mute/unmute your microphone
- **Video Button**: Turn video on/off
- **Chat Button**: Toggle chat panel
- **Add Video** (Host only): Add YouTube videos to watch

## 🎥 Supported Video Sources

### ✅ YouTube
- Full support with synchronized playback
- Supports `youtube.com` and `youtu.be` URLs
- Automatic video ID extraction
- Host controls, participants sync automatically

### ⚠️ Netflix
- **Not directly supported** (Netflix doesn't allow embedding)
- **Workarounds:**
  1. **Screen Sharing**: One person shares their screen
  2. **Browser Extension**: Use a Netflix party extension
  3. **Manual Sync**: Use countdown timers (not ideal)

### ✅ Custom Videos
- Supports direct video URLs (MP4, WebM, etc.)
- HTML5 video player
- Synchronized playback

## 🏗️ Architecture

### Backend (`watch-together-backend`)
- **Express.js**: REST API server
- **Socket.io**: WebSocket server for real-time communication
- **WebRTC Signaling**: Handles peer connection setup
- **Room Management**: In-memory room storage (can use MongoDB for persistence)

### Frontend (`watch-together-frontend`)
- **Next.js 14**: React framework with App Router
- **Socket.io Client**: Real-time communication
- **Simple-peer**: WebRTC wrapper for peer connections
- **YouTube IFrame API**: YouTube video playback
- **Tailwind CSS**: Styling

## 🔧 Configuration

### Backend Environment Variables

```env
PORT=3003                    # Backend server port
FRONTEND_URL=http://localhost:3002  # Frontend URL for CORS
MONGODB_URI=...             # Optional: MongoDB connection string
```

### Frontend Environment Variables

```env
NEXT_PUBLIC_SOCKET_URL=http://localhost:3003  # Backend Socket.io URL
```

## 🐛 Troubleshooting

### Can't connect to server
- Make sure the backend is running on port 3003
- Check that `NEXT_PUBLIC_SOCKET_URL` matches your backend URL
- Check browser console for errors

### Video not playing
- Make sure you're using a valid YouTube URL
- Check that the video is not private or restricted
- Try a different video URL

### WebRTC not working
- Make sure you've granted camera/microphone permissions
- Check browser console for WebRTC errors
- Try a different browser
- Some networks/firewalls block WebRTC

### Playback not syncing
- Make sure you're the host (only host controls playback)
- Check that Socket.io connection is active
- Refresh the page if sync is lost

## 📝 Development

### Backend Development
```bash
cd watch-together-backend
npm run dev  # Uses nodemon for auto-reload
```

### Frontend Development
```bash
cd watch-together-frontend
npm run dev  # Next.js dev server with hot reload
```

## 🚢 Deployment

### Backend Deployment
1. Set environment variables on your hosting platform
2. Make sure port 3003 is accessible
3. Update `FRONTEND_URL` to your frontend URL

### Frontend Deployment
1. Set `NEXT_PUBLIC_SOCKET_URL` to your backend URL
2. Build: `npm run build`
3. Deploy to Vercel, Netlify, or your preferred platform

## 📚 Project Structure

```
watch-together-app/
├── watch-together-backend/
│   ├── server.js           # Express + Socket.io server
│   ├── package.json
│   └── README.md
├── watch-together-frontend/
│   ├── app/                # Next.js app directory
│   ├── components/         # React components
│   ├── hooks/              # Custom React hooks
│   ├── package.json
│   └── README.md
└── README.md              # This file
```

## 🔐 Security Notes

- This is a development setup. For production:
  - Add authentication/authorization
  - Use HTTPS/WSS for WebRTC
  - Implement rate limiting
  - Add input validation
  - Use environment variables for secrets

## 📄 License

This project is for educational purposes.

## 🤝 Contributing

Feel free to submit issues and pull requests!
