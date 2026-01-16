'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import VideoGrid from '@/components/VideoGrid';
import VideoPlayer from '@/components/VideoPlayer';
import Controls from '@/components/Controls';
import Chat from '@/components/Chat';
import ShareInvite from '@/components/ShareInvite';
import { useSocket } from '@/hooks/useSocket';
import { useWebRTC } from '@/hooks/useWebRTC';
import { useBackgroundEffects } from '@/hooks/useBackgroundEffects';

export default function RoomPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const roomId = params.id as string;
  const userName = searchParams.get('name') || 'Anonymous';
  
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

  const { socket, connected } = useSocket();
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

    socket.emit('join-room', {
      roomId,
      userId: socket.id,
      userName
    });

    socket.on('room-state', (state) => {
      setIsHost(state.hostId === socket.id);
      setParticipants(state.participants || []);
      setVideoUrl(state.videoUrl);
      setVideoType(state.videoType);
      setPlaybackState(state.playbackState || { isPlaying: false, currentTime: 0, duration: 0 });
    });

    socket.on('participants-updated', ({ participants: updatedParticipants }) => {
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

    return () => {
      socket.off('room-state');
      socket.off('participants-updated');
      socket.off('video-changed');
      socket.off('playback-control');
      socket.off('time-sync');
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
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Connecting to server...</div>
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
            <span className="px-3 py-1 bg-primary-500 rounded-full text-sm font-medium">
              Host
            </span>
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
