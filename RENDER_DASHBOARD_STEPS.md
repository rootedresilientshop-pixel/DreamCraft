# Render Dashboard Setup — Step-by-Step

## Prerequisites
- Render account created
- dreamcraft-backend service already linked to GitHub
- This commit pushed to main branch

---

## Step 1: Access Render Dashboard

1. Go to https://dashboard.render.com
2. Login with your account
3. Click on **dreamcraft-backend** in the services list
4. You should see a service page with status showing "Building", "Deploy", or "Live"

---

## Step 2: Set Environment Variables

1. On the dreamcraft-backend service page, find the **Environment** section (left sidebar)
2. Click **Environment Variables** or scroll to find the env var inputs

### Add These Variables (in order):

#### A. MONGODB_URI (CRITICAL)
- Key: `MONGODB_URI`
- Value: `mongodb+srv://username:password@cluster.mongodb.net/dreamcraft`
  - Replace `username` with your MongoDB Atlas user
  - Replace `password` with the password (URL-encode if special chars: `!` → `%21`)
  - Replace `cluster` with your cluster name
- Click **Save** after each variable

#### B. JWT_SECRET (CRITICAL)
- Key: `JWT_SECRET`
- Value: Generate a secure random 32-char string:
  ```bash
  # Run this in your terminal to generate:
  openssl rand -hex 32
  # Or Python:
  python -c "import secrets; print(secrets.token_hex(32))"
  ```
- Example: `a7f3c9d1e8b2f4a6c9e1b3d5f7a9c1e3`
- Click **Save**

#### C. CORS_ORIGINS (IMPORTANT)
- Key: `CORS_ORIGINS`
- Value: Update to your actual Vercel domain:
  ```
  https://dreamcraft.vercel.app,https://www.dreamcraft.vercel.app
  ```
  - Replace with YOUR actual Vercel domain
  - Keep comma-separated with no spaces
- Click **Save**

#### D. STRIPE_SECRET_KEY (Optional - if payments enabled)
- Key: `STRIPE_SECRET_KEY`
- Value: `sk_live_xxxxx` (from your Stripe dashboard)
- Click **Save**

#### E. OPENAI_API_KEY (Optional - if AI features enabled)
- Key: `OPENAI_API_KEY`
- Value: `sk-xxxxx` (from OpenAI dashboard)
- Click **Save**

#### F. SENTRY_DSN (Optional - recommended for monitoring)
- Key: `SENTRY_DSN`
- Value: `https://xxxxx@sentry.io/project-id` (from Sentry dashboard)
- Click **Save**

---

## Step 3: Trigger Deployment

After setting all environment variables, you have two options:

### Option A: Auto-Deploy (if configured)
1. The service will automatically detect the new variables
2. Watch the **Logs** tab for build progress
3. Wait for "Deploy successful" message

### Option B: Manual Deploy
1. Find the **Redeploy** button (top right of service page)
2. Click **Redeploy**
3. Select "Latest commit"
4. Click **Deploy**
5. Watch the **Logs** tab

---

## Step 4: Monitor Build Progress

1. Click the **Logs** tab
2. Watch for these stages:
   ```
   Cloning repository...
   Running build command: npm ci && NODE_OPTIONS="--max-old-space-size=512" npm run build && npm prune --omit=dev
   npm install...
   TypeScript compilation...
   Removing devDependencies...
   Starting server: npm start
   ```

3. Look for the message:
   ```
   DreamCraft Backend running on port 3002
   ```

4. If you see errors:
   - Check MONGODB_URI syntax
   - Verify MongoDB is accessible from Render IP
   - Check JWT_SECRET is set
   - Look at the specific error message

---

## Step 5: Verify Deployment

Once build shows "Live" status:

### Test Health Endpoint
```bash
curl https://dreamcraft-backend.onrender.com/health
```

Expected response:
```json
{"status":"ok","timestamp":"2025-12-05T..."}
```

### Test Login Endpoint (if MongoDB is connected)
```bash
# First, create a test user (or use existing)
curl -X POST https://dreamcraft-backend.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "testuser",
    "password": "TestPassword123",
    "userType": "creator"
  }'

# Then test login
curl -X POST https://dreamcraft-backend.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPassword123"
  }'
```

Expected response:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "...",
    "email": "test@example.com",
    "username": "testuser"
  }
}
```

---

## Step 6: Update Frontend Config

Once backend is live, update your frontend to point to the production API:

### For Web App (apps/web)
Update `.env.production` or environment variable:
```
VITE_API_BASE=https://dreamcraft-backend.onrender.com
```

### For Mobile App (apps/mobile)
Update `app.json` or environment:
```json
{
  "extra": {
    "apiUrl": "https://dreamcraft-backend.onrender.com"
  }
}
```

---

## Troubleshooting

### Build Fails with "Out of Memory"
**This should be fixed now**, but if it recurs:
- Check render.yaml has: `NODE_OPTIONS="--max-old-space-size=512"`
- Upgrade from Render free plan to paid tier

### "MongoDB connection failed"
- Verify MONGODB_URI is correct
- Check MongoDB Atlas IP whitelist includes Render's IPs
- Test connection string locally first
- Check username/password has no special characters (URL-encode if needed)

### "JWT_SECRET not set"
- Verify JWT_SECRET was added to environment variables
- Wait 30 seconds for Render to apply changes
- Trigger redeploy if still failing

### Health check fails / Port not responding
- Check Render logs for startup errors
- Verify PORT is set to 3002
- Ensure service status shows "Live" not "Building"

### CORS errors from frontend
- Update CORS_ORIGINS to include your Vercel domain
- Format: `https://your-vercel-domain.vercel.app` (no trailing slash)
- Multiple domains separated by comma (no spaces)

---

## Success Checklist

- [ ] All environment variables set in Render dashboard
- [ ] Build status shows "Live"
- [ ] `/health` endpoint responds successfully
- [ ] Can create user via `/api/auth/register`
- [ ] Can login via `/api/auth/login` and receive JWT
- [ ] Logs show no ERROR messages
- [ ] Frontend successfully connects to backend

✅ **When all items checked, backend is ready for Golden Path testing!**
