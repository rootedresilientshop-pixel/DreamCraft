import mongoose from 'mongoose';

export interface TemplateSection {
  id: string;
  title: string;
  description: string;
  placeholder: string;
  hints: string[];
  warnings?: string[];
  wordCountTarget?: number;
  required: boolean;
}

export interface ITemplate {
  _id?: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  sections: TemplateSection[];
  isDefault: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const templateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    default: '💡',
  },
  category: {
    type: String,
    required: true,
    enum: ['Technology', 'Healthcare', 'Finance', 'Education', 'Marketplace', 'AI', 'Other'],
  },
  sections: [
    {
      id: {
        type: String,
        required: true,
      },
      title: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
      placeholder: {
        type: String,
        required: true,
      },
      hints: [String],
      warnings: [String],
      wordCountTarget: Number,
      required: {
        type: Boolean,
        default: false,
      },
    },
  ],
  isDefault: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for efficient querying
templateSchema.index({ category: 1 });
templateSchema.index({ isDefault: 1 });

export default mongoose.model('Template', templateSchema);
