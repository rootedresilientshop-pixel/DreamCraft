# Beta Deployment Checklist - Deploy Live Right Now

**Goal**: Get your app live on Vercel + Render in 45 minutes so you can recruit testers (100% FREE)

**Current Status**: Code is ready (Phase 1 bugfixes + Phase 2 collaboration guardrails complete)

**Cost**: $0 guaranteed - See [ZERO_COST_BETA_DEPLOYMENT.md](ZERO_COST_BETA_DEPLOYMENT.md) for full details

---

## ✅ Pre-Deployment Status Check

Run these checks locally first:

```bash
# 1. Frontend builds without errors
cd apps/web
npm install
npm run build
# Expected: "dist/" folder created, no errors

# 2. Backend builds without errors
cd ../../packages/backend
npm install
npm run build
# Expected: "dist/" folder created, no errors

# 3. Verify git is clean (no uncommitted changes you want to keep)
git status
# Expected: Only untracked files, nothing staged
```

---

## 🚀 DEPLOYMENT STEPS

### STEP 1: Create MongoDB Atlas Free Database (5 mins)

**Why**: You need a production database in the cloud (free tier available)

1. Go to [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Create account or login
3. Click "Create a Project" → Name it "VentureLab-Beta"
4. Click "Create a Deployment"
   - Select "M0 (Free)" tier
   - Choose region closest to you
   - Click "Create"
5. Wait for cluster to initialize (1-2 mins)
6. Click "Database" in left sidebar
7. Click "Connect" button on your cluster
8. Select "Drivers" tab
9. Copy your connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/venturelab?retryWrites=true&w=majority`)
10. **⭐ Save this string somewhere** - you'll paste it in next steps

**Note**: Create database user credentials when prompted:
- Username: `betauser`
- Password: Generate strong password (auto-generate recommended)
- Save the password somewhere safe

---

### STEP 2: Deploy Backend to Render (10 mins)

**Why**: Your Node.js API needs to run on a server

**Cost**: $0 guaranteed (750 free hours/month = run 24/7 free)

**2.1 Create Render Account**
1. Go to [render.com](https://render.com)
2. Click "Get Started"
3. Create account with GitHub login (no credit card required)
4. Grant Render access to your VentureLab repo

**2.2 Create Backend Web Service**
1. In Render dashboard, click "New +"
2. Select "Web Service"
3. Choose "GitHub" and select your VentureLab repo
4. Configure settings:
   - **Name**: `venturelab-backend`
   - **Branch**: `main`
   - **Root Directory**: `packages/backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Select "Free" (very important - don't pick paid)
5. Click "Create Web Service"
6. Render will start building automatically

**2.3 Add Environment Variables**
While the service is deploying, click on it and go to "Environment" tab:

```
NODE_ENV=production
PORT=3002
MONGODB_URI=[PASTE YOUR CONNECTION STRING FROM STEP 1]
JWT_SECRET=[GENERATE A RANDOM 32-CHARACTER STRING]
STRIPE_SECRET_KEY=sk_test_dummy_for_now
OPENAI_API_KEY=sk_test_dummy_for_now
CORS_ORIGINS=http://localhost:3000,http://localhost:3001
```

**How to generate JWT_SECRET**:
- Use [this generator](https://generate-random.org/encryption-key-generator?count=1&bytes=32&enc=hex)
- Or: Open terminal and run: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- Copy the result and paste as JWT_SECRET value

**2.4 Wait for Deployment**
- Render builds and deploys automatically
- Check "Logs" tab for status
- Look for: "Server running on port 3002" or "Connected to MongoDB"
- Takes 3-5 minutes
- **Note**: After 15 mins of no traffic, backend spins down (to save free hours). First request wakes it up in ~30s. This is normal and free.

**2.5 Get Your Backend URL**
- In Render dashboard, you'll see your service URL (looks like: `venturelab-backend.onrender.com`)
- ⭐ **Save this URL** - you need it for frontend

---

### STEP 3: Deploy Frontend to Vercel (10 mins)

**Why**: Your React app needs to run on a CDN (free tier available)

**3.1 Create Vercel Account**
1. Go to [vercel.com](https://vercel.com)
2. Click "Sign Up"
3. Choose "GitHub"
4. Authorize Vercel to access your repos

**3.2 Import Your Project**
1. Click "Add New..." → "Project"
2. Select your VentureLab repo from the list
3. Vercel will auto-detect it's a monorepo
4. Set these settings:
   - **Framework**: React
   - **Root Directory**: `apps/web`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

**3.3 Add Environment Variables**
Before deploying, add:

1. Click "Environment Variables"
2. Add new variable:
   - **Name**: `VITE_API_BASE`
   - **Value**: `https://[YOUR-RAILWAY-BACKEND-URL]/api`
   - (Replace with the URL you got in Step 2.5)
3. Click "Add"

**3.4 Deploy**
1. Click "Deploy"
2. Vercel will build and deploy (2-3 minutes)
3. You'll see "Congratulations! Your project has been successfully deployed"

**3.5 Get Your Frontend URL**
- In Vercel dashboard, find "Production" domain
- Your site is live at: `https://yourapp-xyz.vercel.app`
- ⭐ **Save this URL** - this is what you tell testers

---

### STEP 4: Update Backend CORS (2 mins)

Now that you have your Vercel URL, update backend:

1. Go back to Render dashboard
2. Click on your backend service
3. Go to "Environment" tab
4. Find `CORS_ORIGINS` variable
5. Update it to:
```
CORS_ORIGINS=https://yourapp-xyz.vercel.app,http://localhost:3000,http://localhost:3001
```
(Replace `yourapp-xyz` with your actual Vercel domain from Step 3.5)

6. Save
7. Render will redeploy automatically (1-2 mins)

---

### STEP 5: Test the Live Deployment (5 mins)

**Test 1: Backend is running**
```bash
curl https://[YOUR-RENDER-URL]/api/health
```
Should return: `{"status":"ok","timestamp":"..."}`
(Note: First request might take 30s if backend was asleep - this is normal and free)

**Test 2: Frontend loads**
1. Open browser to your Vercel URL: `https://yourapp-xyz.vercel.app`
2. You should see the VentureLab login page
3. No errors in browser console (F12 → Console tab)

**Test 3: Can register an account**
1. Click "Register"
2. Enter email, password, select role
3. Click "Register"
4. Should redirect to login
5. Login with your new account
6. Should see marketplace page

**Test 4: Core features work**
From [TESTING_READY.md](TESTING_READY.md):
- [ ] Create an idea
- [ ] View idea with valuation (should show 65%, not 6500%)
- [ ] See collaboration terms form when clicking "Collaborate"
- [ ] Check console for no errors

---

## 🎉 You're Live!

Your app is now running on the internet:
- **Frontend**: `https://yourapp-xyz.vercel.app`
- **Backend**: `https://yourbackend.railway.app`
- **Database**: MongoDB Atlas free tier

---

## 📢 Now You Can Recruit Testers

Your app is live and ready for testers. **BUT** before sending them invites:

1. **Phase 1 needs to be deployed**: Implement invite code system (otherwise they can register freely)
2. Estimated build time: 4-6 hours
3. Test locally
4. Push to GitHub (auto-deploys to Vercel)

---

## 🔄 Continuous Deployment Workflow

Once live, here's how updates work:

```bash
# 1. Make changes locally
# Edit code in apps/web or packages/backend

# 2. Test locally
cd apps/web && npm start
cd packages/backend && npm run dev

# 3. Commit and push
git add .
git commit -m "feature: add invite code system"
git push

# 4. Auto-deploy happens
# - Vercel builds frontend (2-3 mins)
# - Railway builds backend (2-3 mins)
# - Changes live immediately

# 5. Testers see updates
# No action needed from them - changes appear instantly
```

---

## ⚠️ Important Notes

1. **Keep `.env` local** - Never commit sensitive values
   - `.env` is in `.gitignore` (don't change this)
   - All secrets go in Railway/Vercel UI only

2. **JWT_SECRET matters** - Use strong random value
   - Once set, changing it logs out all users
   - Don't lose it - save somewhere safe
   - For beta: one strong value is fine

3. **CORS must be configured** - Frontend must be whitelisted
   - Vercel URLs change if you redeploy
   - Update CORS_ORIGINS in Railway if frontend URL changes
   - Always include localhost:3000 for local testing

4. **MongoDB is free** - Forever free tier
   - No payment card needed
   - Enough for thousands of users in beta
   - Only upgrade if you hit resource limits

5. **Railway is free tier** - $5 free credit/month
   - Enough for your beta phase
   - Never charge you unless you go over
   - Can upgrade later if needed

---

## 🆘 Troubleshooting

**"Cannot reach backend" in browser**
- Cause: CORS not configured correctly
- Fix: Check CORS_ORIGINS variable in Render matches your Vercel URL
- Test: `curl https://backend-url/api/health`

**"500 Internal Server Error" when registering**
- Cause: Backend issue
- Fix: Check Render Logs tab for actual error
- Common: MongoDB connection failing
- Solution: Verify MONGODB_URI is correct in Render Environment variables

**"Frontend still showing old version"**
- Cause: Browser cache
- Fix: Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)

**"Module not found" errors in Railway logs**
- Cause: Dependencies not installed
- Fix: Push a change to trigger rebuild, Railway will reinstall packages

---

## 📋 Final Checklist Before Recruiting

- [ ] Frontend deploys to Vercel without errors
- [ ] Backend deploys to Railway without errors
- [ ] Can register account on live site
- [ ] Can create an idea and see valuation (65%, not 6500%)
- [ ] Can view collaboration terms when clicking "Collaborate"
- [ ] No console errors when browsing
- [ ] Backend responds to health check
- [ ] CORS configured correctly
- [ ] Have both URLs saved:
  - Frontend: `https://yourapp-xyz.vercel.app`
  - Backend: `https://yourbackend.railway.app`

---

## 🚀 Next Steps

1. **Complete this deployment** ✅
2. **Build Phase 1 (Invite Codes)** locally while site is live
3. **Deploy Phase 1** when ready (~4 hours of development)
4. **Post recruitment message** with your invite code requirements
5. **Collect 14-25 testers** over next week
6. **Build & deploy Phases 2-6** while testers use the app

---

## Time Estimate

- **Setup + Deployment**: 45 mins (one-time)
- **Phase 1 (Invite Codes)**: 4-6 hours (build + deploy)
- **Phase 2-6 (Feedback System)**: 12-16 hours (build in parallel with tester signups)

**Total to closed beta launch**: ~24-28 hours of work

---

**You've got this! Let me know when deployment is done and I'll help with Phase 1 implementation.**
