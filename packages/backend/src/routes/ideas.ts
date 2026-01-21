import express, { Request, Response } from 'express';
import Idea from '../models/Idea';
import Message from '../models/Message';
import Collaboration from '../models/Collaboration';
import User from '../models/User';
import { authenticateToken } from '../middleware/auth';
import { generateNDAText } from '../services/aiService';
import DeterministicEvaluationService from '../services/deterministicEvaluationService';

const router = express.Router();

// Create idea (authenticated)
router.post('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const payload = req.body;
    const idea = new Idea({ ...payload, creatorId: userId, status: 'draft', visibility: payload.visibility || 'private' });
    await idea.save();
    res.status(201).json({ success: true, data: idea });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Failed to create idea' });
  }
});

// List ideas (public)
router.get('/', async (req: Request, res: Response) => {
  try {
    const ideas = await Idea.find({ visibility: 'public' }).sort({ createdAt: -1 }).limit(50).lean();
    res.json({ success: true, data: ideas });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Failed to list ideas' });
  }
});

// Get leaderboard - top rated ideas
router.get('/leaderboard/top', async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 20;
    const ideas = await Idea.find({
      visibility: 'public',
      'valuation.aiScore': { $exists: true }
    })
    .sort({ 'valuation.aiScore': -1, createdAt: -1 })
    .limit(limit)
    .populate('creatorId', 'username profile.firstName profile.lastName profile.avatar')
    .lean();

    res.json({ success: true, data: ideas });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Failed to fetch leaderboard' });
  }
});

// Get user's ideas (authenticated)
router.get('/my-ideas', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const ideas = await Idea.find({ creatorId: userId }).sort({ createdAt: -1 });

    // Add engagement stats for each idea
    const ideasWithStats = await Promise.all(
      ideas.map(async (idea) => {
        const pendingRequests = await Collaboration.countDocuments({
          ideaId: idea._id,
          status: 'pending',
          invitedBy: 'collaborator',
        });

        const activeCollaborators = await Collaboration.countDocuments({
          ideaId: idea._id,
          status: 'accepted',
        });

        return {
          ...idea.toObject(),
          stats: {
            pendingRequests,
            activeCollaborators,
          },
        };
      })
    );

    res.json({ success: true, data: ideasWithStats });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Failed to list ideas' });
  }
});

// Get idea by id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const idea = await Idea.findById(req.params.id).lean();
    if (!idea) return res.status(404).json({ success: false, error: 'Idea not found' });
    res.json({ success: true, data: idea });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Failed to get idea' });
  }
});

// Update idea (authenticated + owner)
router.put('/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const idea = await Idea.findById(req.params.id);
    if (!idea) return res.status(404).json({ success: false, error: 'Idea not found' });
    if (idea.creatorId.toString() !== userId) return res.status(403).json({ success: false, error: 'Not authorized' });
    Object.assign(idea, req.body);
    idea.updatedAt = new Date();
    await idea.save();
    res.json({ success: true, data: idea });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Failed to update idea' });
  }
});

// Delete idea (authenticated + owner)
router.delete('/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const idea = await Idea.findById(req.params.id);
    if (!idea) return res.status(404).json({ success: false, error: 'Idea not found' });
    if (idea.creatorId.toString() !== userId) return res.status(403).json({ success: false, error: 'Not authorized' });
    await idea.deleteOne();
    res.json({ success: true, message: 'Idea deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Failed to delete idea' });
  }
});

// Make all user ideas public (testing endpoint)
router.post('/make-public/all', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const result = await Idea.updateMany(
      { creatorId: userId },
      { visibility: 'public' }
    );
    res.json({ success: true, message: `Updated ${result.modifiedCount} ideas to public` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Failed to make ideas public' });
  }
});

// Create sample public ideas (dev/testing endpoint)
router.post('/dev/create-samples', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const sampleIdeas = [
      {
        title: 'AI-Powered Meal Planner',
        description: 'An intelligent app that uses machine learning to create personalized meal plans based on dietary preferences, allergies, and budget constraints.',
        category: 'Technology',
        visibility: 'public',
        creatorId: userId,
        status: 'draft'
      },
      {
        title: 'Sustainable Fashion E-Commerce Platform',
        description: 'A marketplace connecting eco-friendly fashion brands with conscious consumers, featuring carbon footprint tracking for each purchase.',
        category: 'E-Commerce',
        visibility: 'public',
        creatorId: userId,
        status: 'draft'
      },
      {
        title: 'Mental Health Support App',
        description: 'Mobile app providing anonymous peer support, guided meditation, and access to licensed therapists for mental wellness.',
        category: 'Healthcare',
        visibility: 'public',
        creatorId: userId,
        status: 'draft'
      },
      {
        title: 'Blockchain-Based Supply Chain Tracker',
        description: 'Transparent supply chain solution using blockchain to track products from manufacturer to consumer, ensuring authenticity.',
        category: 'Technology',
        visibility: 'public',
        creatorId: userId,
        status: 'draft'
      }
    ];

    const created = await Idea.insertMany(sampleIdeas);
    res.json({ success: true, message: `Created ${created.length} sample ideas`, data: created });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Failed to create sample ideas' });
  }
});

// Valuation endpoint - generates deterministic valuation and saves to idea
router.post('/:id/valuate', authenticateToken, async (req: Request, res: Response) => {
  try {
    const idea = await Idea.findById(req.params.id).populate('creatorId');
    if (!idea) return res.status(404).json({ success: false, error: 'Idea not found' });

    // Get creator profile for evaluation context
    const creator = await User.findById(idea.creatorId);
    const creatorProfile = creator?.profile as any;

    // Run deterministic evaluation
    const evaluation = DeterministicEvaluationService.evaluate({
      title: (idea.title as string) || '',
      description: (idea.description as string) || '',
      category: (idea.category as string) || '',
      creatorProfile: creatorProfile ? {
        firstName: (creatorProfile.firstName as string) || undefined,
        lastName: (creatorProfile.lastName as string) || undefined,
        skills: (creatorProfile.skills as string[]) || undefined,
      } : undefined,
    });

    // Save valuation to idea
    idea.valuation = {
      estimatedValue: evaluation.valuation.mid,
      aiScore: evaluation.overallScore,
      marketSize: 'Estimated based on category and description',
      confidence: Math.min(85, 50 + evaluation.scoreBreakdown.problemClarity * 0.3),
    } as any;

    // Store detailed evaluation for future reference
    (idea as any).evaluation = evaluation;
    await idea.save();

    res.json({
      success: true,
      data: idea.valuation,
      evaluation: {
        overallScore: evaluation.overallScore,
        scoreBreakdown: evaluation.scoreBreakdown,
        valuationRange: evaluation.valuation,
        suggestions: evaluation.suggestions,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Valuation failed' });
  }
});

// Validation and Scoring endpoint (using deterministic evaluation)
router.post('/:id/validate-and-score', authenticateToken, async (req: Request, res: Response) => {
  try {
    const idea = await Idea.findById(req.params.id).populate('creatorId');
    if (!idea) return res.status(404).json({ success: false, error: 'Idea not found' });

    // Get creator profile for evaluation context
    const creator = await User.findById(idea.creatorId);
    const creatorProfile = creator?.profile as any;

    // Run deterministic evaluation
    const evaluation = DeterministicEvaluationService.evaluate({
      title: (idea.title as string) || '',
      description: (idea.description as string) || '',
      category: (idea.category as string) || '',
      creatorProfile: creatorProfile ? {
        firstName: (creatorProfile.firstName as string) || undefined,
        lastName: (creatorProfile.lastName as string) || undefined,
        skills: (creatorProfile.skills as string[]) || undefined,
      } : undefined,
    });

    res.json({
      success: true,
      data: {
        score: evaluation.overallScore,
        breakdown: evaluation.scoreBreakdown,
        valuation: evaluation.valuation,
        suggestions: evaluation.suggestions,
        risks: evaluation.riskFactors,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Validation failed' });
  }
});

// Suggestions endpoint (for partial ideas during creation - using deterministic evaluation)
router.post('/ai-suggestions', authenticateToken, async (req: Request, res: Response) => {
  try {
    const partialIdea = {
      title: req.body.title || '',
      description: req.body.description || '',
      category: req.body.category || '',
    };

    // Run evaluation to get suggestions
    const evaluation = DeterministicEvaluationService.evaluate(partialIdea);

    res.json({
      success: true,
      data: {
        suggestions: evaluation.suggestions,
        riskFactors: evaluation.riskFactors,
        preliminaryScore: evaluation.overallScore,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Failed to generate suggestions' });
  }
});

// NDA generation endpoint
router.get('/:id/nda', authenticateToken, async (req: Request, res: Response) => {
  try {
    const idea = await Idea.findById(req.params.id).populate('creatorId');
    if (!idea) return res.status(404).json({ success: false, error: 'Idea not found' });
    const creatorName = (idea as any).creatorId?.profile?.firstName || 'Creator';
    const nda = generateNDAText(creatorName, (idea as any).title || 'Untitled');
    res.setHeader('Content-Type', 'text/plain');
    res.send(nda);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Failed to generate NDA' });
  }
});

// GET - Get idea discussion messages
router.get('/:id/messages', authenticateToken, async (req: Request, res: Response) => {
  try {
    const messages = await Message.find({
      threadType: 'idea',
      ideaId: req.params.id
    })
    .populate('fromUserId', 'username profile')
    .sort({ createdAt: 1 })
    .limit(200);

    res.json({ success: true, data: messages });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Failed to get messages' });
  }
});

export default router;
