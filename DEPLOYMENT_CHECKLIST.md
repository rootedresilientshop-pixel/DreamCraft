# 🎯 Quick Deployment Checklist

## ✅ What's Ready

- [x] Backend code (31 APIs implemented)
- [x] Frontend code (all pages built)
- [x] Authentication system (working)
- [x] Deployment guide (created: DEPLOYMENT_GUIDE.md)
- [x] All code committed to GitHub

## 📋 Your Action Items

### 1️⃣ Set Up MongoDB Atlas (10 minutes)

- [ ] Go to https://www.mongodb.com/cloud/atlas
- [ ] Create free account
- [ ] Create cluster (free tier)
- [ ] Create database user (username/password)
- [ ] Get connection string: `mongodb+srv://username:password@cluster0.mongodb.net/venturelab`
- [ ] Add IP whitelist: 0.0.0.0/0 (for testing) or specific Render IP

**Save this connection string - you'll need it for Render**

---

### 2️⃣ Deploy Backend to Render (15 minutes)

- [ ] Go to https://render.com
- [ ] Login/signup
- [ ] Click "New +" → "Web Service"
- [ ] Connect GitHub repository: `rootedresilientshop-pixel/DreamCraft`
- [ ] Fill in:
  - Name: `dreamcraft-backend`
  - Build: `cd packages/backend && npm install && npm run build`
  - Start: `cd packages/backend && npm start`
- [ ] Add environment variables:
  ```
  PORT=3001
  NODE_ENV=production
  MONGODB_URI=<paste your MongoDB connection string>
  JWT_SECRET=<generate random 32 chars>
  STRIPE_SECRET_KEY=sk_test_xxx (can leave empty)
  OPENAI_API_KEY=sk-xxx (can leave empty)
  CORS_ORIGINS=http://localhost:5173,https://your-vercel-url.vercel.app
  ```
- [ ] Click "Create Web Service"
- [ ] Wait for deployment (5-10 minutes)
- [ ] Copy backend URL: `https://dreamcraft-backend-xxxxx.render.com`
- [ ] Test it: Open URL in browser → `/api/marketplace`

**Save the backend URL - you need it for frontend**

---

### 3️⃣ Deploy Frontend to Vercel (10 minutes)

**Option A: If frontend is already on Vercel:**
- [ ] Go to https://vercel.com
- [ ] Find DreamCraft project
- [ ] Go to Settings → Environment Variables
- [ ] Add: `VITE_API_BASE=https://your-render-backend-url/api`
- [ ] Click "Redeploy"

**Option B: If not on Vercel yet:**
- [ ] Go to https://vercel.com
- [ ] Click "Add New" → "Project"
- [ ] Import GitHub repo: `rootedresilientshop-pixel/DreamCraft`
- [ ] Set root directory: `apps/web`
- [ ] Add environment variable: `VITE_API_BASE=https://your-render-backend-url/api`
- [ ] Click "Deploy"

- [ ] Wait for deployment (2-5 minutes)
- [ ] Copy frontend URL from Vercel
- [ ] Test it: Open URL in browser

---

### 4️⃣ Quick E2E Test (10 minutes)

- [ ] Open frontend URL in browser
- [ ] Register: test1@example.com, select "Creator", password: Test123456
- [ ] Should redirect to login
- [ ] Login with same credentials
- [ ] Should see Creator Dashboard
- [ ] Create new account: test2@example.com, select "Collaborator"
- [ ] Login with test2 account
- [ ] Should see Collaborator Dashboard with "Browse Ideas" option
- [ ] Open marketplace
- [ ] Create idea as test1:
  - [ ] Go to "Create Idea"
  - [ ] Fill in title, description
  - [ ] Click "Create"
- [ ] Browse as test2:
  - [ ] Should see idea in marketplace
  - [ ] Click idea
  - [ ] Click "Apply" or similar
- [ ] Send collaboration invitation (test1):
  - [ ] Find idea
  - [ ] Invite test2@example.com
- [ ] Accept invitation (test2):
  - [ ] Go to "Invitations" tab
  - [ ] Click "Accept"
  - [ ] Should appear in "Active Collaborations"
- [ ] Message each other:
  - [ ] Go to Messages
  - [ ] Send test message
  - [ ] Should receive immediately

---

## 🎉 You're Launched!

Once all steps above are done:

```
🌐 Frontend:  https://your-vercel-url.vercel.app
🔌 Backend:   https://dreamcraft-backend-xxxxx.render.com
📚 API Docs:  https://dreamcraft-backend-xxxxx.render.com/api/marketplace
```

---

## 🆘 If Something Goes Wrong

**Backend won't start:**
- Check Render logs (Dashboard → dreamcraft-backend → Logs)
- Verify MongoDB connection string is correct
- Check all env vars are set

**Frontend shows blank page:**
- Check browser console (F12)
- Check that `VITE_API_BASE` is set correctly
- Make sure it doesn't have trailing slash

**API returns 401/403:**
- Backend probably can't reach MongoDB
- Check MongoDB whitelist includes 0.0.0.0/0

**Need detailed help?**
- See DEPLOYMENT_GUIDE.md for full troubleshooting

---

## 📞 Support

Git repo: https://github.com/rootedresilientshop-pixel/DreamCraft

Need to make changes? Push to GitHub, then:
- Backend: Render auto-redeploys
- Frontend: Vercel auto-redeploys

**Total time to launch: ~1 hour**
