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

// POST /api/users/run-migration - One-time migration endpoint (for Render free tier workaround)
// This endpoint runs the database migration to add onboarding fields
// Protected by simple token check (deploy-time secret)
router.post('/run-migration', async (req: Request, res: Response) => {
  try {
    // Simple security check - require a migration token
    const migrationToken = req.headers['x-migration-token'] as string;
    const expectedToken = process.env.MIGRATION_TOKEN || 'dev-migration-token';

    if (migrationToken !== expectedToken) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized: Invalid migration token',
      });
    }

    console.log('🚀 Starting migration via HTTP endpoint...');

    const usersCollection = User.collection;

    // Count existing users
    const totalUsers = await usersCollection.countDocuments({});
    console.log(`📈 Found ${totalUsers} existing users`);

    // Step 1: Add missing profile.profileCompleted field
    console.log('📝 Step 1: Adding profile.profileCompleted field...');
    const result1 = await usersCollection.updateMany(
      { 'profile.profileCompleted': { $exists: false } },
      { $set: { 'profile.profileCompleted': true } }
    );
    console.log(`✅ Updated ${result1.modifiedCount} documents`);

    // Step 2: Set primary skill for collaborators
    console.log('📝 Step 2: Setting primary skill for collaborators...');
    const collaborators = await usersCollection
      .find({
        userType: 'collaborator',
        'profile.skills': { $exists: true, $ne: [] },
        'profile.primarySkill': { $exists: false },
      })
      .toArray() as any[];

    let collaboratorsUpdated = 0;
    for (const user of collaborators) {
      if (user.profile?.skills && user.profile.skills.length > 0) {
        const primarySkill = user.profile.skills[0];
        await usersCollection.updateOne(
          { _id: user._id },
          { $set: { 'profile.primarySkill': primarySkill } }
        );
        collaboratorsUpdated++;
      }
    }
    console.log(`✅ Updated ${collaboratorsUpdated} collaborators`);

    // Step 3: Add onboarding object
    console.log('📝 Step 3: Adding onboarding tracking object...');
    const result3 = await usersCollection.updateMany(
      { onboarding: { $exists: false } },
      {
        $set: {
          onboarding: {
            collaboratorWizardCompleted: true,
            creatorIntroShown: true,
            completedAt: new Date(),
          },
        },
      }
    );
    console.log(`✅ Updated ${result3.modifiedCount} documents`);

    // Verification
    const usersWithoutProfileCompleted = await usersCollection.countDocuments({
      'profile.profileCompleted': { $exists: false },
    });
    const usersWithoutOnboarding = await usersCollection.countDocuments({
      onboarding: { $exists: false },
    });

    if (usersWithoutProfileCompleted === 0 && usersWithoutOnboarding === 0) {
      console.log('✅ Migration completed successfully!');
      res.json({
        success: true,
        message: 'Migration completed successfully',
        summary: {
          totalUsers,
          profileCompletedUpdated: result1.modifiedCount,
          collaboratorsWithPrimarySkill: collaboratorsUpdated,
          onboardingObjectsAdded: result3.modifiedCount,
        },
      });
    } else {
      res.status(400).json({
        success: false,
        error: 'Migration verification failed',
        details: {
          usersWithoutProfileCompleted,
          usersWithoutOnboarding,
        },
      });
    }
  } catch (err: any) {
    console.error('❌ Migration failed:', err);
    res.status(500).json({
      success: false,
      error: 'Migration failed: ' + err.message,
    });
  }
});

export default router;
