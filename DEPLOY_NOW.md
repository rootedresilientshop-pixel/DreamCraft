# Deploy Now - Quick Start (45 mins)

**You're reading this because you want to deploy your app live RIGHT NOW, cost-free.**

This is the fastest path to a live app. Everything else is optional reading.

---

## 5-Minute Pre-Check

Make sure your code compiles:

```bash
# 1. Frontend
cd apps/web && npm run build

# 2. Backend
cd ../../packages/backend && npm run build

# Expected: Both show "build successful" or similar
# If errors: Stop here, let me know what failed
```

---

## Deploy in 45 Minutes: Follow These 5 Steps

### STEP 1: MongoDB Database (5 mins)

1. Go to [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Create account (no card needed)
3. Create project: "VentureLab-Beta"
4. Create cluster: Select "M0 (Free)"
5. Click "Connect"
6. Create username: `betauser` and password
7. Copy connection string:
   ```
   mongodb+srv://betauser:PASSWORD@cluster.mongodb.net/venturelab?retryWrites=true&w=majority
   ```
8. **Save this URL** ⭐

---

### STEP 2: Backend (Render) (10 mins)

1. Go to [render.com](https://render.com)
2. Create account with GitHub (no card needed)
3. Click "New +" → "Web Service"
4. Select your VentureLab GitHub repo
5. Configure:
   ```
   Name: venturelab-backend
   Root Directory: packages/backend
   Build Command: npm install && npm run build
   Start Command: npm start
   Plan: Free
   ```
6. Click "Create Web Service"
7. Wait for build (2-3 mins) ⏳
8. Go to "Environment" tab and add:
   ```
   NODE_ENV=production
   PORT=3002
   MONGODB_URI=[paste from step 1]
   JWT_SECRET=[run: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"]
   STRIPE_SECRET_KEY=sk_test_xyz
   OPENAI_API_KEY=sk_test_xyz
   CORS_ORIGINS=http://localhost:3000,http://localhost:3001
   ```
9. Save
10. **Copy your Render URL when deployment completes** ⭐

---

### STEP 3: Frontend (Vercel) (10 mins)

1. Go to [vercel.com](https://vercel.com)
2. Create account with GitHub (no card needed)
3. Click "Add New" → "Project"
4. Select VentureLab repo
5. Configure:
   ```
   Framework: React
   Root Directory: apps/web
   Build: npm run build
   Output Directory: dist
   ```
6. Add environment variable:
   ```
   VITE_API_BASE=https://[your-render-url]/api
   ```
7. Click "Deploy" ⏳ (2-3 mins)
8. **Copy your Vercel URL when done** ⭐

---

### STEP 4: Update CORS (2 mins)

1. Go back to Render dashboard
2. Click your backend service
3. Go to "Environment" tab
4. Update `CORS_ORIGINS`:
   ```
   CORS_ORIGINS=https://[your-vercel-url].vercel.app,http://localhost:3000,http://localhost:3001
   ```
5. Save

---

### STEP 5: Test (5 mins)

1. Open your Vercel URL in browser
2. Register with test account
3. Create an idea
4. Verify it works (no errors in console)

**✅ You're live!**

---

## URLs to Save

```
Frontend: https://YOUR-VERCEL-URL.vercel.app
Backend: https://YOUR-RENDER-URL.onrender.com
Database: MongoDB Atlas account (signed in)
```

---

## Next: Build Phase 1 (Invite Codes)

Now that you're live, you can:

1. Build invite code system locally (4-6 hours)
2. Deploy to Vercel when ready (git push)
3. Post recruitment message
4. Collect 14-25 testers

Then build Phase 2-6 while they test.

---

## Cost

**$0** - Nothing costs money

---

## Issues?

- MongoDB won't connect: Check connection string is correct
- Backend won't deploy: Check Render logs
- Frontend won't load: Hard refresh browser (Ctrl+Shift+R)
- API calls failing: Check CORS_ORIGINS in Render

---

## You're Done!

App is live. Go build Phase 1 next.

See [ZERO_COST_BETA_DEPLOYMENT.md](ZERO_COST_BETA_DEPLOYMENT.md) for full details if needed.

See [BETA_COST_SUMMARY.md](BETA_COST_SUMMARY.md) for cost guarantees.

---

**Ready? Let's go!** 🚀
