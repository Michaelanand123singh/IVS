import mongoose, { Document, Schema } from 'mongoose';

export interface IAdminUser extends Document {
  username: string;
  password: string;
  created_at: Date;
  last_login?: Date;
  is_active: boolean;
}

const AdminUserSchema = new Schema<IAdminUser>({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters'],
    maxlength: [50, 'Username cannot be more than 50 characters']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  last_login: {
    type: Date
  },
  is_active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Create index for username
AdminUserSchema.index({ username: 1 });

export default mongoose.models.AdminUser || mongoose.model<IAdminUser>('AdminUser', AdminUserSchema);
