import express, { Request, Response } from 'express';
import InviteCode from '../models/InviteCode';
import User from '../models/User';
import Collaboration from '../models/Collaboration';
import { authenticateToken } from '../middleware/auth';

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

// Apply auth middleware to all routes
router.use(authenticateToken);

// Create new invite code
router.post('/invite-codes', checkAdmin, async (req: Request, res: Response) => {
  try {
    const { maxUses, expiresAt, description } = req.body;
    const userId = (req as any).userId;

    // Generate unique invite code (format: BETA-XXXXXX)
    const generateCode = () => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let code = 'BETA-';
      for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return code;
    };

    const inviteCode = new InviteCode({
      code: generateCode(),
      createdBy: userId,
      maxUses: maxUses || -1,
      expiresAt: expiresAt ? new Date(expiresAt) : undefined,
      notes: description,
      isActive: true,
    });

    await inviteCode.save();

    res.status(201).json({
      success: true,
      data: inviteCode,
    });
  } catch (err: any) {
    console.error('Error creating invite code:', err);
    res.status(500).json({ success: false, error: 'Failed to create invite code' });
  }
});

// List all invite codes
router.get('/invite-codes', checkAdmin, async (_req: Request, res: Response) => {
  try {
    const codes = await InviteCode.find()
      .populate('createdBy', 'username email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: codes,
    });
  } catch (err) {
    console.error('Error fetching invite codes:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch invite codes' });
  }
});

// Get single invite code with usage details
router.get('/invite-codes/:id', checkAdmin, async (req: Request, res: Response) => {
  try {
    const code = await InviteCode.findById(req.params.id)
      .populate('createdBy', 'username email')
      .populate('usedBy.userId', 'username email createdAt');

    if (!code) {
      return res.status(404).json({ success: false, error: 'Invite code not found' });
    }

    res.json({
      success: true,
      data: code,
    });
  } catch (err) {
    console.error('Error fetching invite code:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch invite code' });
  }
});

// Deactivate invite code
router.patch('/invite-codes/:id/deactivate', checkAdmin, async (req: Request, res: Response) => {
  try {
    const code = await InviteCode.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!code) {
      return res.status(404).json({ success: false, error: 'Invite code not found' });
    }

    res.json({
      success: true,
      data: code,
    });
  } catch (err) {
    console.error('Error deactivating invite code:', err);
    res.status(500).json({ success: false, error: 'Failed to deactivate invite code' });
  }
});

// Get beta user statistics
router.get('/beta-users', checkAdmin, async (_req: Request, res: Response) => {
  try {
    const totalBetaUsers = await User.countDocuments({ betaAccess: true });
    const totalInviteCodes = await InviteCode.countDocuments();
    const activeInviteCodes = await InviteCode.countDocuments({ isActive: true });
    const totalRegistrations = await User.countDocuments();

    const recentUsers = await User.find({ betaAccess: true })
      .sort({ createdAt: -1 })
      .limit(10)
      .select('username email userType createdAt betaAccess');

    res.json({
      success: true,
      data: {
        totalBetaUsers,
        totalInviteCodes,
        activeInviteCodes,
        totalRegistrations,
        betaUserPercentage: totalRegistrations > 0 ? ((totalBetaUsers / totalRegistrations) * 100).toFixed(2) : 0,
        recentUsers,
      },
    });
  } catch (err) {
    console.error('Error fetching beta stats:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch statistics' });
  }
});

// Get overall platform statistics
router.get('/stats', checkAdmin, async (_req: Request, res: Response) => {
  try {
    const totalUsers = await User.countDocuments();
    const creators = await User.countDocuments({ userType: 'creator' });
    const collaborators = await User.countDocuments({ userType: 'collaborator' });
    const admins = await User.countDocuments({ userType: 'admin' });
    const totalCollaborations = await Collaboration.countDocuments();
    const activeCollaborations = await Collaboration.countDocuments({ status: 'accepted' });
    const totalBetaUsers = await User.countDocuments({ betaAccess: true });

    res.json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          creators,
          collaborators,
          admins,
          betaUsers: totalBetaUsers,
        },
        collaborations: {
          total: totalCollaborations,
          active: activeCollaborations,
          pending: await Collaboration.countDocuments({ status: 'pending' }),
          accepted: activeCollaborations,
        },
        timestamp: new Date(),
      },
    });
  } catch (err) {
    console.error('Error fetching platform stats:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch statistics' });
  }
});

export default router;
