import express, { Request, Response } from 'express';
import { authenticateToken } from '../middleware/auth.js';
import Notification from '../models/Notification.js';

const router = express.Router();

// Custom request type for authenticated routes
interface AuthRequest extends Request {
  userId?: string;
}

// GET - Get user's notifications
router.get('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const notifications = await Notification.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({ success: true, data: notifications });
  } catch (error: any) {
    console.error('Fetch notifications error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// PATCH - Mark notification as read
router.patch('/:id/read', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ success: false, error: 'Notification not found' });
    }

    res.json({ success: true, data: notification });
  } catch (error: any) {
    console.error('Mark read error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// PATCH - Mark all as read
router.patch('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    // Check for mark-all-read in body or query
    const markAll = (req.body?.markAll || req.query?.markAll) === 'true';

    if (markAll) {
      await Notification.updateMany(
        { userId: req.userId, read: false },
        { read: true }
      );
    }

    res.json({ success: true });
  } catch (error: any) {
    console.error('Mark all read error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE - Delete notification
router.delete('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    await Notification.deleteOne({ _id: req.params.id, userId: req.userId });
    res.json({ success: true });
  } catch (error: any) {
    console.error('Delete notification error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
