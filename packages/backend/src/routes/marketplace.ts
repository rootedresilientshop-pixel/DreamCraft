import express, { Request, Response } from 'express';
import Idea from '../models/Idea';

const router = express.Router();

// List marketplace ideas (public) with optional search/filter
router.get('/', async (req: Request, res: Response) => {
  try {
    const q = (req.query.q as string) || '';
    const filter: any = { visibility: 'public' };
    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
      ];
    }
    const ideas = await Idea.find(filter).sort({ createdAt: -1 }).limit(100).lean();
    res.json({ success: true, data: ideas });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to list marketplace ideas' });
  }
});

// Get marketplace idea detail
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const idea = await Idea.findById(req.params.id).lean();
    if (!idea || idea.visibility !== 'public') return res.status(404).json({ error: 'Idea not found' });
    res.json({ success: true, data: idea });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to get idea' });
  }
});

export default router;
