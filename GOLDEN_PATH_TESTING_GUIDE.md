# 🏆 Golden Path Testing Guide - Section 9

**Objective:** Verify the complete user journey works end-to-end
**Environment:** Production (Vercel + Render + MongoDB)
**Estimated Time:** 10-15 minutes per platform

---

## Platform 1: Web App (Primary)

### Prerequisites
- [ ] Vercel deployment complete
- [ ] Backend running on Render
- [ ] Latest LoginPage.tsx deployed (with 200ms delay fix)
- [ ] Browser: Chrome/Firefox (with DevTools)
- [ ] Network: Active internet connection

### Test 1: Sign Up (New Account)

**Steps:**
1. Open https://dreamcraft-web.vercel.app
2. Verify login page loads with "DreamCraft" branding
3. Click "No account? Register"
4. Enter test credentials:
   - Email: `test_$(date +%s)@example.com` (use unique email)
   - Password: `TestPass123!`
5. Click "Register"

**Expected Results:**
```
✅ Form accepts input
✅ Submit button becomes disabled while loading
✅ Message appears: "Account created! Now try logging in."
✅ Page switches back to login tab
✅ New account created in MongoDB (verify in Atlas)
```

**If Issues:**
- [ ] Check browser console (F12) for errors
- [ ] Check network tab for failed requests
- [ ] Verify backend is running: https://dreamcraft-f8w8.onrender.com/health
- [ ] Check Render logs for registration errors

---

### Test 2: Login (with New Account)

**Steps:**
1. Click "Already have an account? Login"
2. Enter credentials from Test 1
   - Email: (same as registered)
   - Password: (same as registered)
3. Click "Login"
4. **CRITICAL:** Open DevTools Console (F12 → Console tab)

**Expected Results:**
```
✅ Form accepts input
✅ Submit button becomes disabled with "Loading..." text
✅ Console shows: "LoginPage received res: {success: true, token: "eyJ..."...}"
✅ Console shows: "Token saved to localStorage: eyJ..."
✅ After ~200ms, dashboard/marketplace page loads
✅ No console errors or warnings
✅ localStorage shows "userToken" key with JWT value
```

**Verify in DevTools:**
1. Open DevTools (F12)
2. Go to: Application → Local Storage → https://dreamcraft-web.vercel.app
3. Look for `userToken` key with JWT token value
4. Token format: `eyJhbGciOiJIUzI1NiI...` (JWT)

**If Issues:**
- [ ] Console shows error? Check DevTools console
- [ ] Token not in localStorage? Verify 200ms delay worked
- [ ] Stuck on login page? Check network calls (Network tab)
- [ ] CORS errors? Verify VITE_API_BASE environment variable
- [ ] Check Render backend logs for login errors

---

### Test 3: Marketplace (Dashboard)

**Steps:**
1. After successful login, you should see:
   - "Marketplace" heading
   - "Discover innovative ideas" subtitle
   - Search box for ideas
   - Grid of idea cards

**Expected Results:**
```
✅ Marketplace page loads without errors
✅ Layout is readable on screen
✅ Grid displays (even if empty initially)
✅ Search box is functional
✅ No console errors
```

**Verify Functionality:**
1. Type "test" in search box
2. Click "Search" button
3. Results update (or show "No ideas found")

**If Issues:**
- [ ] Page doesn't load? Check console errors (F12)
- [ ] Grid layout broken? Check CSS in DevTools
- [ ] Search not working? Check API request in Network tab
- [ ] No ideas showing? That's OK (first-time app may be empty)

---

### Test 4: Create Idea (Authenticated Flow)

**Steps:**
1. From Marketplace, look for "New Idea" button (if implemented)
2. OR navigate to ideas section
3. Enter idea details:
   - Title: "Test Idea from Web App"
   - Description: "This is a test idea created during Golden Path testing"
   - Category: "Technology"

**Expected Results:**
```
✅ Idea form renders
✅ Form accepts input
✅ Submit creates idea
✅ Idea appears in marketplace
✅ Backend stores in MongoDB
```

**If Not Implemented:**
- This may be on the Ideas/CollaboratorBrowseScreen
- Or requires implementing POST to `/api/ideas`
- That's OK - can be added in Phase 2

---

### Test 5: Logout

**Steps:**
1. Look for logout button (may be in dropdown or navbar)
2. OR navigate to `/logout`
3. Click logout

**Expected Results:**
```
✅ Redirected to login page
✅ localStorage cleared (userToken removed)
✅ Cannot access marketplace without re-login
✅ No errors in console
```

**Verify:**
1. Open DevTools → Application → Local Storage
2. Confirm `userToken` key is gone
3. Try going to `/` - should redirect to login

**If Issues:**
- [ ] Still logged in after logout? Check token cleanup code
- [ ] localStorage not cleared? Verify logout handler
- [ ] Redirect not working? Check App.tsx router logic

---

### Test 6: Re-login Cycle

**Steps:**
1. After logout, log back in with same credentials
2. Verify you can re-access the marketplace

**Expected Results:**
```
✅ Login works second time
✅ Token re-issued correctly
✅ Marketplace loads
✅ No duplicate tokens or storage issues
```

---

## Platform 2: Mobile App (Secondary)

### Prerequisites
- [ ] Expo development environment set up
- [ ] Mobile app code updated with correct backend URL
- [ ] iOS simulator or Android emulator running
- [ ] Device/emulator connected to internet

### Test 1: Start Mobile App

**Steps:**
1. Open terminal in `apps/mobile`
2. Run: `npm start` or `expo start`
3. Press `i` for iOS simulator or `a` for Android emulator
4. Wait for app to load

**Expected Results:**
```
✅ Expo starts without build errors
✅ QR code displays in terminal
✅ App loads on simulator/emulator
✅ DreamCraft login screen visible
```

**If Issues:**
- [ ] Build errors? Check `npm install` completed
- [ ] Simulator not found? Check Xcode (iOS) or Android Studio
- [ ] App won't load? Check environment.ts configuration
- [ ] Backend URL wrong? Verify app.json was updated

---

### Test 2: Mobile Login

**Steps:**
1. Use same credentials from web app testing
2. Enter email and password
3. Tap "Login" button

**Expected Results:**
```
✅ TextInput accepts email and password
✅ Login button shows loading state
✅ Token stored securely (SecureStore)
✅ Navigation to home tab navigator
✅ Bottom tab navigation visible (4 tabs)
```

**Tabs Visible:**
- 🏠 Home
- 💡 Ideas
- 👥 Collaborators
- 👤 Profile

**If Issues:**
- [ ] Connection refused? Verify backend URL in app.json
- [ ] "Login failed" error? Check credentials
- [ ] SecureStore error? Check Expo modules installed
- [ ] Navigation doesn't work? Check react-navigation setup

---

### Test 3: Browse Tabs

**Steps:**
1. Tap each bottom tab
2. Verify screen renders for each:
   - Home (likely shows marketplace/ideas)
   - Ideas (documentation screen)
   - Collaborators (browse collaborators)
   - Profile (user profile)

**Expected Results:**
```
✅ All tabs load without crashing
✅ Content displays correctly
✅ Navigation is smooth
✅ No console errors
```

---

### Test 4: Mobile Logout

**Steps:**
1. Look for logout button on Profile screen
2. OR use app menu/settings
3. Tap logout

**Expected Results:**
```
✅ Redirected to login screen
✅ Token cleared from SecureStore
✅ Can log back in
```

---

## Cross-Platform Tests

### Test: Sync Between Web & Mobile

**Steps:**
1. Create idea on web app
2. Log in to mobile app
3. Check if idea appears in marketplace

**Expected Results:**
```
✅ Idea created on web shows on mobile
✅ Same backend ensures data sync
✅ Timestamps match
```

---

### Test: Token Validity

**Steps:**
1. Log in on web
2. Copy JWT token from localStorage
3. Use token in API request via postman/curl
4. Verify token is valid for API calls

**Command:**
```bash
curl -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  https://dreamcraft-f8w8.onrender.com/api/ideas
```

**Expected Results:**
```
✅ Returns ideas array (200 OK)
✅ Token properly formatted
```

---

## Error Handling Tests

### Test: Invalid Credentials

**Steps (Web):**
1. Enter wrong email or password
2. Click Login

**Expected Results:**
```
✅ Shows error message: "Invalid credentials"
✅ No token saved
✅ Stays on login page
```

**Steps (Mobile):**
1. Enter wrong credentials
2. Tap Login

**Expected Results:**
```
✅ Shows Alert: "Login failed" or error message
✅ Can retry login
```

---

### Test: Logout & Unauthorized Access

**Steps:**
1. Log out on web
2. Try to access `/marketplace` directly
3. Should redirect to login

**Steps (Mobile):**
1. Log out
2. Try to access protected screens
3. Should show login only

---

## Performance & Responsiveness Tests

### Web App (Optional)

1. Open DevTools → Lighthouse
2. Run Mobile audit
3. Check scores:
   - Performance > 85? ✅
   - Accessibility > 85? ✅
   - Best Practices > 85? ✅
   - SEO > 85? ✅

### Mobile App

1. Check for lag/jank while navigating
2. Verify smooth tab switching
3. Check memory usage doesn't spike
4. Test network switch (WiFi ↔ Mobile data)

---

## Checklist Summary

### Web App
- [ ] Sign up works
- [ ] Login works (with localStorage check)
- [ ] Marketplace displays
- [ ] Create idea (if implemented)
- [ ] Logout clears token
- [ ] Re-login works
- [ ] No console errors
- [ ] DevTools Network shows requests to production API

### Mobile App
- [ ] App starts without build errors
- [ ] Login works (SecureStore saves token)
- [ ] All 4 tabs load
- [ ] Tab navigation smooth
- [ ] Logout works
- [ ] Re-login works
- [ ] Network requests go to production backend

### Cross-Platform
- [ ] Ideas sync between web and mobile
- [ ] Same user can log in on both
- [ ] Token format valid for API calls
- [ ] Error handling works on both

---

## Issue Logging

If you find issues, log them with:

**Format:**
```
Platform: [Web | Mobile]
Feature: [Login | Marketplace | Logout | etc]
Severity: [Critical | High | Medium | Low]
Steps to Reproduce:
1. ...
2. ...
Expected: ...
Actual: ...
Screenshot/Console Error: ...
```

---

## Success Criteria

✅ **Golden Path Complete When:**
1. User can sign up on web
2. User can login on web (with localStorage token)
3. Dashboard/marketplace displays
4. User can logout
5. Mobile app can authenticate
6. No console errors on either platform
7. API requests go to production backend
8. Token validation works

---

## Next Steps After Testing

**If All Tests Pass:**
1. ✅ Mark Section 9 as complete
2. ✅ Deploy any fixes needed
3. ✅ Create post-launch monitoring plan
4. ✅ Prepare announcement/release notes

**If Issues Found:**
1. Document the issue
2. Identify root cause (frontend/backend/network)
3. Fix in appropriate layer
4. Redeploy (Vercel/Render as needed)
5. Retest until all tests pass

---

**Time Estimate:** 15-20 minutes total
**Tester:** [Your Name]
**Test Date:** [Today's Date]
**Result:** [PASS | FAIL]

✅ **Ready to begin testing!**
