import mongoose from 'mongoose';

export const connectDB = async (uri?: string) => {
  const mongoUri = uri || process.env.MONGODB_URI || 'mongodb://localhost:27017/dreamcraft';
  try {
    await mongoose.connect(mongoUri, {
      // useNewUrlParser and useUnifiedTopology are defaults in newer mongoose
    } as any);
    console.log('MongoDB connected');
  } catch (err) {
    console.warn('MongoDB connection warning:', err);
    console.warn('Proceeding without database - some features may not work');
    // Don't throw - allow server to start without database
  }
};

export default connectDB;
