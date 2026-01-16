'use client';

import { useEffect, useRef, useState } from 'react';
import { Socket } from 'socket.io-client';
import { Send } from 'lucide-react';

interface ChatMessage {
  userId: string;
  userName: string;
  message: string;
  timestamp: number;
}

interface ChatProps {
  socket: Socket | null;
  roomId: string;
  userName: string;
}

export default function Chat({ socket, roomId, userName }: ChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!socket) return;

    const handleChatMessage = (msg: ChatMessage) => {
      console.log('💬 Received chat message:', msg);
      setMessages((prev) => {
        // Check if message already exists (prevent duplicates)
        // Allow small timestamp differences (within 1 second) for same message
        const exists = prev.some(
          (m) => 
            m.userId === msg.userId && 
            m.message === msg.message && 
            Math.abs(m.timestamp - msg.timestamp) < 1000
        );
        if (exists) {
          console.log('⚠️ Duplicate message ignored:', msg);
          return prev;
        }
        console.log('✅ Adding message to chat:', msg);
        return [...prev, msg];
      });
    };

    socket.on('chat-message', handleChatMessage);

    return () => {
      socket.off('chat-message', handleChatMessage);
    };
  }, [socket]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim() || !socket || !socket.id) return;

    const messageText = input.trim();
    const timestamp = Date.now();
    const currentUserId = socket.id;

    // Optimistically add your own message immediately (optimistic UI)
    const optimisticMessage: ChatMessage = {
      userId: currentUserId,
      userName: userName || 'You',
      message: messageText,
      timestamp: timestamp,
    };

    console.log('📤 Sending chat message:', optimisticMessage);
    console.log('📊 Current messages before add:', messages.length);
    setMessages((prev) => {
      const updated = [...prev, optimisticMessage];
      console.log('📊 Messages after add:', updated.length);
      return updated;
    });
    setInput('');

    // Send to server
    socket.emit('chat-message', { message: messageText });
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-full bg-slate-900">
      {/* Chat Header */}
      <div className="px-4 py-3 border-b border-slate-700">
        <h3 className="text-sm font-semibold text-gray-300">Chat</h3>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <div className="text-center text-gray-400 text-sm py-8">
            No messages yet. Start the conversation!
          </div>
        )}
        {messages.map((msg) => {
          // Use a unique key based on timestamp, userId, and message content
          const uniqueKey = `${msg.userId}-${msg.timestamp}-${msg.message.slice(0, 20)}`;
          const isOwnMessage = msg.userId === (socket?.id || '');
          
          return (
            <div
              key={uniqueKey}
              className={`flex flex-col ${
                isOwnMessage ? 'items-end' : 'items-start'
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-3 py-2 ${
                  isOwnMessage
                    ? 'bg-primary-500 text-white'
                    : 'bg-slate-700 text-gray-200'
                }`}
              >
                {!isOwnMessage && (
                  <div className="text-xs font-medium mb-1 opacity-80">
                    {msg.userName || 'Anonymous'}
                  </div>
                )}
                <div className="text-sm">{msg.message}</div>
                <div className="text-xs opacity-70 mt-1">
                  {formatTime(msg.timestamp)}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-slate-700">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type a message..."
            className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
          />
          <button
            onClick={sendMessage}
            className="p-2 bg-primary-500 hover:bg-primary-600 rounded-lg transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
