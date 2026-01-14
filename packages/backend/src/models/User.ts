import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, index: true },
  username: { type: String, required: true, unique: true, index: true },
  password: { type: String, required: true },
  userType: { type: String, enum: ['creator', 'collaborator', 'admin'], default: 'creator', index: true },
  profile: {
    firstName: String,
    lastName: String,
    bio: String,
    avatar: String,
    skills: [String],
    primarySkill: String,
    location: String,
    profileCompleted: { type: Boolean, default: false },
  },
  onboarding: {
    collaboratorWizardCompleted: { type: Boolean, default: false },
    creatorIntroShown: { type: Boolean, default: false },
    completedAt: Date,
  },
  subscription: {
    tier: { type: String, enum: ['free', 'explorer', 'builder', 'enterprise'], default: 'free' },
    status: { type: String, enum: ['active', 'canceled', 'expired'], default: 'active' },
    renewalDate: Date,
    stripeSubscriptionId: String,
  },
  verified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model('User', userSchema);
