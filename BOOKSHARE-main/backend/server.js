import dotenv from 'dotenv';

// Cargar variables de entorno PRIMERO, antes de cualquier otro módulo
dotenv.config();

import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import connectDB from './config/database.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import bookRoutes from './routes/bookRoutes.js';
import exchangeRoutes from './routes/exchangeRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

// Conectar a la base de datos
connectDB();

// Verificar configuración de email (opcional - no bloquea el servidor)
import('./config/email.js').then(({ verifyEmailConfig }) => {
  verifyEmailConfig();
}).catch(err => {
  console.log('⚠️ Email no configurado. Las funciones de email no estarán disponibles.');
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/exchanges', exchangeRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/chat', chatRoutes);

// Ruta de prueba
app.get('/api', (req, res) => {
  res.json({ message: 'API BookShare funcionando correctamente' });
});

// WebSocket para chat en tiempo real
const connectedUsers = new Map(); // userId -> socketId

io.on('connection', (socket) => {
  console.log('Usuario conectado:', socket.id);

  // Registrar usuario conectado
  socket.on('user-connected', (userId) => {
    connectedUsers.set(userId, socket.id);
    console.log(`✅ Usuario ${userId} registrado con socket ${socket.id}`);
    console.log(`👥 Total usuarios conectados: ${connectedUsers.size}`);
    
    // Notificar a todos los usuarios conectados del nuevo usuario
    io.emit('user-status-change', { userId, online: true });
    
    // Enviar al usuario recién conectado la lista de usuarios en línea
    const onlineUsers = Array.from(connectedUsers.keys());
    socket.emit('online-users-list', onlineUsers);
    console.log(`📤 Enviando lista de usuarios en línea a ${userId}:`, onlineUsers);
  });

  // Unirse a una sala de chat privada
  socket.on('join-chat', (chatRoom) => {
    socket.join(chatRoom);
    console.log(`Socket ${socket.id} se unió a la sala ${chatRoom}`);
  });

  // Enviar mensaje
  socket.on('send-message', (data) => {
    const { chatRoom, message, remitente, destinatario } = data;
    
    console.log(`📨 Mensaje de ${remitente} a ${destinatario} en sala ${chatRoom}`);
    console.log('Contenido:', message.contenido);
    
    // Emitir el mensaje solo al destinatario (no al remitente)
    socket.to(chatRoom).emit('receive-message', {
      message: message,
      chatRoom
    });
    console.log(`✅ Mensaje emitido a la sala ${chatRoom}`);
    
    // También enviar directamente al socket del destinatario si está conectado
    const destinatarioSocketId = connectedUsers.get(destinatario);
    if (destinatarioSocketId) {
      console.log(`📤 Enviando mensaje directamente al socket ${destinatarioSocketId}`);
      io.to(destinatarioSocketId).emit('receive-message', {
        message: message,
        chatRoom
      });
      
      // Enviar notificación
      io.to(destinatarioSocketId).emit('new-message-notification', {
        from: remitente,
        message: message.contenido
      });
    } else {
      console.log(`⚠️ Destinatario ${destinatario} no está conectado`);
    }
  });

  // Usuario está escribiendo
  socket.on('typing', (data) => {
    socket.to(data.chatRoom).emit('user-typing', {
      userId: data.userId,
      nombre: data.nombre
    });
  });

  // Usuario dejó de escribir
  socket.on('stop-typing', (data) => {
    socket.to(data.chatRoom).emit('user-stop-typing', {
      userId: data.userId
    });
  });

  // Desconexión
  socket.on('disconnect', () => {
    // Encontrar y eliminar usuario desconectado
    for (const [userId, socketId] of connectedUsers.entries()) {
      if (socketId === socket.id) {
        connectedUsers.delete(userId);
        io.emit('user-status-change', { userId, online: false });
        console.log(`Usuario ${userId} desconectado`);
        break;
      }
    }
    console.log('Socket desconectado:', socket.id);
  });
});

// Hacer io accesible en las rutas
app.set('io', io);

// Manejo de errores
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});

export default app;
