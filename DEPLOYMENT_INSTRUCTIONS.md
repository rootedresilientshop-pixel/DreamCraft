# DreamCraft Auth Fix - Deployment Instructions

**Commit**: fc22ac3 - Fix auth/redirect flow issues on web and mobile

---

## EXACT CONFIGURATION VALUES TO SET

### 1. Render Dashboard Setup

URL: https://dashboard.render.com → Select "venturelab-backend" service

Set these environment variables:

| Key | Value |
|-----|-------|
| `MONGODB_URI` | `mongodb+srv://USERNAME:PASSWORD@cluster.mongodb.net/dreamcraft?retryWrites=true&w=majority` |
| `JWT_SECRET` | `openssl rand -base64 32` (generate this, keep secure) |
| `CORS_ORIGINS` | `http://localhost:5173,http://127.0.0.1:5173,https://dreamcraft-khaki.vercel.app,https://www.dreamcraft-khaki.vercel.app,https://dreamcraft-git-main-gardner-seeses-projects.vercel.app` |
| `STRIPE_SECRET_KEY` | `sk_live_xxxxx` (from Stripe Dashboard) |
| `OPENAI_API_KEY` | `sk-xxxx` (from OpenAI platform) |
| `LOG_LEVEL` | `error` |

After setting:
1. Click "Deploy" to trigger rebuild
2. Wait for "Available" status
3. Verify: `curl https://YOUR_RENDER_URL/health`
4. Get your Render URL from dashboard (format: https://venturelab-backend-XXXXX.onrender.com)

---

### 2. Vercel Dashboard Setup

URL: https://vercel.com/dashboard → Select "dreamcraft" project

1. Go to "Settings" → "Environment Variables"
2. Click "Add"
3. Name: `VITE_API_BASE`
4. Value: `https://YOUR_RENDER_URL/api` (use your actual Render URL from step 1)
5. Environment: "Production"
6. Click "Save"
7. Trigger deployment: `git push origin main`

---

### 3. Expo/EAS Setup (Mobile)

```bash
cd apps/mobile
eas secret:create
# Name: EXPO_PUBLIC_API_URL
# Value: https://YOUR_RENDER_URL/api
eas build --platform all --auto-submit
```

---

### 4. Deep Links - iOS (Optional for now, required for OAuth later)

File: `apps/web/public/.well-known/apple-app-site-association`

Update placeholder: Replace `ABC123DEFG` with your Apple Team ID (from https://developer.apple.com)

Example: `"appID": "A1B2C3D4E5.com.venturelab.app"`

---

### 5. Deep Links - Android (Optional for now, required for OAuth later)

File: `apps/web/public/.well-known/assetlinks.json`

Get SHA-256 hash:
```bash
keytool -list -v -keystore /path/to/keystore.jks
# Look for "SHA256: XX:XX:..." line
# Remove colons: XXXXXXXXXXXXXXXX (no spaces, 64 chars hex)
```

Update: Replace `PLACEHOLDER_SHA256_HASH` with actual hash

---

## TESTING CHECKLIST

- [ ] Web login: https://dreamcraft-khaki.vercel.app
  - Enter credentials → should redirect to Marketplace
  - Check browser console: no CORS errors
  - Check localStorage: should have `userToken` key

- [ ] Mobile login (dev build)
  - Enter credentials → should navigate to Home screen
  - Check logs: should see "Production mode, using: https://YOUR_RENDER_URL/api"

- [ ] Backend health
  - `curl https://YOUR_RENDER_URL/health`
  - Should return: `{"status":"ok","timestamp":"..."}`

---

## ROLLBACK

**Web**: Vercel Dashboard → Deployments → select previous → "Promote to Production"

**Backend**: Render Dashboard → Events → select previous → "Rollback to this deployment"

**Mobile**: No quick rollback; prepare patch release if needed

---

## KEY CHANGES SUMMARY

| File | Change |
|------|--------|
| `render.yaml` | Updated CORS_ORIGINS with all Vercel domains |
| `apps/web/.env.production` | Added VITE_API_BASE (new) |
| `apps/web/.env.vercel.production` | Added VITE_API_BASE overrides (new) |
| `apps/mobile/app.json` | Added deep link schemes, fixed API URL |
| `apps/mobile/src/environment.ts` | Added EXPO_PUBLIC_API_URL support, proper dev/prod logic |
| `apps/mobile/src/App.tsx` | FIXED: replaced window.addEventListener with AppState listener |
| `packages/backend/.env.production` | Created production template (new) |
| `apps/web/public/.well-known/` | Added apple-app-site-association and assetlinks.json (new) |

---

## SUCCESS CRITERIA

1. Web login works: https://dreamcraft-khaki.vercel.app → login → marketplace
2. Mobile login works: login → Home screen (not stuck on LoginScreen)
3. Backend health OK: `curl https://YOUR_RENDER_URL/health` returns status ok
4. No CORS errors in any console
5. Token properly stored (web: localStorage, mobile: SecureStore)
