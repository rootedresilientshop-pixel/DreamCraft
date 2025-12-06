# 🐛 Bug Report Template

## How to Use This Template

When you find a bug **during testing**, copy this template and fill it out completely. A well-written bug report helps developers fix issues quickly.

**Time to fill out:** 5-10 minutes per bug

---

## Bug Report Form

### ✅ BASIC INFO

**Bug Title:** (Short, descriptive title)
```
Example: "Login page shows blank after successful authentication"
```

**Date Found:** _______________
**Tester Name:** _______________
**Severity:** ☐ Blocker  ☐ High  ☐ Medium  ☐ Low
**Platform:** ☐ Web (Desktop)  ☐ Web (Mobile)  ☐ iOS App  ☐ Android App

---

### 📍 ENVIRONMENT

**Browser/Device:** _______________________
```
Examples:
- Chrome 120 on Windows 11
- Safari on iPhone 14
- Android 13 on Samsung Galaxy S20
```

**Operating System:** _______________________

**Backend URL Being Used:** _______________
```
https://dreamcraft-f8w8.onrender.com/api
```

**App Version:** _______________
```
Web: Check URL bar or footer
Mobile: Settings > App Info > Version
```

---

### 🔍 BUG DESCRIPTION

**What did you do?** (Step-by-step actions)
```
1. Navigated to login page
2. Entered email: test@dreamcraft.com
3. Entered password: TestPassword123!
4. Clicked Login button
5. Waited 3 seconds
```

**What happened?** (Actual result)
```
Page redirected to dashboard, but the page was completely blank.
No content loaded. No error message displayed.
```

**What should have happened?** (Expected result)
```
After login, the dashboard/marketplace page should display:
- Header with navigation
- List of ideas
- Welcome message or user info
```

**How often does it happen?**
☐ Always ☐ Usually ☐ Sometimes ☐ Rarely

---

### 🔄 REPRODUCTION STEPS

**Can you reproduce it?** ☐ Yes  ☐ No  ☐ Sometimes

**Steps to Reproduce:**
```
1. [First step]
2. [Second step]
3. [Third step]
... continue until bug appears
```

**Frequency:** Does it happen:
- Every time you follow these steps? ☐ Yes  ☐ No
- On fresh login? ☐ Yes  ☐ No
- After specific actions? ☐ Yes  ☐ No

---

### 📸 EVIDENCE

**Screenshots/Screen Recordings:** (Attach if possible)
```
How to take:
Web: Print Screen key, paste into paint, save as PNG
Mobile: Use native screenshot feature
Recording: Use OBS, ScreenFlow, or built-in recorder
```

**Console Errors:** (If any - from DevTools)
```
Open DevTools → Console tab
Copy any red error messages:

Example:
> TypeError: Cannot read property 'token' of undefined
  at LoginPage.tsx:42:15
  at async handleLogin (LoginPage.tsx:38:20)
```

**Network Errors:** (From DevTools Network tab)
```
Open DevTools → Network tab
Look for any RED failed requests
Record the request:
- URL: https://dreamcraft-f8w8.onrender.com/api/auth/login
- Status: 401 Unauthorized
- Response: {"error": "Invalid credentials"}
```

---

### 🔗 RELATED INFORMATION

**Did you test the same flow elsewhere?**
- [ ] Works on web desktop
- [ ] Works on web mobile
- [ ] Works on iOS app
- [ ] Works on Android app
- [ ] Fails everywhere

**Is this blocking launch?** ☐ Yes  ☐ No

**Does this affect other features?**
```
Example: "Users can't log in, so they can't access marketplace"
```

---

### 🔧 TECHNICAL DETAILS (For Developers)

**DevTools Console Logs:**
```
Paste full console output here (including timestamps)
Example:
[12:34:56] Token saved to localStorage: eyJhbGciOiJIUzI1NiIs...
[12:34:57] Redirecting to /marketplace
[12:34:58] Error loading marketplace: 404 Not Found
```

**Local Storage/Session Storage:**
```
Open DevTools → Application → Storage
Check these keys:
- userToken: [Present? Yes/No] [Value: eyJ...]
- userId: [Present? Yes/No] [Value: ...]
- refreshToken: [Present? Yes/No] [Value: ...]
```

**Network Request Details:**
```
From DevTools Network tab, click the failed request:
- Method: GET / POST / PUT / DELETE
- URL: [Full URL]
- Status Code: [e.g., 200, 401, 500]
- Headers Sent:
  Authorization: Bearer eyJ...
- Response Body:
  {"error": "..."}
```

---

### 💡 ADDITIONAL NOTES

**Did you try anything to work around it?**
```
Example:
- Cleared browser cache → Bug still appears
- Used incognito mode → Bug still appears
- Tried different email → Bug still appears
- Hard refresh (Ctrl+Shift+R) → Bug disappeared
```

**Could this be user error?**
```
Example: "I wasn't logged in" or "I was offline"
```

**Any other observations?**
```
Example: "The bug seems to happen more often on slow connections"
```

---

## SEVERITY GUIDE

**Blocker** 🔴 (Fix immediately)
- Prevents core functionality (login, signup, payments)
- App crashes or hangs completely
- Data loss or corruption
- Security vulnerability
- Example: "Users can't log in at all"

**High** 🟠 (Fix before launch)
- Major feature doesn't work (can't create ideas, can't invite)
- Significant performance issue (takes 10+ seconds to load)
- Affects most/all users
- Example: "Login works, but marketplace page is blank"

**Medium** 🟡 (Fix soon, can wait a few days)
- Feature partially works but has issues
- Affects some users in specific scenarios
- Minor performance issues (slightly slow)
- Example: "Create idea form sometimes shows validation error when it shouldn't"

**Low** 🟢 (Polish/nice-to-have)
- Cosmetic issues (colors, spacing, font)
- Feature works but UX could be better
- Affects very few users
- Example: "Button text is slightly misaligned on mobile"

---

## Example Bug Report (FILLED OUT)

```
✅ BASIC INFO
Bug Title: Login page shows blank after successful authentication
Date Found: 2025-12-05
Tester Name: John Smith
Severity: ☑️ HIGH
Platform: ☑️ Web (Desktop)

📍 ENVIRONMENT
Browser/Device: Chrome 120 on Windows 11
Operating System: Windows 11
Backend URL: https://dreamcraft-f8w8.onrender.com/api
App Version: Vercel deployment from 2025-12-05

🔍 BUG DESCRIPTION
What did you do?
1. Opened https://dreamcraft-web.vercel.app
2. Entered email: test@dreamcraft.com
3. Entered password: TestPassword123!
4. Clicked Login button
5. Waited 3 seconds

What happened?
Page redirected to dashboard URL (/marketplace), but the page was completely blank.
No header, no idea list, no content of any kind.
White/blank page with no error message.

What should have happened?
Dashboard should display:
- Header with navigation menu
- Welcome message or user greeting
- List of ideas from marketplace
- "Create Idea" button

How often: ☑️ ALWAYS (100% reproduction rate)

🔄 REPRODUCTION STEPS
Can reproduce: ☑️ YES
Steps:
1. Clear browser cache and localStorage
2. Open web app in incognito mode
3. Login with test@dreamcraft.com
4. Observe blank page

Frequency: ☑️ Every time ☑️ On fresh login

📸 EVIDENCE
Console Errors:
> TypeError: Cannot read property 'ideas' of undefined
  at MarketplacePage.tsx:45

Network Errors:
GET https://dreamcraft-f8w8.onrender.com/api/ideas
Status: 200 OK
Response: {"ideas": [...]} (data came back fine)

🔗 RELATED INFO
Affects:
☑️ Works on web mobile (same issue)
☑️ Not tested on mobile app yet
Blocking launch: ☑️ YES

🔧 TECHNICAL DETAILS
Console Log:
[12:34:56] Token saved to localStorage: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
[12:34:57] Redirecting to /marketplace
[12:34:58] MarketplacePage mounted
[12:34:59] Fetching ideas...
[12:35:00] TypeError: Cannot read property 'ideas' of undefined

localStorage:
userToken: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... ✓ Present

Network Request:
GET /api/ideas
Status: 200 OK
Response: {"ideas": [{"id": "1", "title": "Test", ...}]}

💡 NOTES
Workaround: Hard refresh (Ctrl+Shift+R) fixes it temporarily
Pattern: Happens on first login, but repeats if you logout/login again
```

---

## How to Submit Bug Reports

### During Testing:
1. **Fill out this template** as you find each bug
2. **Save the file** with a descriptive name: `BUG_REPORT_[date]_[issue_number].md`
3. **Share with team** via email or add to project issues

### Example filenames:
```
BUG_REPORT_2025-12-05_001_LOGIN_BLANK_PAGE.md
BUG_REPORT_2025-12-05_002_MOBILE_CRASH.md
BUG_REPORT_2025-12-05_003_SLOW_IDEAS_LOAD.md
```

### In GitHub Issues (Optional):
If you're using GitHub, create an issue with:
- **Title:** [Severity] Issue description (e.g., "[HIGH] Login page shows blank")
- **Description:** Copy the filled bug report
- **Labels:** bug, high-priority, web, mobile, etc.

---

## Quick Checklist Before Submitting

Before you submit a bug report, verify:

- [ ] I've filled out all required sections
- [ ] I've included clear reproduction steps
- [ ] I've included screenshots/console logs if applicable
- [ ] I've tested on at least one platform
- [ ] I've checked if it's blocking launch
- [ ] I've assigned appropriate severity
- [ ] I've included DevTools information (console/network errors)
- [ ] I've noted any workarounds I've found

---

## Questions to Ask While Testing

If you encounter something that might be a bug, ask yourself:

1. **Is this the expected behavior?**
   - If no, it's a bug

2. **Did I do something wrong?**
   - Test again to make sure it's not user error

3. **Does it happen consistently?**
   - Try to reproduce multiple times

4. **Does it happen on other platforms too?**
   - Test web, mobile, different browsers

5. **Is there an error message?**
   - Check console for clues

6. **Is it blocking core functionality?**
   - Determines severity level

---

## Common Bugs to Watch For During Testing

### Authentication & Login
- ✓ Token not saving to storage
- ✓ Login redirects but page is blank
- ✓ Session expires too quickly
- ✓ "Remember me" not working
- ✓ Multiple logins cause issues

### Data & API
- ✓ Ideas created but not showing in list
- ✓ Data doesn't sync between devices
- ✓ Old data still visible after logout
- ✓ API returns error but no UI message
- ✓ Slow API responses (>3 seconds)

### Mobile
- ✓ App crashes on startup
- ✓ Forms not submitting
- ✓ Keyboard covers input fields
- ✓ Navigation doesn't work
- ✓ Images/text too small to read

### UI/UX
- ✓ Buttons don't respond to clicks
- ✓ Loading states never appear/disappear
- ✓ Error messages are confusing
- ✓ Layout breaks on certain screen sizes
- ✓ Dark theme colors inconsistent

---

**Now go forth and test! Document everything! 🚀**
