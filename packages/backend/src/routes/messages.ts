import express, { Request, Response } from 'express';
import { authenticateToken } from '../middleware/auth';
import Message from '../models/Message';
import User from '../models/User';
import Idea from '../models/Idea';
import { sendNotification } from '../services/notificationService';
import { getIO } from '../services/socketService';

const router = express.Router();

interface AuthRequest extends Request {
  userId?: string;
}

// POST - Send a message (DM or idea discussion)
router.post('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { threadType, toUserId, ideaId, content, parentId } = req.body;

    if (threadType === 'dm' && !toUserId) {
      return res.status(400).json({ success: false, error: 'toUserId required for DMs' });
    }
    if (threadType === 'idea' && !ideaId) {
      return res.status(400).json({ success: false, error: 'ideaId required for idea threads' });
    }

    if (threadType === 'dm') {
      const recipient = await User.findById(toUserId);
      if (!recipient) {
        return res.status(404).json({ success: false, error: 'Recipient not found' });
      }
    } else {
      const idea = await Idea.findById(ideaId);
      if (!idea) {
        return res.status(404).json({ success: false, error: 'Idea not found' });
      }
    }

    const message = await Message.create({
      fromUserId: req.userId,
      threadType,
      toUserId,
      ideaId,
      content,
      parentId
    });

    await message.populate('fromUserId', 'username profile');

    const io = getIO();
    if (threadType === 'dm') {
      io.to(`user:${toUserId}`).emit('message', {
        id: message._id.toString(),
        from: message.fromUserId,
        content: message.content,
        threadType: 'dm',
        createdAt: message.createdAt
      });

      await sendNotification({
        userId: toUserId,
        type: 'message',
        title: 'New Message',
        message: `${(message.fromUserId as any).username} sent you a message`,
        actionUrl: `/messages/direct/${req.userId}`
      });
    } else {
      io.to(`idea:${ideaId}`).emit('idea-message', {
        ideaId,
        message: {
          id: message._id.toString(),
          from: message.fromUserId,
          content: message.content,
          createdAt: message.createdAt
        }
      });
    }

    res.json({ success: true, data: message });
  } catch (error: any) {
    console.error('Send message error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET - Get direct messages with a user
router.get('/direct/:userId', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const messages = await Message.find({
      threadType: 'dm',
      $or: [
        { fromUserId: req.userId, toUserId: req.params.userId },
        { fromUserId: req.params.userId, toUserId: req.userId }
      ]
    })
    .populate('fromUserId', 'username profile')
    .sort({ createdAt: 1 })
    .limit(100);

    await Message.updateMany(
      {
        threadType: 'dm',
        fromUserId: req.params.userId,
        toUserId: req.userId,
        read: false
      },
      { read: true }
    );

    res.json({ success: true, data: messages });
  } catch (error: any) {
    console.error('Get direct messages error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET - Get user's conversations
router.get('/conversations', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const messages = await Message.find({
      threadType: 'dm',
      $or: [
        { fromUserId: req.userId },
        { toUserId: req.userId }
      ]
    })
    .populate('fromUserId toUserId', 'username profile')
    .sort({ createdAt: -1 });

    const userMap = new Map();
    messages.forEach((msg: any) => {
      const otherUser = msg.fromUserId._id.toString() === req.userId
        ? msg.toUserId
        : msg.fromUserId;

      if (!userMap.has(otherUser._id.toString())) {
        userMap.set(otherUser._id.toString(), {
          user: otherUser,
          lastMessage: msg,
          unreadCount: 0
        });
      }
    });

    const conversations = Array.from(userMap.values());
    for (const conv of conversations) {
      const unreadCount = await Message.countDocuments({
        threadType: 'dm',
        fromUserId: conv.user._id,
        toUserId: req.userId,
        read: false
      });
      conv.unreadCount = unreadCount;
    }

    res.json({ success: true, data: conversations });
  } catch (error: any) {
    console.error('Get conversations error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
