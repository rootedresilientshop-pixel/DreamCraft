import express, { Request, Response } from 'express';
import { authenticateToken } from '../middleware/auth';
import Favorite from '../models/Favorite';
import Idea from '../models/Idea';
import { sendNotification } from '../services/notificationService';

const router = express.Router();

interface AuthRequest extends Request {
  userId?: string;
}

// POST /api/favorites/:ideaId - Add favorite
router.post('/:ideaId', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const existing = await Favorite.findOne({ userId: req.userId, ideaId: req.params.ideaId });
    if (existing) {
      return res.status(400).json({ success: false, error: 'Already favorited' });
    }

    const favorite = await Favorite.create({ userId: req.userId, ideaId: req.params.ideaId });

    // Notify idea creator
    const idea = await Idea.findById(req.params.ideaId);
    if (idea && idea.creatorId.toString() !== req.userId) {
      await sendNotification({
        userId: idea.creatorId.toString(),
        type: 'favorite',
        title: 'Someone liked your idea!',
        message: `Your idea "${idea.title}" was added to favorites`,
        actionUrl: `/ideas/${req.params.ideaId}`,
        metadata: { ideaId: req.params.ideaId },
      });
    }

    res.json({ success: true, data: favorite });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/favorites/:ideaId - Remove favorite
router.delete('/:ideaId', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    await Favorite.deleteOne({ userId: req.userId, ideaId: req.params.ideaId });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/favorites - Get user's favorites
router.get('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const favorites = await Favorite.find({ userId: req.userId })
      .populate('ideaId')
      .sort({ createdAt: -1 });

    const ideas = favorites.map((f) => f.ideaId).filter(Boolean);
    res.json({ success: true, data: ideas });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/favorites/check/:ideaId - Check if favorited
router.get('/check/:ideaId', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const favorite = await Favorite.findOne({
      userId: req.userId,
      ideaId: req.params.ideaId,
    });

    res.json({ success: true, data: { isFavorited: !!favorite } });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
