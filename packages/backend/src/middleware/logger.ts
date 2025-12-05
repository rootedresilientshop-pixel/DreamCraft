import express, { Request, Response, NextFunction } from 'express';

const router = express.Router();

interface LogEntry {
  timestamp: string;
  method: string;
  path: string;
  statusCode: number;
  responseTime: number;
  clientIp: string;
}

const logs: LogEntry[] = [];
const MAX_LOGS = 1000; // Keep last 1000 logs in memory

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();
  const clientIp = req.ip || req.socket.remoteAddress || 'unknown';

  // Intercept response to capture status code
  const originalSend = res.send;
  res.send = function (data: any) {
    const responseTime = Date.now() - startTime;
    const logEntry: LogEntry = {
      timestamp: new Date().toISOString(),
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      responseTime,
      clientIp,
    };

    logs.push(logEntry);
    if (logs.length > MAX_LOGS) logs.shift(); // Keep only last 1000

    console.log(`[${logEntry.timestamp}] ${logEntry.method} ${logEntry.path} - ${logEntry.statusCode} (${logEntry.responseTime}ms)`);

    return originalSend.call(this, data);
  };

  next();
};

// Endpoint to view recent logs (for debugging)
router.get('/logs', (req: Request, res: Response) => {
  const limit = parseInt(req.query.limit as string) || 50;
  res.json({ logs: logs.slice(-limit) });
});

export { router as loggingRouter };
