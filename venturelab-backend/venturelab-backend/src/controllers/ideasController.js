const Idea = require('../models/Idea');

// Create new idea
exports.create = async (req, res) => {
  try {
    const { title, category, problem, solution, targetAudience, monetization, pricingModel } = req.body;
    
    // Validate required fields
    if (!title || !category || !problem || !solution) {
      return res.status(400).json({ 
        error: 'Title, category, problem, and solution are required' 
      });
    }
    
    const idea = await Idea.create({
      userId: req.user.id,
      title,
      category,
      problem,
      solution,
      targetAudience,
      monetization,
      pricingModel
    });
    
    res.status(201).json({
      message: 'Idea created successfully',
      idea
    });
  } catch (error) {
    console.error('Create idea error:', error);
    res.status(500).json({ error: 'Failed to create idea' });
  }
};

// Get idea by ID
exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const idea = await Idea.findById(id);
    
    if (!idea) {
      return res.status(404).json({ error: 'Idea not found' });
    }
    
    // Increment view count if not the owner
    if (!req.user || req.user.id !== idea.user_id) {
      await Idea.incrementViews(id);
    }
    
    res.json({ idea });
  } catch (error) {
    console.error('Get idea error:', error);
    res.status(500).json({ error: 'Failed to get idea' });
  }
};

// List ideas with filters
exports.list = async (req, res) => {
  try {
    const {
      category,
      status,
      minScore,
      isForSale,
      isSeekingCollaborators,
      limit,
      offset,
      sortBy,
      sortOrder
    } = req.query;
    
    const result = await Idea.list({
      category,
      status,
      minScore: minScore ? parseInt(minScore) : undefined,
      isForSale: isForSale === 'true',
      isSeekingCollaborators: isSeekingCollaborators === 'true',
      limit: limit ? parseInt(limit) : 20,
      offset: offset ? parseInt(offset) : 0,
      sortBy,
      sortOrder
    });
    
    res.json(result);
  } catch (error) {
    console.error('List ideas error:', error);
    res.status(500).json({ error: 'Failed to list ideas' });
  }
};

// Get user's own ideas
exports.getUserIdeas = async (req, res) => {
  try {
    const { status } = req.query;
    
    const ideas = await Idea.getUserIdeas(req.user.id, status);
    
    res.json({
      ideas,
      count: ideas.length
    });
  } catch (error) {
    console.error('Get user ideas error:', error);
    res.status(500).json({ error: 'Failed to get ideas' });
  }
};

// Update idea
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const idea = await Idea.update(id, req.user.id, updates);
    
    if (!idea) {
      return res.status(404).json({ error: 'Idea not found or unauthorized' });
    }
    
    res.json({
      message: 'Idea updated successfully',
      idea
    });
  } catch (error) {
    console.error('Update idea error:', error);
    res.status(500).json({ error: 'Failed to update idea' });
  }
};

// Delete idea
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    
    const idea = await Idea.delete(id, req.user.id);
    
    if (!idea) {
      return res.status(404).json({ error: 'Idea not found or unauthorized' });
    }
    
    res.json({ message: 'Idea deleted successfully' });
  } catch (error) {
    console.error('Delete idea error:', error);
    res.status(500).json({ error: 'Failed to delete idea' });
  }
};

// Get leaderboard (top ideas)
exports.leaderboard = async (req, res) => {
  try {
    const { category, limit } = req.query;
    
    const ideas = await Idea.getTopIdeas(
      limit ? parseInt(limit) : 10,
      category
    );
    
    res.json({
      ideas,
      count: ideas.length
    });
  } catch (error) {
    console.error('Leaderboard error:', error);
    res.status(500).json({ error: 'Failed to get leaderboard' });
  }
};

// Search ideas
exports.search = async (req, res) => {
  try {
    const { q, limit } = req.query;
    
    if (!q) {
      return res.status(400).json({ error: 'Search query required' });
    }
    
    const ideas = await Idea.search(q, limit ? parseInt(limit) : 20);
    
    res.json({
      ideas,
      count: ideas.length,
      query: q
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Search failed' });
  }
};

// Publish idea (change from draft to active)
exports.publish = async (req, res) => {
  try {
    const { id } = req.params;
    
    const idea = await Idea.update(id, req.user.id, { status: 'active' });
    
    if (!idea) {
      return res.status(404).json({ error: 'Idea not found or unauthorized' });
    }
    
    res.json({
      message: 'Idea published successfully',
      idea
    });
  } catch (error) {
    console.error('Publish idea error:', error);
    res.status(500).json({ error: 'Failed to publish idea' });
  }
};

// Mark idea as sold
exports.markAsSold = async (req, res) => {
  try {
    const { id } = req.params;
    
    const idea = await Idea.update(id, req.user.id, { 
      status: 'sold',
      is_for_sale: false 
    });
    
    if (!idea) {
      return res.status(404).json({ error: 'Idea not found or unauthorized' });
    }
    
    res.json({
      message: 'Idea marked as sold',
      idea
    });
  } catch (error) {
    console.error('Mark as sold error:', error);
    res.status(500).json({ error: 'Failed to update idea' });
  }
};
