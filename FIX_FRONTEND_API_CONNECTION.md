# Fix Frontend API Connection - Network Error

## Problem
Frontend on Vercel can't reach the backend API, resulting in "network error" when trying to register/create profile.

**Root Cause:** Environment variable `VITE_API_BASE` is not set in Vercel dashboard.

---

## Solution: Set Environment Variables in Vercel (2 minutes)

### Step 1: Go to Vercel Dashboard
1. Visit https://vercel.com
2. Click on the `dreamcraft-khaki` project
3. Go to **Settings** → **Environment Variables**

### Step 2: Add Environment Variable
1. Click **Add New**
2. **Name:** `VITE_API_BASE`
3. **Value:** `https://dreamcraft-f8w8.onrender.com/api`
4. **Select environments:** Check ALL three boxes (Production, Preview, Development)
5. Click **Add**

### Step 3: Trigger Redeploy
**IMPORTANT:** Environment variables don't take effect until the project redeploys.

Option A (Recommended):
1. In Vercel dashboard, go to **Deployments** tab
2. Find the latest deployment (should be recent)
3. Click the three dots menu and select **Redeploy**

Option B (Git push):
1. Make a small change to any file (e.g., add a comment)
2. Commit: `git commit -m "trigger: redeploy with env vars"`
3. `git push origin main`
4. Wait 2-3 minutes for Vercel to rebuild

### Step 4: Verify It Works
1. Wait for green checkmark (deployment complete)
2. Visit https://dreamcraft-khaki.vercel.app
3. Open browser DevTools (F12)
4. Click **Console** tab
5. Try to register - you should NOT see network errors anymore

---

## Verify the Fix

**Before:** Network error in console
**After:** Should see successful API responses

### Check Network Tab (F12)
1. Open DevTools on the site
2. Go to **Network** tab
3. Try to register
4. Look for requests to `https://dreamcraft-f8w8.onrender.com/api/auth/register`
5. Should show **200** status code, not network error

---

## If Still Not Working

1. **Check that environment variable is set:**
   - Go to Vercel > Project Settings > Environment Variables
   - Confirm `VITE_API_BASE` shows `https://dreamcraft-f8w8.onrender.com/api`

2. **Check that deployment finished:**
   - Go to Vercel > Deployments
   - Confirm latest deployment has green checkmark
   - Timestamp should be within last few minutes

3. **Clear browser cache:**
   - Open DevTools (F12)
   - Right-click refresh button, select "Empty cache and hard refresh"
   - Try again

4. **Check backend is running:**
   - Test: `curl https://dreamcraft-f8w8.onrender.com/api/health`
   - Should return: `{"status":"ok"}`

5. **Check CORS on backend:**
   - Render Dashboard > dreamcraft service > Environment
   - Verify `CORS_ORIGINS=https://dreamcraft-khaki.vercel.app`

---

## What This Does

When you set `VITE_API_BASE` in Vercel:
- Vite build process reads this variable during build
- Replaces all API calls to use `https://dreamcraft-f8w8.onrender.com/api` instead of `http://localhost:3002/api`
- Frontend can now reach the production backend
- CORS headers allow the request (because CORS_ORIGINS includes Vercel URL)

---

**Do this now and let me know when the environment variable is set!**
