# 🎯 START HERE - 4 Steps to Launch

**Everything is built and ready. Follow these 4 simple steps to launch.**

---

## Step 1️⃣: Create MongoDB (10 minutes)

1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up (free tier available)
3. Create cluster (call it "venturelab")
4. Create database user:
   - Username: `venturelab`
   - Password: (create strong password)
5. Get connection string:
   - Click "Connect"
   - Choose "Drivers"
   - Copy the MongoDB URI
   - **It should look like:** `mongodb+srv://venturelab:PASSWORD@cluster0.mongodb.net/venturelab?retryWrites=true&w=majority`
6. Keep this safe - you need it in Step 2

---

## Step 2️⃣: Deploy Backend to Render (15 minutes)

1. Go to https://render.com
2. Sign up with GitHub (easier)
3. Click **"New +"** → **"Web Service"**
4. Select repo: **`rootedresilientshop-pixel/DreamCraft`**
5. Fill in details:
   - **Name:** `dreamcraft-backend`
   - **Build Command:** `cd packages/backend && npm install && npm run build`
   - **Start Command:** `cd packages/backend && npm start`
6. Click **"Advanced"** and add Environment Variables:
   ```
   PORT = 3001
   NODE_ENV = production
   MONGODB_URI = (paste your MongoDB URI from Step 1)
   JWT_SECRET = (generate 32 random characters, e.g. using online generator)
   STRIPE_SECRET_KEY = (leave empty for now)
   OPENAI_API_KEY = (leave empty for now)
   CORS_ORIGINS = http://localhost:5173,https://dreamcraft-khaki.vercel.app
   ```
7. Click **"Create Web Service"**
8. Wait for it to finish (5-10 minutes) - you'll see "Live"
9. Copy the URL - should be like `https://dreamcraft-backend-xxxxx.render.com`
10. **Save this URL** - you need it for Step 3

---

## Step 3️⃣: Deploy Frontend to Vercel (10 minutes)

### If you DON'T have a Vercel account yet:
1. Go to https://vercel.com
2. Click **"Sign Up"**
3. Click **"Continue with GitHub"**
4. Authorize access to your GitHub
5. Click **"Add New"** → **"Project"**
6. Import GitHub repo: **`rootedresilientshop-pixel/DreamCraft`**
7. Set **"Root Directory"** to `apps/web`
8. Click **"Environment Variables"** and add:
   ```
   VITE_API_BASE = https://dreamcraft-backend-xxxxx.render.com/api
   ```
   (Replace `xxxxx` with your actual Render URL from Step 2)
9. Click **"Deploy"**
10. Wait for it to finish (2-5 minutes)
11. Copy the deployment URL - should be like `https://dreamcraft-khaki.vercel.app`

### If you ALREADY have Vercel account:
1. Go to https://vercel.com
2. Find **"DreamCraft"** project
3. Click **"Settings"** → **"Environment Variables"**
4. Add/update:
   ```
   VITE_API_BASE = https://dreamcraft-backend-xxxxx.render.com/api
   ```
5. Go to **"Deployments"** tab
6. Click **"Redeploy"** on latest commit
7. Wait for deployment (2-5 minutes)

---

## Step 4️⃣: Test (10 minutes)

1. Open your Vercel URL in browser
2. You should see the login page
3. **Test Registration:**
   - Click "Don't have an account? Register"
   - Enter email: `test1@example.com`
   - Enter password: `Test12345678` (8+ chars)
   - Select role: **"Creator"**
   - Click "Register"
   - Should see "Account created! Please log in"
   - Login with same email/password
   - Should see Creator Dashboard (orange theme)

4. **Test as Collaborator:**
   - Go back to login (or new tab)
   - Register new account: `test2@example.com`
   - Select role: **"Collaborator"**
   - Login
   - Should see Collaborator Dashboard (blue theme)

5. **Test Create & Browse:**
   - As Creator: Click "Create Idea" → fill in title & description → Create
   - As Collaborator: Click "Browse Ideas" → should see creator's idea
   - Click "View Details"

6. **Test Invitations:**
   - As Creator: Go to idea → Look for "Invite Collaborators"
   - Find test2@example.com → Invite
   - As Collaborator: Go to "Invitations" tab → Accept
   - Should move to "Active Collaborations"

7. **Test Messaging:**
   - As either user: Go to "Messages"
   - Find the other user → Send test message
   - Switch accounts → Should see message

**If everything works → You're launched! 🎉**

---

## 🆘 Quick Troubleshooting

**Backend shows error/offline:**
- Check Render dashboard logs
- Verify MongoDB connection string is correct
- Make sure you whitelisted IP (0.0.0.0/0) in MongoDB Atlas

**Frontend shows blank page:**
- Press F12 to open developer tools
- Check "Console" tab for red errors
- Check that `VITE_API_BASE` env var is set correctly
- Make sure it doesn't end with `/`

**API returns 401/403 errors:**
- Your MongoDB might not be connected
- Check Render logs for MongoDB error
- Verify connection string is exactly correct

**Still stuck?**
- Open DEPLOYMENT_GUIDE.md for detailed help
- Check browser console (F12 → Console)
- Check Render logs (Dashboard → dreamcraft-backend → Logs)
- Check Vercel logs (Dashboard → Deployments)

---

## 🎉 You're Live!

Once all steps work, you have:
- ✅ Live backend at: `https://dreamcraft-backend-xxxxx.render.com`
- ✅ Live frontend at: `https://dreamcraft-khaki.vercel.app`
- ✅ Real database: MongoDB Atlas
- ✅ Real-time messaging: Socket.io

Share the frontend URL with friends to start using!

---

## 📝 Need to Make Changes?

1. Edit code on your computer
2. Run: `git add .` → `git commit -m "fix: description"` → `git push origin main`
3. Render backend auto-deploys (5 min)
4. Vercel frontend auto-deploys (2 min)
5. Your changes are live!

---

## 💡 Next Steps (After Launch)

- Monitor Render/Vercel logs for errors
- Create real user accounts to test features
- Gather feedback from beta users
- Add Stripe keys for payments (when ready)
- Add OpenAI keys for AI features (when ready)

---

**That's it! You're ready to launch. Start with Step 1 above.** 🚀
