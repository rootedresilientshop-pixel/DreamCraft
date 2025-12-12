# Run Database Migration via HTTP (Render Free Tier Workaround)

Since Render free tier doesn't have shell access, we've created an HTTP endpoint to run the migration.

## Step 1: Set Migration Token on Render

You need to add a `MIGRATION_TOKEN` environment variable to your Render backend service.

**Go to:**
1. https://dashboard.render.com
2. Click **dreamcraft-backend** service
3. Click **Environment** tab
4. Click **Add Environment Variable**
5. Set:
   - Key: `MIGRATION_TOKEN`
   - Value: `your-secure-migration-token` (any string you want, e.g., `run-onboarding-migration-12345`)
6. Click **Save**

The service will auto-restart with this new variable.

---

## Step 2: Run the Migration

Once the service restarts, run this command:

```bash
curl -X POST https://dreamcraft-f8w8.onrender.com/api/users/run-migration \
  -H 'X-Migration-Token: your-secure-migration-token' \
  -H 'Content-Type: application/json'
```

**Replace `your-secure-migration-token` with the value you set above.**

---

## Step 3: Check the Response

You should get a response like:

```json
{
  "success": true,
  "message": "Migration completed successfully",
  "summary": {
    "totalUsers": 5,
    "profileCompletedUpdated": 5,
    "collaboratorsWithPrimarySkill": 2,
    "onboardingObjectsAdded": 5
  }
}
```

If you see `"success": true`, the migration is done! ✅

---

## Troubleshooting

### "Unauthorized: Invalid migration token"
- Make sure you set the `MIGRATION_TOKEN` environment variable on Render
- Make sure the token in your curl command matches exactly
- Wait a minute for the environment variable to take effect

### "404 Not Found"
- The service might still be restarting after you added the env var
- Wait 1-2 minutes and try again

### Other errors
- Check Render logs: Dashboard → dreamcraft-backend → Logs
- The error will be printed there

---

## After Migration Completes

Once the migration is done:
1. ✅ All existing users have profile.profileCompleted
2. ✅ All collaborators have primarySkill set
3. ✅ All users have onboarding object
4. ✅ Ready to test mobile app!

---

**Need help? Check Render logs or share the error response above.**
