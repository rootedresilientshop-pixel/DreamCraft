# 🚀 VentureLab Deployment Guide

## Pre-Deployment Checklist

- [x] Backend APIs implemented (31/31 endpoints)
- [x] Frontend built and tested locally
- [x] Authentication system working
- [x] `.env` file created with local config
- [x] Code committed to GitHub

## Phase 1: Deploy Backend to Render

### Step 1: Prepare Backend Environment Variables

On **Render Dashboard**, create environment variables for backend:

```env
PORT=3001
NODE_ENV=production
MONGODB_URI=mongodb+srv://YOUR_MONGO_USERNAME:YOUR_MONGO_PASSWORD@cluster.mongodb.net/venturelab
JWT_SECRET=<generate-32-character-random-string>
STRIPE_SECRET_KEY=sk_test_xxx (or leave empty for now)
OPENAI_API_KEY=sk-xxx (or leave empty for now)
CORS_ORIGINS=http://localhost:5173,https://your-vercel-frontend-url.vercel.app
```

**How to get MongoDB:**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create cluster
4. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/venturelab`
5. Copy to MONGODB_URI above

### Step 2: Create Render Web Service

1. Go to https://render.com
2. Click "New +" → "Web Service"
3. Connect GitHub repository (rootedresilientshop-pixel/DreamCraft)
4. Configure:
   - **Name:** `dreamcraft-backend`
   - **Region:** US (recommended)
   - **Branch:** `main`
   - **Runtime:** Node
   - **Build Command:** `cd packages/backend && npm install && npm run build`
   - **Start Command:** `cd packages/backend && npm start`
   - **Plan:** Free (or Paid if you want always-on)
5. Add environment variables (copy from above)
6. Click "Create Web Service"
7. **Wait for deployment to complete** (5-10 minutes)
8. Copy the backend URL: `https://dreamcraft-backend-xxxxx.render.com`

### Step 3: Verify Backend is Running

```bash
curl https://dreamcraft-backend-xxxxx.render.com/api/marketplace
```

Should return JSON with ideas (or empty array if no data yet).

---

## Phase 2: Deploy Frontend to Vercel

### Step 1: Update Frontend Environment Variables

Create or update `apps/web/.env.production`:

```env
VITE_API_BASE=https://dreamcraft-backend-xxxxx.render.com/api
```

Replace `dreamcraft-backend-xxxxx.render.com` with your actual Render backend URL.

### Step 2: Commit and Push

```bash
git add apps/web/.env.production
git commit -m "config: Add production API URL for Vercel deployment"
git push origin main
```

### Step 3: Deploy on Vercel

**Option A: Auto-Deploy (Recommended)**
1. Vercel auto-deploys when you push to GitHub
2. Check https://vercel.com to monitor deployment

**Option B: Manual Deploy**
1. Go to https://vercel.com
2. Find DreamCraft project
3. Click "Redeploy"

### Step 4: Verify Frontend is Running

- Go to your Vercel production URL (e.g., `https://dreamcraft-khaki.vercel.app`)
- Should see login page
- Try to register a test account

---

## Phase 3: End-to-End Testing on Production

### Test 1: Registration & Login Flow
```
1. Go to your production URL
2. Click "Don't have an account? Register"
3. Enter email (test1@example.com) and password
4. Select "Creator" role
5. See success message
6. Login with same credentials
7. Should see Creator Dashboard
```

### Test 2: Create and Browse Ideas
```
Creator Account:
1. Click "Create Idea" from dashboard
2. Fill in title, description, category
3. Click "Create"
4. Should see idea in "My Ideas"

Collaborator Account:
1. Register with email test2@example.com, select "Collaborator"
2. Login
3. Go to "Browse Ideas" or Marketplace
4. Should see creator's idea
5. Click "View Details"
```

### Test 3: Collaboration Invitation
```
Creator:
1. Go to idea details
2. Find "Invite Collaborators" section
3. Search for collaborator email
4. Click invite
5. Add message (optional)

Collaborator:
1. Go to Dashboard → Invitations tab
2. Should see invitation
3. Click "Accept"
4. Should move to "Active Collaborations"
```

### Test 4: Messaging
```
Both accounts:
1. Go to Messages
2. Find the other user
3. Send a test message
4. Should receive immediately
```

---

## Troubleshooting

### Backend won't start on Render
- Check logs in Render dashboard
- Verify MongoDB URI is correct
- Check all env vars are set
- Try rebuilding: Click "Manual Deploy" → "Deploy Latest Commit"

### Frontend can't connect to backend
- Check `VITE_API_BASE` is correct (no trailing slash)
- Check CORS is configured: `CORS_ORIGINS` includes your Vercel URL
- Check network tab in browser DevTools for 401/403 errors

### MongoDB connection timeout
- Add your Render IP to MongoDB Atlas whitelist (0.0.0.0/0 for testing)
- Wait 5-10 minutes after adding IP, then retry

### Ideas don't show up
- Check if ideas were created in your account
- Check MongoDB has data: MongoDB Atlas dashboard → Collections

---

## Post-Launch Tasks

### Add Real Stripe Keys
1. Get from https://dashboard.stripe.com
2. Update `STRIPE_SECRET_KEY` on Render
3. Test checkout flow

### Add Real OpenAI Key
1. Get from https://platform.openai.com
2. Update `OPENAI_API_KEY` on Render
3. Test idea validation

### Enable Mobile App
1. Build and deploy mobile apps to TestFlight (iOS) / Play Store (Android)
2. Update mobile API URLs

### Set Up Monitoring
1. Add Sentry for error tracking
2. Add logs aggregation
3. Set up performance monitoring

---

## URLs After Deployment

```
Backend API:    https://dreamcraft-backend-xxxxx.render.com
Frontend (Web): https://dreamcraft-khaki.vercel.app
Frontend (Dev):  http://localhost:5173
API Docs:       https://dreamcraft-backend-xxxxx.render.com/api/health
```

---

## Need Help?

- Check Render logs: Dashboard → dreamcraft-backend → Logs
- Check Vercel logs: Dashboard → dreamcraft-web → Deployments
- Check browser console: F12 → Console tab
- Check network errors: F12 → Network tab (filter by XHR/Fetch)
