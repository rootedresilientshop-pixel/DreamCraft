import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['info', 'success', 'warning', 'error', 'collaboration_invite', 'message', 'favorite'],
    required: true
  },
  title: String,
  message: String,
  actionUrl: String,
  metadata: {
    ideaId: mongoose.Schema.Types.ObjectId,
    fromUserId: mongoose.Schema.Types.ObjectId,
    inviteId: mongoose.Schema.Types.ObjectId
  },
  read: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

notificationSchema.index({ userId: 1, createdAt: -1 });
notificationSchema.index({ userId: 1, read: 1 });

export default mongoose.model('Notification', notificationSchema);
