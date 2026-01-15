import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';

// Extend Socket interface to include userId
declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

import authRoutes from './routes/auth';
import ideasRoutes from './routes/ideas';
import collaboratorsRoutes from './routes/collaborators';
import marketplaceRoutes from './routes/marketplace';
import paymentsRoutes from './routes/payments';
import notificationRoutes from './routes/notifications';
import messageRoutes from './routes/messages';
import userRoutes from './routes/users';
import favoriteRoutes from './routes/favorites';
import templateRoutes from './routes/templates';
import connectDB from './db';
import { requestLogger } from './middleware/logger';
import { createRateLimiter } from './middleware/rateLimiter';
import { initializeSocket } from './services/socketService';

console.log('Starting DreamCraft backend...');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

// Create HTTP server for WebSocket support
const httpServer = http.createServer(app);

// Security & Logging Middleware
const getDefaultOrigins = () => {
  const development = [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001',
    'http://127.0.0.1:3002',
    'http://localhost:5173',
    'http://127.0.0.1:5173'
  ];

  const production = [
    'https://dreamcraft-khaki.vercel.app',
    'https://www.dreamcraft-khaki.vercel.app',
    'https://dreamcraft-git-main-gardner-seeses-projects.vercel.app'
  ];

  return process.env.NODE_ENV === 'production' ? production : [...development, ...production];
};

const allowedOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(',').map(o => o.trim())
  : getDefaultOrigins();

const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('CORS rejected origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// Initialize Socket.io
initializeSocket(httpServer, allowedOrigins);

app.use(cors(corsOptions));

// Preflight OPTIONS handling for all routes
app.options('*', cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(requestLogger);
app.use(createRateLimiter({ windowMs: 15 * 60 * 1000, maxRequests: 100 }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/ideas', ideasRoutes);
app.use('/api/collaborators', collaboratorsRoutes);
app.use('/api/marketplace', marketplaceRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/users', userRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/transactions', (req, res) => {
  res.status(501).json({ error: 'Transactions routes not implemented' });
});

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  // Ensure CORS headers are present even in error responses
  const origin = req.headers.origin || '';
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', 'true');
  }
  res.status(500).json({ error: 'Internal server error' });
});

// Validate required environment variables
const validateEnvironment = () => {
  const required = ['JWT_SECRET', 'MONGODB_URI'];
  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:', missing.join(', '));
    console.error('Please set these variables in your .env file and restart the server');
    process.exit(1);
  }

  if (process.env.JWT_SECRET === 'your_jwt_secret_key_here_change_in_production') {
    console.warn('⚠️  WARNING: Using default JWT_SECRET. This is insecure in production!');
    if (process.env.NODE_ENV === 'production') {
      console.error('❌ Default JWT_SECRET not allowed in production');
      process.exit(1);
    }
  }

  console.log('✅ Environment validation passed');
};

// Connect to DB and Start server
const startServer = async () => {
  validateEnvironment();
  await connectDB();
  httpServer.listen(PORT, () => {
    console.log(`✅ DreamCraft Backend with WebSocket running on port ${PORT}`);
    console.log(`📡 CORS enabled for: ${allowedOrigins.join(', ')}`);
  });
};

startServer().catch((err) => {
  console.error('❌ Server error:', err);
  process.exit(1);
});
