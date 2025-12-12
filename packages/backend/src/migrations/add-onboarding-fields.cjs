/**
 * Migration: Add onboarding fields to existing users
 * CommonJS version for direct Node.js execution
 */

const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/dreamcraft';

async function runMigration() {
  console.log('🚀 Starting migration: add-onboarding-fields');
  console.log(`📊 Connecting to MongoDB: ${MONGODB_URI.replace(/\/\/.*@/, '//***:***@')}`);

  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Get the User collection
    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('Database connection failed');
    }

    const usersCollection = db.collection('users');

    // Count existing users
    const totalUsers = await usersCollection.countDocuments({});
    console.log(`📈 Found ${totalUsers} existing users`);

    // Step 1: Add missing profile.profileCompleted field
    console.log('\n📝 Step 1: Adding profile.profileCompleted field...');
    const result1 = await usersCollection.updateMany(
      { 'profile.profileCompleted': { $exists: false } },
      {
        $set: {
          'profile.profileCompleted': true, // Grandfathered in
        },
      }
    );
    console.log(`✅ Updated ${result1.modifiedCount} documents with profile.profileCompleted`);

    // Step 2: Set primary skill for collaborators with skills but no primarySkill
    console.log('\n📝 Step 2: Setting primary skill for collaborators...');

    // Find all collaborators with skills but no primary skill
    const collaboratorsWithoutPrimary = await usersCollection
      .find({
        userType: 'collaborator',
        'profile.skills': { $exists: true, $ne: [] },
        'profile.primarySkill': { $exists: false },
      })
      .toArray();

    console.log(`Found ${collaboratorsWithoutPrimary.length} collaborators without primary skill`);

    let collaboratorsUpdated = 0;
    for (const user of collaboratorsWithoutPrimary) {
      if (user.profile?.skills && user.profile.skills.length > 0) {
        const primarySkill = user.profile.skills[0]; // Set first skill as primary
        await usersCollection.updateOne(
          { _id: user._id },
          {
            $set: {
              'profile.primarySkill': primarySkill,
            },
          }
        );
        collaboratorsUpdated++;
      }
    }
    console.log(`✅ Updated ${collaboratorsUpdated} collaborators with primary skill`);

    // Step 3: Add onboarding object to all users
    console.log('\n📝 Step 3: Adding onboarding tracking object...');
    const result3 = await usersCollection.updateMany(
      { onboarding: { $exists: false } },
      {
        $set: {
          onboarding: {
            collaboratorWizardCompleted: true, // Grandfathered in - existing users have complete data
            creatorIntroShown: true, // Grandfathered in - creators already know about platform
            completedAt: new Date(),
          },
        },
      }
    );
    console.log(`✅ Updated ${result3.modifiedCount} documents with onboarding fields`);

    // Verification step
    console.log('\n✔️  Verifying migration...');

    const usersWithoutProfileCompleted = await usersCollection.countDocuments({
      'profile.profileCompleted': { $exists: false },
    });
    const usersWithoutOnboarding = await usersCollection.countDocuments({
      onboarding: { $exists: false },
    });

    console.log(`
Migration verification:
- Users missing profile.profileCompleted: ${usersWithoutProfileCompleted}
- Users missing onboarding object: ${usersWithoutOnboarding}
`);

    if (usersWithoutProfileCompleted === 0 && usersWithoutOnboarding === 0) {
      console.log('✅ Migration completed successfully!');
      process.exit(0);
    } else {
      console.error('❌ Migration verification failed - some fields are still missing');
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run the migration
runMigration();
