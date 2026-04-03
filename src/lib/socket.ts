import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const getSocket = (authToken?: string): Socket => {
  if (!socket) {
    const token = authToken || (typeof window !== 'undefined' ? localStorage.getItem('taskflow_token') : null);
    socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000', {
      auth: { token },
      transports: ['websocket'],
      autoConnect: true,
    });

    socket.on('connect', () => console.log('🔌 Socket connected:', socket?.id));
    socket.on('disconnect', () => console.log('🔌 Socket disconnected'));
    socket.on('connect_error', (err) => console.error('Socket error:', err.message));
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
