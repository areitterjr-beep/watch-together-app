import { useEffect, useRef, useState } from 'react';
import { Socket } from 'socket.io-client';

interface UseWebRTCReturn {
  localStream: MediaStream | null;
  remoteStreams: Map<string, MediaStream>;
  peers: Map<string, any>;
  toggleMute: () => void;
  toggleVideo: () => void;
  isMuted: boolean;
  isVideoOff: boolean;
}

export function useWebRTC(socket: Socket | null, roomId: string): UseWebRTCReturn {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStreams, setRemoteStreams] = useState<Map<string, MediaStream>>(new Map());
  const [peers, setPeers] = useState<Map<string, any>>(new Map());
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const peersRef = useRef<Map<string, any>>(new Map());
  const localStreamRef = useRef<MediaStream | null>(null);
  const PeerRef = useRef<any>(null);

  // Dynamically import simple-peer only in browser
  useEffect(() => {
    if (typeof window === 'undefined') return;

    import('simple-peer').then((module) => {
      PeerRef.current = module.default;
    }).catch((err) => {
      console.error('Failed to load simple-peer:', err);
    });
  }, []);

  // Get user media
  useEffect(() => {
    // Only run in browser (not during SSR)
    if (typeof window === 'undefined' || !navigator.mediaDevices) {
      return;
    }

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setLocalStream(stream);
        localStreamRef.current = stream;
      })
      .catch((err) => {
        console.error('Error accessing media devices:', err);
        // Don't throw - just log the error
      });

    return () => {
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Create peer connection
  const createPeer = (socketId: string, initiator: boolean) => {
    // Only create peer in browser
    if (typeof window === 'undefined' || !PeerRef.current) {
      return null;
    }

    const Peer = PeerRef.current;
    const peer = new Peer({
      initiator,
      trickle: false,
      stream: localStreamRef.current || undefined,
    });

    peer.on('signal', (data: any) => {
      if (initiator) {
        socket?.emit('webrtc-offer', {
          offer: data,
          targetSocketId: socketId,
        });
      } else {
        socket?.emit('webrtc-answer', {
          answer: data,
          targetSocketId: socketId,
        });
      }
    });

    peer.on('stream', (stream: MediaStream) => {
      setRemoteStreams((prev) => {
        const newMap = new Map(prev);
        newMap.set(socketId, stream);
        return newMap;
      });
    });

    peer.on('error', (err: Error) => {
      console.error('Peer error:', err);
    });

    if (peer) {
      peersRef.current.set(socketId, peer);
    }
    return peer;
  };

  // Handle WebRTC signaling
  useEffect(() => {
    // Only run in browser
    if (typeof window === 'undefined' || !PeerRef.current) return;
    if (!socket || !localStream) return;

    socket.on('webrtc-offer', ({ offer, senderSocketId }) => {
      const peer = createPeer(senderSocketId, false);
      if (peer) {
        peer.signal(offer);
      }
    });

    socket.on('webrtc-answer', ({ answer, senderSocketId }) => {
      const peer = peersRef.current.get(senderSocketId);
      if (peer) {
        peer.signal(answer);
      }
    });

    socket.on('webrtc-ice-candidate', ({ candidate, senderSocketId }) => {
      const peer = peersRef.current.get(senderSocketId);
      if (peer) {
        peer.signal(candidate);
      }
    });

    socket.on('user-joined', ({ userId }) => {
      if (userId !== socket.id) {
        const peer = createPeer(userId, true);
        if (peer) {
          setPeers((prev) => {
            const newMap = new Map(prev);
            newMap.set(userId, peer);
            return newMap;
          });
        }
      }
    });

    socket.on('user-left', ({ userId }) => {
      const peer = peersRef.current.get(userId);
      if (peer) {
        peer.destroy();
        peersRef.current.delete(userId);
        setPeers((prev) => {
          const newMap = new Map(prev);
          newMap.delete(userId);
          return newMap;
        });
        setRemoteStreams((prev) => {
          const newMap = new Map(prev);
          newMap.delete(userId);
          return newMap;
        });
      }
    });

    return () => {
      socket.off('webrtc-offer');
      socket.off('webrtc-answer');
      socket.off('webrtc-ice-candidate');
      socket.off('user-joined');
      socket.off('user-left');
    };
  }, [socket, localStream]);

  const toggleMute = () => {
    if (localStreamRef.current) {
      const audioTracks = localStreamRef.current.getAudioTracks();
      // isMuted: false = audio ON (not muted), true = audio OFF (muted)
      // When audio is ON (isMuted=false), clicking should mute it (turn OFF)
      //   - track.enabled should be false (disable audio)
      //   - isMuted should become true (state is muted)
      // When audio is OFF (isMuted=true), clicking should unmute it (turn ON)
      //   - track.enabled should be true (enable audio)
      //   - isMuted should become false (state is not muted)
      const newMutedState = !isMuted; // Toggle the state
      audioTracks.forEach((track) => {
        track.enabled = !newMutedState; // If new state is muted (true), disable (false). If new state is unmuted (false), enable (true).
      });
      setIsMuted(newMutedState); // Update state
    }
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTracks = localStreamRef.current.getVideoTracks();
      // isVideoOff: false = video ON, true = video OFF
      // When video is ON (isVideoOff=false), clicking should turn it OFF
      //   - track.enabled should be false (turn off)
      //   - isVideoOff should become true (state is OFF)
      // When video is OFF (isVideoOff=true), clicking should turn it ON
      //   - track.enabled should be true (turn on)
      //   - isVideoOff should become false (state is ON)
      // So: track.enabled = isVideoOff (if OFF=true, enable=true; if ON=false, enable=false)
      const newVideoOffState = !isVideoOff; // Toggle the state
      videoTracks.forEach((track) => {
        track.enabled = isVideoOff; // If video is OFF (true), enable it (true). If video is ON (false), disable it (false).
      });
      setIsVideoOff(newVideoOffState); // Update state
    }
  };

  return {
    localStream,
    remoteStreams,
    peers,
    toggleMute,
    toggleVideo,
    isMuted,
    isVideoOff,
  };
}
