# 🧪 DreamCraft Golden Path Testing Checklist

**Date Created:** 2025-12-05
**Status:** Ready for Testing
**Tester:** [Your Name]
**Test Date:** ___________

---

## 📋 Test Overview

This checklist covers the critical "golden path" user journeys across all platforms. Each section should be completed systematically, and any issues should be documented in the "Issues Found" section.

**Estimated Time:** 45-60 minutes per platform
**Platforms to Test:** Web (Desktop), Web (Mobile), Mobile App (iOS/Android)

---

## Part 1: Web App Testing (Desktop)

### 1.1 - Initial Setup
- [ ] Open https://dreamcraft-web.vercel.app in a fresh incognito/private window
- [ ] Verify page loads without errors
- [ ] Check DevTools Console (F12) - note any errors or warnings
- [ ] Check Network tab - verify all requests complete successfully
- [ ] Record Browser/OS: _________________

**Issues Found:**
```
[Notes on any startup issues]
```

---

### 1.2 - Sign-Up Flow

#### 1.2a - Registration Page
- [ ] Click "Sign Up" or "Register" button
- [ ] Verify form loads with:
  - [ ] Email input field
  - [ ] Password input field
  - [ ] Confirm Password field (if present)
  - [ ] Submit button
  - [ ] Link to login page
- [ ] Check styling matches dark theme (consistent with screenshots)

#### 1.2b - Valid Registration
- [ ] Enter unique email: `test_user_[timestamp]@example.com`
  - Example: `test_user_120525_1430@example.com`
- [ ] Enter strong password: `TestPass123!@`
- [ ] Confirm password matches
- [ ] Click Submit/Register button
- [ ] Wait for response (should see success message or redirect)
- [ ] Check DevTools Console for token: Should log `Token saved to localStorage: eyJ...`
- [ ] Verify redirect to dashboard/marketplace (may take ~200ms)
- [ ] Check if user can see idea list or marketplace

**Result:** ☐ Pass  ☐ Fail  ☐ Partial
**Notes:** _________________________________________________________________

#### 1.2c - Invalid Registration
- [ ] Try email without @ symbol → Should show error
- [ ] Try password too short → Should show error
- [ ] Try passwords that don't match → Should show error
- [ ] Try existing email (use test@dreamcraft.com) → Should show error or 409

**Result:** ☐ Pass  ☐ Fail  ☐ Partial
**Notes:** _________________________________________________________________

---

### 1.3 - Login Flow

#### 1.3a - Login Page
- [ ] Clear browser storage: DevTools → Application → Clear All
- [ ] Refresh page and verify login form appears
- [ ] Form has:
  - [ ] Email input field
  - [ ] Password input field
  - [ ] Submit/Login button
  - [ ] Link to sign up page
- [ ] Dark theme styling is consistent

#### 1.3b - Valid Login (Test Credentials)
- [ ] Enter email: `test@dreamcraft.com`
- [ ] Enter password: `TestPassword123!`
- [ ] Click Login button
- [ ] Open DevTools Console immediately
- [ ] Look for log: `Token saved to localStorage: eyJ...`
- [ ] Wait 200-300ms (the fix adds 200ms delay)
- [ ] Verify page redirects to dashboard/marketplace
- [ ] Verify user can see content (not blank page)
- [ ] Check localStorage in DevTools → Application → localStorage
  - [ ] `userToken` key exists
  - [ ] Value starts with `eyJ` (JWT format)

**Result:** ☐ Pass  ☐ Fail  ☐ Partial
**Timing (ms to redirect):** _______
**Issues:** _________________________________________________________________

#### 1.3c - Invalid Login
- [ ] Try wrong email → Should show error
- [ ] Try wrong password → Should show 401 Unauthorized error
- [ ] Try empty fields → Should show validation error
- [ ] Verify no token is stored on failed login

**Result:** ☐ Pass  ☐ Fail  ☐ Partial
**Notes:** _________________________________________________________________

---

### 1.4 - Dashboard / Marketplace Page (Post-Login)

#### 1.4a - Page Load
- [ ] Wait for page to fully load
- [ ] Should display:
  - [ ] Header/navigation bar
  - [ ] User greeting or profile info
  - [ ] List of ideas or "Loading..." state
  - [ ] Create idea button (if present)
- [ ] No console errors
- [ ] Images/icons load properly

#### 1.4b - Marketplace Content
- [ ] Ideas list displays (or shows "No ideas yet")
- [ ] Each idea shows:
  - [ ] Title
  - [ ] Description/preview
  - [ ] Creator name
  - [ ] Category or type
  - [ ] (Optional) pricing or valuation
- [ ] Can scroll through list
- [ ] Loading skeleton/spinner appears (if implemented)

**Result:** ☐ Pass  ☐ Fail  ☐ Partial
**Content Found:** ☐ Ideas present  ☐ Empty state
**Notes:** _________________________________________________________________

#### 1.4c - Navigation Elements
- [ ] Header/Menu is visible and clickable
- [ ] Logout button visible and accessible
- [ ] Profile icon/link visible (if present)
- [ ] Create Idea button present and clickable
- [ ] No broken links or 404 errors

**Result:** ☐ Pass  ☐ Fail  ☐ Partial
**Notes:** _________________________________________________________________

---

### 1.5 - Create Idea Flow

#### 1.5a - Create Idea Page
- [ ] Click "Create Idea" button
- [ ] Page loads with form containing:
  - [ ] Title input field
  - [ ] Description/details input field
  - [ ] Category selector/dropdown
  - [ ] Visibility toggle (private/public)
  - [ ] Submit button
  - [ ] Cancel button (optional)

#### 1.5b - Create New Idea
- [ ] Fill in:
  - Title: `Test Idea [timestamp]`
  - Description: `This is a test idea created during QA testing`
  - Category: Select any valid category
  - Visibility: Set to Public
- [ ] Click Submit/Create button
- [ ] Check for success message
- [ ] Verify redirect back to marketplace
- [ ] Check that new idea appears in list
- [ ] Verify idea shows correct title and visibility

**Result:** ☐ Pass  ☐ Fail  ☐ Partial
**Time to Create:** _______ seconds
**Notes:** _________________________________________________________________

#### 1.5c - Form Validation
- [ ] Try submitting with empty title → Should show error
- [ ] Try submitting with empty description → Should show error
- [ ] Verify required fields are marked or indicated

**Result:** ☐ Pass  ☐ Fail  ☐ Partial
**Notes:** _________________________________________________________________

---

### 1.6 - Profile Page (if implemented)

#### 1.6a - Access Profile
- [ ] Click profile icon/link in header
- [ ] Profile page loads showing:
  - [ ] User name/email
  - [ ] User bio or description (if present)
  - [ ] Skills list (if present)
  - [ ] Edit button or edit mode toggle

#### 1.6b - View Profile Data
- [ ] All user info displays correctly
- [ ] First name and last name shown (if applicable)
- [ ] Skills/expertise listed
- [ ] Profile picture placeholder shown
- [ ] No console errors

**Result:** ☐ Pass  ☐ Fail  ☐ Partial
**Notes:** _________________________________________________________________

#### 1.6c - Edit Profile (if applicable)
- [ ] Click Edit button
- [ ] Form fields become editable
- [ ] Change user information:
  - [ ] Update bio or description
  - [ ] Add/update skills (if field present)
  - [ ] Update name fields (if present)
- [ ] Click Save button
- [ ] Verify success message appears
- [ ] Verify changes persist on page reload

**Result:** ☐ Pass  ☐ Fail  ☐ Partial
**Notes:** _________________________________________________________________

---

### 1.7 - Collaborators / Search (if implemented)

#### 1.7a - Access Collaborators Page
- [ ] Find and click "Collaborators" or "Browse Collaborators" link
- [ ] Page loads with search functionality
- [ ] Shows list of available collaborators or search prompt

#### 1.7b - Search Collaborators
- [ ] Enter search term or name in search box
- [ ] Results update/display
- [ ] Click on a collaborator card/result
- [ ] Can see collaborator profile information

#### 1.7c - Invite Collaborator (if available)
- [ ] Look for "Invite" or "Collaborate" button on collaborator card
- [ ] Click invite button
- [ ] Verify confirmation dialog or success message
- [ ] Check if invitation is recorded

**Result:** ☐ Pass  ☐ Fail  ☐ Partial
**Notes:** _________________________________________________________________

---

### 1.8 - Logout Flow

#### 1.8a - Initiate Logout
- [ ] Click Logout button (in header or profile menu)
- [ ] Verify confirmation dialog (optional)
- [ ] Click Confirm/Yes
- [ ] Page redirects to login page
- [ ] Check DevTools → Application → localStorage
  - [ ] `userToken` should be cleared or removed
- [ ] Try back button - should stay on login (not go back to dashboard)

**Result:** ☐ Pass  ☐ Fail  ☐ Partial
**Notes:** _________________________________________________________________

#### 1.8b - Re-Login After Logout
- [ ] Use same credentials as before
- [ ] Verify login works again (test same flow as 1.3b)
- [ ] Verify new token is issued
- [ ] Verify can access dashboard/marketplace again

**Result:** ☐ Pass  ☐ Fail  ☐ Partial
**Notes:** _________________________________________________________________

---

### 1.9 - Error Handling & Edge Cases

#### 1.9a - Network Error Simulation
- [ ] Open DevTools Network tab
- [ ] Click "Offline" to simulate no connection
- [ ] Try to create an idea or load marketplace
- [ ] Verify error message appears (not blank page or hang)
- [ ] Go back online
- [ ] Verify functionality resumes

**Result:** ☐ Pass  ☐ Fail  ☐ Partial
**Notes:** _________________________________________________________________

#### 1.9b - Console Errors
- [ ] Keep DevTools Console open throughout testing
- [ ] Document any red errors or warnings
- [ ] Expected: Some network logs okay, but no JavaScript errors
- [ ] No "undefined" or "null reference" errors

**Red Errors Found:** ☐ None  ☐ Yes (document below)
**Error Details:** _________________________________________________________________

#### 1.9c - Session Expiration (Optional)
- [ ] Log in successfully
- [ ] Wait 5+ minutes without activity
- [ ] Try to interact with the app (click a button, load marketplace)
- [ ] Verify either:
  - [ ] Session continues (no forced logout), OR
  - [ ] Redirected to login with message

**Result:** ☐ Pass  ☐ Fail  ☐ Partial
**Notes:** _________________________________________________________________

---

### 1.10 - Responsive Design (Desktop)

- [ ] Resize browser window to tablet width (768px)
- [ ] Check that layout adapts:
  - [ ] Menu collapses or reorganizes
  - [ ] Text remains readable
  - [ ] Buttons are still clickable
  - [ ] No overlapping elements
- [ ] Verify dark theme is consistent
- [ ] Check form fields are properly sized

**Result:** ☐ Pass  ☐ Fail  ☐ Partial
**Notes:** _________________________________________________________________

---

## Part 2: Web App Testing (Mobile Browser)

### 2.1 - Mobile Browser Setup

- [ ] Open web app URL on mobile device: https://dreamcraft-web.vercel.app
- [ ] Device type: _________________ (iPhone/Android/Tablet)
- [ ] Browser: _________________ (Safari/Chrome/Firefox)
- [ ] Open DevTools (if available) for error checking

---

### 2.2 - Responsive UI Testing

- [ ] Page loads and is readable on mobile screen
- [ ] Text is appropriately sized (not too small)
- [ ] Buttons are large enough to tap easily
- [ ] Navigation is accessible (no overflow or hidden menus)
- [ ] Images/icons scale properly
- [ ] No horizontal scrolling needed

**Result:** ☐ Pass  ☐ Fail  ☐ Partial
**Issues:** _________________________________________________________________

---

### 2.3 - Mobile Login & Navigation

- [ ] Follow same login flow as 1.3 (Login Flow)
- [ ] Verify form fields are touch-friendly
- [ ] Tap buttons and verify response
- [ ] Marketplace/dashboard loads and is scrollable
- [ ] Navigation between pages works
- [ ] No performance issues or lag

**Result:** ☐ Pass  ☐ Fail  ☐ Partial
**Notes:** _________________________________________________________________

---

### 2.4 - Mobile Form Input

- [ ] Click on email/text fields
- [ ] Verify keyboard appears (not covered by content)
- [ ] Can type and see input
- [ ] "Done" or "Go" button on keyboard works
- [ ] Form submission works on mobile

**Result:** ☐ Pass  ☐ Fail  ☐ Partial
**Notes:** _________________________________________________________________

---

## Part 3: Mobile App Testing (iOS/Android via EAS)

### 3.1 - Build & Installation

- [ ] Verify EAS build is available at: [Your EAS project URL]
- [ ] Download build to device (iOS/Android)
- [ ] Installation completes without errors
- [ ] App icon appears on home screen
- [ ] App name is correct: "DreamCraft"

**Platform Tested:** ☐ iOS  ☐ Android
**Build Status:** ☐ Success  ☐ Failed
**Notes:** _________________________________________________________________

---

### 3.2 - Initial App Launch

- [ ] Tap app icon to launch
- [ ] Splash screen appears (if implemented)
- [ ] App loads without crashing
- [ ] No error dialogs or warnings
- [ ] Login/auth screen is displayed

**Result:** ☐ Pass  ☐ Fail  ☐ Crash
**Notes:** _________________________________________________________________

---

### 3.3 - Mobile Login Flow

#### 3.3a - Login Screen
- [ ] Email input field is visible and tappable
- [ ] Password input field is visible and tappable
- [ ] Login button is prominent and tappable
- [ ] Link to sign up is available
- [ ] Fields show proper keyboard (email vs password)

#### 3.3b - Login with Test Credentials
- [ ] Enter: test@dreamcraft.com
- [ ] Enter: TestPassword123!
- [ ] Tap Login button
- [ ] Verify:
  - [ ] No crash or error dialog
  - [ ] Loading indicator appears (if implemented)
  - [ ] After 1-2 seconds, redirected to home screen
  - [ ] Home screen shows user content or empty state

**Result:** ☐ Pass  ☐ Fail  ☐ Crash
**Time to Load:** _______ seconds
**Notes:** _________________________________________________________________

#### 3.3c - Token Persistence
- [ ] Close app completely (swipe from task manager)
- [ ] Reopen app
- [ ] Verify:
  - [ ] App goes directly to home screen (not login)
  - [ ] User data loads automatically
  - [ ] No re-login required (token persisted)

**Result:** ☐ Pass  ☐ Fail
**Notes:** _________________________________________________________________

---

### 3.4 - Home Screen

- [ ] Home tab/screen is active
- [ ] Displays:
  - [ ] User greeting or status
  - [ ] List of ideas or empty state
  - [ ] "Create Idea" button or similar
  - [ ] Loading skeleton or spinner (if implemented)
- [ ] Bottom tab navigation shows multiple screens
- [ ] All tabs are accessible and labeled correctly

**Result:** ☐ Pass  ☐ Fail  ☐ Partial
**Tabs Visible:** _________________________________________________________________
**Notes:** _________________________________________________________________

---

### 3.5 - Create Idea Flow (Mobile)

#### 3.5a - Access Create Idea
- [ ] Tap "Create Idea" button on Home screen
- [ ] New screen/modal opens with form
- [ ] Form contains:
  - [ ] Title input (TextInput)
  - [ ] Description input (TextInput with multiple lines)
  - [ ] Category selector (Picker or dropdown)
  - [ ] Visibility toggle (private/public)
  - [ ] Submit button
  - [ ] Cancel button

#### 3.5b - Create Idea
- [ ] Fill form with test data:
  - Title: `Mobile Test Idea [timestamp]`
  - Description: `Created via mobile app`
  - Category: Select any
  - Visibility: Public
- [ ] Tap Submit/Create button
- [ ] Verify:
  - [ ] Loading indicator appears
  - [ ] Success message or modal closes
  - [ ] Redirected back to Home screen
  - [ ] New idea appears in list (may need to refresh)

**Result:** ☐ Pass  ☐ Fail  ☐ Partial
**Time to Create:** _______ seconds
**Notes:** _________________________________________________________________

#### 3.5c - Form Validation
- [ ] Try submitting with empty title → Should show error
- [ ] Verify fields are validated before submission

**Result:** ☐ Pass  ☐ Fail
**Notes:** _________________________________________________________________

---

### 3.6 - Ideas / Marketplace Screen

- [ ] Tap "Ideas" or marketplace tab
- [ ] Screen loads and displays:
  - [ ] List of ideas (if any exist)
  - [ ] Empty state message (if no ideas)
  - [ ] Loading spinner (if loading)
- [ ] Can scroll through list
- [ ] Each idea card shows:
  - [ ] Title
  - [ ] Description preview
  - [ ] Creator name
- [ ] Tap on idea card → Opens detail view (if implemented)

**Result:** ☐ Pass  ☐ Fail  ☐ Partial
**Ideas Found:** ☐ Multiple  ☐ Single  ☐ None
**Notes:** _________________________________________________________________

---

### 3.7 - Collaborators / Search Screen

- [ ] Tap "Collaborators" or similar tab
- [ ] Screen loads with:
  - [ ] Search input field
  - [ ] List of collaborators or search results
  - [ ] Loading indicator (if loading)
- [ ] Tap search field and enter a name/email
- [ ] Results update/filter
- [ ] Can tap on collaborator to view details
- [ ] Can tap "Invite" button (if present)

**Result:** ☐ Pass  ☐ Fail  ☐ Partial
**Notes:** _________________________________________________________________

---

### 3.8 - Profile Screen

- [ ] Tap "Profile" or account tab
- [ ] Screen displays:
  - [ ] User name/email
  - [ ] User bio or description
  - [ ] Skills or expertise
  - [ ] Edit button (if present)
- [ ] All info displays correctly
- [ ] Can tap Edit to modify profile (if available)

**Result:** ☐ Pass  ☐ Fail  ☐ Partial
**Notes:** _________________________________________________________________

---

### 3.9 - Mobile Navigation

- [ ] Bottom tab bar is visible and functional
- [ ] Verify each tab:
  - [ ] Home - shows user content
  - [ ] Ideas/Marketplace - shows all ideas
  - [ ] Collaborators - shows collaborators
  - [ ] Profile - shows user profile
- [ ] Tapping tabs switches screens smoothly
- [ ] Current tab is highlighted/active

**Result:** ☐ Pass  ☐ Fail  ☐ Partial
**Notes:** _________________________________________________________________

---

### 3.10 - Logout Flow (Mobile)

- [ ] Tap Profile tab
- [ ] Find and tap Logout button
- [ ] Verify:
  - [ ] Logout confirmation appears (optional)
  - [ ] App redirects to login screen
  - [ ] Token is cleared from storage
- [ ] Try re-login with same credentials
- [ ] Verify login works and token is stored again

**Result:** ☐ Pass  ☐ Fail  ☐ Partial
**Notes:** _________________________________________________________________

---

### 3.11 - Mobile Error Handling

- [ ] Keep app open and toggle airplane mode OFF/ON
- [ ] Try loading data while offline
- [ ] Verify error message appears (not blank)
- [ ] Toggle airplane mode back ON
- [ ] Verify functionality resumes when online

**Result:** ☐ Pass  ☐ Fail  ☐ Partial
**Notes:** _________________________________________________________________

---

### 3.12 - Mobile Performance

- [ ] App responds quickly to button taps (no lag)
- [ ] Screens transition smoothly
- [ ] List scrolling is smooth (no jank)
- [ ] No crashes or freezes observed
- [ ] App doesn't consume excessive battery (subjective)

**Result:** ☐ Pass  ☐ Fail  ☐ Partial
**Notes:** _________________________________________________________________

---

## Part 4: Cross-Platform Consistency

### 4.1 - UI/UX Consistency

- [ ] Dark theme colors match across web and mobile
- [ ] Button styles are consistent
- [ ] Form field styling matches
- [ ] Typography/font sizes are proportional
- [ ] Icons and imagery are consistent

**Result:** ☐ Pass  ☐ Fail  ☐ Partial
**Inconsistencies Found:** _________________________________________________________________

---

### 4.2 - Feature Parity

- [ ] Same features available on web and mobile:
  - [ ] Create Idea
  - [ ] Search/Browse Collaborators
  - [ ] View Profile
  - [ ] Logout
- [ ] Data persists across platforms:
  - [ ] Create idea on web, visible on mobile
  - [ ] Create idea on mobile, visible on web
- [ ] Same error messages/handling

**Result:** ☐ Pass  ☐ Fail  ☐ Partial
**Notes:** _________________________________________________________________

---

### 4.3 - Data Synchronization

- [ ] Create test idea on web app
- [ ] Open mobile app
- [ ] Verify new idea appears in list (may require refresh)
- [ ] Create test idea on mobile
- [ ] Refresh web app
- [ ] Verify new idea appears in web marketplace

**Result:** ☐ Pass  ☐ Fail  ☐ Partial
**Sync Time:** _______ seconds
**Notes:** _________________________________________________________________

---

## Part 5: Performance Audit (Optional)

### 5.1 - Lighthouse Audit (Web App)

**Requires:** Chrome/Edge browser

- [ ] Open https://dreamcraft-web.vercel.app in Chrome
- [ ] Press F12 to open DevTools
- [ ] Go to "Lighthouse" tab
- [ ] Click "Analyze page load"
- [ ] Wait for report (1-2 minutes)

**Record scores:**
- Performance: _______/100
- Accessibility: _______/100
- Best Practices: _______/100
- SEO: _______/100

**Target:** Each score > 85 (Good = 90-100, OK = 50-89, Poor = 0-49)

**Result:** ☐ All Excellent  ☐ Mostly Good  ☐ Needs Work
**Failures:** _________________________________________________________________

---

### 5.2 - Performance Notes

- [ ] App loads within 3 seconds on 4G
- [ ] No large unoptimized images
- [ ] API calls are reasonably fast (< 2 seconds)
- [ ] No memory leaks on extended use
- [ ] Mobile app doesn't crash under stress

**Issues Found:** _________________________________________________________________

---

## Summary & Issues Log

### Critical Issues Found
```
Issue #1:
Description: [What went wrong?]
Reproduction Steps:
1.
2.
3.
Expected:
Actual:
Severity: ☐ Blocker  ☐ High  ☐ Medium  ☐ Low
Status: ☐ New  ☐ Assigned  ☐ Fixed  ☐ Verified

Issue #2:
[Repeat format for each issue]
```

---

### Nice-to-Have Issues (Non-Blocking)
```
[Document lower-priority issues here]
```

---

### Testing Summary

| Category | Status | Notes |
|----------|--------|-------|
| Web App (Desktop) | ☐ Pass ☐ Fail | _________________ |
| Web App (Mobile) | ☐ Pass ☐ Fail | _________________ |
| Mobile App (iOS) | ☐ Pass ☐ Fail | _________________ |
| Mobile App (Android) | ☐ Pass ☐ Fail | _________________ |
| Cross-Platform | ☐ Pass ☐ Fail | _________________ |
| Performance | ☐ Pass ☐ Fail | _________________ |

---

### Overall Testing Result

**Status:** ☐ **PASS - Ready for Launch**
**Status:** ☐ **PASS with Minor Issues**
**Status:** ☐ **FAIL - Issues Must Be Fixed**

**Comments:**
_________________________________________________________________
_________________________________________________________________
_________________________________________________________________

---

### Sign-Off

**Tested By:** _______________________
**Date:** _______________________
**Time Spent:** _______ minutes

**Approved for Launch:** ☐ Yes  ☐ No  ☐ With Conditions

**Launch Approval Signature:** _______________________

---

## Quick Reference: Common Issues & Fixes

### Issue: Login redirects but page is blank
**Check:**
1. Open DevTools Console
2. Look for token log: "Token saved to localStorage: eyJ..."
3. Check if error appears in console
4. If no token, login failed silently
5. Check Network tab for failed requests

### Issue: Mobile app crashes on startup
**Check:**
1. Review EAS build logs
2. Verify backend URL is correct in app.json
3. Check if app has proper permissions (iOS/Android)
4. Try deleting app and reinstalling

### Issue: Ideas don't appear after creation
**Check:**
1. Verify POST /ideas returned 201 Created
2. Check if user is authenticated (has token)
3. Try refreshing page (hard refresh with Ctrl+Shift+R)
4. Check backend logs for errors

### Issue: Token not persisting between sessions
**Check:**
1. Web: Verify localStorage is enabled in browser
2. Mobile: Verify SecureStore is working (Android specific)
3. Check if cookies are being blocked (third-party)
4. Try clearing browser cache and retrying

### Issue: Slow or hanging loading states
**Check:**
1. Check Network tab for slow requests
2. Verify backend is responding (check Render logs)
3. Check if database queries are slow (MongoDB)
4. Look for infinite loops in console

---

**End of Testing Checklist**

Good luck with testing! Document everything and reach out if you find issues! 🚀
