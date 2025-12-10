# Auth/Redirect Fix - Quick Reference

Commit Hash: fc22ac3

Diagnostic: 5 critical issues blocking login/redirects - missing env vars, broken auth listener, CORS misconfiguration, invalid API URLs, no deep link support.

All fixes are backwards-compatible, environment variable setup only.

---

## 3 STEPS TO DEPLOY

### Step 1: Render Backend (5 min)
1. https://dashboard.render.com → venturelab-backend service
2. Add environment variables:
   - MONGODB_URI = your MongoDB Atlas URL
   - JWT_SECRET = openssl rand -base64 32
   - CORS_ORIGINS = http://localhost:5173,http://127.0.0.1:5173,https://dreamcraft-khaki.vercel.app,https://www.dreamcraft-khaki.vercel.app,https://dreamcraft-git-main-gardner-seeses-projects.vercel.app
   - STRIPE_SECRET_KEY = your Stripe live key
   - OPENAI_API_KEY = your OpenAI key
3. Deploy & copy URL (https://venturelab-backend-XXXXX.onrender.com)

### Step 2: Vercel Web (3 min)
1. https://vercel.com/dashboard → dreamcraft project
2. Settings → Environment Variables → Add
3. VITE_API_BASE = https://YOUR_RENDER_URL/api
4. Environment: Production
5. Save & git push origin main

### Step 3: Mobile (5 min)
```
cd apps/mobile
eas secret:create
Name: EXPO_PUBLIC_API_URL
Value: https://YOUR_RENDER_URL/api
eas build --platform all --auto-submit
```

---

## TEST IN 1 MINUTE

1. Web: https://dreamcraft-khaki.vercel.app → login → Marketplace?
2. Mobile: dev build → login → Home screen?
3. Backend: curl https://YOUR_RENDER_URL/health → status ok?

---

## QUICK FIX IF SOMETHING FAILS

Web login POST fails:
- Check Vercel env: VITE_API_BASE set?
- Network tab: is POST going to correct URL?

Web login CORS error:
- Check Render CORS_ORIGINS matches exactly
- Check Render logs: "CORS rejected origin"?

Mobile login stuck on LoginScreen:
- Check logs: "App: Token loaded: present"?
- Verify token saved to SecureStore

Backend unreachable:
- curl https://YOUR_RENDER_URL/health
- Check Render dashboard: service running?

---

## FILES CHANGED

Core Fixes:
- render.yaml (CORS origins)
- apps/mobile/src/App.tsx (event listener fix)
- apps/mobile/src/environment.ts (API URL logic)
- apps/mobile/app.json (deep links)

New:
- apps/web/.env.production
- packages/backend/.env.production
- apps/web/public/.well-known/ (deep link files)

Docs:
- AUTH_REDIRECT_FIX.md (full diagnosis)
- DEPLOYMENT_INSTRUCTIONS.md (step-by-step)
- QUICK_REFERENCE.md (this file)

---

## ROLLBACK

- Web: Vercel Deployments → select previous → Promote
- Backend: Render Events → select previous → Rollback
- Mobile: prepare patch release

---

SUCCESS = 
- Web login redirects
- Mobile navigates to Home
- Backend healthy
- No CORS errors
- Token saved properly
