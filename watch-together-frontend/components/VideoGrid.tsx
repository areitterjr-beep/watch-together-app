'use client';

import { useEffect, useRef } from 'react';
import { User, Video, VideoOff, Mic, MicOff } from 'lucide-react';

interface VideoGridProps {
  localStream: MediaStream | null;
  remoteStreams: Map<string, MediaStream>;
  participants: Array<{
    id: string;
    name: string;
    socketId: string;
    isHost?: boolean;
  }>;
  currentUserId: string;
  backgroundEffect?: 'none' | 'blur' | 'image' | 'color';
  blurIntensity?: number;
  backgroundColor?: 'blue' | 'green' | 'purple' | 'red' | 'custom';
  customBackgroundColor?: string;
  customBackgroundImage?: string | null;
  // Controls for local video
  onMute?: () => void;
  onVideoToggle?: () => void;
  isMuted?: boolean;
  isVideoOff?: boolean;
}

export default function VideoGrid({
  localStream,
  remoteStreams,
  participants,
  currentUserId,
  backgroundEffect = 'none',
  blurIntensity = 10,
  backgroundColor = 'blue',
  customBackgroundColor = '#1e40af',
  customBackgroundImage = null,
  onMute,
  onVideoToggle,
  isMuted = false,
  isVideoOff = false,
}: VideoGridProps) {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRefs = useRef<Map<string, HTMLVideoElement>>(new Map());

  useEffect(() => {
    if (localStream && localVideoRef.current) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    remoteStreams.forEach((stream, socketId) => {
      const videoElement = remoteVideoRefs.current.get(socketId);
      if (videoElement) {
        videoElement.srcObject = stream;
      }
    });
  }, [remoteStreams]);

  const setRemoteVideoRef = (socketId: string, element: HTMLVideoElement | null) => {
    if (element) {
      remoteVideoRefs.current.set(socketId, element);
      const stream = remoteStreams.get(socketId);
      if (stream) {
        element.srcObject = stream;
      }
    } else {
      remoteVideoRefs.current.delete(socketId);
    }
  };

  const getParticipantName = (socketId: string) => {
    return participants.find((p) => p.socketId === socketId)?.name || 'Anonymous';
  };

  const hasVideo = (stream: MediaStream | null) => {
    if (!stream) return false;
    return stream.getVideoTracks().some((track) => track.enabled);
  };

  const hasAudio = (stream: MediaStream | null) => {
    if (!stream) return false;
    return stream.getAudioTracks().some((track) => track.enabled);
  };

  const getColorValue = (color: 'blue' | 'green' | 'purple' | 'red' | 'custom'): string => {
    const colors: Record<string, string> = {
      blue: '#1e40af',
      green: '#166534',
      purple: '#6b21a8',
      red: '#991b1b',
      custom: '#1e40af',
    };
    return colors[color] || '#1e40af';
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-4">
        Participants ({participants.length})
      </h3>

      {/* Local Video */}
      <div 
        className="relative bg-slate-700 rounded-lg overflow-hidden aspect-video group"
        style={{
          backgroundColor: backgroundEffect === 'color' 
            ? (backgroundColor === 'custom' ? customBackgroundColor : getColorValue(backgroundColor))
            : undefined,
          backgroundImage: backgroundEffect === 'image' && customBackgroundImage
            ? `url(${customBackgroundImage})`
            : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <video
          ref={localVideoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
          style={{
            filter: backgroundEffect === 'blur' ? `blur(${blurIntensity}px)` : 'none',
            mixBlendMode: backgroundEffect === 'image' || backgroundEffect === 'color' ? 'multiply' : 'normal',
            opacity: backgroundEffect === 'image' || backgroundEffect === 'color' ? 0.9 : 1,
          }}
        />
        {!hasVideo(localStream) && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
            <User className="w-12 h-12 text-gray-500" />
          </div>
        )}
        
        {/* Control buttons - shown on hover */}
        {(onMute || onVideoToggle) && (
          <div className="absolute top-2 right-2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            {onMute && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onMute();
                }}
                className={`p-2 rounded-lg transition-colors ${
                  isMuted
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : 'bg-black/70 hover:bg-black/80 text-white'
                }`}
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>
            )}
            {onVideoToggle && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onVideoToggle();
                }}
                className={`p-2 rounded-lg transition-colors ${
                  isVideoOff
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : 'bg-black/70 hover:bg-black/80 text-white'
                }`}
                title={isVideoOff ? 'Turn on camera' : 'Turn off camera'}
              >
                {isVideoOff ? <VideoOff className="w-4 h-4" /> : <Video className="w-4 h-4" />}
              </button>
            )}
          </div>
        )}
        
        <div className="absolute bottom-2 left-2 flex items-center gap-2 bg-black/60 px-2 py-1 rounded text-sm">
          <span className="font-medium">You</span>
          {!hasVideo(localStream) && <VideoOff className="w-4 h-4" />}
          {!hasAudio(localStream) && <MicOff className="w-4 h-4" />}
        </div>
      </div>

      {/* Remote Videos */}
      {Array.from(remoteStreams.entries()).map(([socketId, stream]) => {
        const participant = participants.find((p) => p.socketId === socketId);
        return (
          <div
            key={socketId}
            className="relative bg-slate-700 rounded-lg overflow-hidden aspect-video"
          >
            <video
              ref={(el) => setRemoteVideoRef(socketId, el)}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
            {!hasVideo(stream) && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
                <User className="w-12 h-12 text-gray-500" />
              </div>
            )}
            <div className="absolute bottom-2 left-2 flex items-center gap-2 bg-black/60 px-2 py-1 rounded text-sm">
              <span className="font-medium">{participant?.name || 'Anonymous'}</span>
              {participant?.isHost && (
                <span className="px-1.5 py-0.5 bg-primary-500 rounded text-xs">Host</span>
              )}
              {!hasVideo(stream) && <VideoOff className="w-4 h-4" />}
              {!hasAudio(stream) && <MicOff className="w-4 h-4" />}
            </div>
          </div>
        );
      })}

      {/* Participants without video */}
      {participants
        .filter((p) => p.socketId !== currentUserId && !remoteStreams.has(p.socketId))
        .map((participant) => (
          <div
            key={participant.socketId}
            className="relative bg-slate-700 rounded-lg overflow-hidden aspect-video flex items-center justify-center"
          >
            <User className="w-12 h-12 text-gray-500" />
            <div className="absolute bottom-2 left-2 flex items-center gap-2 bg-black/60 px-2 py-1 rounded text-sm">
              <span className="font-medium">{participant.name}</span>
              {participant.isHost && (
                <span className="px-1.5 py-0.5 bg-primary-500 rounded text-xs">Host</span>
              )}
            </div>
          </div>
        ))}
    </div>
  );
}
