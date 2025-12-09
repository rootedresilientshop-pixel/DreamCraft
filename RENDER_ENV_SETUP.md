# Render Backend Environment Setup

## Required Environment Variables for Production

These variables **must** be set in the Render Dashboard before deployment.

### Step 1: Create/Connect Backend Service on Render

1. Go to [render.com](https://render.com)
2. Click **New → Web Service**
3. Connect your GitHub repo: `rootedresilientshop-pixel/DreamCraft`
4. Configure:
   - **Name:** `venturelab-backend` (or your choice)
   - **Root Directory:** `packages/backend`
   - **Runtime:** Node
   - **Build Command:** `npm ci && npm run build`
   - **Start Command:** `npm start`
   - **Plan:** Free (or Starter)
   - **Region:** Oregon (or closest to you)

### Step 2: Set Environment Variables in Render Dashboard

After creating the service, go to **Settings → Environment**. Add these variables:

#### 🔴 CRITICAL (Must Set)

| Variable        | Value                                | Example                                                          |
| --------------- | ------------------------------------ | ---------------------------------------------------------------- |
| **MONGODB_URI** | MongoDB Atlas connection string      | `mongodb+srv://username:password@cluster.mongodb.net/dreamcraft` |
| **JWT_SECRET**  | Generate 32+ character random string | `$(openssl rand -base64 32)`                                     |

#### 🟡 RECOMMENDED (Should Set)

| Variable         | Value                                 | Example                                                                   |
| ---------------- | ------------------------------------- | ------------------------------------------------------------------------- |
| **CORS_ORIGINS** | Comma-separated list of frontend URLs | `https://dreamcraft-abc.vercel.app,https://www.dreamcraft-abc.vercel.app` |
| **NODE_ENV**     | Environment mode                      | `production`                                                              |

#### ⚠️ OPTIONAL (Only if Feature Enabled)

| Variable              | Value                                                         | Example          |
| --------------------- | ------------------------------------------------------------- | ---------------- |
| **STRIPE_SECRET_KEY** | Your Stripe secret key (starts with `sk_live_` or `sk_test_`) | `sk_test_xxx...` |
| **OPENAI_API_KEY**    | Your OpenAI API key                                           | `sk-xxx...`      |

---

## How to Generate JWT_SECRET

### On Windows (PowerShell):

```powershell
$bytes = [System.Text.Encoding]::UTF8.GetBytes([guid]::NewGuid().ToString())
[Convert]::ToBase64String($bytes)
```

### On Mac/Linux:

```bash
openssl rand -base64 32
```

### Alternative (any platform):

Use an online generator: https://www.uuidgenerator.net/ (copy and paste)

---

## Step 3: Set MongoDB Atlas Connection

If you don't have MongoDB Atlas set up:

1. Go to [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Create a free account or log in
3. Create a **Cluster** (Free tier: M0)
4. Get the connection string:
   - Click **Connect → Drivers**
   - Copy the connection string
   - Replace `<username>` and `<password>` with your credentials
   - Replace `<database>` with `dreamcraft`

Example:

```
mongodb+srv://myuser:mypassword@cluster0.mongodb.net/dreamcraft?retryWrites=true&w=majority
```

---

## Step 4: Deploy

1. Click **Deploy** in Render dashboard
2. Wait for build to complete (3-5 minutes)
3. Check logs for errors
4. If successful, Render will provide your backend URL:
   ```
   https://venturelab-backend-xxxx.onrender.com
   ```

---

## Step 5: Verify Deployment

Once deployed, test the health endpoint:

```bash
curl https://venturelab-backend-xxxx.onrender.com/health
```

Expected response:

```json
{ "status": "ok", "timestamp": "2025-12-08T..." }
```

---

## Next Steps

After successful deployment:

1. Copy the backend URL (e.g., `https://venturelab-backend-xxxx.onrender.com`)
2. Update `CORS_ORIGINS` in Render with your Vercel domain
3. Set `VITE_API_BASE` in Vercel to this URL
4. Update mobile `app.json` with this URL

See: `VERCEL_ENV_SETUP.md` and `MOBILE_SETUP_GUIDE.md`
