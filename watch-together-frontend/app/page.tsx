'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Video, Users, ArrowRight } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const [roomId, setRoomId] = useState('');
  const [userName, setUserName] = useState('');

  // Debug: Log when component loads
  useEffect(() => {
    console.log('🏠 Home page component loaded');
    console.log('🌐 Window available:', typeof window !== 'undefined');
    console.log('🔗 Router available:', !!router);
  }, [router]);

  const createRoom = () => {
    const trimmedName = userName.trim();
    if (!trimmedName) {
      alert('Please enter your name first. Your name is required to join a room.');
      document.getElementById('userName')?.focus();
      return;
    }
    const newRoomId = Math.random().toString(36).substring(2, 9);
    const roomUrl = `/room/${newRoomId}?name=${encodeURIComponent(trimmedName)}`;
    console.log('🚪 Navigating to room:', roomUrl);
    
    // Use window.location for more reliable navigation
    window.location.href = roomUrl;
  };

  const joinRoom = () => {
    const trimmedName = userName.trim();
    const trimmedRoomId = roomId.trim();
    
    if (!trimmedName) {
      alert('Please enter your name first. Your name is required to join a room.');
      document.getElementById('userName')?.focus();
      return;
    }
    if (!trimmedRoomId) {
      alert('Please enter a room ID');
      document.getElementById('roomId')?.focus();
      return;
    }
    const roomUrl = `/room/${trimmedRoomId}?name=${encodeURIComponent(trimmedName)}`;
    console.log('🚪 Joining room:', roomUrl);
    
    // Use window.location for more reliable navigation
    window.location.href = roomUrl;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-500 rounded-full mb-4">
            <Video className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Watch Together</h1>
          <p className="text-gray-300">Stream and chat with friends in real-time</p>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <label htmlFor="userName" className="block text-sm font-medium text-gray-300 mb-2">
              Your Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              id="userName"
              name="userName"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Enter your name"
              required
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <p className="mt-1 text-xs text-gray-400">Required to join a room</p>
          </div>
        </div>

        <div className="space-y-4">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              createRoom();
            }}
            disabled={!userName.trim()}
            className={`w-full font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 ${
              !userName.trim()
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-primary-500 hover:bg-primary-600 text-white'
            }`}
          >
            <Video className="w-5 h-5" />
            Create Room
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/20"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white/10 text-gray-300">or</span>
            </div>
          </div>

          <div className="space-y-3">
            <input
              type="text"
              id="roomId"
              name="roomId"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              placeholder="Enter room ID"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              onKeyPress={(e) => e.key === 'Enter' && joinRoom()}
            />
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                joinRoom();
              }}
              disabled={!userName.trim() || !roomId.trim()}
              className={`w-full font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 border ${
                !userName.trim() || !roomId.trim()
                  ? 'bg-gray-600/50 text-gray-400 cursor-not-allowed border-gray-600'
                  : 'bg-white/10 hover:bg-white/20 text-white border-white/20'
              }`}
            >
              <Users className="w-5 h-5" />
              Join Room
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/20">
          <p className="text-xs text-gray-400 text-center">
            Supports YouTube videos. Netflix requires browser extension.
          </p>
        </div>
      </div>
    </div>
  );
}
