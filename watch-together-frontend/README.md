# Watch Together Frontend

Frontend application for the Watch Together streaming app built with Next.js, React, and TypeScript.

## Features

- 🎥 **Video Streaming**: YouTube integration with synchronized playback
- 💬 **Video/Audio Chat**: WebRTC-based peer-to-peer video and audio calls
- 🔊 **Audio Control**: Mute/unmute stream audio, talk over content
- ⏯️ **Synchronized Playback**: Real-time playback control synchronization
- 🎮 **Playback Controls**: Play, pause, seek together
- 👥 **Room Management**: Create/join watch rooms with friends
- 🎨 **Teams/Zoom-like UI**: Modern video conferencing interface

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment**
   Create a `.env.local` file:
   ```env
   NEXT_PUBLIC_SOCKET_URL=http://localhost:3003
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:3002`

## Usage

1. **Start the backend server** (from `watch-together-backend` directory)
   ```bash
   npm run dev
   ```

2. **Open the frontend** in your browser
   - Go to `http://localhost:3002`
   - Enter your name
   - Click "Create Room" or "Join Room"

3. **In the room:**
   - **Host**: Can add YouTube videos, control playback
   - **Participants**: Can watch synchronized video, chat, and use video/audio
   - **Controls**: Mute/unmute audio/video, toggle chat

## YouTube Integration

- Supports YouTube URLs (youtube.com and youtu.be)
- Automatic video ID extraction
- Synchronized playback for all participants
- Host controls playback, others sync automatically

## WebRTC Features

- Peer-to-peer video and audio calls
- Automatic peer connection management
- Mute/unmute controls
- Video on/off toggle
- Participant video grid

## Project Structure

```
watch-together-frontend/
├── app/
│   ├── page.tsx              # Home page (create/join room)
│   ├── room/[id]/page.tsx   # Watch room page
│   └── layout.tsx           # Root layout
├── components/
│   ├── VideoPlayer.tsx      # Video player component
│   ├── VideoGrid.tsx        # Participants video grid
│   ├── Controls.tsx         # Playback and media controls
│   └── Chat.tsx             # Chat component
├── hooks/
│   ├── useSocket.ts         # Socket.io hook
│   └── useWebRTC.ts         # WebRTC hook
└── README.md
```

## Technologies

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type safety
- **Socket.io Client**: Real-time communication
- **Simple-peer**: WebRTC wrapper
- **Tailwind CSS**: Styling
- **YouTube IFrame API**: YouTube video playback

## Browser Requirements

- Modern browser with WebRTC support
- Microphone and camera permissions
- JavaScript enabled

## Notes

- **Netflix**: Not directly supported (requires browser extension or screen sharing)
- **YouTube**: Full support with synchronized playback
- **Custom Videos**: Supports direct video URLs (MP4, WebM, etc.)
