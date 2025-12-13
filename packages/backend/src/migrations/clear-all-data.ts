import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

async function clearAllData() {
  try {
    const dbUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/venturelab';
    console.log('Connecting to MongoDB:', dbUri);

    await mongoose.connect(dbUri);
    console.log('✅ Connected to MongoDB');

    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('Database connection failed');
    }

    // Get all collections
    const collections = await db.listCollections().toArray();
    console.log(`Found ${collections.length} collections`);

    // Drop all collections
    for (const collection of collections) {
      await db.dropCollection(collection.name);
      console.log(`✅ Dropped collection: ${collection.name}`);
    }

    console.log('✅ All collections cleared successfully');
    await mongoose.connection.close();
    console.log('✅ Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error clearing data:', error);
    process.exit(1);
  }
}

clearAllData();
