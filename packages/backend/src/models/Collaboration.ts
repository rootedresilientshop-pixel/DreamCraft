import mongoose from 'mongoose';

const collaborationSchema = new mongoose.Schema({
  ideaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Idea',
    required: true,
  },
  creatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  collaboratorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'cancelled'],
    default: 'pending',
  },
  role: {
    type: String,
    enum: ['developer', 'designer', 'marketer', 'business', 'other'],
    default: 'other',
  },
  message: String,
  invitedBy: {
    type: String,
    enum: ['creator', 'collaborator'],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  respondedAt: Date,
});

// Indexes for efficient querying
collaborationSchema.index({ ideaId: 1, collaboratorId: 1 });
collaborationSchema.index({ collaboratorId: 1, status: 1 });
collaborationSchema.index({ creatorId: 1, status: 1 });
collaborationSchema.index({ createdAt: -1 });

export default mongoose.model('Collaboration', collaborationSchema);
