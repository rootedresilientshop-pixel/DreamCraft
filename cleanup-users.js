const mongoose = require('mongoose');

// Load env vars
require('dotenv').config({ path: 'packages/backend/.env' });

// Simple User schema for deletion
const userSchema = new mongoose.Schema({});
const User = mongoose.model('User', userSchema, 'users');

(async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb+srv://dreamcraft_user:DreamCraft123@dreamcraft.ged81bl.mongodb.net/dreamcraft';
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');

    // Delete test accounts
    const result = await User.deleteMany({
      email: {
        $regex: 'test|example|dec06|testuser'
      }
    });
    console.log('✓ Deleted:', result.deletedCount, 'test accounts');

    // List remaining
    const remaining = await User.countDocuments();
    console.log('✓ Remaining accounts:', remaining);

    await mongoose.disconnect();
    console.log('✓ Done');
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
})();
