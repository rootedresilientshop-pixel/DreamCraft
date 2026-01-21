import mongoose, { Document, Schema } from 'mongoose';

export interface IInviteCode extends Document {
  code: string;
  createdBy: mongoose.Types.ObjectId;
  createdFor?: string;
  email?: string;
  maxUses: number;
  currentUses: number;
  usedBy: mongoose.Types.ObjectId[];
  expiresAt?: Date;
  isActive: boolean;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const inviteCodeSchema = new Schema<IInviteCode>(
  {
    code: { type: String, required: true, unique: true, uppercase: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    createdFor: { type: String },
    email: { type: String },
    maxUses: { type: Number, default: 1 },
    currentUses: { type: Number, default: 0 },
    usedBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    expiresAt: { type: Date },
    isActive: { type: Boolean, default: true },
    notes: { type: String },
  },
  { timestamps: true }
);

// Index for lookups
inviteCodeSchema.index({ code: 1 });
inviteCodeSchema.index({ isActive: 1, expiresAt: 1 });
inviteCodeSchema.index({ createdBy: 1 });

export default mongoose.model<IInviteCode>('InviteCode', inviteCodeSchema);
