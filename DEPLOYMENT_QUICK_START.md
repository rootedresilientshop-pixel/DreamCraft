# 🚀 DreamCraft - Quick Deployment Guide (30 Minutes, FREE)

## ✅ Your Project is 100% Ready

All code is written, tested, and compiled. **Zero development work needed.**

---

## 🎯 Three Simple Steps to Deploy (FREE)

### Step 1️⃣: MongoDB Atlas (5 min - FREE Forever)

1. Go to: **https://www.mongodb.com/cloud/atlas**
2. Sign up (use Google/GitHub for faster signup)
3. Create **FREE M0 Cluster**:
   - Provider: AWS
   - Region: Closest to you
   - Name: DreamCraft
4. Create Database User:
   - Username: `venturelab`
   - Click "Autogenerate Password" → **COPY IT**
5. Network Access:
   - Click "Add IP" → "Allow Access from Anywhere"
6. Get Connection String:
   - Click "Connect" → "Connect your application"
   - Copy: `mongodb+srv://venturelab:<password>@...`
   - Replace `<password>` with the one you copied
   - **SAVE THIS** ← You need it for Step 2

---

### Step 2️⃣: Deploy Backend to Render (10 min - FREE)

1. Go to: **https://render.com**
2. Sign up with GitHub
3. Click "New +" → "Web Service"
4. Connect your DreamCraft GitHub repo
5. Settings:
   - Name: `venturelab-backend`
   - Root Directory: `packages/backend`
   - Environment: **Docker**
   - Instance Type: **Free**
6. Environment Variables (click "Advanced"):

   ```
   MONGODB_URI = [paste your MongoDB connection string from Step 1]
   JWT_SECRET = [copy the random string below]
   PORT = 3001
   NODE_ENV = production
   CORS_ORIGINS = https://venturelab-web.vercel.app
   ```

   **JWT_SECRET - Copy this random string:**

   ```
   vL9kX2mN8pQ4rT6yU1wZ3aS5dF7gH0jK
   ```

   _(Or generate your own: Use any 32+ character random string)_

7. Click "Create Web Service"
8. Wait 5-10 minutes
9. Once deployed, **COPY YOUR URL**: `https://venturelab-backend-XXXX.onrender.com`

**Test it:**

```powershell
Invoke-RestMethod -Uri https://YOUR-BACKEND-URL/health
```

Should return: `{"status":"ok",...}`

---

### Step 3️⃣: Deploy Frontend to Vercel (10 min - FREE)

1. Go to: **https://vercel.com**
2. Sign up with GitHub
3. Click "Add New..." → "Project"
4. Select DreamCraft repository
5. Settings:
   - Framework: **Vite**
   - Root Directory: `apps/web`
   - Build Command: `npm run build`
   - Output Directory: `dist`
6. Environment Variables:

   ```
   VITE_API_BASE = https://YOUR-BACKEND-URL/api
   ```

   _(Replace with your Render URL from Step 2)_

7. Click "Deploy"
8. Wait 2-3 minutes
9. **YOUR APP IS LIVE!** 🎉

**Visit your URL:** `https://venturelab-XXXX.vercel.app`

---

### Step 4️⃣: Update CORS (2 min)

1. Go back to **Render.com**
2. Click your backend service
3. Click "Environment"
4. Find `CORS_ORIGINS`
5. Change value to: `https://YOUR-VERCEL-URL` (use your actual Vercel URL)
6. Click "Save" (auto-redeploys)

---

## 🧪 Test Your Deployed App

1. **Visit your Vercel URL**
2. **Click "Register"**
   - Email: `test@example.com`
   - Password: `Test123!`
3. **Should work!** You're logged in to the marketplace

---

## ✅ Done! Your App is Live

- ✅ **Backend API:** Running on Render (FREE)
- ✅ **Web App:** Running on Vercel (FREE)
- ✅ **Database:** MongoDB Atlas (FREE)
- ✅ **Total Cost:** $0/month

---

## ⚠️ Important Notes

### Render Free Tier:

- Spins down after 15 min of inactivity
- First request after sleep takes ~30 seconds to wake up
- **This is normal and expected on free tier**

### When to Upgrade:

- Need 24/7 uptime → Render paid tier ($7/month)
- High traffic → Vercel Pro ($20/month)
- More than 512MB data → MongoDB M10 ($9/month)

---

## 🔧 Troubleshooting

**"Service Unavailable" on first request?**

- Wait 30 seconds (cold start)
- Try again

**CORS error in browser?**

- Verify Step 4 was completed
- Check CORS_ORIGINS matches your Vercel URL exactly

**Can't register/login?**

- Check browser console for errors
- Verify backend health: `https://YOUR-BACKEND-URL/health`
- Check MongoDB connection string has correct password

---

## 📱 Want Mobile Apps Too?

Mobile deployment requires:

- iOS: Apple Developer account ($99/year)
- Android: Google Play account ($25 one-time)

See `PROJECT_STATUS_AND_DEPLOYMENT.md` for mobile deployment guide.

**For now:** Your web app works perfectly on mobile browsers! 📱

---

## 📚 More Documentation

- **Full deployment guide:** `DEPLOYMENT_CHECKLIST.md`
- **Environment setup:** `ENV_SETUP_GUIDE.md`
- **Quick start:** `QUICKSTART.md`
- **Project status:** `PROJECT_STATUS_AND_DEPLOYMENT.md`

---

## 🎉 Congratulations!

You've deployed a full-stack application with:

- ✅ Backend API (Node.js + MongoDB)
- ✅ Frontend (React + TypeScript)
- ✅ Authentication (JWT)
- ✅ Security (CORS, rate limiting, validation)
- ✅ All for **FREE**

**Now go share your app with the world! 🚀**
