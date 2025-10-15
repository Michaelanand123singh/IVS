import mongoose, { Document, Schema } from 'mongoose';

export interface IHero extends Document {
  title: string;
  subtitle: string;
  description: string;
  primaryButtonText: string;
  primaryButtonLink: string;
  secondaryButtonText: string;
  secondaryButtonLink: string;
  backgroundImages: string[];
  isActive: boolean;
  displayOrder: number;
  created_at: Date;
  updated_at: Date;
}

const HeroSchema = new Schema<IHero>({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  subtitle: {
    type: String,
    required: [true, 'Subtitle is required'],
    trim: true,
    maxlength: [200, 'Subtitle cannot be more than 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  primaryButtonText: {
    type: String,
    required: [true, 'Primary button text is required'],
    trim: true,
    maxlength: [50, 'Primary button text cannot be more than 50 characters']
  },
  primaryButtonLink: {
    type: String,
    required: [true, 'Primary button link is required'],
    trim: true,
    maxlength: [200, 'Primary button link cannot be more than 200 characters']
  },
  secondaryButtonText: {
    type: String,
    required: [true, 'Secondary button text is required'],
    trim: true,
    maxlength: [50, 'Secondary button text cannot be more than 50 characters']
  },
  secondaryButtonLink: {
    type: String,
    required: [true, 'Secondary button link is required'],
    trim: true,
    maxlength: [200, 'Secondary button link cannot be more than 200 characters']
  },
  backgroundImages: [{
    type: String,
    trim: true,
    validate: {
      validator: function(v: string) {
        return /^https?:\/\/.+\.(jpg|jpeg|png|webp|gif)$/i.test(v);
      },
      message: 'Background image must be a valid URL'
    }
  }],
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

HeroSchema.index({ isActive: 1 });
HeroSchema.index({ displayOrder: 1 });
HeroSchema.index({ created_at: -1 });

export default mongoose.models.Hero || mongoose.model<IHero>('Hero', HeroSchema);
