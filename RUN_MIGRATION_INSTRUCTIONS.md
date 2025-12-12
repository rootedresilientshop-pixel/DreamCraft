# How to Run Database Migration

The migration script must be run from **Render Shell** so it has access to the production MongoDB connection string.

## Step-by-Step Instructions

### 1. Go to Render Dashboard
- Open: https://dashboard.render.com
- Click on your **dreamcraft-backend** service

### 2. Open the Shell
- Click the **"Shell"** tab (near the top)
- A terminal window will open

### 3. Run the Migration Command

Copy and paste this entire command:

```bash
cd /opt/render/project/src/packages/backend && node src/migrations/add-onboarding-fields.cjs
```

### 4. Wait for Completion

You should see output like:
```
🚀 Starting migration: add-onboarding-fields
📊 Connecting to MongoDB: mongodb://***:***@...
✅ Connected to MongoDB
📈 Found X existing users

📝 Step 1: Adding profile.profileCompleted field...
✅ Updated X documents with profile.profileCompleted

📝 Step 2: Setting primary skill for collaborators...
Found X collaborators without primary skill
✅ Updated X collaborators with primary skill

📝 Step 3: Adding onboarding tracking object...
✅ Updated X documents with onboarding fields

✔️  Verifying migration...
Migration verification:
- Users missing profile.profileCompleted: 0
- Users missing onboarding object: 0

✅ Migration completed successfully!
```

---

## What the Migration Does

1. **Adds `profile.profileCompleted: true`** to all existing users
   - Marks them as having completed the onboarding process

2. **Sets `profile.primarySkill`** for collaborators
   - Uses their first skill if they have any
   - This makes them searchable by primary skill

3. **Adds `onboarding` object** to all users
   - Tracks wizard and intro modal completion
   - Marks existing users as grandfathered in

4. **Idempotent** - Safe to run multiple times
   - Won't duplicate data if run again

---

## Troubleshooting

### If you see "command not found"
- Make sure you're in the correct directory
- The full path is important: `/opt/render/project/src/packages/backend`

### If you see MongoDB connection error
- Check that MONGODB_URI environment variable is set in Render dashboard
- Verify the connection string is correct

### If migration seems to hang
- Wait up to 5 minutes for MongoDB operations to complete
- Check if there are many users (migration is slower with large datasets)

---

## After Migration Completes

Once you see "✅ Migration completed successfully!", you're ready to:

1. Build the mobile APK
2. Test the profile wizard
3. Prepare for beta testing

---

**Let me know once the migration completes!**
