const mongoose = require('mongoose');
const dotenv = require('dotenv');

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
  verified: { type: Boolean, default: false },
  betaAccess: { type: Boolean, default: false },
  inviteCodeUsed: {
    code: String,
    usedAt: Date,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const User = mongoose.model('User', userSchema);

async function deleteUser(email) {
  try {
    // Check if MONGODB_URI is provided
    if (!process.env.MONGODB_URI) {
      console.error('❌ Error: MONGODB_URI environment variable not set');
      console.log('\n📋 Usage:');
      console.log('   MONGODB_URI="mongodb+srv://..." node delete-user.js email@example.com');
      console.log('\n📌 Get your MONGODB_URI from:');
      console.log('   1. Render Dashboard → Your Backend Service → Environment');
      console.log('   2. Copy the MONGODB_URI value');
      console.log('   3. Run the command above with the email to delete');
      process.exit(1);
    }

    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ Connected to MongoDB');

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      console.log(`\n⚠️  User not found: ${email}`);
      await mongoose.disconnect();
      process.exit(0);
    }

    console.log(`\n📋 Found user:`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Username: ${user.username}`);
    console.log(`   User Type: ${user.userType}`);
    console.log(`   Created: ${new Date(user.createdAt).toLocaleString()}`);

    // Delete user
    await User.deleteOne({ email });

    console.log(`\n✅ User deleted successfully!`);
    console.log(`   Email: ${email} can now re-register`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Error deleting user:', err.message);
    process.exit(1);
  }
}

const emailArg = process.argv[2];
if (!emailArg) {
  console.error('❌ Error: Email address required');
  console.log('\n📋 Usage:');
  console.log('   MONGODB_URI="mongodb+srv://..." node delete-user.js email@example.com');
  process.exit(1);
}

deleteUser(emailArg);
