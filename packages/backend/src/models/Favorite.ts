import mongoose from 'mongoose';

const favoriteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  ideaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Idea',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

favoriteSchema.index({ userId: 1, ideaId: 1 }, { unique: true });
favoriteSchema.index({ ideaId: 1 });

export default mongoose.model('Favorite', favoriteSchema);
