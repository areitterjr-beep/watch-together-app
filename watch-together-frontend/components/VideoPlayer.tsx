'use client';

import { useEffect, useRef, useState } from 'react';

interface VideoPlayerProps {
  url: string;
  type: 'youtube' | 'custom';
  playbackState: {
    isPlaying: boolean;
    currentTime: number;
    duration: number;
  };
  isHost: boolean;
  onPlaybackControl: (action: string, currentTime?: number) => void;
  onTimeSync: (currentTime: number, duration: number) => void;
}

export default function VideoPlayer({
  url,
  type,
  playbackState,
  isHost,
  onPlaybackControl,
  onTimeSync,
}: VideoPlayerProps) {
  const playerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const youtubePlayerRef = useRef<any>(null);
  const syncIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // YouTube IFrame API
  useEffect(() => {
    // Only run in browser (not during SSR)
    if (typeof window === 'undefined') return;
    if (type !== 'youtube' || !playerRef.current) return;

    // Load YouTube IFrame API
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

      window.onYouTubeIframeAPIReady = () => {
        if (!playerRef.current) return;
        const videoId = extractYouTubeId(url);
        if (!videoId) return;

        youtubePlayerRef.current = new window.YT.Player(playerRef.current, {
          height: '100%',
          width: '100%',
          videoId,
          playerVars: {
            autoplay: 0,
            controls: isHost ? 1 : 0,
            modestbranding: 1,
            rel: 0,
            // Quality: YouTube uses adaptive streaming based on container size and bandwidth
            // Larger container = higher quality. We ensure container is large enough for HD.
            playsinline: 1, // Enable inline playback on mobile
            enablejsapi: 1, // Enable JavaScript API for better control
            origin: typeof window !== 'undefined' ? window.location.origin : '',
          },
          events: {
            onStateChange: (event: any) => {
              if (!isHost) return;
              // YT.PlayerState.PLAYING = 1, PAUSED = 2
              if (event.data === 1) {
                onPlaybackControl('play');
              } else if (event.data === 2) {
                onPlaybackControl('pause');
              }
            },
            onReady: () => {
              // Note: YouTube IFrame API no longer supports setPlaybackQuality()
              // Quality is now adaptive based on container size, bandwidth, and device
              // We ensure the container is large enough (min 854x480) to encourage HD playback
              console.log('✅ YouTube player ready - quality will adapt based on container size and bandwidth');

              if (isHost) {
                // Start time sync
                syncIntervalRef.current = setInterval(() => {
                  if (youtubePlayerRef.current) {
                    try {
                      const currentTime = youtubePlayerRef.current.getCurrentTime();
                      const duration = youtubePlayerRef.current.getDuration();
                      onTimeSync(currentTime, duration);
                    } catch (e) {
                      // Player might not be ready
                    }
                  }
                }, 1000);
              }
            },
          },
        });
      };
    } else {
      // API already loaded
      const videoId = extractYouTubeId(url);
      if (videoId && playerRef.current) {
        youtubePlayerRef.current = new window.YT.Player(playerRef.current, {
          height: '100%',
          width: '100%',
          videoId,
          playerVars: {
            autoplay: 0,
            controls: isHost ? 1 : 0,
            modestbranding: 1,
            rel: 0,
            // Quality: YouTube uses adaptive streaming based on container size and bandwidth
            // Larger container = higher quality. We ensure container is large enough for HD.
            playsinline: 1, // Enable inline playback on mobile
            enablejsapi: 1, // Enable JavaScript API for better control
            origin: typeof window !== 'undefined' ? window.location.origin : '',
          },
          events: {
            onReady: () => {
              // Note: YouTube IFrame API no longer supports setPlaybackQuality()
              // Quality is now adaptive based on container size, bandwidth, and device
              // We ensure the container is large enough (min 854x480) to encourage HD playback
              console.log('✅ YouTube player ready - quality will adapt based on container size and bandwidth');

              if (isHost) {
                syncIntervalRef.current = setInterval(() => {
                  if (youtubePlayerRef.current) {
                    try {
                      const currentTime = youtubePlayerRef.current.getCurrentTime();
                      const duration = youtubePlayerRef.current.getDuration();
                      onTimeSync(currentTime, duration);
                    } catch (e) {
                      // Player might not be ready
                    }
                  }
                }, 1000);
              }
            },
          },
        });
      }
    }

    return () => {
      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current);
      }
      if (youtubePlayerRef.current) {
        youtubePlayerRef.current.destroy();
      }
    };
  }, [url, type, isHost, onPlaybackControl, onTimeSync]);

  // Sync playback state for non-host
  useEffect(() => {
    if (isHost || !youtubePlayerRef.current || type !== 'youtube') return;

    // Only sync if playback state actually changed
    try {
      const currentPlayerState = youtubePlayerRef.current.getPlayerState();
      // YT.PlayerState.PLAYING = 1, PAUSED = 2
      const shouldBePlaying = playbackState.isPlaying;
      const isCurrentlyPlaying = currentPlayerState === 1;

      if (shouldBePlaying && !isCurrentlyPlaying) {
        youtubePlayerRef.current.playVideo();
      } else if (!shouldBePlaying && isCurrentlyPlaying) {
        youtubePlayerRef.current.pauseVideo();
      }

      const currentTime = youtubePlayerRef.current.getCurrentTime();
      const timeDiff = Math.abs(currentTime - playbackState.currentTime);
      if (timeDiff > 1) {
        youtubePlayerRef.current.seekTo(playbackState.currentTime, true);
      }
    } catch (e) {
      // Player might not be ready, ignore
    }
  }, [playbackState.isPlaying, playbackState.currentTime, isHost, type]);

  // HTML5 video player for custom URLs
  useEffect(() => {
    if (type !== 'custom' || !videoRef.current) return;

    const video = videoRef.current;
    video.src = url;

    if (isHost) {
      // Host controls
      syncIntervalRef.current = setInterval(() => {
        onTimeSync(video.currentTime, video.duration);
      }, 1000);

      video.addEventListener('play', () => onPlaybackControl('play'));
      video.addEventListener('pause', () => onPlaybackControl('pause'));
    } else {
      // Sync with host
      if (playbackState.isPlaying) {
        video.play();
      } else {
        video.pause();
      }

      const timeDiff = Math.abs(video.currentTime - playbackState.currentTime);
      if (timeDiff > 1) {
        video.currentTime = playbackState.currentTime;
      }
    }

    return () => {
      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current);
      }
    };
  }, [url, type, isHost, playbackState, onPlaybackControl, onTimeSync]);

  if (type === 'youtube') {
    return (
      <div className="w-full h-full flex items-center justify-center bg-black p-2 md:p-4">
        {/* Large container encourages YouTube to serve higher quality video */}
        {/* YouTube's adaptive streaming uses container size to determine quality */}
        <div 
          ref={playerRef} 
          className="w-full h-full"
          style={{ 
            // Use full available space, but ensure minimum size for HD
            // YouTube will adapt quality based on this container size and user's bandwidth
            minHeight: '200px', // Smaller minimum for mobile
            minWidth: '100%', // Full width on mobile
            maxWidth: '100%',
            maxHeight: '100%',
            aspectRatio: '16/9', // Maintain 16:9 aspect ratio for optimal quality
            // Ensure container is as large as possible within viewport
            width: '100%',
            height: '100%'
          }}
        ></div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex items-center justify-center">
      <video
        ref={videoRef}
        className="w-full h-full max-w-7xl"
        controls={isHost}
        playsInline
      />
    </div>
  );
}

function extractYouTubeId(url: string): string | null {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

// Extend Window interface for YouTube API
declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}
