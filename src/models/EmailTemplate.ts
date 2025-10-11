import mongoose, { Document, Schema } from 'mongoose';

export interface IEmailTemplate extends Document {
  name: string;
  subject: string;
  html_content: string;
  type: 'user_confirmation' | 'admin_notification';
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

const EmailTemplateSchema = new Schema<IEmailTemplate>({
  name: {
    type: String,
    required: [true, 'Template name is required'],
    trim: true,
    maxlength: [100, 'Template name cannot be more than 100 characters']
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true,
    maxlength: [200, 'Subject cannot be more than 200 characters']
  },
  html_content: {
    type: String,
    required: [true, 'HTML content is required'],
    minlength: [10, 'HTML content must be at least 10 characters']
  },
  type: {
    type: String,
    required: [true, 'Template type is required'],
    enum: ['user_confirmation', 'admin_notification']
  },
  is_active: {
    type: Boolean,
    default: true
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Update the updated_at field before saving
EmailTemplateSchema.pre('save', function(next) {
  this.updated_at = new Date();
  next();
});

// Create indexes
EmailTemplateSchema.index({ type: 1 });
EmailTemplateSchema.index({ is_active: 1 });
EmailTemplateSchema.index({ created_at: -1 });

export default mongoose.models.EmailTemplate || mongoose.model<IEmailTemplate>('EmailTemplate', EmailTemplateSchema);
