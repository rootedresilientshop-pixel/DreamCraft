# Local Testing Guide - Phase 1 & 2

**Commit:** d41592d
**Status:** Ready to test

---

## Setup (One-time)

### 1. Install Dependencies (if not already done)
```bash
npm install
cd apps/web && npm install
cd ../../packages/backend && npm install
cd ../..
```

### 2. Environment Variables

**packages/backend/.env**
```
MONGODB_URI=mongodb://localhost:27017/venturelab
JWT_SECRET=test-secret-key-for-local-dev-only-123456789
PORT=3002
NODE_ENV=development
VITE_API_BASE=http://localhost:3002/api
```

**apps/web/.env**
```
VITE_API_BASE=http://localhost:3002/api
```

---

## Start Development Servers

### Terminal 1 - Backend (Port 3002)
```bash
cd packages/backend
npm run dev
```
**Expected output:**
```
Server running on port 3002
MongoDB connected
```

### Terminal 2 - Frontend (Port 5173)
```bash
cd apps/web
npm run dev
```
**Expected output:**
```
  VITE v5.4.21  ready in 234 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h + enter to show help
```

### Terminal 3 - Testing/Monitoring
```bash
# You'll use this to run commands and monitor
cd VentureLab
```

---

## Testing Checklist

### Phase 1: Bugfixes

#### Test 1: Valuation Percentages (6500% → 65%)
1. Open http://localhost:5173 in browser
2. Navigate to an idea that has AI valuation
3. Look at the "Valuation Metrics" section
4. **Expected:** AI Score shows "65%" (not "6500%")
5. **Expected:** Confidence shows percentage (not multiplied by 100)

**Files to check:**
- [apps/web/src/pages/IdeaDetailPage.tsx:331](apps/web/src/pages/IdeaDetailPage.tsx#L331)
- [apps/web/src/pages/IdeaDetailPage.tsx:349](apps/web/src/pages/IdeaDetailPage.tsx#L349)

---

#### Test 2: Auto-redirect Race Condition
1. Go to /create-idea page
2. Fill in title and description
3. Click "Create Idea" button
4. AI validation modal should appear
5. **Expected:** Modal STAYS visible showing validation results
6. **Expected:** Modal does NOT auto-redirect to dashboard
7. Click "Continue to Dashboard" button to proceed
8. Should navigate to /dashboard

**Files to check:**
- [apps/web/src/pages/CreateIdeaPage.tsx:125](apps/web/src/pages/CreateIdeaPage.tsx#L125)

---

#### Test 3: AI Suggestions Display
1. Go to /create-idea page
2. Fill in title and description
3. Click "Get AI Suggestions" button
4. **Expected:** Suggestions appear with:
   - "Improvement Ideas" section with suggestions list
   - "Risk Factors to Address" section
   - "Preliminary Score" with a number
5. **OR if no data:** "Feature coming soon" message appears
6. **NOT Expected:** Empty blank space

**Files to check:**
- [apps/web/src/pages/CreateIdeaPage.tsx:336-389](apps/web/src/pages/CreateIdeaPage.tsx#L336-L389)

---

#### Test 4: Templates Loading
1. Go to /create-idea page
2. **Expected:** Templates appear in purple box at top
   - Shows template cards (icons + names)
3. Click on a template (e.g., "SaaS", "Marketplace")
4. **Expected:** Modal opens showing template details
5. Click "Use This Template"
6. **Expected:** Template form loads with pre-filled sections

**Files to check:**
- [apps/web/src/api.ts:235-238](apps/web/src/api.ts#L235-L238)
- [apps/web/src/pages/CreateIdeaPage.tsx:31-43](apps/web/src/pages/CreateIdeaPage.tsx#L31-L43)

---

#### Test 5: Sample Data Script Removed
1. In Terminal 3, run:
```bash
npm run db:clear-and-samples
```
2. **Expected:** Command fails with "script not found" error
3. **Verify:** `npm run` shows only these scripts:
   - `mobile`
   - `web`
   - `backend`
   - `start:web`
   - `start:mobile:clear`
   - `start:mobile`
   - `db:clear`
   - `templates:seed`
4. **NOT present:** `db:clear-and-samples`

**Files to check:**
- [package.json:6-15](package.json#L6-L15)

---

#### Test 6: "Coming Soon" Labels
1. Go to /create-idea page
2. Click "Get AI Suggestions" with empty/minimal content
3. If suggestions are empty, **Expected:** Message says:
   > "✨ Feature coming soon - AI suggestions will be available in a future update"
4. **Not Expected:** Blank empty space

**Files to check:**
- [apps/web/src/pages/CreateIdeaPage.tsx:365-390](apps/web/src/pages/CreateIdeaPage.tsx#L365-L390)

---

### Phase 2: Collaboration Guardrails Feature

#### Test 7: Collaboration Terms Form
1. Go to an idea you **didn't create**
2. Click "👥 Collaborate" button
3. **Expected:** Modal appears with title "📋 Collaboration Terms"
4. **Expected:** 4 input fields visible:
   - Time Commitment (hours/week) - number input, 0-168
   - Equity Percentage (%) - number input, 0-100
   - Success Definition - textarea
   - Timeline to MVP - text input
5. Fill in some values:
   - Time Commitment: 20
   - Equity Percentage: 30
   - Success Definition: "Launch MVP with core features"
   - Timeline to MVP: "8 weeks"
6. Click "✓ Propose Collaboration"
7. **Expected:** Form closes, NDA modal appears
8. Accept or decline NDA

**Files to check:**
- [apps/web/src/pages/IdeaDetailPage.tsx:549-719](apps/web/src/pages/IdeaDetailPage.tsx#L549-L719)
- [apps/web/src/api.ts:138-159](apps/web/src/api.ts#L138-L159)

---

#### Test 8: Database Verification
1. After proposing collaboration with terms filled in:
2. Open MongoDB compass or mongosh
3. Query database:
```bash
mongosh venturelab
db.collaborations.findOne({}, {sort: {createdAt: -1}})
```
4. **Expected:** Document contains:
```json
{
  timeCommitment: 20,
  equityPercentage: 30,
  successDefinition: "Launch MVP with core features",
  timelineToMVP: "8 weeks",
  // ... other fields
}
```

**Files to check:**
- [packages/backend/src/models/Collaboration.ts:35-45](packages/backend/src/models/Collaboration.ts#L35-L45)
- [packages/backend/src/routes/collaborators.ts:68-143](packages/backend/src/routes/collaborators.ts#L68-L143)

---

### Edge Cases to Test

#### Optional Fields
1. Propose collaboration leaving all 4 terms fields blank
2. **Expected:** Should work fine, proceed to NDA
3. Check database: fields should be null/undefined

#### Partial Fills
1. Propose collaboration with only equity (30%)
2. Leave other 3 fields blank
3. **Expected:** Works, database shows only equityPercentage: 30

#### Browser Validation
1. Try to enter 169 hours in Time Commitment
2. **Expected:** Browser prevents submit (max is 168)
3. Try to enter 101% in Equity
4. **Expected:** Browser prevents submit (max is 100)

#### Cancel Form
1. Click "Collaborate"
2. Modal opens
3. Click "Cancel" button
4. **Expected:** Modal closes, returns to idea page

---

## Browser Console Checks

While testing, open DevTools (F12) and check:
- No red error messages
- Network tab: No 500 errors
- No TypeScript type errors
- WebSocket connection should be established

---

## Backend Logs to Monitor

While testing, watch Terminal 1 (backend) for:
- No `[ERROR]` messages
- No database connection issues
- Request logs showing POST /collaborators/invite
- Response logs showing 200 success

---

## Quick Reference

### Important URLs
- **Frontend:** http://localhost:5173
- **API Base:** http://localhost:3002/api
- **Health Check:** http://localhost:3002/api/health

### Key Files Changed
```
Backend:
  packages/backend/src/models/Collaboration.ts        (4 new fields)
  packages/backend/src/routes/collaborators.ts        (updated endpoint)

Frontend:
  apps/web/src/api.ts                                (getTemplates, inviteCollaborator)
  apps/web/src/pages/IdeaDetailPage.tsx              (percentage fix, terms form)
  apps/web/src/pages/CreateIdeaPage.tsx              (templates, suggestions, labels)

Config:
  package.json                                        (removed db:clear-and-samples)
```

---

## Troubleshooting

### Backend won't start
```bash
# Check if port 3002 is in use
lsof -i :3002  # or on Windows: netstat -ano | findstr 3002

# Kill the process
kill -9 <PID>

# Try again
npm run dev
```

### MongoDB connection error
```bash
# Make sure MongoDB is running
# Check connection string in .env
# Default: mongodb://localhost:27017/venturelab

# Test connection
mongosh mongodb://localhost:27017/venturelab
```

### Frontend won't start
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Network errors
- Make sure both servers are running
- Check VITE_API_BASE matches backend URL
- Check browser console for CORS errors

---

## After Testing

1. Document any issues found
2. Check if all 8 tests pass
3. Verify edge cases work correctly
4. Ready to deploy to staging/production

---

**Happy testing! Report findings back here.**
