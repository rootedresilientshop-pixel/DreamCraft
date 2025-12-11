import express, { Request, Response } from 'express';
import Idea from '../models/Idea';
import Message from '../models/Message';
import Collaboration from '../models/Collaboration';
import { authenticateToken } from '../middleware/auth';
import { generateIdeaValuation, generateNDAText } from '../services/aiService';

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
    res.status(500).json({ error: 'Failed to create idea' });
  }
});

// List ideas (public)
router.get('/', async (req: Request, res: Response) => {
  try {
    const ideas = await Idea.find({ visibility: 'public' }).sort({ createdAt: -1 }).limit(50).lean();
    res.json({ success: true, data: ideas });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to list ideas' });
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
    res.status(500).json({ error: 'Failed to list ideas' });
  }
});

// Get idea by id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const idea = await Idea.findById(req.params.id).lean();
    if (!idea) return res.status(404).json({ error: 'Idea not found' });
    res.json({ success: true, data: idea });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to get idea' });
  }
});

// Update idea (authenticated + owner)
router.put('/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const idea = await Idea.findById(req.params.id);
    if (!idea) return res.status(404).json({ error: 'Idea not found' });
    if (idea.creatorId.toString() !== userId) return res.status(403).json({ error: 'Not authorized' });
    Object.assign(idea, req.body);
    idea.updatedAt = new Date();
    await idea.save();
    res.json({ success: true, data: idea });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update idea' });
  }
});

// Delete idea (authenticated + owner)
router.delete('/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const idea = await Idea.findById(req.params.id);
    if (!idea) return res.status(404).json({ error: 'Idea not found' });
    if (idea.creatorId.toString() !== userId) return res.status(403).json({ error: 'Not authorized' });
    await idea.deleteOne();
    res.json({ success: true, message: 'Idea deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete idea' });
  }
});

// Valuation endpoint - generates AI valuation and saves to idea
router.post('/:id/valuate', authenticateToken, async (req: Request, res: Response) => {
  try {
    const idea = await Idea.findById(req.params.id);
    if (!idea) return res.status(404).json({ error: 'Idea not found' });

    const valuation = await generateIdeaValuation(idea);
    idea.valuation = {
      estimatedValue: valuation.estimatedValue || idea.valuation?.estimatedValue || 0,
      aiScore: valuation.aiScore || 0,
      marketSize: valuation.marketSize || 'Unknown',
      confidence: valuation.confidence || 0,
    } as any;
    await idea.save();

    res.json({ success: true, data: idea.valuation, analysis: valuation.analysis || null });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Valuation failed' });
  }
});

// NDA generation endpoint
router.get('/:id/nda', authenticateToken, async (req: Request, res: Response) => {
  try {
    const idea = await Idea.findById(req.params.id).populate('creatorId');
    if (!idea) return res.status(404).json({ error: 'Idea not found' });
    const creatorName = (idea as any).creatorId?.profile?.firstName || 'Creator';
    const nda = generateNDAText(creatorName, (idea as any).title || 'Untitled');
    res.setHeader('Content-Type', 'text/plain');
    res.send(nda);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to generate NDA' });
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
    res.status(500).json({ error: 'Failed to get messages' });
  }
});

export default router;
