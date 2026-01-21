# Security Incident: Exposed MongoDB Credentials

## Status: CRITICAL - Requires Immediate Action

Your MongoDB credentials (`dreamcraft_user:FBZun8CkGw0Rpj1f`) are exposed on GitHub:
- In commit: `10165fa` (FIX_BACKEND_RENDER.md)
- Visible to anyone with GitHub access
- MongoDB sent alert: `EYS6xhDrn` (likely unauthorized access attempt)

---

## Immediate Action: Rotate Credentials (5 minutes)

### 1. Reset MongoDB Password
1. Go to https://cloud.mongodb.com
2. Login to your Atlas account
3. Click on your cluster: `dreamcraft`
4. Go to **Security** → **Database Access**
5. Find user `dreamcraft_user`
6. Click the three dots menu
7. Select **Edit Password**
8. Click **Auto Generate Secure Password**
9. Copy the new password (save it safely!)
10. Click **Update User**

### 2. Update Render Environment Variable
1. Go to https://render.com
2. Click `dreamcraft` backend service
3. Go to **Environment** tab
4. Find `MONGODB_URI`
5. Update with new password:
   ```
   mongodb+srv://dreamcraft_user:NEWPASSWORD@dreamcraft.ged81bl.mongodb.net/?appName=DreamCraft
   ```
6. Click **Save**
7. Render will redeploy (wait 2-3 minutes)

### 3. Update Local .env Files
In `c:\Users\gardn\VentureLab`:
- Update `packages/backend/.env`
- Update `packages/backend/.env.production`
- Update `packages/backend/.env.local`

Replace:
```
MONGODB_URI=mongodb+srv://dreamcraft_user:FBZun8CkGw0Rpj1f@dreamcraft.ged81bl.mongodb.net/?appName=DreamCraft
```

With:
```
MONGODB_URI=mongodb+srv://dreamcraft_user:NEWPASSWORD@dreamcraft.ged81bl.mongodb.net/?appName=DreamCraft
```

### 4. Clean Git History (Remove Exposed Credentials)
This is important - the credentials are still in git history!

Run:
```bash
git filter-branch --force --index-filter 'git rm --cached --ignore-unmatch FIX_BACKEND_RENDER.md VERIFY_ALL_ENV_VARS.md' --prune-empty --tag-name-filter cat -- --all
```

Then:
```bash
git push origin --force --all
git push origin --force --tags
```

**WARNING:** This rewrites git history. Only do this if no one else is pushing to this repo.

### 5. Delete Exposed Files Locally (Keep locally but remove from git)
```bash
git rm --cached FIX_BACKEND_RENDER.md VERIFY_ALL_ENV_VARS.md
echo "FIX_BACKEND_RENDER.md" >> .gitignore
echo "VERIFY_ALL_ENV_VARS.md" >> .gitignore
git add .gitignore
git commit -m "security: remove credentials from version control"
git push origin main
```

---

## Best Practices Going Forward

1. **Never commit secrets** to git (even in documentation)
2. **Use .gitignore** for files with credentials:
   ```
   .env
   .env.local
   .env.*.local
   **/dist
   node_modules/
   FIX_*.md
   VERIFY_*.md
   ```

3. **Store secrets in environment variables only:**
   - Local: `.env` files (gitignored)
   - Production: Platform dashboard (Render, Vercel)
   - Never in git history

4. **Use placeholder values in documentation:**
   ```
   # MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@cluster.mongodb.net/?appName=APP
   # Don't include actual credentials in docs!
   ```

---

## Verify Fix Works

After updating credentials:
1. Check Render logs - should see "Connected to MongoDB"
2. Try creating an idea - should work
3. Git history should no longer contain credentials

---

## Summary

✅ **Do immediately:**
1. Rotate MongoDB password in Atlas
2. Update Render environment variable
3. Update local .env files
4. Clean git history or remove sensitive files
5. Verify application still works

⏱️ **Time needed:** ~10-15 minutes

📋 **After fix:** Document lessons learned, update team git practices
