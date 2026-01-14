#!/usr/bin/env node
/**
 * Database Clear Script
 * Clears all collections from MongoDB for fresh testing
 * Usage: node clear-db.js
 */

const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/dreamcraft';

async function clearDatabase() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();

    console.log(`\n📊 Found ${collections.length} collections to clear:\n`);

    let clearedCount = 0;
    for (const collection of collections) {
      await db.dropCollection(collection.name);
      console.log(`  ✓ Dropped: ${collection.name}`);
      clearedCount++;
    }

    console.log(`\n🎉 Successfully cleared ${clearedCount} collections!\n`);
    console.log('Database is now fresh and ready for new testing.\n');

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('\n❌ Error clearing database:', err.message);
    console.error('\nMake sure MongoDB is running at:', MONGODB_URI);
    process.exit(1);
  }
}

clearDatabase();
