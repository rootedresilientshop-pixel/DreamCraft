# Render Deployment Setup - Ready to Deploy

**Status**: Ready to deploy backend to Render

---

## Your Configuration (Ready to Use)

### Environment Variables for Render

When you create your web service on Render, use these environment variables:

```
NODE_ENV=production
PORT=3002
MONGODB_URI=mongodb+srv://dreamcraft_user:<db_password>@dreamcraft.ged81bl.mongodb.net/?appName=DreamCraft
JWT_SECRET=[GENERATE RANDOM 32-CHAR STRING - see below]
STRIPE_SECRET_KEY=sk_test_dummy_for_now
OPENAI_API_KEY=sk_test_dummy_for_now
CORS_ORIGINS=http://localhost:3000,http://localhost:3001
```

### Generate JWT_SECRET

Copy and paste this into your terminal to generate a secure JWT secret:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

This will output a 64-character random string. **Copy that string and paste it as your JWT_SECRET value in Render.**

---

## Next: Go Deploy on Render

Follow these exact steps:

### Step 1: Go to Render
1. Open [render.com](https://render.com)
2. Click "Get Started"
3. Sign in with GitHub (grant access to VentureLab repo)

### Step 2: Create Web Service
1. Click "New +" button
2. Select "Web Service"
3. Choose your VentureLab GitHub repository
4. Click "Connect"

### Step 3: Configure the Service
Fill in these fields:

- **Name**: `venturelab-backend`
- **Branch**: `main`
- **Root Directory**: `packages/backend`
- **Runtime**: `Node`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`
- **Plan**: Click "Free" (important - don't select paid)

### Step 4: Add Environment Variables
Before clicking "Deploy", click "Advanced" or "Environment" section and add all variables from above:

For MONGODB_URI: Copy and paste the full string (replace `<db_password>` with your actual database password from MongoDB Atlas)

For JWT_SECRET: Paste the 64-character random string you generated

### Step 5: Click "Deploy"
- Render will start building automatically
- This takes 3-5 minutes
- Check "Logs" tab to see progress
- Look for: "Server running on port 3002"

### Step 6: Get Your Backend URL
Once deployed, Render will show your service URL like:
```
venturelab-backend.onrender.com
```

**Save this URL** - you'll need it for the frontend deployment.

---

## Once Backend is Deployed

Come back here and tell me:
1. ✅ Backend is live on Render
2. Your backend URL (from Render dashboard)
3. Then I'll help you deploy the frontend to Vercel

---

## If You Get Stuck

**Deployment fails with "MongoDB connection error"?**
- Check your password in MONGODB_URI is correct
- Verify the connection string format is exactly right
- Make sure you replaced `<db_password>` with your actual password

**Backend deploys but shows errors in Logs?**
- Click "Logs" tab in Render dashboard
- Look for the actual error message
- Share the error with me

**Service spins down after 15 mins?**
- This is normal and free - it saves compute hours
- First request wakes it up in ~30 seconds
- Not a problem for testing

---

## Ready?

1. Go to [render.com](https://render.com)
2. Create the web service with the variables above
3. Wait for deployment to complete
4. Come back with your backend URL

**Let me know once Step 2 (backend deployment) is done!**
