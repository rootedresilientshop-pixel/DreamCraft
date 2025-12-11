import express, { Request, Response } from 'express';
import { authenticateToken } from '../middleware/auth';
import User from '../models/User';
import Idea from '../models/Idea';
import Collaboration from '../models/Collaboration';

const router = express.Router();

interface AuthRequest extends Request {
  userId?: string;
}

// GET /api/users/me - Get current user profile
router.get('/me', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    res.json({ success: true, data: user });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PATCH /api/users/me - Update profile
router.patch('/me', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { firstName, lastName, bio, skills, location } = req.body;

    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        $set: {
          'profile.firstName': firstName,
          'profile.lastName': lastName,
          'profile.bio': bio,
          'profile.skills': skills,
          'profile.location': location,
        },
      },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({ success: true, data: user });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/users/dashboard - Get dashboard stats
router.get('/dashboard', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    // Creator stats
    const myIdeasCount = await Idea.countDocuments({ creatorId: req.userId });

    const pendingCollaborationRequests = await Collaboration.countDocuments({
      creatorId: req.userId,
      status: 'pending',
      invitedBy: 'collaborator',
    });

    // Collaborator stats
    const myCollaborationsCount = await Collaboration.countDocuments({
      collaboratorId: req.userId,
      status: 'accepted',
    });

    const pendingInvitationsCount = await Collaboration.countDocuments({
      collaboratorId: req.userId,
      status: 'pending',
    });

    res.json({
      success: true,
      data: {
        myIdeasCount,
        pendingCollaborationRequests,
        myCollaborationsCount,
        pendingInvitationsCount,
        userType: user.userType,
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
