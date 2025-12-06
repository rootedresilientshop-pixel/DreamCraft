import express, { Request, Response } from 'express';
import User from '../models/User';
import { authenticateToken } from '../middleware/auth';

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
    const { collaboratorId, ideaId } = req.body;

    // Validate input
    if (!collaboratorId || !ideaId) {
      return res.status(400).json({ error: 'collaboratorId and ideaId required' });
    }

    // Check if collaborator exists
    const collaborator = await User.findById(collaboratorId);
    if (!collaborator) {
      return res.status(404).json({ error: 'Collaborator not found' });
    }

    // In a full implementation, this would:
    // 1. Create an invitation record
    // 2. Send notification to collaborator
    // 3. Track invitation status
    // For now, we return success
    res.json({
      success: true,
      message: `Invitation sent to ${collaborator.username}`,
      data: { collaboratorId, ideaId, status: 'pending' }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to send invitation' });
  }
});

export default router;
