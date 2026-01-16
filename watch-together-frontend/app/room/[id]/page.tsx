'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { X } from 'lucide-react';
import VideoGrid from '@/components/VideoGrid';
import VideoPlayer from '@/components/VideoPlayer';
import Controls from '@/components/Controls';
import Chat from '@/components/Chat';
import ShareInvite from '@/components/ShareInvite';
import { useSocket } from '@/hooks/useSocket';
import { useWebRTC } from '@/hooks/useWebRTC';
import { useBackgroundEffects } from '@/hooks/useBackgroundEffects';

// Debug: Log immediately when module loads
console.log('📦 Room page module loaded');

export default function RoomPage() {
  // Debug: Log immediately when component function is called
  console.log('🏠 RoomPage component function called');
  
  const params = useParams();
  const searchParams = useSearchParams();
  const roomId = params.id as string;
  const userNameFromUrl = searchParams.get('name');
  const userName = userNameFromUrl?.trim() || '';

  // Redirect if no name provided
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    if (!userName || !userName.trim()) {
      console.warn('⚠️ No name provided in URL, redirecting to home');
      alert('Please enter your name before joining a room. Redirecting to home page...');
      window.location.href = '/';
      return;
    }
    
    console.log('🏠 Room page component loaded (useEffect)');
    console.log('🏠 Room ID:', roomId);
    console.log('👤 User name:', userName);
    console.log('🌐 Current URL:', window.location.href);
  }, [roomId, userName]);
  
  // Show loading state while redirecting
  if (!userName || !userName.trim()) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-center">
          <h2 className="text-xl mb-2">Redirecting...</h2>
          <p className="text-gray-400">Please enter your name to join a room.</p>
        </div>
      </div>
    );
  }
  
  const [showChat, setShowChat] = useState(false);
  const [isHost, setIsHost] = useState(false);
  const [participants, setParticipants] = useState<any[]>([]);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoType, setVideoType] = useState<'youtube' | 'custom' | null>(null);
  const [playbackState, setPlaybackState] = useState({
    isPlaying: false,
    currentTime: 0,
    duration: 0
  });

  const { socket, connected, connectionError } = useSocket();
  // Only initialize WebRTC in browser (not during SSR)
  const webRTCEnabled = typeof window !== 'undefined';
  const { localStream, remoteStreams, peers, toggleMute, toggleVideo, isMuted, isVideoOff } = useWebRTC(
    webRTCEnabled ? socket : null, 
    roomId
  );

  // Background effects
  const {
    effect: backgroundEffect,
    blurIntensity,
    backgroundColor,
    customBackgroundImage,
    customBackgroundColor,
    setEffect: setBackgroundEffect,
    setBlurIntensity,
    setBackgroundColor,
    setCustomBackgroundImage,
    setCustomBackgroundColor,
  } = useBackgroundEffects();

  useEffect(() => {
    if (!socket || !connected) return;
    
    // Don't join room if no name provided
    if (!userName || !userName.trim()) {
      console.warn('⚠️ Cannot join room without a name');
      return;
    }

    console.log('📤 Joining room:', { roomId, userId: socket.id, userName });
    socket.emit('join-room', {
      roomId,
      userId: socket.id,
      userName: userName.trim()
    });

    socket.on('room-state', (state) => {
      console.log('📥 Room state received:', state);
      console.log('👥 Participants:', state.participants || []);
      setIsHost(state.hostId === socket.id);
      setParticipants(state.participants || []);
      setVideoUrl(state.videoUrl);
      setVideoType(state.videoType);
      setPlaybackState(state.playbackState || { isPlaying: false, currentTime: 0, duration: 0 });
    });

    socket.on('participants-updated', ({ participants: updatedParticipants }) => {
      console.log('👥 Participants updated:', updatedParticipants);
      setParticipants(updatedParticipants);
    });

    socket.on('video-changed', ({ videoUrl: newUrl, videoType: newType, playbackState: newState }) => {
      setVideoUrl(newUrl);
      setVideoType(newType);
      setPlaybackState(newState);
    });

    socket.on('playback-control', ({ action, currentTime }) => {
      setPlaybackState(prev => ({
        ...prev,
        isPlaying: action === 'play',
        currentTime
      }));
    });

    socket.on('time-sync', ({ currentTime, duration }) => {
      setPlaybackState(prev => ({
        ...prev,
        currentTime,
        duration
      }));
    });

    // Handle room closed by host
    socket.on('room-closed', ({ message }) => {
      console.log('🚪 Room closed by host:', message);
      alert(message || 'The host has closed the room. You will be redirected to the home page.');
      // Redirect to home page
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
    });

    return () => {
      socket.off('room-state');
      socket.off('participants-updated');
      socket.off('video-changed');
      socket.off('playback-control');
      socket.off('time-sync');
      socket.off('room-closed');
    };
  }, [socket, connected, roomId, userName]);

  const handlePlaybackControl = useCallback((action: string, currentTime?: number) => {
    if (!socket || !isHost) return;
    socket.emit('playback-control', { action, currentTime });
  }, [socket, isHost]);

  const handleVideoChange = useCallback((url: string, type: 'youtube' | 'custom') => {
    if (!socket || !isHost) return;
    socket.emit('change-video', { videoUrl: url, videoType: type });
    setVideoUrl(url);
    setVideoType(type);
  }, [socket, isHost]);

  const handleTimeSync = useCallback((currentTime: number, duration: number) => {
    if (!socket || !isHost) return;
    socket.emit('time-sync', { currentTime, duration });
  }, [socket, isHost]);

  const handleMute = useCallback(() => {
    toggleMute();
  }, [toggleMute]);

  const handleVideoToggle = useCallback(() => {
    toggleVideo();
  }, [toggleVideo]);

  if (!connected) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="text-white text-xl mb-4">Connecting to server...</div>
          
          {connectionError && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
              <div className="text-red-400 text-sm font-semibold mb-1">Connection Error:</div>
              <div className="text-red-300 text-xs">{connectionError}</div>
            </div>
          )}
          
          <div className="text-gray-400 text-sm mb-4">
            Troubleshooting steps:
          </div>
          <ul className="text-left text-gray-400 text-sm space-y-2 mb-4">
            <li>1. Check Railway → Backend → Variables → <code className="text-primary-400">FRONTEND_URL</code></li>
            <li>2. Should be: <code className="text-primary-400">https://watch-together-app-theta.vercel.app</code></li>
            <li>3. Check Vercel → Settings → Environment Variables → <code className="text-primary-400">NEXT_PUBLIC_SOCKET_URL</code></li>
            <li>4. Should be: <code className="text-primary-400">https://watch-together-app-production.up.railway.app</code></li>
          </ul>
          
          <div className="text-xs text-gray-500 mb-4 p-2 bg-slate-700 rounded">
            <div>Backend URL: <code className="text-primary-400">{process.env.NEXT_PUBLIC_SOCKET_URL || 'NOT SET'}</code></div>
            <div className="mt-1">Frontend URL: <code className="text-primary-400">{typeof window !== 'undefined' ? window.location.origin : 'N/A'}</code></div>
          </div>
          
          <div className="flex gap-2 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg text-sm"
            >
              Retry Connection
            </button>
            <button
              onClick={() => {
                const backendUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'https://watch-together-app-production.up.railway.app';
                window.open(backendUrl + '/health', '_blank');
              }}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm"
            >
              Test Backend
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Room: {roomId}</h1>
          <p className="text-sm text-gray-400">{participants.length} participant{participants.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="flex items-center gap-4">
          <ShareInvite roomId={roomId} userName={userName} />
          {isHost && (
            <>
              <button
                onClick={() => {
                  if (confirm('Are you sure you want to close this room? All participants will be disconnected.')) {
                    socket?.emit('close-room');
                  }
                }}
                className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                title="Close Room"
              >
                <X className="w-4 h-4" />
                Close Room
              </button>
              <span className="px-3 py-1 bg-primary-500 rounded-full text-sm font-medium">
                Host
              </span>
            </>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Side - Video Player and Participants */}
        <div className="flex-1 flex flex-col">
          {/* Video Player */}
          <div className="flex-1 bg-black flex items-center justify-center p-4">
            {videoUrl ? (
              <VideoPlayer
                url={videoUrl}
                type={videoType || 'youtube'}
                playbackState={playbackState}
                isHost={isHost}
                onPlaybackControl={handlePlaybackControl}
                onTimeSync={handleTimeSync}
              />
            ) : (
              <div className="text-center text-gray-400">
                <p className="text-xl mb-2">No video selected</p>
                {isHost && (
                  <p className="text-sm">Add a YouTube URL to start watching</p>
                )}
              </div>
            )}
          </div>

          {/* Controls */}
          <Controls
            isHost={isHost}
            videoUrl={videoUrl}
            onVideoChange={handleVideoChange}
            onMute={handleMute}
            onVideoToggle={handleVideoToggle}
            isMuted={isMuted}
            isVideoOff={isVideoOff}
            onChatToggle={() => setShowChat(!showChat)}
            showChat={showChat}
            backgroundEffect={backgroundEffect}
            blurIntensity={blurIntensity}
            backgroundColor={backgroundColor}
            customBackgroundColor={customBackgroundColor}
            onBackgroundEffectChange={setBackgroundEffect}
            onBlurIntensityChange={setBlurIntensity}
            onBackgroundColorChange={setBackgroundColor}
            onCustomBackgroundColorChange={setCustomBackgroundColor}
            onBackgroundImageChange={setCustomBackgroundImage}
          />
        </div>

        {/* Right Side - Video Grid and Chat */}
        <div className={`w-80 bg-slate-800 border-l border-slate-700 flex flex-col transition-all ${showChat ? 'w-96' : ''}`}>
          {/* Video Grid */}
          <div className="flex-1 p-4 overflow-y-auto">
            <VideoGrid
              localStream={localStream}
              remoteStreams={remoteStreams}
              participants={participants}
              currentUserId={socket?.id || ''}
              backgroundEffect={backgroundEffect}
              blurIntensity={blurIntensity}
              backgroundColor={backgroundColor}
              customBackgroundColor={customBackgroundColor}
              customBackgroundImage={customBackgroundImage}
              onMute={handleMute}
              onVideoToggle={handleVideoToggle}
              isMuted={isMuted}
              isVideoOff={isVideoOff}
            />
          </div>

          {/* Chat */}
          {showChat && (
            <div className="h-64 border-t border-slate-700">
              <Chat socket={socket} roomId={roomId} userName={userName} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
