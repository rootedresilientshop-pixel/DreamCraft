# Vercel Web App Environment Setup

## Required Environment Variables for Production

The web app requires one critical environment variable to connect to your backend API.

### Step 1: Create/Connect Web Service on Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **Add New → Project**
3. Import your GitHub repo: `rootedresilientshop-pixel/DreamCraft`
4. Configure:
   - **Root Directory:** `apps/web`
   - **Framework:** Vite (auto-detected)
   - **Build Command:** `npm ci && npm run build`
   - **Output Directory:** `dist`

### Step 2: Set Environment Variables in Vercel Dashboard

In your project settings → **Environment Variables**, add:

#### 🔴 CRITICAL (Must Set Before Deploy)

| Variable | Value | Example |
|----------|-------|---------|
| **VITE_API_BASE** | Your Render backend URL + `/api` | `https://venturelab-backend-xxxx.onrender.com/api` |

#### ⚠️ OPTIONAL (Only if Stripe Payments Enabled)

| Variable | Value | Example |
|----------|-------|---------|
| **VITE_STRIPE_PUBLIC_KEY** | Your Stripe publishable key | `pk_test_xxx...` |

---

## How to Get Your Render Backend URL

This is set **after** deploying the backend to Render:

1. Go to [render.com](https://render.com)
2. Open your backend service: `venturelab-backend`
3. Copy the URL (e.g., `https://venturelab-backend-xxxx.onrender.com`)
4. Paste it in Vercel's `VITE_API_BASE` as: `https://venturelab-backend-xxxx.onrender.com/api`

---

## Step 3: Deploy Web App

1. Click **Deploy** in Vercel dashboard
2. Wait for build to complete (2-3 minutes)
3. Check build logs for errors
4. If successful, Vercel will provide your web URL:
   ```
   https://dreamcraft-abc123.vercel.app
   ```

---

## Step 4: Verify Deployment

1. Visit your Vercel URL
2. Try logging in with test credentials
3. Check browser console for errors (F12 → Console tab)
4. Check Vercel logs for any API connection issues

### Common Issues:

| Issue | Cause | Fix |
|-------|-------|-----|
| **CORS error in console** | VITE_API_BASE not set or wrong | Check Vercel env vars; update CORS_ORIGINS in Render |
| **Blank page** | Build failed silently | Check Vercel build logs |
| **Login fails** | Backend not responding | Verify backend is running on Render; check VITE_API_BASE |

---

## Step 5: Update Render CORS

Once your Vercel URL is live, update the backend's `CORS_ORIGINS`:

1. Go to Render dashboard → `venturelab-backend` → **Settings**
2. Edit `CORS_ORIGINS` environment variable
3. Add your Vercel domains:
   ```
   https://dreamcraft-abc123.vercel.app,https://www.dreamcraft-abc123.vercel.app
   ```
4. Redeploy the backend

---

## Environment Variable Validation

After deployment, the app will:
- ✅ Use `VITE_API_BASE` from Vercel env if set
- ⚠️ Fall back to `http://localhost:3001/api` if not set (won't work in production)

To verify it's correct, open browser DevTools → Network tab and check API calls—they should go to your Render backend.

---

## Next Steps

1. ✅ Deploy Render backend (see `RENDER_ENV_SETUP.md`)
2. ✅ Deploy Vercel web app (this guide)
3. Update mobile app with backend URL (see `MOBILE_SETUP_GUIDE.md`)
4. Run end-to-end tests

See: `RENDER_ENV_SETUP.md` and `MOBILE_SETUP_GUIDE.md`
