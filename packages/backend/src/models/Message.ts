import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  fromUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  toUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  ideaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Idea'
  },
  threadType: {
    type: String,
    enum: ['dm', 'idea'],
    required: true
  },
  content: {
    type: String,
    required: true,
    maxlength: 2000
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
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

messageSchema.pre('validate', function(next) {
  if (!this.toUserId && !this.ideaId) {
    return next(new Error('Message must have either toUserId or ideaId'));
  }
  if (this.toUserId && this.ideaId) {
    return next(new Error('Message cannot have both toUserId and ideaId'));
  }
  next();
});

messageSchema.index({ threadType: 1, fromUserId: 1, toUserId: 1, createdAt: -1 });
messageSchema.index({ threadType: 1, ideaId: 1, createdAt: -1 });
messageSchema.index({ toUserId: 1, read: 1 });

export default mongoose.model('Message', messageSchema);
