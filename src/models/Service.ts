import mongoose, { Document, Schema } from 'mongoose';

export interface IService extends Document {
  title: string;
  description: string;
  items?: string[];
  learnMore?: {
    detailedDescription: string;
    features: string[];
    benefits: string[];
    useCases: string[];
  };
  isActive: boolean;
  displayOrder: number;
  created_at: Date;
  updated_at: Date;
}

const ServiceSchema = new Schema<IService>({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500
  },
  items: [{
    type: String,
    trim: true,
    maxlength: 100
  }],
  learnMore: {
    detailedDescription: {
      type: String,
      trim: true,
      maxlength: 2000
    },
    features: [{
      type: String,
      trim: true,
      maxlength: 200
    }],
    benefits: [{
      type: String,
      trim: true,
      maxlength: 200
    }],
    useCases: [{
      type: String,
      trim: true,
      maxlength: 200
    }]
  },
  isActive: {
    type: Boolean,
    default: true
  },
  displayOrder: {
    type: Number,
    default: 0
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Create indexes
ServiceSchema.index({ title: 1 });
ServiceSchema.index({ isActive: 1 });
ServiceSchema.index({ displayOrder: 1 });

export default mongoose.models.Service || mongoose.model<IService>('Service', ServiceSchema);
