import { Server as HTTPServer } from 'http';

export interface AuthSocket {
  userId?: string;
}

let io: any;

export const initializeSocket = (httpServer: HTTPServer, allowedOrigins: string[]): any => {
  // Import inside function to avoid circular dependencies
  const { Server } = require('socket.io');
  const jwt = require('jsonwebtoken');

  io = new Server(httpServer, {
    cors: {
      origin: allowedOrigins,
      credentials: true
    }
  });

  // Socket.io authentication middleware
  io.use((socket: any, next: any) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication error'));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret') as any;
      socket.userId = decoded.userId;
      next();
    } catch (err) {
      next(new Error('Authentication failed'));
    }
  });

  // Socket.io connection handling
  io.on('connection', (socket: any) => {
    console.log('User connected:', socket.userId);
    socket.join(`user:${socket.userId}`);

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.userId);
    });
  });

  return io;
};

export const getIO = (): any => {
  if (!io) {
    throw new Error('Socket.io not initialized. Call initializeSocket first.');
  }
  return io;
};
