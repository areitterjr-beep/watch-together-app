import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3003';

export function useSocket() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  useEffect(() => {
    // Only run in browser (not during SSR)
    if (typeof window === 'undefined') {
      return;
    }

    console.log('🔌 Attempting to connect to Socket.io server...');
    console.log('📍 Socket URL:', SOCKET_URL);
    console.log('📍 Environment variable NEXT_PUBLIC_SOCKET_URL:', process.env.NEXT_PUBLIC_SOCKET_URL || 'NOT SET');

    const newSocket = io(SOCKET_URL, {
      transports: ['polling', 'websocket'], // Try polling first, then websocket
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 10,
      timeout: 20000,
      forceNew: true,
      withCredentials: true,
      upgrade: true
    });

    newSocket.on('connect', () => {
      console.log('✅ Connected to server!');
      console.log('📡 Socket ID:', newSocket.id);
      setConnected(true);
      setConnectionError(null);
    });

    newSocket.on('disconnect', (reason) => {
      console.log('❌ Disconnected from server. Reason:', reason);
      setConnected(false);
      if (reason === 'io server disconnect') {
        setConnectionError('Server disconnected. Please check backend status.');
      }
    });

    newSocket.on('connect_error', (error) => {
      console.error('❌ Connection error:', error);
      console.error('Error message:', error.message);
      if ('type' in error) {
        console.error('Error type:', (error as any).type);
      }
      setConnected(false);
      
      if (error.message.includes('CORS')) {
        setConnectionError('CORS Error: Backend CORS settings not configured. Check Railway FRONTEND_URL variable.');
      } else if (error.message.includes('ECONNREFUSED') || error.message.includes('failed')) {
        setConnectionError('Connection Failed: Backend may be down or URL incorrect. Check Railway deployment.');
      } else {
        setConnectionError(`Connection Error: ${error.message}`);
      }
    });

    newSocket.on('reconnect_attempt', (attemptNumber) => {
      console.log(`🔄 Reconnection attempt ${attemptNumber}...`);
    });

    newSocket.on('reconnect_failed', () => {
      console.error('❌ Reconnection failed after all attempts');
      setConnectionError('Failed to connect after multiple attempts. Check backend and CORS settings.');
    });

    setSocket(newSocket);

    return () => {
      console.log('🔌 Cleaning up socket connection...');
      newSocket.close();
    };
  }, []);

  return { socket, connected, connectionError };
}
