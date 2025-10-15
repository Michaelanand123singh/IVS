import mongoose, { Document, Schema } from 'mongoose';

export interface ITestimonial extends Document {
  quote: string;
  author: string;
  role: string;
  isActive: boolean;
  displayOrder: number;
  created_at: Date;
  updated_at: Date;
}

const TestimonialSchema = new Schema<ITestimonial>({
  quote: {
    type: String,
    required: [true, 'Quote is required'],
    trim: true,
    maxlength: [500, 'Quote cannot be more than 500 characters']
  },
  author: {
    type: String,
    required: [true, 'Author name is required'],
    trim: true,
    maxlength: [100, 'Author name cannot be more than 100 characters']
  },
  role: {
    type: String,
    required: [true, 'Role is required'],
    trim: true,
    maxlength: [100, 'Role cannot be more than 100 characters']
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

// Create indexes for better performance
TestimonialSchema.index({ isActive: 1 });
TestimonialSchema.index({ displayOrder: 1 });
TestimonialSchema.index({ created_at: -1 });

export default mongoose.models.Testimonial || mongoose.model<ITestimonial>('Testimonial', TestimonialSchema);
