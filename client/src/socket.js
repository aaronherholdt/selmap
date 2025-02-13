import { io } from 'socket.io-client';

const SOCKET_URL = process.env.NODE_ENV === 'production'
  ? 'https://sel-interactive-map-server.onrender.com'
  : 'http://localhost:5000';

export const socket = io(SOCKET_URL, {
  withCredentials: true,
  autoConnect: true
});

export const initializeSocket = (onCursorMove, onActivityStart) => {
  socket.on('cursorMove', onCursorMove);
  socket.on('activityStart', onActivityStart);

  return () => {
    socket.off('cursorMove');
    socket.off('activityStart');
  };
}; 