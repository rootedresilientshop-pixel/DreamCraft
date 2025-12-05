# 🔍 DreamCraft - Complete Deployment Profile

**Generated:** December 1, 2025  
**Project:** DreamCraft MVP - Full Stack Platform  
**Architecture:** Monorepo with 3 applications + 1 shared package

---

## 📋 TECH STACK

### Frontend Web

- **Framework:** React `18.3.1`
- **Build Tool:** Vite `5.4.21`
- **TypeScript:** `5.3.3`
- **Routing:** React Router DOM `6.30.2`
- **HTTP Client:** Axios `1.13.2`
- **State Management:** Zustand `4.5.7`
- **Query Library:** TanStack React Query `5.90.11`

### Frontend Mobile

- **Framework:** React Native `0.81.5`
- **Runtime:** Expo SDK `54.0.25`
- **TypeScript:** `5.9.3`
- **Navigation:** React Navigation `6.1.18`
  - Bottom Tabs: `7.8.8`
  - Native Stack: `6.11.0`
- **HTTP Client:** Axios `1.13.2`
- **Secure Storage:** Expo Secure Store `15.0.7`
- **State Management:** Zustand `4.5.7`

### Backend API

- **Runtime:** Node.js (requires `20+` based on Dockerfile)
- **Framework:** Express `4.21.2`
- **TypeScript:** `5.9.3`
- **Database ODM:** Mongoose `7.8.7`
- **Authentication:** jsonwebtoken `9.0.2`, bcryptjs `2.4.3`
- **CORS:** cors `2.8.5`
- **Environment:** dotenv `16.6.1`
- **Development:** nodemon `3.1.11`, ts-node `10.9.2`

### External Services

- **AI Integration:** OpenAI SDK `4.104.0`
- **Payments:** Stripe SDK `14.25.0`

### Database

- **Type:** MongoDB
- **Version:** Compatible with Mongoose `7.8.7` (MongoDB 4.4+)
- **Driver:** Mongoose ODM

### Package Manager

- **Tool:** npm (package-lock.json present in all workspaces)
- **Workspaces:** No (independent npm projects)

---

## 📁 PROJECT STRUCTURE

### Architecture Type

**✅ Monorepo** - Single repository with 4 independent workspaces

```
DreamCraft/
├── apps/
│   ├── web/              # Web frontend (React + Vite)
│   └── mobile/           # Mobile app (React Native + Expo)
├── packages/
│   ├── backend/          # Backend API (Node.js + Express)
│   └── shared/           # Shared TypeScript types
└── package.json          # Root workspace scripts (no dependencies)
```

### Build Directories

#### Backend (`packages/backend/`)

- **Source:** `src/`
- **Output:** `dist/` (CommonJS compiled JavaScript)
- **Build Command:** `npm run build` (runs `tsc`)
- **Entry Point:** `dist/server.js`
- **Development:** `npm run dev` (nodemon with ts-node)
- **Production:** `npm start` (node with ts-node/esm loader)

#### Web (`apps/web/`)

- **Source:** `src/`
- **Output:** `dist/` (optimized production bundle)
- **Build Command:** `npm run build` (runs `vite build`)
- **Entry Point:** `dist/index.html`
- **Development:** `npm start` (runs `vite` on port 3000)
- **Preview:** `npm run preview`

#### Mobile (`apps/mobile/`)

- **Source:** `src/`
- **Output:** Expo managed (no dist folder)
- **Build Command:** `eas build` (requires Expo EAS)
- **Entry Point:** `index.js`
- **Development:** `npm start` (runs `expo start`)

### Static Asset Directories

- **Web:** `apps/web/public/` (contains `index.html`)
- **Mobile:** `apps/mobile/assets/` (icon.png, splash.png, adaptive-icon.png)

### API Routes/Endpoints

**Base Path:** `/api`

All endpoints prefixed with `/api/`:

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login (returns JWT)
- `POST /api/ideas` - Create new idea (requires auth)
- `POST /api/ideas/:id/valuate` - AI valuation (requires auth)
- `GET /api/marketplace` - Browse public ideas (query: `?q=search`)
- `GET /api/collaborators` - Search collaborators (query: `?q=search&skill=filter`)
- `POST /api/payments/create-payment-intent` - Stripe payment (requires auth)
- `GET /health` - Health check (no auth)

**Protected Routes:** All except `/api/auth/*` and `/health` require `Authorization: Bearer <token>` header

---

## 🔐 ENVIRONMENT VARIABLES

### Backend (`packages/backend/`)

| Variable            | Required      | Production Value  | Current Default                                                               | Notes                                             |
| ------------------- | ------------- | ----------------- | ----------------------------------------------------------------------------- | ------------------------------------------------- |
| `MONGODB_URI`       | ✅ **YES**    | **MISSING**       | `mongodb://localhost:27017/venturelab`                                        | MongoDB connection string                         |
| `JWT_SECRET`        | ✅ **YES**    | **MISSING**       | `'secret'` ⚠️                                                                 | **SECURITY RISK:** Hardcoded fallback to 'secret' |
| `PORT`              | ❌ No         | Platform-assigned | `3001`                                                                        | Server port                                       |
| `NODE_ENV`          | ❌ No         | `production`      | `development`                                                                 | Environment mode                                  |
| `CORS_ORIGINS`      | ⚠️ **YES**    | **MISSING**       | `['http://localhost:3000', 'http://localhost:5173', 'http://localhost:3001']` | **BLOCKER:** Hardcoded localhost URLs             |
| `STRIPE_SECRET_KEY` | ⚠️ Optional\* | **MISSING**       | `''`                                                                          | Required for payment features                     |
| `OPENAI_API_KEY`    | ⚠️ Optional\* | **MISSING**       | `undefined`                                                                   | Required for AI valuation features                |

**⚠️ \*Optional but affects functionality:**

- Without `STRIPE_SECRET_KEY`: Payment endpoints return errors
- Without `OPENAI_API_KEY`: AI valuation silently fails/returns placeholder

### Web (`apps/web/`)

| Variable        | Required   | Production Value | Current Default             | Notes                                        |
| --------------- | ---------- | ---------------- | --------------------------- | -------------------------------------------- |
| `VITE_API_BASE` | ✅ **YES** | **MISSING**      | `http://localhost:3001/api` | **BLOCKER:** Hardcoded localhost in fallback |

**Build-time variable:** Must be set BEFORE running `npm run build` (Vite embeds at build time)

### Mobile (`apps/mobile/`)

| Variable   | Required   | Production Value | Current Default             | Notes                                 |
| ---------- | ---------- | ---------------- | --------------------------- | ------------------------------------- |
| `API_BASE` | ✅ **YES** | **MISSING**      | `http://localhost:3001/api` | **BLOCKER:** Hardcoded in source code |

**⚠️ CRITICAL:** API_BASE is hardcoded in `apps/mobile/src/api.ts:4` - **NOT configurable via env var**

---

## 🗄️ DATABASE REQUIREMENTS

### Type

**MongoDB** (NoSQL document database)

### Version Requirements

- **Minimum:** MongoDB 4.4+ (based on Mongoose 7.8.7 compatibility)
- **Recommended:** MongoDB 5.0+ or 6.0+

### Connection String Format

```
Development: mongodb://localhost:27017/venturelab
Production:  mongodb+srv://<user>:<password>@<cluster>.mongodb.net/venturelab
```

### Collections (Auto-created by Mongoose)

1. **users** - User accounts and profiles
2. **ideas** - Idea documentation and metadata
3. **transactions** - Payment and equity transactions

### Indexes

**Auto-created by Mongoose:**

- `users.email` - Unique index
- `users.username` - Unique index
- `ideas.creatorId` - Reference index (implied by ref)

### Migrations

**❌ NO** - No migration system implemented  
**Strategy:** Mongoose creates collections on first document insert  
**Schema Changes:** Handled by Mongoose schema versioning (additive changes safe)

### Seed Data

**❌ NO** - No seed data scripts present  
**Fresh DB:** Works with empty database (users must register)

### Backups

**⚠️ NOT CONFIGURED** - Must be configured at database provider level (MongoDB Atlas auto-backup recommended)

---

## 🔨 BUILD REQUIREMENTS

### Backend

**Development Commands:**

```bash
npm run dev          # nodemon with ts-node (hot reload)
npm run build        # tsc (TypeScript compilation to dist/)
npm start            # node with ts-node/esm loader
```

**Production Build:**

```bash
cd packages/backend
npm ci --only=production  # Install production dependencies
npm run build             # Compile TypeScript to dist/
node dist/server.js       # Start server (OR use Docker)
```

**Docker Build:**

```bash
cd packages/backend
docker build -t venturelab-backend .
docker run -p 3001:3001 --env-file .env venturelab-backend
```

### Web

**Development Commands:**

```bash
npm start            # vite (dev server on port 3000)
npm run build        # vite build (outputs to dist/)
npm run preview      # Preview production build locally
```

**Production Build:**

```bash
cd apps/web
npm ci                       # Install all dependencies
VITE_API_BASE=https://your-api.com/api npm run build  # Build with API URL
# Output: dist/ folder (68 KB gzipped)
```

**Static Hosting Requirements:**

- SPA routing support (redirect all routes to `index.html`)
- HTTPS recommended (for secure token storage)

### Mobile

**Development Commands:**

```bash
npm start            # expo start
npm run android      # expo start --android
npm run ios          # expo start --ios
```

**Production Build:**

```bash
cd apps/mobile
eas build --platform ios       # iOS build (requires Apple account)
eas build --platform android   # Android build (requires Google account)
```

**Prerequisites:**

- Expo account (free)
- EAS CLI: `npm install -g eas-cli`
- iOS: Apple Developer Program ($99/year)
- Android: Google Play Console ($25 one-time)

### Runtime Environment

**Backend:**

- **Node.js:** `20.x` (LTS) - specified in Dockerfile `node:20-alpine`
- **Memory:** Minimum 512 MB (Docker health check runs every 30s)
- **Disk:** ~100 MB (node_modules + dist)

**Web:**

- **Static hosting:** Any (Vercel, Netlify, AWS S3+CloudFront, etc.)
- **No server runtime required** (SPA)

**Mobile:**

- **iOS:** Minimum iOS 13.0+ (typical Expo requirement)
- **Android:** Minimum API 21+ (Android 5.0+)

---

## 🚨 DEPLOYMENT BLOCKERS & CRITICAL ISSUES

### 🔴 CRITICAL BLOCKERS (Must Fix Before Deployment)

#### 1. **Hardcoded Localhost URLs**

**Severity:** CRITICAL ❌  
**Impact:** App will not work in production

**Affected Files:**

```typescript
// apps/web/src/api.ts:3
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3001/api';
// ❌ Fallback to localhost if VITE_API_BASE not set

// apps/mobile/src/api.ts:4
const API_BASE = 'http://localhost:3001/api';
// ❌❌ HARDCODED - No environment variable support!

// packages/backend/src/server.ts:22
origin: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000', ...];
// ❌ Fallback to localhost origins
```

**Fix Required:**

- ✅ Web: Set `VITE_API_BASE` environment variable before build
- ❌ Mobile: **MUST EDIT SOURCE CODE** - No env var support exists
- ✅ Backend: Set `CORS_ORIGINS` environment variable

#### 2. **Insecure JWT Secret Fallback**

**Severity:** CRITICAL 🔒  
**Impact:** Security vulnerability if JWT_SECRET not set

**Affected Files:**

```typescript
// packages/backend/src/routes/auth.ts:52
const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'secret', {
// ❌ Falls back to 'secret' if env var missing

// packages/backend/src/middleware/auth.ts:16
jwt.verify(token, process.env.JWT_SECRET || 'secret', (err: any, decoded: any) => {
// ❌ Uses 'secret' for verification if env var missing
```

**Fix Required:**

- MUST set `JWT_SECRET` environment variable in production
- SHOULD remove fallback and fail fast if missing

#### 3. **Mobile API URL Hardcoded**

**Severity:** CRITICAL ❌  
**Impact:** Mobile app cannot connect to production API

**Location:** `apps/mobile/src/api.ts:4`

**Current Code:**

```typescript
const API_BASE = "http://localhost:3001/api";
```

**Fix Required:**
Either:

1. Implement environment variable support (recommended):
   ```typescript
   import Constants from "expo-constants";
   const API_BASE =
     Constants.expoConfig?.extra?.apiUrl || "http://localhost:3001/api";
   ```
2. OR hardcode production URL before building (not recommended):
   ```typescript
   const API_BASE = "https://your-backend.onrender.com/api";
   ```

---

### 🟡 HIGH PRIORITY WARNINGS

#### 4. **CORS Configuration**

**Severity:** HIGH ⚠️  
**Impact:** Frontend requests will be blocked by browser

**Issue:** Backend CORS whitelist defaults to localhost  
**Production Requirement:** Must add production frontend URLs to `CORS_ORIGINS`

**Example:**

```bash
CORS_ORIGINS=https://venturelab-web.vercel.app,https://venturelab.com
```

#### 5. **Missing Environment Variables Template**

**Severity:** MEDIUM ⚠️  
**Impact:** Deployment confusion

**Available:** `.env.example` in `packages/backend/`  
**Missing:**

- No `.env.example` for web frontend (VITE_API_BASE)
- No guidance for mobile environment configuration

#### 6. **Database Connection String Fallback**

**Severity:** MEDIUM ⚠️  
**Impact:** Will try to connect to localhost MongoDB in production

**Location:** `packages/backend/src/db.ts:4`

```typescript
const mongoUri =
  uri || process.env.MONGODB_URI || "mongodb://localhost:27017/venturelab";
```

**Issue:** Falls back to localhost if `MONGODB_URI` not set  
**Fix Required:** MUST set `MONGODB_URI` in production environment

#### 7. **Stripe Key Fallback**

**Severity:** LOW (if payments not needed immediately) ⚠️  
**Impact:** Payment endpoints will fail

**Location:** `packages/backend/src/routes/payments.ts:7`

```typescript
const stripeKey = process.env.STRIPE_SECRET_KEY || "";
```

**Issue:** Stripe initialized with empty string if not set  
**Result:** Payment requests throw errors

---

### 🟢 LOW PRIORITY WARNINGS

#### 8. **Development Proxy Configuration**

**Severity:** LOW ℹ️  
**Impact:** Only affects local development

**Location:** `apps/web/vite.config.ts:9`

```typescript
proxy: { '/api': 'http://localhost:3001' }
```

**Note:** Only used in development mode, ignored in production build

#### 9. **Health Check Hardcoded Port**

**Severity:** LOW ℹ️  
**Impact:** Docker health check fails if PORT != 3001

**Location:** `packages/backend/Dockerfile:17`

```dockerfile
CMD node -e "require('http').get('http://localhost:3001/health', ...)"
```

**Issue:** Health check uses hardcoded port 3001  
**Fix Required:** Should use `$PORT` environment variable

#### 10. **No Error Tracking**

**Severity:** LOW ℹ️  
**Impact:** Hard to debug production issues

**Issue:** No Sentry, LogRocket, or error tracking service integrated  
**Recommendation:** Add before production launch

#### 11. **Rate Limiter Uses In-Memory Store**

**Severity:** LOW ℹ️  
**Impact:** Rate limits reset on server restart, not shared across instances

**Location:** `packages/backend/src/middleware/rateLimiter.ts`  
**Issue:** In-memory storage doesn't persist or share state  
**Recommendation:** Use Redis for production (multi-instance scaling)

---

## 📊 DEPLOYMENT READINESS SUMMARY

### ✅ READY FOR DEPLOYMENT

- [x] All code compiles without errors
- [x] Production builds succeed (backend, web)
- [x] TypeScript strict mode passes (all apps)
- [x] Docker containerization ready
- [x] Health check endpoint implemented
- [x] Security middleware (CORS, rate limiting, validation, logging)
- [x] Authentication system functional
- [x] Database models defined (Mongoose schemas)

### ❌ BLOCKERS BEFORE DEPLOYMENT

**Backend:**

- [ ] Set `MONGODB_URI` environment variable (production database)
- [ ] Set `JWT_SECRET` environment variable (secure random string, 32+ chars)
- [ ] Set `CORS_ORIGINS` environment variable (production frontend URLs)
- [ ] (Optional) Set `STRIPE_SECRET_KEY` for payments
- [ ] (Optional) Set `OPENAI_API_KEY` for AI features

**Web Frontend:**

- [ ] Set `VITE_API_BASE` environment variable before build
- [ ] Configure SPA routing on hosting platform (redirect to index.html)

**Mobile App:**

- [ ] **EDIT SOURCE CODE:** Change hardcoded `API_BASE` in `apps/mobile/src/api.ts`
- [ ] Or implement environment variable support
- [ ] Configure Expo app.json with production values

**Cross-cutting:**

- [ ] Create MongoDB Atlas account (or MongoDB host)
- [ ] Create production database and user
- [ ] Update CORS to include production frontend URL
- [ ] Generate secure JWT secret
- [ ] (Optional) Obtain Stripe API keys
- [ ] (Optional) Obtain OpenAI API key

---

## 🎯 RECOMMENDED DEPLOYMENT ORDER

### Phase 1: Database (5 min)

1. Create MongoDB Atlas free cluster (M0)
2. Create database user with password
3. Whitelist IP addresses (0.0.0.0/0 for cloud deployments)
4. Copy connection string

### Phase 2: Backend (10 min)

1. Choose hosting (Render.com recommended - free tier)
2. Set environment variables:
   - `MONGODB_URI` (from Phase 1)
   - `JWT_SECRET` (generate: 32+ random characters)
   - `PORT` (usually auto-set by platform)
   - `NODE_ENV=production`
   - `CORS_ORIGINS` (placeholder, update after Phase 3)
3. Deploy (Docker or build pack)
4. Test: `curl https://your-backend.com/health`
5. Note backend URL for next phases

### Phase 3: Web Frontend (10 min)

1. Choose hosting (Vercel recommended - free tier)
2. Set build environment variable:
   - `VITE_API_BASE=https://your-backend.com/api`
3. Configure framework: Vite
4. Set build command: `npm run build`
5. Set output directory: `dist`
6. Configure SPA routing (redirect /\* to /index.html)
7. Deploy
8. Note frontend URL

### Phase 4: Update CORS (2 min)

1. Return to backend hosting (Render)
2. Update `CORS_ORIGINS` environment variable
3. Add frontend URL from Phase 3
4. Redeploy backend

### Phase 5: Test (5 min)

1. Visit frontend URL
2. Register new account
3. Login
4. Browse marketplace
5. Verify API calls work (check browser network tab)

### Phase 6: Mobile (Optional - 1-2 hours)

1. Edit `apps/mobile/src/api.ts` with production API URL
2. Configure `app.json` for production
3. Build with EAS CLI
4. Submit to app stores (iOS: ~24-48 hours, Android: ~few hours)

---

## 🔍 FILESYSTEM ASSUMPTIONS

**None Detected** ✅

- No hardcoded file paths in code
- No assumptions about directory structure outside app folders
- All file operations use relative paths or Mongoose (database)
- Static assets referenced correctly via build tools

---

## 🔑 AUTHENTICATION REDIRECT URLs

**None Detected** ✅

- JWT-based authentication (no OAuth redirects)
- No third-party auth providers (Google, GitHub, etc.)
- Login returns token in JSON response
- Frontend stores token in localStorage (web) or SecureStore (mobile)
- No callback URLs or redirect URIs to configure

---

## ⚡ QUICK DEPLOYMENT CHECKLIST

**Copy this for your deployment:**

```
BACKEND ENVIRONMENT VARIABLES:
□ MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/venturelab
□ JWT_SECRET=[generate 32+ character random string]
□ PORT=[auto-assigned by platform]
□ NODE_ENV=production
□ CORS_ORIGINS=https://your-frontend.vercel.app
□ STRIPE_SECRET_KEY=sk_live_xxx (optional)
□ OPENAI_API_KEY=sk-xxx (optional)

WEB ENVIRONMENT VARIABLES:
□ VITE_API_BASE=https://your-backend.onrender.com/api

MOBILE CODE CHANGES:
□ Edit apps/mobile/src/api.ts line 4 (change localhost to production URL)

PLATFORM CONFIGURATIONS:
□ Backend: Docker or Node.js 20 buildpack
□ Web: Vite framework, build command: npm run build, output: dist
□ Web: SPA routing enabled (/* → /index.html)
□ Database: MongoDB Atlas M0 free cluster
□ Database: Network access: 0.0.0.0/0 (allow all)
□ Database: User created with read/write permissions

TESTING:
□ Health check: curl https://backend/health
□ Frontend: Visit URL, register, login
□ API calls: Check browser network tab for 200 responses
□ CORS: Verify no CORS errors in browser console
```

---

## 📝 FINAL NOTES

### Strengths

- ✅ Well-structured monorepo
- ✅ TypeScript throughout (type safety)
- ✅ Security middleware implemented
- ✅ Docker support ready
- ✅ Clean separation of concerns
- ✅ Comprehensive documentation

### Weaknesses

- ❌ Hardcoded localhost URLs in multiple places
- ❌ Insecure fallback values (JWT secret, CORS)
- ❌ Mobile app has no environment variable support
- ⚠️ No database migrations (relies on Mongoose auto-creation)
- ⚠️ No error tracking/monitoring
- ⚠️ Rate limiter not production-ready (in-memory)

### Estimated Deployment Time

- **Fastest Path** (Backend + Web only): 30 minutes
- **With Mobile:** 2-3 hours (including code changes)
- **With App Store Submission:** 1-7 days (review time)

### Estimated Monthly Cost (Free Tier)

- **MongoDB Atlas (M0):** $0/month
- **Render.com (Free):** $0/month
- **Vercel (Hobby):** $0/month
- **Total:** $0/month ✅

**Last Updated:** December 1, 2025  
**Document Version:** 1.0
