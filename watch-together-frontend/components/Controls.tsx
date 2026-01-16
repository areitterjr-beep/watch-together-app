'use client';

import { useState } from 'react';
import { Mic, MicOff, Video, VideoOff, MessageSquare, Plus, X } from 'lucide-react';
import BackgroundEffects from './BackgroundEffects';

interface ControlsProps {
  isHost: boolean;
  videoUrl: string | null;
  onVideoChange: (url: string, type: 'youtube' | 'custom') => void;
  onMute: () => void;
  onVideoToggle: () => void;
  isMuted: boolean;
  isVideoOff: boolean;
  onChatToggle: () => void;
  showChat: boolean;
  // Background effects
  backgroundEffect: 'none' | 'blur' | 'image' | 'color';
  blurIntensity: number;
  backgroundColor: 'blue' | 'green' | 'purple' | 'red' | 'custom';
  customBackgroundColor: string;
  onBackgroundEffectChange: (effect: 'none' | 'blur' | 'image' | 'color') => void;
  onBlurIntensityChange: (intensity: number) => void;
  onBackgroundColorChange: (color: 'blue' | 'green' | 'purple' | 'red' | 'custom') => void;
  onCustomBackgroundColorChange: (color: string) => void;
  onBackgroundImageChange: (image: string | null) => void;
}

export default function Controls({
  isHost,
  videoUrl,
  onVideoChange,
  onMute,
  onVideoToggle,
  isMuted,
  isVideoOff,
  onChatToggle,
  showChat,
  backgroundEffect,
  blurIntensity,
  backgroundColor,
  customBackgroundColor,
  onBackgroundEffectChange,
  onBlurIntensityChange,
  onBackgroundColorChange,
  onCustomBackgroundColorChange,
  onBackgroundImageChange,
}: ControlsProps) {
  const [showVideoInput, setShowVideoInput] = useState(false);
  const [videoInput, setVideoInput] = useState('');

  const handleAddVideo = () => {
    if (!videoInput.trim()) return;

    let url = videoInput.trim();
    let type: 'youtube' | 'custom' = 'custom';

    // Check if it's a YouTube URL
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      type = 'youtube';
    }

    onVideoChange(url, type);
    setVideoInput('');
    setShowVideoInput(false);
  };

  return (
    <div className="bg-slate-800 border-t border-slate-700 p-4">
      <div className="flex items-center justify-between gap-4">
        {/* Left side - Video/Audio controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              e.nativeEvent.stopImmediatePropagation();
              onMute();
            }}
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            className={`p-3 rounded-lg transition-colors ${
              isMuted
                ? 'bg-red-500 hover:bg-red-600'
                : 'bg-slate-700 hover:bg-slate-600'
            }`}
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              e.nativeEvent.stopImmediatePropagation();
              onVideoToggle();
            }}
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            className={`p-3 rounded-lg transition-colors ${
              isVideoOff
                ? 'bg-red-500 hover:bg-red-600'
                : 'bg-slate-700 hover:bg-slate-600'
            }`}
            title={isVideoOff ? 'Turn on video' : 'Turn off video'}
          >
            {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
          </button>
        </div>

        {/* Center - Video URL input (host only) */}
        {isHost && (
          <div className="flex-1 max-w-2xl">
            {showVideoInput ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={videoInput}
                  onChange={(e) => setVideoInput(e.target.value)}
                  placeholder="Enter YouTube URL or video URL"
                  className="flex-1 px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddVideo()}
                  autoFocus
                />
                <button
                  onClick={handleAddVideo}
                  className="px-4 py-2 bg-primary-500 hover:bg-primary-600 rounded-lg transition-colors"
                >
                  Add
                </button>
                <button
                  onClick={() => {
                    setShowVideoInput(false);
                    setVideoInput('');
                  }}
                  className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowVideoInput(true)}
                className="w-full px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                <span>{videoUrl ? 'Change Video' : 'Add Video'}</span>
              </button>
            )}
          </div>
        )}

        {/* Right side - Background effects and Chat toggle */}
        <div className="flex items-center gap-2">
          <BackgroundEffects
            effect={backgroundEffect}
            blurIntensity={blurIntensity}
            backgroundColor={backgroundColor}
            customBackgroundColor={customBackgroundColor}
            onEffectChange={onBackgroundEffectChange}
            onBlurIntensityChange={onBlurIntensityChange}
            onBackgroundColorChange={onBackgroundColorChange}
            onCustomBackgroundColorChange={onCustomBackgroundColorChange}
            onBackgroundImageChange={onBackgroundImageChange}
          />
          <button
            onClick={onChatToggle}
            className={`p-3 rounded-lg transition-colors ${
              showChat
                ? 'bg-primary-500 hover:bg-primary-600'
                : 'bg-slate-700 hover:bg-slate-600'
            }`}
            title={showChat ? 'Hide chat' : 'Show chat'}
          >
            <MessageSquare className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
