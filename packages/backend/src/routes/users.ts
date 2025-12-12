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
    const { firstName, lastName, bio, skills, primarySkill, location, profileCompleted } = req.body;

    // Validation: if primarySkill is provided, it must be in skills array
    if (primarySkill && skills && !skills.includes(primarySkill)) {
      return res.status(400).json({
        success: false,
        error: 'Primary skill must be included in skills array',
      });
    }

    const updateData: any = {};

    if (firstName !== undefined) updateData['profile.firstName'] = firstName;
    if (lastName !== undefined) updateData['profile.lastName'] = lastName;
    if (bio !== undefined) updateData['profile.bio'] = bio;
    if (skills !== undefined) updateData['profile.skills'] = skills;
    if (primarySkill !== undefined) updateData['profile.primarySkill'] = primarySkill;
    if (location !== undefined) updateData['profile.location'] = location;
    if (profileCompleted !== undefined) updateData['profile.profileCompleted'] = profileCompleted;

    const user = await User.findByIdAndUpdate(
      req.userId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({ success: true, data: user });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/users/complete-onboarding - Mark onboarding as complete
router.post('/complete-onboarding', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { type } = req.body; // 'collaborator-wizard' or 'creator-intro'

    if (!type || !['collaborator-wizard', 'creator-intro'].includes(type)) {
      return res.status(400).json({
        success: false,
        error: "Invalid type. Must be 'collaborator-wizard' or 'creator-intro'",
      });
    }

    const updateData: any = {
      'updatedAt': new Date(),
    };

    if (type === 'collaborator-wizard') {
      updateData['onboarding.collaboratorWizardCompleted'] = true;
      updateData['onboarding.completedAt'] = new Date();
      updateData['profile.profileCompleted'] = true;
    } else if (type === 'creator-intro') {
      updateData['onboarding.creatorIntroShown'] = true;
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      { $set: updateData },
      { new: true }
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
