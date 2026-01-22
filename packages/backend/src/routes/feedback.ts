import express, { Request, Response } from 'express';
import Feedback from '../models/Feedback';
import User from '../models/User';
import { authenticateToken } from '../middleware/auth';
import { emitFeedbackCreated, emitFeedbackUpdated, emitFeedbackUpvoted } from '../services/socketService';

const router = express.Router();

// Middleware to check if user is admin
const checkAdmin = async (req: Request, res: Response, next: express.NextFunction) => {
  try {
    const userId = (req as any).userId;
    const user = await User.findById(userId);

    if (!user || user.userType !== 'admin') {
      return res.status(403).json({ success: false, error: 'Admin access required' });
    }

    next();
  } catch (err) {
    res.status(500).json({ success: false, error: 'Authorization failed' });
  }
};

// Create new feedback
router.post('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { category, title, description, priority, attachmentUrl } = req.body;

    if (!title || !description) {
      return res.status(400).json({ success: false, error: 'Title and description are required' });
    }

    const feedback = new Feedback({
      userId,
      category,
      title,
      description,
      priority,
      attachmentUrl,
    });

    await feedback.save();
    await feedback.populate('userId', 'username email');

    // Emit socket event for real-time update
    try {
      emitFeedbackCreated(feedback);
    } catch (socketErr) {
      console.error('Socket emit error:', socketErr);
    }

    res.status(201).json({
      success: true,
      data: feedback,
    });
  } catch (err: any) {
    console.error('Error creating feedback:', err);
    res.status(500).json({ success: false, error: 'Failed to create feedback' });
  }
});

// Get all feedback (public, for feedback board)
router.get('/', async (req: Request, res: Response) => {
  try {
    const { status, category, sort } = req.query;
    const query: any = {};

    if (status) query.status = status;
    if (category) query.category = category;

    const sortOption = sort === 'upvotes' ? { upvoteCount: -1 } : { createdAt: -1 };

    const feedback = await Feedback.find(query)
      .populate('userId', 'username email avatar')
      .populate('assignedTo', 'username email')
      .sort(sortOption as any)
      .limit(100);

    res.json({
      success: true,
      data: feedback,
    });
  } catch (err) {
    console.error('Error fetching feedback:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch feedback' });
  }
});

// Get user's own feedback
router.get('/user/my-feedback', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;

    const feedback = await Feedback.find({ userId })
      .populate('userId', 'username email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: feedback,
    });
  } catch (err) {
    console.error('Error fetching user feedback:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch feedback' });
  }
});

// Get single feedback
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const feedback = await Feedback.findById(req.params.id)
      .populate('userId', 'username email avatar')
      .populate('assignedTo', 'username email')
      .populate('upvotedBy', 'username');

    if (!feedback) {
      return res.status(404).json({ success: false, error: 'Feedback not found' });
    }

    res.json({
      success: true,
      data: feedback,
    });
  } catch (err) {
    console.error('Error fetching feedback:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch feedback' });
  }
});

// Upvote feedback
router.post('/:id/upvote', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({ success: false, error: 'Feedback not found' });
    }

    const hasUpvoted = feedback.upvotedBy.includes(userId);

    if (hasUpvoted) {
      // Remove upvote
      feedback.upvotedBy = feedback.upvotedBy.filter(id => id.toString() !== userId);
      feedback.upvotes = Math.max(0, feedback.upvotes - 1);
    } else {
      // Add upvote
      feedback.upvotedBy.push(userId);
      feedback.upvotes += 1;
    }

    await feedback.save();
    await feedback.populate('userId', 'username email');

    // Emit socket event for real-time update
    try {
      emitFeedbackUpvoted(feedback._id.toString(), feedback.upvotes);
    } catch (socketErr) {
      console.error('Socket emit error:', socketErr);
    }

    res.json({
      success: true,
      data: feedback,
      upvoted: !hasUpvoted,
    });
  } catch (err: any) {
    console.error('Error upvoting feedback:', err);
    res.status(500).json({ success: false, error: 'Failed to upvote feedback' });
  }
});

// Update feedback (owner or admin only)
router.patch('/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({ success: false, error: 'Feedback not found' });
    }

    const user = await User.findById(userId);
    const isOwner = feedback.userId.toString() === userId;
    const isAdmin = user?.userType === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ success: false, error: 'Not authorized to update this feedback' });
    }

    // Only owner can update title/description, admin can update status/priority/notes
    if (isOwner && !isAdmin) {
      feedback.title = req.body.title || feedback.title;
      feedback.description = req.body.description || feedback.description;
    } else if (isAdmin) {
      feedback.status = req.body.status || feedback.status;
      feedback.priority = req.body.priority || feedback.priority;
      feedback.adminNotes = req.body.adminNotes || feedback.adminNotes;
      feedback.assignedTo = req.body.assignedTo || feedback.assignedTo;

      if (req.body.status === 'resolved' && !feedback.resolvedAt) {
        feedback.resolvedAt = new Date();
      }
    }

    feedback.updatedAt = new Date();
    await feedback.save();
    await feedback.populate('userId', 'username email');

    // Emit socket event for real-time update
    try {
      emitFeedbackUpdated(feedback);
    } catch (socketErr) {
      console.error('Socket emit error:', socketErr);
    }

    res.json({
      success: true,
      data: feedback,
    });
  } catch (err: any) {
    console.error('Error updating feedback:', err);
    res.status(500).json({ success: false, error: 'Failed to update feedback' });
  }
});

// Delete feedback (owner or admin only)
router.delete('/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({ success: false, error: 'Feedback not found' });
    }

    const user = await User.findById(userId);
    const isOwner = feedback.userId.toString() === userId;
    const isAdmin = user?.userType === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ success: false, error: 'Not authorized to delete this feedback' });
    }

    await Feedback.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Feedback deleted',
    });
  } catch (err) {
    console.error('Error deleting feedback:', err);
    res.status(500).json({ success: false, error: 'Failed to delete feedback' });
  }
});

// Get feedback statistics
router.get('/stats/summary', async (req: Request, res: Response) => {
  try {
    const total = await Feedback.countDocuments();
    const open = await Feedback.countDocuments({ status: 'open' });
    const inProgress = await Feedback.countDocuments({ status: 'in-progress' });
    const resolved = await Feedback.countDocuments({ status: 'resolved' });

    const byCategory = await Feedback.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
    ]);

    res.json({
      success: true,
      data: {
        total,
        byStatus: { open, inProgress, resolved },
        byCategory: byCategory.reduce((acc: any, item: any) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
      },
    });
  } catch (err) {
    console.error('Error fetching feedback stats:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch statistics' });
  }
});

export default router;
