# DEPLOYMENT INITIATION - ACTION ITEMS FOR YOU

## Pre-Deployment Validation ✅ COMPLETE

| Check             | Status    | Details                                          |
| ----------------- | --------- | ------------------------------------------------ |
| Backend builds    | ✅ PASS   | `npm run build` → tsc compiles                   |
| Web builds        | ✅ PASS   | `npm run build` → Vite (260 KB gzipped)          |
| render.yaml valid | ✅ PASS   | rootDir, buildCommand, startCommand correct      |
| vercel.json valid | ✅ PASS   | framework, buildCommand, outputDirectory correct |
| Git committed     | ❓ VERIFY | All fixes committed and pushed to main branch    |

---

## CRITICAL: Git Commit & Push

Before deploying, you **must** push all code changes to GitHub. Render and Vercel will pull from your repo.

### Check current status:

```powershell
cd C:\Users\gardn\VentureLab
git status
git log --oneline -n 3
```

### If changes exist, commit & push:

```powershell
git add .
git commit -m "fix: update env var handling and security checks for production deployment"
git push origin main
```

**Verify:** Go to https://github.com/rootedresilientshop-pixel/DreamCraft/commits/main

- Should see your commit at the top
- Check that fixes are in the latest commit

---

## STEP 1: Deploy Backend to Render (15 min)

### 1a. Setup (Before Render)

- [ ] **Create MongoDB Atlas account & cluster**

  - Go to https://mongodb.com/cloud/atlas
  - Create free M0 cluster
  - Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/dreamcraft`
  - Save this string; you'll need it in Step 1c

- [ ] **Generate JWT_SECRET (32+ random characters)**

  PowerShell:

  ```powershell
  $bytes = [System.Text.Encoding]::UTF8.GetBytes([guid]::NewGuid().ToString())
  [Convert]::ToBase64String($bytes)
  ```

  Copy the output. You'll need it in Step 1c.

### 1b. Create Service on Render

1. Go to https://render.com → Sign in with GitHub
2. Click **New → Web Service**
3. Select repo: `rootedresilientshop-pixel/DreamCraft`
4. Configure:

   - **Name:** `venturelab-backend`
   - **Runtime:** Node
   - **Root Directory:** `packages/backend`
   - **Build Command:** `npm ci && npm run build`
   - **Start Command:** `npm start`
   - **Plan:** Free
   - **Region:** Oregon

5. Click **Create Web Service**

### 1c. Add Environment Variables in Render

In Render dashboard, go to **Settings → Environment**

Add these variables:

```
MONGODB_URI = mongodb+srv://username:password@cluster.mongodb.net/dreamcraft
JWT_SECRET = <your 32+ char secret from Step 1a>
NODE_ENV = production
CORS_ORIGINS = http://localhost:5173,https://your-vercel-domain.vercel.app
```

_(Leave CORS_ORIGINS as-is for now; update after Vercel deployment)_

### 1d. Deploy

Click **Deploy** button. Wait for build to complete (3-5 minutes).

**Monitor logs for errors:**

- Should see: `> npm ci && npm run build`
- Should see: `DreamCraft Backend running on port 10000`
- If errors: Check env vars, check MongoDB connection string

### 1e. Verify Backend

Once deployed (status shows "Live"):

1. Get your backend URL from dashboard (e.g., `https://venturelab-backend-xxxx.onrender.com`)
2. Test health endpoint:

   ```powershell
   curl https://venturelab-backend-xxxx.onrender.com/health
   ```

   Expected response:

   ```json
   { "status": "ok", "timestamp": "2025-12-08T..." }
   ```

3. **Save this URL** — you'll need it for Vercel

---

## STEP 2: Deploy Web App to Vercel (10 min)

### 2a. Create Project on Vercel

1. Go to https://vercel.com → Sign in with GitHub
2. Click **Add New → Project**
3. Import repo: `rootedresilientshop-pixel/DreamCraft`
4. Configure:

   - **Root Directory:** `apps/web`
   - **Framework:** Vite (should auto-detect)
   - **Build Command:** `npm ci && npm run build`
   - **Output Directory:** `dist`

5. Click **Create Project**

### 2b. Add Environment Variable

Go to **Settings → Environment Variables**

Add:

```
VITE_API_BASE = https://venturelab-backend-xxxx.onrender.com/api
```

_(Use your Render URL from Step 1e)_

### 2c. Deploy

Click **Deploy** button. Wait for build to complete (2-3 minutes).

**Monitor logs:**

- Should see: `vite build`
- Should see: `built in X.XXs`
- If errors: Check VITE_API_BASE format

### 2d. Verify Web

Once deployed:

1. Click the deployed URL (e.g., `https://dreamcraft-abc.vercel.app`)
2. Page should load with login form
3. Open browser console (F12 → Console)
4. Try logging in with test credentials
5. Check for CORS errors — if present, Render CORS needs update

**Save this URL** — you'll need it next

---

## STEP 3: Update Render CORS (2 min)

Now that your web app is live, tell the backend to accept requests from it.

1. Go to Render dashboard → `venturelab-backend` → **Settings → Environment**
2. Edit `CORS_ORIGINS`:

   ```
   https://dreamcraft-abc.vercel.app,https://www.dreamcraft-abc.vercel.app
   ```

   _(Use your Vercel URL from Step 2d)_

3. Click **Save**
4. Render will automatically redeploy backend

---

## STEP 4: Update Mobile App (2 min)

Edit `apps/mobile/app.json` and update line 26:

```json
"extra": {
  "apiUrl": "https://venturelab-backend-xxxx.onrender.com/api"
}
```

Then:

```powershell
cd C:\Users\gardn\VentureLab\apps\mobile
npx expo start --clear --tunnel
```

Scan QR code with Expo Go app on your phone.

---

## STEP 5: Test Login Flow 🚀

### Web App Login Test

1. Visit your Vercel URL: `https://dreamcraft-abc.vercel.app`
2. Click **Register**
3. Create test account:
   - Email: `test@example.com`
   - Password: `TestPassword123`
4. Click **Register**
5. Click **Login**
6. Login with same credentials
7. **Expected:** See home feed with ideas

**If it fails:**

- Check browser console (F12) for errors
- Most likely: CORS error → Check CORS_ORIGINS in Render
- Or: VITE_API_BASE wrong format

### Mobile App Login Test

1. Open Expo Go app (from Step 4)
2. Register (use different email): `testmobile@example.com`
3. Login
4. **Expected:** See home feed

### Cross-Platform Test

1. Register on web as `web@example.com`
2. Login on mobile with same credentials
3. Should work (users are shared in MongoDB)

---

## Expected Timeline

| Step                       | Time        | Status  |
| -------------------------- | ----------- | ------- |
| MongoDB + JWT_SECRET setup | 5 min       | ⏳ TODO |
| Render backend deploy      | 10 min      | ⏳ TODO |
| Vercel web deploy          | 5 min       | ⏳ TODO |
| Update CORS                | 2 min       | ⏳ TODO |
| Update mobile app          | 2 min       | ⏳ TODO |
| Login testing              | 10 min      | ⏳ TODO |
| **TOTAL**                  | **~35 min** | ⏳ TODO |

---

## Troubleshooting

### Backend won't start

- Check env vars: `MONGODB_URI` and `JWT_SECRET` must be set
- Check MongoDB Atlas connection string (username/password)
- Check Render logs for detailed error

### Web shows CORS error

- CORS_ORIGINS in Render not updated with Vercel domain
- VITE_API_BASE in Vercel wrong format (should end with `/api`)
- Render backend not fully redeployed

### Login fails

- Backend not responding: Check health endpoint
- Wrong email/password: Try again
- JWT_SECRET mismatch: Check Render env var

### Mobile offline

- app.json apiUrl wrong: Must be `https://...onrender.com/api`
- Using LAN mode? Switch to Tunnel: `npx expo start --clear --tunnel`
- Network firewall? Tunnel bypasses it

---

## Next Actions (In Order)

1. ✅ Verify git status → commit & push
2. ⏳ **Follow STEP 1** (Render backend)
3. ⏳ **Follow STEP 2** (Vercel web)
4. ⏳ **Follow STEP 3** (Update CORS)
5. ⏳ **Follow STEP 4** (Update mobile)
6. ⏳ **Follow STEP 5** (Test login)

---

## Success Criteria

✅ Backend deployed to Render  
✅ Web deployed to Vercel  
✅ Health endpoint responds  
✅ Web app loads and shows login  
✅ Can register and login on web  
✅ Can login on mobile  
✅ Data shared across platforms

**Once all pass: You're production-ready!**

---

**Start with:** Check git status, then proceed to STEP 1

Good luck! 🚀
