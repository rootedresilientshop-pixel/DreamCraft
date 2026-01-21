# Testing Summary - Quick Reference

## What We're Testing

### Phase 1: 6 Bugfixes
1. **Valuation Percentages** - Should show 65%, not 6500%
2. **Auto-redirect Bug** - Modal should stay visible after validation
3. **AI Suggestions** - Should display or show "Coming Soon"
4. **Templates Loading** - Should load templates in create idea form
5. **Sample Script Removed** - npm run db:clear-and-samples should fail
6. **Coming Soon Labels** - Empty suggestions should have message

### Phase 2: Collaboration Guardrails Feature
7. **Collaboration Terms Form** - Should appear with 4 fields when clicking Collaborate
8. **Database Verification** - Terms should be saved to MongoDB

---

## How to Test

### Option 1: Manual Testing (Fastest)
1. Start servers locally
2. Open browser to http://localhost:5173
3. Follow test scenarios in LOCAL_TESTING.md
4. Report findings

### Option 2: Automated Testing
We can write test scripts to validate the changes programmatically

---

## Key Test Scenarios

### Test 1: Valuation Display
```
1. Open any idea with valuation
2. Look for "Valuation Metrics" section
3. Check: AI Score shows as percentage (e.g., "65%")
4. Check: Confidence shows as percentage (e.g., "78%")
```

**Expected Result:** ✅ Both percentages display correctly without extra digits

---

### Test 2: Idea Creation + Validation
```
1. Navigate to /create-idea
2. Fill title: "My Test Idea"
3. Fill description: "This is a test description"
4. Click "Create Idea"
5. Wait for validation modal
```

**Expected Result:** ✅ Modal appears and STAYS visible until you click "Continue"

---

### Test 3: AI Suggestions
```
1. On /create-idea page
2. Fill title and description
3. Click "Get AI Suggestions" button
4. Look at suggestions block
```

**Expected Result:** ✅ Either:
- Suggestions appear with content
- OR message shows "Feature coming soon"

**NOT Expected:** ❌ Blank empty space

---

### Test 4: Templates
```
1. Go to /create-idea
2. Look for template section at top (purple box)
```

**Expected Result:** ✅ Templates load and display

---

### Test 5: Collaboration Terms
```
1. Find an idea you didn't create
2. Click "👥 Collaborate" button
3. Modal appears with 4 fields
4. Fill: Time: 20, Equity: 30, Success: "Launch", Timeline: "8 weeks"
5. Click "✓ Propose Collaboration"
6. NDA modal appears
```

**Expected Result:** ✅ Terms form works, saves to database

---

## Quick Commands

### Check Sample Script Removed
```bash
npm run
# Should NOT show db:clear-and-samples
```

### Check Database (After Test 5)
```bash
mongosh venturelab
db.collaborations.findOne({}, {sort: {createdAt: -1}})
```

Should show:
```json
{
  timeCommitment: 20,
  equityPercentage: 30,
  successDefinition: "Launch",
  timelineToMVP: "8 weeks"
}
```

---

## Status Tracker

As you test, report back with:

```
Test 1 (Percentages): ✅ PASS / ❌ FAIL / 🔍 NOTES
Test 2 (Auto-redirect): ✅ PASS / ❌ FAIL / 🔍 NOTES
Test 3 (Suggestions): ✅ PASS / ❌ FAIL / 🔍 NOTES
Test 4 (Templates): ✅ PASS / ❌ FAIL / 🔍 NOTES
Test 5 (Script Removed): ✅ PASS / ❌ FAIL / 🔍 NOTES
Test 6 (Coming Soon): ✅ PASS / ❌ FAIL / 🔍 NOTES
Test 7 (Terms Form): ✅ PASS / ❌ FAIL / 🔍 NOTES
Test 8 (Database): ✅ PASS / ❌ FAIL / 🔍 NOTES
```

---

## Next Steps

1. **Start servers** and begin testing
2. **Report findings** for each test
3. **If all pass:** Ready for staging/production deployment
4. **If failures:** I'll debug and fix immediately

Ready to test?
