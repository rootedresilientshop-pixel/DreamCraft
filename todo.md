# VentureLab Feedback Fixes - Implementation Plan

## Goal
Fix 7 user-reported issues across the VentureLab codebase using minimal, targeted changes.

## Issues to Fix

### Issue 1: Valuation Percentages (6500% → 65%)
**Problem**: Double multiplication of scores in frontend
**Root Cause**: Backend returns 0-100, frontend multiplies by 100 again
**Files**: apps/web/src/pages/IdeaDetailPage.tsx:331, 349
**Fix**: Remove the × 100 multiplication in frontend

- [ ] Fix percentage display in IdeaDetailPage.tsx

### Issue 2: Valuation Visibility (Auto-redirect bug)
**Problem**: Modal redirects too quickly, user can't read results
**Root Cause**: Race condition with setTimeout not awaiting state update
**Files**: apps/web/src/pages/CreateIdeaPage.tsx:124-133
**Fix**: Remove setTimeout or increase delay to let validation results display

- [ ] Fix redirect timing in CreateIdeaPage.tsx

### Issue 3: Suggestions Not Appearing
**Problem**: AI suggestions are returned but not displayed
**Root Cause**: Data format mismatch between backend and frontend
**Files**: packages/backend/src/routes/ideas.ts:282-285, apps/web/src/pages/IdeaDetailPage.tsx (suggestions rendering)
**Fix**: Standardize data format or adjust frontend parsing

- [ ] Fix suggestions data format issue

### Issue 4: Templates Missing from Create Idea
**Problem**: Templates don't load in idea creation form
**Root Cause**: Wrong API call using relative path instead of API client
**Files**: apps/web/src/pages/CreateIdeaPage.tsx:33
**Fix**: Replace fetch('/api/templates') with proper API client call

- [ ] Fix templates API call in CreateIdeaPage.tsx

### Issue 5: Collaboration Terms (NEW FEATURE - Phase 2)
**Problem**: Collaborators agree without clarity on roles, time, equity, timeline
**Approach**: Add required guardrail fields when collaboration starts (not payments yet)
**Fields to add**: Role, Time Commitment (hrs/week), Equity Split %, Success Definition, Timeline to MVP
**Files**: packages/backend/src/models/Collaboration.ts, apps/web/src/components/CollaborationForm.tsx
**Note**: Future legal docs will consume this data structure

- [ ] Add collaboration terms to backend schema
- [ ] Update frontend form to include new fields
- [ ] Update validation and API handling

### Issue 6: Sample Ideas Feature Cleanup (BUGFIX)
**Problem**: Sample data generation script exists but users should create ideas, not use pre-seeded samples
**Root Cause**: db:clear-and-samples script left over - misconstrued feature
**Files**: package.json (root)
**Fix**: Remove db:clear-and-samples script entirely

- [ ] Remove sample data script from root package.json

### Issue 7: AI Feature Labels (BUGFIX)
**Problem**: Broken AI suggestions show empty response - looks like bug instead of "coming soon"
**Root Cause**: Missing "Feature Coming Soon" labels on incomplete AI features
**Files**: apps/web/src/pages/IdeaDetailPage.tsx
**Fix**: Add "Feature Coming Soon" message to suggestion blocks that return empty

- [ ] Add "Feature Coming Soon" labels to broken AI features

## Execution Order
1. **Phase 1 - Fixes** (Issues #1-4, #6-7): Critical bugs and cleanups ✅ COMPLETE
   - ✅ Issue #1: Fixed percentage display (removed × 100 multiplication)
   - ✅ Issue #2: Fixed auto-redirect race condition (check validation instead of showValidation)
   - ✅ Issue #3: Fixed suggestions data format (adapted frontend to backend format)
   - ✅ Issue #4: Fixed templates API call (use api.getTemplates() instead of fetch)
   - ✅ Issue #6: Removed db:clear-and-samples script from package.json
   - ✅ Issue #7: Added "Feature Coming Soon" fallback for empty AI suggestions
2. **Phase 2 - New Feature** (Issue #5): Collaboration terms guardrails ✅ COMPLETE
   - ✅ Added collaboration terms fields to Collaboration schema (timeCommitment, equityPercentage, successDefinition, timelineToMVP)
   - ✅ Updated backend /collaborators/invite endpoint to accept and store terms
   - ✅ Created collaboration terms form modal in IdeaDetailPage
   - ✅ Updated frontend API client to pass new fields

---

## Review

### Summary of Changes
**Phase 1 & 2 Complete** - All user feedback issues fixed + collaboration guardrails implemented

#### Phase 1 (Bugfixes)
- Fixed double-multiplication bug causing 6500% percentages → now displays 65% correctly
- Fixed race condition in idea creation causing auto-redirect before validation results visible
- Fixed AI suggestions data format mismatch (backend returns different structure than frontend expected)
- Fixed templates API call using fetch instead of proper API client
- Removed sample ideas generation script (db:clear-and-samples)
- Added "Feature Coming Soon" labels to empty AI suggestion blocks

#### Phase 2 (New Feature - Collaboration Guardrails)
- Added 4 new collaboration terms fields to database schema:
  - **timeCommitment**: Hours per week expected from collaborator
  - **equityPercentage**: Equity percentage being offered
  - **successDefinition**: What MVP success looks like (free-form text)
  - **timelineToMVP**: Expected timeline (e.g., "8 weeks", "3 months")
- Created modal form that appears when user clicks "Collaborate"
  - All fields optional (not forcing users to fill everything)
  - Form validates input (hours 0-168, equity 0-100)
  - Fields are saved to database when collaboration is proposed
- Flow now: Click "Collaborate" → Fill terms (optional) → Accept NDA → Collaboration starts
- Future legal documents can reference these agreed terms as foundation

### Files Affected
**Backend:**
- `packages/backend/src/models/Collaboration.ts` - Added 4 new fields to schema
- `packages/backend/src/routes/collaborators.ts` - Updated /invite endpoint to accept new fields

**Frontend:**
- `apps/web/src/pages/IdeaDetailPage.tsx` - Added collaboration terms form modal, updated handlers
- `apps/web/src/api.ts` - Added getTemplates() method, updated inviteCollaborator() signature
- `apps/web/src/pages/CreateIdeaPage.tsx` - Fixed templates loading, fixed suggestions rendering, added feature labels
- `package.json` (root) - Removed db:clear-and-samples script

### Follow-ups Needed
1. **Database Migration**: Existing Collaboration documents won't have new fields (optional, not required)
2. **Display Terms in Collaboration View**: Add a section showing agreed terms when viewing collaboration details
3. **Terms Amendment**: Add ability for both parties to view/renegotiate terms after initial agreement
4. **Legal Doc Integration**: When implementing actual legal documents, consume these stored terms as data

### Concerns
- **Optional Fields**: Terms are optional right now (good for MVP). If you want to make certain fields required later, just add validation in backend route.
- **Display**: Currently terms are only stored, not displayed back to users. Should add a section showing agreed terms in collaboration details page.
- **No Amendment Flow**: Once agreed, terms can't be changed via UI (only via database). Future feature could add renegotiation flow.
