import express, { Request, Response } from 'express';
import Template from '../models/Template';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Get all available templates (public)
router.get('/', async (req: Request, res: Response) => {
  try {
    const templates = await Template.find({ isDefault: true }).sort({ category: 1 });
    res.json({ success: true, data: templates });
  } catch (err: any) {
    console.error('Get templates error:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch templates' });
  }
});

// Get single template by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const template = await Template.findById(req.params.id);
    if (!template) {
      return res.status(404).json({ success: false, error: 'Template not found' });
    }
    res.json({ success: true, data: template });
  } catch (err: any) {
    console.error('Get template error:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch template' });
  }
});

// Get templates by category
router.get('/category/:category', async (req: Request, res: Response) => {
  try {
    const templates = await Template.find({
      category: req.params.category,
      isDefault: true
    }).sort({ name: 1 });
    res.json({ success: true, data: templates });
  } catch (err: any) {
    console.error('Get templates by category error:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch templates' });
  }
});

// Create template (admin only)
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, description, icon, category, sections, isDefault } = req.body;

    if (!name || !description || !category || !sections) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: name, description, category, sections'
      });
    }

    const template = await Template.create({
      name,
      description,
      icon: icon || '💡',
      category,
      sections,
      isDefault: isDefault || false,
    });

    res.status(201).json({ success: true, data: template });
  } catch (err: any) {
    console.error('Create template error:', err);
    res.status(500).json({ success: false, error: err.message || 'Failed to create template' });
  }
});

export default router;
