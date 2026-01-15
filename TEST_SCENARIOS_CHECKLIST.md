# VentureLab Test Scenarios Checklist

**Version:** 1.0
**Date:** January 15, 2026
**Status:** Ready for Beta Testing

---

## Quick Reference

**Total Tests:** 15 scenarios
**Total Time:** ~45 minutes
**Test Accounts Needed:** 2 (Creator + Collaborator)

---

## Creator Flow Tests

### Test Suite 1: Dashboard Experience

#### [ ] Test 1.1: Dashboard Loads Without Errors
**Time:** 2 mins
**Steps:**
1. Login as Creator
2. Verify dashboard displays
3. Check all stats load

**Acceptance Criteria:**
- No errors in console (F12)
- All stat cards populated
- Page responsive
- Navigation working

---

#### [ ] Test 1.2: Dashboard Navigation Works
**Time:** 2 mins
**Steps:**
1. Click each tab: Overview, Ideas, Invitations
2. Verify content changes
3. Click back to Overview

**Acceptance Criteria:**
- All tabs functional
- Content updates correctly
- No lag or freezing

---

#### [ ] Test 1.3: Quick Actions Visible and Working
**Time:** 2 mins
**Steps:**
1. Verify 4 action buttons visible
2. Click "Start a New Idea"
3. Verify navigation to create form

**Acceptance Criteria:**
- All buttons visible
- Buttons responsive
- Navigation works

---

### Test Suite 2: Create Idea with Templates

#### [ ] Test 2.1: Template Selection Modal
**Time:** 2 mins
**Steps:**
1. Click "Start a New Idea"
2. Modal appears with templates
3. Verify all 4 templates visible

**Acceptance Criteria:**
- Modal displays correctly
- 4 templates shown (SaaS, Mobile, Healthcare, Marketplace)
- Icons visible
- Descriptions readable
- Modal dismissible

---

#### [ ] Test 2.2: Select and Preview Template
**Time:** 2 mins
**Steps:**
1. Click on SaaS Product template
2. Template detail view shows
3. Read sections listed
4. Click "Use This Template"

**Acceptance Criteria:**
- Template preview shows
- Sections listed clearly
- "Use This Template" button visible
- Button responsive

---

#### [ ] Test 2.3: Form Renders All Sections
**Time:** 2 mins
**Steps:**
1. Form appears after template selection
2. Verify all sections visible
3. Check progress bar shows "0/5"

**Acceptance Criteria:**
- All 5 sections render
- Progress bar present
- Section titles clear
- Required/optional indicators visible
- Word targets shown

---

#### [ ] Test 2.4: Section 1 - Word Counter Accuracy
**Time:** 3 mins
**Steps:**
1. Click "The Problem" textarea
2. Type: "This is a test with five words" (5 words)
3. Verify counter shows "5 words"
4. Type more text to reach 150 words
5. Verify color changes and badge updates

**Acceptance Criteria:**
- Counter accurate (±1 word)
- Color orange when < 50% target
- Color green when ≥ 80% target
- Badge shows "⚠ More needed" → "✓ Good"
- Updates real-time as typing

---

#### [ ] Test 2.5: Hints Toggle Works
**Time:** 2 mins
**Steps:**
1. Click "💡 Tips (X)" button
2. Hints list expands
3. Read hints
4. Click again to collapse
5. Click to expand again

**Acceptance Criteria:**
- Button shows hint count
- Hints expand/collapse smoothly
- All hints readable
- Toggle responsive
- No layout shift

---

#### [ ] Test 2.6: Fill Multiple Sections
**Time:** 5 mins
**Steps:**
1. Fill Section 1: "The Problem" (150+ words)
2. Progress bar updates to 1/5
3. Fill Section 2: "Your Solution" (200+ words)
4. Progress bar updates to 2/5
5. Repeat for Sections 3 & 4
6. Leave Section 5 empty (optional)

**Acceptance Criteria:**
- Progress updates correctly
- Can fill all sections
- Optional section not required
- Word counters accurate
- No validation errors until submit

---

#### [ ] Test 2.7: AI Suggestion Feature
**Time:** 3 mins
**Steps:**
1. In Section 2, click "✨ Get AI Suggestion"
2. Button shows "Getting suggestion..."
3. Suggestion appears in purple box
4. Read suggestion
5. Click "Use This"
6. Suggestion appends to textarea
7. Word counter updates

**Acceptance Criteria:**
- Button shows loading state
- Suggestion loads within 3 seconds
- Suggestion box formatted correctly
- "Use This" appends text
- Word counter updates
- Suggestion clears after use

---

#### [ ] Test 2.8: Form Validation on Submit
**Time:** 3 mins
**Steps:**
1. Clear Section 1 (required)
2. Try to submit form
3. Validation error appears
4. Error message specific to section
5. Fill section and submit
6. Form submits successfully

**Acceptance Criteria:**
- Validation blocks submission
- Error message clear
- Error clears when user types
- Can submit after fixing errors
- No form data lost

---

#### [ ] Test 2.9: Submission and Validation Modal
**Time:** 3 mins
**Steps:**
1. Submit completed form
2. Loading state shows "⏳ Creating Idea..."
3. Validation modal appears
4. Read score, valuation, strengths, weaknesses
5. Close modal

**Acceptance Criteria:**
- Loading state visible
- Modal appears with idea score
- Valuation shown
- Strengths/weaknesses listed
- Can close modal
- Redirected to dashboard

---

#### [ ] Test 2.10: New Idea Appears in Dashboard
**Time:** 2 mins
**Steps:**
1. Go to Ideas tab
2. Find newly created idea
3. Verify title, status, details

**Acceptance Criteria:**
- Idea appears in list
- Title correct
- Status shows (draft/published)
- Can click to view full idea

---

### Test Suite 3: Find Collaborators

#### [ ] Test 3.1: Search and Invite Collaborators
**Time:** 3 mins
**Steps:**
1. Click "Find Collaborators"
2. See collaborator grid
3. Search for skill: "React"
4. Click "Invite" on a collaborator
5. Modal appears
6. Select idea and role
7. Write optional message
8. Send invite
9. Button updates to "✓ Invited"

**Acceptance Criteria:**
- Search works
- Collaborators display
- Invite modal appears
- Can select idea/role
- Can write message
- Invite sends
- Button state updates

---

### Test Suite 4: Browse Marketplace

#### [ ] Test 4.1: View Ideas and Favorite
**Time:** 3 mins
**Steps:**
1. Click "Browse Ideas"
2. See idea grid
3. Click favorite heart on cards
4. Border color changes to gold
5. Click again to unfavorite
6. Color changes back to blue

**Acceptance Criteria:**
- Ideas display in grid
- Each card shows key info
- Favorite button responsive
- Color changes on toggle
- Visual feedback clear

---

## Collaborator Flow Tests

### Test Suite 5: Dashboard and Discovery

#### [ ] Test 5.1: Collaborator Dashboard Loads
**Time:** 2 mins
**Steps:**
1. Login as Collaborator
2. Dashboard displays
3. Check all sections visible

**Acceptance Criteria:**
- Dashboard loads without errors
- Stats cards populated
- All tabs accessible
- Navigation working

---

#### [ ] Test 5.2: Browse Ideas from Dashboard
**Time:** 3 mins
**Steps:**
1. Click "Browse Ideas" button
2. Marketplace displays
3. Verify ideas showing
4. Click search
5. Search for keyword
6. Results filter

**Acceptance Criteria:**
- Ideas load
- Each card shows: title, creator, category, description
- Search functional
- Results update
- Cards clickable

---

#### [ ] Test 5.3: Evaluate Idea Quickly
**Time:** 4 mins
**Steps:**
1. Click on an idea
2. Read idea details
3. Check if template used (look for section headings)
4. Time yourself - how long to understand fit?
5. Go back to list

**Acceptance Criteria:**
- Detail page loads
- Content readable
- If templated: sections clearly marked
- Can understand fit in < 5 minutes
- Navigation back works

---

#### [ ] Test 5.4: Propose Collaboration
**Time:** 3 mins
**Steps:**
1. On idea detail page, click "Propose Collaboration"
2. Modal/form appears
3. Select role from dropdown
4. Write pitch (2-3 sentences)
5. Add portfolio link (optional)
6. Submit proposal
7. Confirmation appears

**Acceptance Criteria:**
- Proposal form displays
- Can select role
- Can type pitch
- Can add link
- Form validates
- Submits successfully
- Success message appears

---

#### [ ] Test 5.5: Manage Invitations
**Time:** 2 mins
**Steps:**
1. Go to Invitations tab
2. View any invitations
3. Click "✓ Accept"
4. Invitation moves to Active Collaborations
5. Collaborator can see collaborator in their idea

**Acceptance Criteria:**
- Invitations tab accessible
- Can see offers
- Accept button works
- State updates correctly
- Creator also sees update

---

#### [ ] Test 5.6: View Active Collaborations
**Time:** 2 mins
**Steps:**
1. Go to Active Collaborations tab
2. See current projects
3. Click "Message"
4. Chat interface appears
5. Type and send message
6. Message appears in chat

**Acceptance Criteria:**
- Collaborations visible
- Can view each project
- Message interface accessible
- Messages send
- Conversations persist

---

### Test Suite 6: Cross-Account Workflow

#### [ ] Test 6.1: Creator Invites Collaborator
**Time:** 5 mins
**Steps:**
1. Creator: Find Collaborators → Search for test collaborator account
2. Creator: Click Invite
3. Creator: Select idea and role
4. Creator: Send invite
5. Verify invite sends successfully

**Acceptance Criteria:**
- Search finds collaborator
- Invite modal works
- Can select idea/role
- Invite sends
- No errors

---

#### [ ] Test 6.2: Collaborator Receives and Accepts
**Time:** 5 mins
**Steps:**
1. Switch to Collaborator account
2. Check Invitations tab
3. See invitation from creator
4. Read details
5. Click "✓ Accept"
6. Acceptance confirmed

**Acceptance Criteria:**
- Invitation appears in tab
- Shows creator name
- Shows idea title
- Shows role
- Accept works
- Moves to Active Collaborations

---

#### [ ] Test 6.3: Both See Updated State
**Time:** 3 mins
**Steps:**
1. Creator: View the idea
2. Check collaborators list
3. Verify collaborator name appears with correct role
4. Collaborator: View idea in Active Collaborations
5. Check collaborator can see creator info

**Acceptance Criteria:**
- Creator sees collaborator added
- Collaborator sees active project
- Both see same info
- Role displays correctly
- Status consistent

---

## Non-Functional Tests

### Test Suite 7: Performance

#### [ ] Test 7.1: Form Load Time
**Time:** 1 min
**Steps:**
1. Click "Start a New Idea"
2. Note time for template modal to appear
3. Click template
4. Note time for form to render

**Acceptance Criteria:**
- Modal appears instantly (< 500ms)
- Form renders smoothly
- No lag or jank
- Transitions smooth

---

#### [ ] Test 7.2: Search Performance
**Time:** 2 mins
**Steps:**
1. Go to search
2. Type search term slowly
3. Watch results update
4. No lag between typing and results

**Acceptance Criteria:**
- Real-time results (< 500ms)
- No UI freezing
- Responsive typing
- Results accurate

---

### Test Suite 8: Mobile Responsiveness

#### [ ] Test 8.1: Mobile Layouts
**Time:** 3 mins
**Steps:**
1. Open DevTools (F12)
2. Click mobile icon
3. Set width to 375px (iPhone)
4. Test form sections
5. Try to fill textarea
6. Check buttons are tappable
7. Verify no horizontal scroll

**Acceptance Criteria:**
- Text readable at mobile width
- Form sections stack vertically
- Textareas work
- Buttons > 44px (tappable)
- No horizontal scrolling
- Touch-friendly spacing

---

## Test Execution Plan

### Session 1: Creator Flow (20 mins)
1. Test 1.1 - 1.3: Dashboard (6 mins)
2. Test 2.1 - 2.10: Create Idea (20 mins)
3. Test 3.1: Find Collaborators (3 mins)
4. Test 4.1: Browse Ideas (3 mins)

### Session 2: Collaborator Flow (20 mins)
1. Test 5.1 - 5.2: Dashboard & Browse (5 mins)
2. Test 5.3 - 5.4: Evaluate & Propose (7 mins)
3. Test 5.5 - 5.6: Invitations & Collaborations (4 mins)

### Session 3: Integration (10 mins)
1. Test 6.1 - 6.3: Cross-Account Flow (10 mins)

### Session 4: Non-Functional (5 mins)
1. Test 7.1 - 7.2: Performance (3 mins)
2. Test 8.1: Mobile (3 mins)

---

## Scoring Guide

### Bug Severity

**Critical 🔴**
- App crashes
- Cannot complete core flow
- Data loss
- Security issue
Count: ___

**High 🟠**
- Major feature broken
- Confusing UX
- Incorrect data
Count: ___

**Medium 🟡**
- Feature partially broken
- Minor UX confusion
- Small data issue
Count: ___

**Low 🟢**
- UI issue
- Typo
- Minor enhancement
Count: ___

---

## Test Report Summary

### Test Execution Summary

**Date:** _______________
**Tester:** _____________
**Browser:** ____________
**Device:** _____________

**Tests Executed:** ___ / 22
**Tests Passed:** ___
**Tests Failed:** ___
**Pass Rate:** ___%

**Critical Bugs:** ___
**High Bugs:** ___
**Medium Bugs:** ___
**Low Bugs:** ___

**Total Issues:** ___

---

## Post-Test Checklist

Before submitting results:

- [ ] Completed at least 15/22 tests
- [ ] Reported all bugs found
- [ ] Included screenshots for bugs
- [ ] Filled out feedback form
- [ ] Noted confusing flows
- [ ] Suggested improvements
- [ ] Tested on desktop
- [ ] Tested on mobile (if possible)
- [ ] Checked console for errors (F12)

---

## Thank You!

Your testing helps make VentureLab better for everyone.

Submit your results to: `#venturelab-testing` Slack channel

Questions? Contact your testing coordinator.

---

**Ready to test?** Start with Session 1! 🚀
