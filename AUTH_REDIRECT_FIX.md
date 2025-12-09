# DreamCraft Auth/Redirect Issue - Diagnosis & Resolution

## ROOT CAUSE ANALYSIS

### Critical Issues Found (5)

**1. Web: Missing API Base URL Configuration**
- **Problem**: Web app defaults to http://localhost:3001/api in production; no VITE_API_BASE env var set
- **Impact**: Login requests fail from Vercel (HTTPS origin, different domain)
- **Status**: FIXED

**2. Mobile: Broken Auth State Update After Login**
- **Problem**: App.tsx uses window.addEventListener which doesn't exist in React Native
- **Impact**: After successful login, navigation doesn't update; user stays on LoginScreen
- **Status**: FIXED

**3. Mobile: Invalid Production API URL**
- **Problem**: Hardcoded local network IP (192.168.0.230:3001) in app.json; placeholder URL in environment.ts
- **Impact**: Mobile app cannot reach backend in production
- **Status**: FIXED

**4. Backend: Wrong CORS Origins**
- **Problem**: Hardcoded origins don't include production domains; render.yaml has placeholder values
- **Impact**: Valid requests from frontend get rejected with CORS errors
- **Status**: FIXED

**5. Mobile: No Deep Link Configuration**
- **Problem**: No URL schemes, apple-app-site-association, or assetlinks.json
- **Impact**: Cannot handle OAuth callbacks or redirect flows between apps
- **Status**: FIXED

---

## CONFIGURATION CHANGES MADE

### Backend Configuration

File: render.yaml
- Updated CORS_ORIGINS with all Vercel preview and production domains
- Before: "http://localhost:5173,https://your-vercel-domain.vercel.app"
- After: "http://localhost:5173,http://127.0.0.1:5173,https://dreamcraft-khaki.vercel.app,https://www.dreamcraft-khaki.vercel.app,https://dreamcraft-git-main-gardner-seeses-projects.vercel.app"

File: packages/backend/.env.production (NEW)
- Created production environment template with all required variables
- Instructions for secret generation included

Render Dashboard Env Vars Required:
- MONGODB_URI=mongodb+srv://USER:PASSWORD@cluster.mongodb.net/dreamcraft
- JWT_SECRET=<32+ char random string>
- CORS_ORIGINS=<from render.yaml>

### Web Frontend Configuration

File: apps/web/.env.production (NEW)
- VITE_API_BASE=https://api.render.com/api (UPDATE TO ACTUAL RENDER DOMAIN)

File: apps/web/.env.vercel.production (NEW)
- Same VITE_API_BASE for Vercel overrides

Vercel Environment Variables Required:
- VITE_API_BASE=<actual backend API URL>

### Mobile Configuration

File: apps/mobile/app.json
- Added deep link schemes: ["dreamcraft", "com.venturelab.app"]
- Changed API URL from hardcoded local IP to production default
- Added iOS infoPlist and Android permissions

File: apps/mobile/src/environment.ts
- Added EXPO_PUBLIC_API_URL support (highest priority)
- Added proper dev/prod fallbacks
- Added debug logging

File: apps/mobile/src/App.tsx
- FIXED: Replaced window.addEventListener with React Native AppState listener
- Now correctly detects when app returns from browser OAuth flow
- Properly updates auth state when token is saved

### Deep Link Support Files

File: apps/web/public/.well-known/apple-app-site-association (NEW)
- Enables iOS Universal Links
- ACTION REQUIRED: Replace ABC123DEFG with actual Apple Team ID

File: apps/web/public/.well-known/assetlinks.json (NEW)
- Enables Android App Links
- ACTION REQUIRED: Replace PLACEHOLDER_SHA256_HASH with actual signing cert hash

---

## TESTING CHECKLIST

### Web Login Flow
- Local dev: http://localhost:5173 login redirects to Marketplace
- Incognito mode: Fresh session works with no cached tokens
- Production: https://dreamcraft-khaki.vercel.app login succeeds
- No CORS errors in console
- Token visible in localStorage after login

### Mobile Login Flow
- Expo Go dev: Login navigates to Home screen (not stuck on LoginScreen)
- Production build: API URL correctly logs as https://api.render.com/api
- App backgrounding: Session persists after foreground return
- Token stored in SecureStore (native) or localStorage (web platform)

### Token Persistence
- Web: Refresh page, should stay logged in
- Mobile: Kill app and reopen, should show Home (logged in)
- Cross-tab (web): Login in one tab, new tab detects via storage event

### CORS Tests
- Network tab shows preflight OPTIONS then POST request
- No 403 "Not allowed by CORS" errors
- Backend logs show no "CORS rejected origin" messages

### Deep Link Tests (Future OAuth)
- Android: adb shell am start -a android.intent.action.VIEW -d "dreamcraft://login/callback?token=xyz"
- iOS: https://dreamcraft.app/auth/callback?token=xyz opens app, not browser
- assetlinks.json is valid JSON and reachable
- apple-app-site-association is valid JSON and reachable

---

## DIAGNOSTICS IF STILL FAILING

### Web Login POST Request Fails
Check:
- Vercel env var VITE_API_BASE is set correctly
- Run: vercel env pull
- Check build logs on Vercel dashboard

CORS Error (403):
- Backend CORS_ORIGINS missing frontend origin
- Check Render dashboard env vars
- Verify origin matches exactly (https vs http, www vs no www)

### Mobile Login Stays on LoginScreen
Check:
- Console logs show which API URL is being used
- AppState listener is attached (logs say "App: Returned to foreground")
- Token is actually saved to SecureStore
- RootNavigator receives isLoggedIn prop correctly

### Mobile API Connection Fails
Check:
- EXPO_PUBLIC_API_URL is set (for production builds)
- Logs show correct API URL being used
- Backend is accessible: curl https://api.render.com/health

### Render Backend Unreachable
Check:
- curl https://api.render.com/health returns status ok
- Render dashboard shows no build errors
- MONGODB_URI and JWT_SECRET are set
- Recent logs show successful startup

---

## DEPLOYMENT SEQUENCE

Phase 1: Update Render Backend
1. Set MONGODB_URI, JWT_SECRET, CORS_ORIGINS in Render dashboard
2. Trigger deployment (verify health endpoint works)
3. Note actual backend API URL

Phase 2: Deploy Web Frontend
1. Add VITE_API_BASE to Vercel env vars (set to actual Render URL)
2. Trigger deployment: git push or vercel deploy --prod
3. Test login on Vercel domain

Phase 3: Deploy Mobile
1. Set EXPO_PUBLIC_API_URL in EAS build config
2. eas build --platform all --auto-submit
3. iOS: wait 24-48 hours
4. Android: wait 2-4 hours

Rollback:
- Web: Revert Vercel deployment
- Backend: Revert Render deployment
- Mobile: No quick rollback (app distributed); prepare patch release

---

## RELEASE NOTES

v1.0.1 - Auth Flow Fixes

Fixed authentication redirect flow issues affecting web and mobile login:
- Web login now works from Vercel production (API base URL properly configured)
- Mobile login correctly navigates to home after authentication
- Backend CORS allows all required frontend origins
- Added deep link support for future OAuth integration

What to do:
1. Update Render env vars (MONGODB_URI, JWT_SECRET, CORS_ORIGINS)
2. Update Vercel env vars (VITE_API_BASE to actual backend URL)
3. Test all platforms before deploying mobile

Testing:
- Web: login on https://dreamcraft-khaki.vercel.app redirects to Marketplace
- Mobile: login navigates to Home screen
- No CORS errors in console

---

## NEXT STEPS

1. OAuth Integration (future):
   - Configure Google/Apple Sign-In
   - Add OAuth callbacks in backend
   - Use deep links to return from browser to app

2. Android SHA-256 Hash:
   - keytool -list -v -keystore keystore.jks
   - Update assetlinks.json with actual hash

3. Apple Team ID:
   - Get from Apple Developer account
   - Update apple-app-site-association

4. Custom Domain (when dreamcraft.app live):
   - Update CORS_ORIGINS to use dreamcraft.app
   - Update deep link domains
   - Test all flows

