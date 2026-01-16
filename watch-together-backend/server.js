require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3002',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

const PORT = process.env.PORT || 3003;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3002',
  credentials: true
}));
app.use(express.json());

// Database connection (optional - for room persistence)
if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));
}

// In-memory room storage (for simplicity, can use MongoDB for persistence)
const rooms = new Map(); // roomId -> room data
const userRooms = new Map(); // socketId -> roomId

// Room model structure
const createRoom = (roomId, hostId, hostName) => ({
  id: roomId,
  hostId,
  hostName,
  participants: new Map(), // socketId -> { id, name, streamId }
  videoUrl: null,
  videoType: null, // 'youtube' | 'custom'
  playbackState: {
    isPlaying: false,
    currentTime: 0,
    duration: 0
  },
  createdAt: Date.now()
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log(`✅ User connected: ${socket.id}`);

  // Join room
  socket.on('join-room', ({ roomId, userId, userName }) => {
    console.log(`User ${userName} (${socket.id}) joining room ${roomId}`);
    
    let room = rooms.get(roomId);
    if (!room) {
      // Create new room if it doesn't exist
      room = createRoom(roomId, socket.id, userName);
      rooms.set(roomId, room);
    }

    socket.join(roomId);
    userRooms.set(socket.id, roomId);

    // Add participant
    room.participants.set(socket.id, {
      id: userId || socket.id,
      name: userName || 'Anonymous',
      socketId: socket.id,
      isHost: socket.id === room.hostId
    });

    // Notify user about room state
    socket.emit('room-state', {
      roomId,
      hostId: room.hostId,
      participants: Array.from(room.participants.values()),
      videoUrl: room.videoUrl,
      videoType: room.videoType,
      playbackState: room.playbackState
    });

    // Notify others in room
    socket.to(roomId).emit('user-joined', {
      userId: socket.id,
      userName: userName || 'Anonymous'
    });

    // Notify room about updated participant list
    io.to(roomId).emit('participants-updated', {
      participants: Array.from(room.participants.values())
    });
  });

  // WebRTC signaling - Offer
  socket.on('webrtc-offer', ({ offer, targetSocketId }) => {
    socket.to(targetSocketId).emit('webrtc-offer', {
      offer,
      senderSocketId: socket.id
    });
  });

  // WebRTC signaling - Answer
  socket.on('webrtc-answer', ({ answer, targetSocketId }) => {
    socket.to(targetSocketId).emit('webrtc-answer', {
      answer,
      senderSocketId: socket.id
    });
  });

  // WebRTC signaling - ICE candidate
  socket.on('webrtc-ice-candidate', ({ candidate, targetSocketId }) => {
    socket.to(targetSocketId).emit('webrtc-ice-candidate', {
      candidate,
      senderSocketId: socket.id
    });
  });

  // Playback control - Play/Pause
  socket.on('playback-control', ({ action, currentTime }) => {
    const roomId = userRooms.get(socket.id);
    if (!roomId) return;

    const room = rooms.get(roomId);
    if (!room || room.hostId !== socket.id) return; // Only host can control

    room.playbackState.isPlaying = action === 'play';
    if (currentTime !== undefined) {
      room.playbackState.currentTime = currentTime;
    }

    // Broadcast to all participants
    socket.to(roomId).emit('playback-control', {
      action,
      currentTime: room.playbackState.currentTime,
      timestamp: Date.now()
    });
  });

  // Video URL change
  socket.on('change-video', ({ videoUrl, videoType }) => {
    const roomId = userRooms.get(socket.id);
    if (!roomId) return;

    const room = rooms.get(roomId);
    if (!room || room.hostId !== socket.id) return; // Only host can change video

    room.videoUrl = videoUrl;
    room.videoType = videoType;
    room.playbackState = {
      isPlaying: false,
      currentTime: 0,
      duration: 0
    };

    io.to(roomId).emit('video-changed', {
      videoUrl,
      videoType,
      playbackState: room.playbackState
    });
  });

  // Time sync (host sends current time periodically)
  socket.on('time-sync', ({ currentTime, duration }) => {
    const roomId = userRooms.get(socket.id);
    if (!roomId) return;

    const room = rooms.get(roomId);
    if (!room || room.hostId !== socket.id) return;

    room.playbackState.currentTime = currentTime;
    room.playbackState.duration = duration;

    socket.to(roomId).emit('time-sync', {
      currentTime,
      duration,
      timestamp: Date.now()
    });
  });

  // Chat message
  socket.on('chat-message', ({ message }) => {
    const roomId = userRooms.get(socket.id);
    if (!roomId) return;

    const room = rooms.get(roomId);
    if (!room) return;

    const participant = room.participants.get(socket.id);
    if (!participant) return;

    io.to(roomId).emit('chat-message', {
      userId: socket.id,
      userName: participant.name,
      message,
      timestamp: Date.now()
    });
  });

  // Disconnect
  socket.on('disconnect', () => {
    console.log(`❌ User disconnected: ${socket.id}`);
    
    const roomId = userRooms.get(socket.id);
    if (!roomId) return;

    const room = rooms.get(roomId);
    if (!room) return;

    room.participants.delete(socket.id);
    userRooms.delete(socket.id);

    // If host left, transfer host or delete room
    if (room.hostId === socket.id && room.participants.size > 0) {
      const newHost = room.participants.values().next().value;
      room.hostId = newHost.socketId;
      newHost.isHost = true;
      io.to(roomId).emit('host-changed', { newHostId: newHost.socketId });
    }

    // Notify others
    socket.to(roomId).emit('user-left', { userId: socket.id });
    io.to(roomId).emit('participants-updated', {
      participants: Array.from(room.participants.values())
    });

    // Clean up empty rooms
    if (room.participants.size === 0) {
      rooms.delete(roomId);
      console.log(`🗑️ Room ${roomId} deleted (empty)`);
    }
  });
});

// REST API routes
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Watch Together API is running' });
});

app.get('/api/rooms/:roomId', (req, res) => {
  const { roomId } = req.params;
  const room = rooms.get(roomId);
  
  if (!room) {
    return res.status(404).json({ message: 'Room not found' });
  }

  res.json({
    roomId: room.id,
    hostId: room.hostId,
    participants: Array.from(room.participants.values()),
    videoUrl: room.videoUrl,
    videoType: room.videoType,
    playbackState: room.playbackState
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Watch Together Server running on port ${PORT}`);
  console.log(`📱 Frontend: ${process.env.FRONTEND_URL || 'http://localhost:3002'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
});
