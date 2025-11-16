import mongoose from 'mongoose';

// Do NOT define the MONGODB_URI here.

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    // Read the environment variable INSIDE the function.
    // This is the critical change.
    const MONGODB_URI = process.env.MONGODB_URI;

    if (!MONGODB_URI) {
      throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
    }
    
    console.log("Connecting to MONGO URI:", MONGODB_URI); // For debugging

    const opts = {
      bufferCommands: false,
      // Optimize for Vercel serverless functions
      serverSelectionTimeoutMS: 5000, // 5 second timeout for server selection
      socketTimeoutMS: 45000, // 45 second socket timeout
      connectTimeoutMS: 10000, // 10 second connection timeout
      maxPoolSize: 1, // Reduce pool size for serverless (each function instance)
      minPoolSize: 0, // Allow connection pool to close when idle
      // Enable keep-alive for better connection reuse
      keepAlive: true,
      keepAliveInitialDelay: 30000,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('MongoDB connected successfully');
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;
