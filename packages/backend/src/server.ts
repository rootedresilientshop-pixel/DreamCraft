import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import ideasRoutes from './routes/ideas';
import collaboratorsRoutes from './routes/collaborators';
import marketplaceRoutes from './routes/marketplace';
import paymentsRoutes from './routes/payments';
import connectDB from './db';
import { requestLogger } from './middleware/logger';
import { createRateLimiter } from './middleware/rateLimiter';

console.log('Starting DreamCraft backend...');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

// Security & Logging Middleware
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'https://dreamcraft-khaki.vercel.app',
  'https://www.dreamcraft-khaki.vercel.app'
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Preflight OPTIONS handling for all routes
app.options('*', cors());
app.use(express.json({ limit: '10mb' }));
app.use(requestLogger);
app.use(createRateLimiter({ windowMs: 15 * 60 * 1000, maxRequests: 100 }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/ideas', ideasRoutes);

app.use('/api/collaborators', collaboratorsRoutes);
app.use('/api/marketplace', marketplaceRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/transactions', (req, res) => {
  res.status(501).json({ error: 'Transactions routes not implemented' });
});

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// Connect to DB and Start server
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`DreamCraft Backend running on port ${PORT}`);
  });
};

startServer().catch((err) => {
  console.error('Server error:', err);
  process.exit(1);
});
