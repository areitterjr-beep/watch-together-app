# Watch Together Backend

Backend server for the Watch Together streaming app with WebRTC signaling and real-time synchronization.

## Features

- ✅ **Socket.io Server**: Real-time WebRTC signaling
- ✅ **Room Management**: Create and manage watch rooms
- ✅ **Playback Synchronization**: Real-time playback control sync
- ✅ **WebRTC Signaling**: ICE candidates, offers, answers
- ✅ **Chat System**: Real-time chat messages
- ✅ **Video Control**: Change video URLs, control playback

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your configuration.

3. **Run server**
   ```bash
   npm run dev
   ```

## API

### WebSocket Events

#### Client → Server
- `join-room`: Join a watch room
- `webrtc-offer`: Send WebRTC offer
- `webrtc-answer`: Send WebRTC answer
- `webrtc-ice-candidate`: Send ICE candidate
- `playback-control`: Control playback (play/pause/seek)
- `change-video`: Change video URL
- `time-sync`: Sync playback time (from host)
- `chat-message`: Send chat message

#### Server → Client
- `room-state`: Current room state
- `user-joined`: User joined room
- `user-left`: User left room
- `participants-updated`: Updated participant list
- `webrtc-offer`: WebRTC offer received
- `webrtc-answer`: WebRTC answer received
- `webrtc-ice-candidate`: ICE candidate received
- `playback-control`: Playback control update
- `video-changed`: Video URL changed
- `time-sync`: Time sync update
- `chat-message`: Chat message received
- `host-changed`: Host changed

### REST API

- `GET /health`: Health check
- `GET /api/rooms/:roomId`: Get room info
