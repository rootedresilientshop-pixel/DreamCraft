const express = require('express');
const router = express.Router();
const ideasController = require('../controllers/ideasController');
const { authenticate, optionalAuth } = require('../middleware/auth');
const { body } = require('express-validator');
const { validate } = require('../middleware/validator');

// Validation middleware
const createIdeaValidation = [
  body('title').trim().isLength({ min: 5, max: 255 }),
  body('category').isIn(['b2b_saas', 'ecommerce', 'fintech', 'health', 'edtech', 'consumer', 'transportation']),
  body('problem').trim().isLength({ min: 20, max: 5000 }),
  body('solution').trim().isLength({ min: 20, max: 5000 }),
  body('targetAudience').optional().trim().isLength({ max: 255 }),
  body('monetization').optional().trim().isLength({ max: 2000 }),
  body('pricingModel').optional().trim().isLength({ max: 100 }),
  validate
];

// Public routes (with optional auth)
router.get('/', optionalAuth, ideasController.list);
router.get('/leaderboard', ideasController.leaderboard);
router.get('/search', ideasController.search);
router.get('/:id', optionalAuth, ideasController.getById);

// Protected routes
router.post('/', authenticate, createIdeaValidation, ideasController.create);
router.get('/user/my-ideas', authenticate, ideasController.getUserIdeas);
router.put('/:id', authenticate, ideasController.update);
router.delete('/:id', authenticate, ideasController.delete);
router.post('/:id/publish', authenticate, ideasController.publish);
router.post('/:id/mark-sold', authenticate, ideasController.markAsSold);

module.exports = router;
