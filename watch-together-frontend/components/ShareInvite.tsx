'use client';

import { useState, useEffect } from 'react';
import { Share2, Copy, Check, X } from 'lucide-react';

interface ShareInviteProps {
  roomId: string;
  userName?: string;
}

export default function ShareInvite({ roomId, userName }: ShareInviteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [roomUrl, setRoomUrl] = useState('');

  useEffect(() => {
    // Generate the full room URL
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const url = userName 
      ? `${baseUrl}/room/${roomId}?name=${encodeURIComponent(userName)}`
      : `${baseUrl}/room/${roomId}`;
    setRoomUrl(url);
  }, [roomId, userName]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(roomUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = roomUrl;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (fallbackErr) {
        console.error('Fallback copy failed:', fallbackErr);
      }
      document.body.removeChild(textArea);
    }
  };

  const shareNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join me in Watch Together',
          text: `Join me in Watch Together room: ${roomId}`,
          url: roomUrl,
        });
      } catch (err) {
        // User cancelled or error
        if ((err as Error).name !== 'AbortError') {
          console.error('Share failed:', err);
        }
      }
    } else {
      // Fallback to copy
      copyToClipboard();
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
        title="Invite friends"
      >
        <Share2 className="w-4 h-4" />
        <span className="hidden sm:inline">Invite</span>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setIsOpen(false)}>
      <div 
        className="bg-slate-800 rounded-lg shadow-xl max-w-md w-full p-6 border border-slate-700"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">Invite Friends</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-slate-700 rounded transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Room Info */}
        <div className="mb-4">
          <p className="text-sm text-gray-400 mb-2">Share this link to invite friends:</p>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={roomUrl}
              readOnly
              className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              onClick={(e) => (e.target as HTMLInputElement).select()}
            />
            <button
              onClick={copyToClipboard}
              className={`p-2 rounded-lg transition-colors ${
                copied
                  ? 'bg-green-500 hover:bg-green-600'
                  : 'bg-slate-700 hover:bg-slate-600'
              }`}
              title={copied ? 'Copied!' : 'Copy link'}
            >
              {copied ? (
                <Check className="w-5 h-5 text-white" />
              ) : (
                <Copy className="w-5 h-5 text-gray-300" />
              )}
            </button>
          </div>
        </div>

        {/* Room ID */}
        <div className="mb-4 p-3 bg-slate-700/50 rounded-lg">
          <p className="text-xs text-gray-400 mb-1">Room ID:</p>
          <p className="text-lg font-mono font-semibold text-white">{roomId}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2">
          {navigator.share && (
            <button
              onClick={shareNative}
              className="w-full px-4 py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Share2 className="w-5 h-5" />
              Share via...
            </button>
          )}
          <button
            onClick={copyToClipboard}
            className={`w-full px-4 py-3 rounded-lg transition-colors flex items-center justify-center gap-2 font-semibold ${
              copied
                ? 'bg-green-500 hover:bg-green-600 text-white'
                : 'bg-slate-700 hover:bg-slate-600 text-white'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-5 h-5" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-5 h-5" />
                Copy Link
              </>
            )}
          </button>
        </div>

        {/* Instructions */}
        <div className="mt-4 pt-4 border-t border-slate-700">
          <p className="text-xs text-gray-400 text-center">
            Friends can join by clicking the link or entering the Room ID on the home page
          </p>
        </div>
      </div>
    </div>
  );
}
