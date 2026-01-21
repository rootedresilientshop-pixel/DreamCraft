# URGENT: Update Render CORS Environment Variable

## The Problem
Your backend has hardcoded production URLs and is only using those, not the env variable yet.

## The Solution (5 minutes)

1. **Go to Render dashboard**: [render.com](https://render.com)

2. **Click on your `dreamcraft` backend service**

3. **Go to "Environment" tab**

4. **Find or Create the `CORS_ORIGINS` variable**

5. **Set it to:**
   ```
   CORS_ORIGINS=https://dreamcraft-khaki.vercel.app,http://localhost:3000,http://localhost:3001
   ```

6. **Click "Save"**

7. **Render will automatically redeploy** (takes 1-2 minutes)

8. **Wait for the green checkmark** in the Deployments tab

---

## After CORS is Updated

Your frontend and backend will be able to talk to each other.

Then we'll test:
- Open https://dreamcraft-khaki.vercel.app
- Try to register
- Should work!

---

**Do this now and let me know when CORS_ORIGINS is saved in Render!**
