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
    socket.join('feedback'); // All users join feedback room for real-time updates

    // Notify online status
    socket.on('user:online', () => {
      io.to(`user:${socket.userId}`).emit('status:online', { userId: socket.userId });
    });

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

// Emit feedback created event
export const emitFeedbackCreated = (feedback: any): void => {
  const instance = getIO();
  instance.to('feedback').emit('feedback:created', feedback);
};

// Emit feedback updated event
export const emitFeedbackUpdated = (feedback: any): void => {
  const instance = getIO();
  instance.to('feedback').emit('feedback:updated', feedback);
};

// Emit feedback upvoted event
export const emitFeedbackUpvoted = (feedbackId: string, upvotes: number): void => {
  const instance = getIO();
  instance.to('feedback').emit('feedback:upvoted', { feedbackId, upvotes });
};

// Emit notification event
export const emitNotification = (userId: string, notification: any): void => {
  const instance = getIO();
  instance.to(`user:${userId}`).emit('notification:new', notification);
};
