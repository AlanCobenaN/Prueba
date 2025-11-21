import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

export const useSocket = (userId) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!userId) return;

    console.log('Creando conexión de socket para usuario:', userId);

    // Crear conexión de socket
    const newSocket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      autoConnect: true
    });

    newSocket.on('connect', () => {
      console.log('✅ Socket conectado:', newSocket.id);
      newSocket.emit('user-connected', userId);
    });

    newSocket.on('connect_error', (error) => {
      console.error('❌ Error de conexión socket:', error);
    });

    newSocket.on('disconnect', (reason) => {
      console.log('🔌 Socket desconectado:', reason);
    });

    setSocket(newSocket);

    // Cleanup
    return () => {
      console.log('🧹 Limpiando socket...');
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, [userId]);

  return socket;
};
