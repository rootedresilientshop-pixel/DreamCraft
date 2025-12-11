import express, { Request, Response } from 'express';
import User from '../models/User';
import Idea from '../models/Idea';
import Collaboration from '../models/Collaboration';
import { authenticateToken } from '../middleware/auth';
import { sendNotification } from '../services/notificationService';

const router = express.Router();

// Search collaborators by skill or username (public)
router.get('/', async (req: Request, res: Response) => {
  try {
    const q = (req.query.q as string) || '';
    const skill = (req.query.skill as string) || '';
    const filter: any = { userType: 'collaborator' };
    if (q) {
      filter.$or = [
        { username: { $regex: q, $options: 'i' } },
        { 'profile.firstName': { $regex: q, $options: 'i' } },
        { 'profile.lastName': { $regex: q, $options: 'i' } },
      ];
    }
    if (skill) {
      filter['profile.skills'] = { $in: [skill] };
    }

    const users = await User.find(filter).limit(50).select('-password').lean();
    res.json({ success: true, data: users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to list collaborators' });
  }
});

// Get current user's profile
router.get('/me', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const user = await User.findById(userId).select('-password').lean();
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ success: true, data: user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to get profile' });
  }
});

// Invite collaborator (authenticated)
router.post('/invite', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { collaboratorId, ideaId, role, message } = req.body;

    // Validate input
    if (!collaboratorId || !ideaId) {
      return res.status(400).json({ success: false, error: 'collaboratorId and ideaId required' });
    }

    // Check if collaborator exists
    const collaborator = await User.findById(collaboratorId);
    if (!collaborator) {
      return res.status(404).json({ success: false, error: 'Collaborator not found' });
    }

    // Check if idea exists and user is authorized
    const idea = await Idea.findById(ideaId);
    if (!idea) {
      return res.status(404).json({ success: false, error: 'Idea not found' });
    }

    const isCreator = idea.creatorId.toString() === userId;

    // Check for existing active invitation or collaboration
    const existing = await Collaboration.findOne({
      ideaId,
      collaboratorId,
      status: { $in: ['pending', 'accepted'] },
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        error: 'Invitation already exists or collaboration is active',
      });
    }

    // Create collaboration invitation
    const collaboration = await Collaboration.create({
      ideaId,
      creatorId: idea.creatorId,
      collaboratorId,
      status: 'pending',
      role: role || 'other',
      message,
      invitedBy: isCreator ? 'creator' : 'collaborator',
    });

    // Send notification to target user
    const targetUserId = isCreator ? collaboratorId : idea.creatorId.toString();
    const currentUser = await User.findById(userId);

    await sendNotification({
      userId: targetUserId,
      type: 'collaboration_invite',
      title: 'Collaboration Invitation',
      message: isCreator
        ? `You've been invited to collaborate on "${idea.title}"`
        : `${currentUser?.username} wants to collaborate on your idea "${idea.title}"`,
      actionUrl: `/ideas/${ideaId}`,
      metadata: {
        ideaId,
        inviteId: collaboration._id.toString(),
      },
    });

    res.json({
      success: true,
      data: collaboration,
    });
  } catch (err: any) {
    console.error('Invite error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get user's invitations (received or sent)
router.get('/invitations', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { type } = req.query; // 'received', 'sent', or all

    let query: any;
    if (type === 'received') {
      query = { collaboratorId: userId };
    } else if (type === 'sent') {
      query = { creatorId: userId, invitedBy: 'creator' };
    } else {
      query = {
        $or: [{ collaboratorId: userId }, { creatorId: userId }],
      };
    }

    const invitations = await Collaboration.find(query)
      .populate('ideaId', 'title description category')
      .populate('creatorId', 'username profile')
      .populate('collaboratorId', 'username profile')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: invitations });
  } catch (err: any) {
    console.error('Get invitations error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Accept collaboration invitation
router.patch('/invitations/:id/accept', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const collaboration = await Collaboration.findById(req.params.id);

    if (!collaboration) {
      return res.status(404).json({ success: false, error: 'Invitation not found' });
    }

    // Only collaborator can accept
    if (collaboration.collaboratorId.toString() !== userId) {
      return res.status(403).json({ success: false, error: 'Not authorized' });
    }

    if (collaboration.status !== 'pending') {
      return res.status(400).json({ success: false, error: 'Invitation already responded to' });
    }

    collaboration.status = 'accepted';
    collaboration.respondedAt = new Date();
    await collaboration.save();

    // Update idea status to in-collaboration
    await Idea.findByIdAndUpdate(collaboration.ideaId, {
      status: 'in-collaboration',
    });

    // Notify creator
    const idea = await Idea.findById(collaboration.ideaId);
    const collaborator = await User.findById(collaboration.collaboratorId);
    await sendNotification({
      userId: collaboration.creatorId.toString(),
      type: 'success',
      title: 'Collaboration Accepted',
      message: `${collaborator?.username} accepted your collaboration invitation for "${idea?.title}"!`,
      actionUrl: `/ideas/${collaboration.ideaId}`,
      metadata: { ideaId: collaboration.ideaId },
    });

    res.json({ success: true, data: collaboration });
  } catch (err: any) {
    console.error('Accept error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Reject collaboration invitation
router.patch('/invitations/:id/reject', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const collaboration = await Collaboration.findById(req.params.id);

    if (!collaboration) {
      return res.status(404).json({ success: false, error: 'Invitation not found' });
    }

    // Only collaborator can reject
    if (collaboration.collaboratorId.toString() !== userId) {
      return res.status(403).json({ success: false, error: 'Not authorized' });
    }

    if (collaboration.status !== 'pending') {
      return res.status(400).json({ success: false, error: 'Invitation already responded to' });
    }

    collaboration.status = 'rejected';
    collaboration.respondedAt = new Date();
    await collaboration.save();

    res.json({ success: true, data: collaboration });
  } catch (err: any) {
    console.error('Reject error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get user's active collaborations
router.get('/my-collaborations', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;

    const collaborations = await Collaboration.find({
      collaboratorId: userId,
      status: 'accepted',
    })
      .populate('ideaId', 'title description category status')
      .populate('creatorId', 'username profile')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: collaborations });
  } catch (err: any) {
    console.error('Get collaborations error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
