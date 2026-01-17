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
  // Collaboration Terms (guardrails to prevent disputes)
  timeCommitment: {
    type: Number, // hours per week
    description: 'Expected hours per week',
  },
  equityPercentage: {
    type: Number, // 0-100
    description: 'Agreed equity percentage for collaborator',
  },
  successDefinition: String, // What does MVP success look like?
  timelineToMVP: String, // e.g., "8 weeks", "3 months"
  createdAt: {
    type: Date,
    default: Date.now,
  },
  respondedAt: Date,
  // NDA Tracking
  ndaAcceptedByCreator: {
    type: Boolean,
    default: false,
  },
  ndaAcceptedByCollaborator: {
    type: Boolean,
    default: false,
  },
  ndaAcceptedByCreatorAt: Date,
  ndaAcceptedByCollaboratorAt: Date,
  ndaText: {
    type: String,
    default: 'Standard NDA for idea collaboration - Both parties agree not to disclose proprietary information without written consent.',
  },
});

// Indexes for efficient querying
collaborationSchema.index({ ideaId: 1, collaboratorId: 1 });
collaborationSchema.index({ collaboratorId: 1, status: 1 });
collaborationSchema.index({ creatorId: 1, status: 1 });
collaborationSchema.index({ createdAt: -1 });

export default mongoose.model('Collaboration', collaborationSchema);
