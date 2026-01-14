import mongoose from 'mongoose';

const ideaSchema = new mongoose.Schema({
  creatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: String,
  documentation: {
    problemStatement: String,
    targetMarket: String,
    solutionOverview: String,
    uniqueValue: String,
    competitors: String,
    businessModel: String,
  },
  valuation: {
    estimatedValue: Number,
    aiScore: Number,
    marketSize: String,
    confidence: Number,
  },
  status: { type: String, enum: ['draft', 'published', 'sold', 'in-collaboration'], default: 'draft' },
  visibility: { type: String, enum: ['private', 'public'], default: 'private' },
  price: Number,
  nda: {
    required: { type: Boolean, default: true },
    hash: String,
  },
  // Template Support
  templateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Template',
  },
  sections: {
    type: Map,
    of: String, // Maps section ID to section content
    default: new Map(),
  },
  completionScore: {
    type: Number,
    default: 0, // 0-100 based on sections filled
  },
  lastAutoSaveAt: Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model('Idea', ideaSchema);
