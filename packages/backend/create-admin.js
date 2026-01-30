const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

// Define User schema inline
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  userType: { type: String, enum: ['creator', 'collaborator', 'admin'], default: 'creator' },
  profile: {
    firstName: String,
    lastName: String,
    bio: String,
    avatar: String,
    skills: [String],
    primarySkill: String,
    location: String,
    profileCompleted: { type: Boolean, default: false },
  },
  onboarding: {
    collaboratorWizardCompleted: { type: Boolean, default: false },
    creatorIntroShown: { type: Boolean, default: false },
    completedAt: Date,
  },
  subscription: {
    tier: { type: String, enum: ['free', 'explorer', 'builder', 'enterprise'], default: 'free' },
    status: { type: String, enum: ['active', 'canceled', 'expired'], default: 'active' },
    renewalDate: Date,
    stripeSubscriptionId: String,
  },
  verified: { type: Boolean, default: true },
  betaAccess: { type: Boolean, default: true },
  inviteCodeUsed: {
    code: String,
    usedAt: Date,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const User = mongoose.model('User', userSchema);

async function createAdmin() {
  try {
    // Check if MONGODB_URI is provided
    if (!process.env.MONGODB_URI) {
      console.error('❌ Error: MONGODB_URI environment variable not set');
      console.log('\n📋 Usage:');
      console.log('   MONGODB_URI="mongodb+srv://..." node create-admin.js');
      console.log('\n📌 Get your MONGODB_URI from:');
      console.log('   1. Render Dashboard → Your Backend Service → Environment');
      console.log('   2. Copy the MONGODB_URI value');
      console.log('   3. Run the command above with your actual URI');
      process.exit(1);
    }

    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ Connected to MongoDB');

    const adminEmail = 'admin@dreamcraft.io';
    const adminUsername = 'admin';
    const adminPassword = 'AdminPassword123!';

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log('✅ Admin user already exists!');
      console.log(`Email: ${adminEmail}`);
      console.log(`Username: ${adminUsername}`);
      console.log(`User Type: ${existingAdmin.userType}`);
      await mongoose.disconnect();
      process.exit(0);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    // Create admin user
    const admin = new User({
      email: adminEmail,
      username: adminUsername,
      password: hashedPassword,
      userType: 'admin',
      verified: true,
      betaAccess: true,
      profile: {
        firstName: 'Admin',
        lastName: 'User',
        profileCompleted: true,
      },
    });

    await admin.save();

    console.log('\n✅ Admin user created successfully!');
    console.log('\nAdmin Credentials:');
    console.log(`Email: ${adminEmail}`);
    console.log(`Username: ${adminUsername}`);
    console.log(`Password: ${adminPassword}`);
    console.log('\n⚠️  IMPORTANT: Change this password after first login!');
    console.log('\nLogin at: https://dreamcraft-khaki.vercel.app/login');

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Error creating admin:', err);
    process.exit(1);
  }
}

createAdmin();
