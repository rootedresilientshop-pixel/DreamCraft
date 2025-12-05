import mongoose from 'mongoose';

export const connectDB = async (uri?: string) => {
  const mongoUri = uri || process.env.MONGODB_URI || 'mongodb://localhost:27017/dreamcraft';
  try {
    await mongoose.connect(mongoUri, {
      // useNewUrlParser and useUnifiedTopology are defaults in newer mongoose
    } as any);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('CRITICAL: MongoDB connection failed:', err);
    throw new Error('Failed to connect to MongoDB - cannot start server without database');
  }
};

export default connectDB;
