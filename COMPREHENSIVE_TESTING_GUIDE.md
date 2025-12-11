# Comprehensive Testing Guide - VentureLab

**Complete feature-by-feature testing checklist with step-by-step instructions**

---

## Table of Contents

1. [Authentication & Users](#1-authentication--users)
2. [Idea Management](#2-idea-management)
3. [Marketplace & Discovery](#3-marketplace--discovery)
4. [Real-time Messaging](#4-real-time-messaging)
5. [Notifications](#5-notifications)
6. [Collaboration System](#6-collaboration-system)
7. [Dashboards](#7-dashboards)
8. [Favorites System](#8-favorites-system)
9. [Profile Management](#9-profile-management)
10. [WebSocket & Real-time](#10-websocket--real-time)

---

## 1. Authentication & Users

### 1.1 Registration
**Purpose:** Verify user account creation works

```
Steps:
1. Go to http://localhost:5173 (or your frontend URL)
2. Click "Register" or signup button
3. Fill in:
   - Email: user1@test.com
   - Password: Test123!
4. Click "Register"

Expected Results:
✓ No errors on page
✓ Redirects to login page
✓ Can login with same credentials
✓ JWT token saved to localStorage
✓ User created in MongoDB
```

**Console Checks:**
- Open DevTools (F12) → Console
- Should NOT see any red errors
- Should see successful API calls

**Database Check:**
- Check MongoDB: `db.users.findOne({email: "user1@test.com"})`
- User should exist with hashed password

---

### 1.2 Login
**Purpose:** Verify authentication and token storage

```
Steps:
1. Register user (or use existing)
2. Go to login page
3. Enter credentials: user1@test.com / Test123!
4. Click "Login"

Expected Results:
✓ Redirects to marketplace
✓ Can see ideas (authenticated page)
✓ Token in localStorage (DevTools → Application → localStorage → userToken)
✓ No console errors
```

**Token Verification:**
- Open DevTools → Application → Storage → localStorage
- Find `userToken` key
- Should contain long string (JWT token)

---

### 1.3 Logout
**Purpose:** Verify session cleanup

```
Steps:
1. Login as user
2. Go to /logout (or click logout button)
3. Confirm logout if prompted

Expected Results:
✓ Redirects to login page
✓ localStorage cleared (userToken removed)
✓ Cannot access authenticated pages
✓ Trying /dashboard redirects to login
```

---

### 1.4 Session Persistence
**Purpose:** Verify token persists across refresh

```
Steps:
1. Login successfully
2. Verify you see marketplace
3. Refresh page (F5)

Expected Results:
✓ Still logged in (no redirect to login)
✓ Marketplace still visible
✓ Token still in localStorage
```

---

## 2. Idea Management

### 2.1 Create Idea
**Purpose:** Verify idea creation and storage

```
Steps:
1. Login as user1
2. Go to /create-idea
3. Fill in:
   - Title: "AI Chatbot for Customer Support"
   - Description: "A conversational AI system for handling customer inquiries"
   - Category: "Technology" (or relevant)
   - Any other fields
4. Click "Create"

Expected Results:
✓ No errors
✓ Redirects to idea detail or marketplace
✓ Idea visible in marketplace
✓ Shows creator name (your username)
✓ Idea stored in MongoDB
```

**Database Check:**
- MongoDB: `db.ideas.findOne({title: "AI Chatbot for Customer Support"})`
- Should exist with your userId as creatorId

---

### 2.2 View Idea Details
**Purpose:** Verify idea detail page displays correctly

```
Steps:
1. Go to marketplace
2. Click on any idea
3. Wait for page to load

Expected Results:
✓ See full idea details
✓ Title, description, category visible
✓ Creator information shown
✓ Buttons: "Collaborate", "Favorite", possibly "Edit"/"Delete" if owner
✓ Discussion section below (for messaging)
```

**Test as Creator:**
- Create idea, then view it
- Should see "Edit" and "Delete" buttons

**Test as Non-Creator:**
- View idea created by another user
- Should see "Collaborate" and "Favorite" buttons
- Should NOT see "Edit" or "Delete"

---

### 2.3 Edit Idea
**Purpose:** Verify idea can be updated

```
Steps:
1. Go to idea you created
2. Click "Edit" (if visible)
3. Change:
   - Title: Add " - Updated" to end
   - Description: Add " [Updated]" to end
4. Click "Save"

Expected Results:
✓ Changes saved
✓ Marketplace shows updated title
✓ Detail page shows updated info
✓ Database reflects changes
```

---

### 2.4 Delete Idea
**Purpose:** Verify idea can be removed

```
Steps:
1. Create a test idea
2. Go to that idea
3. Click "Delete"
4. Confirm deletion if prompted

Expected Results:
✓ Removed from marketplace
✓ Removed from database
✓ Navigated away from deleted idea page
✓ No "404 not found" on accessing old URL
```

---

## 3. Marketplace & Discovery

### 3.1 Browse Ideas
**Purpose:** Verify marketplace shows ideas

```
Steps:
1. Go to marketplace (home page)
2. Scroll through ideas

Expected Results:
✓ See list of ideas from multiple creators
✓ Each idea card shows:
  - Title
  - Description (truncated)
  - Creator name
  - Category
  - Quick action buttons
✓ No errors on page
```

---

### 3.2 Search Ideas
**Purpose:** Verify search functionality

```
Steps:
1. Go to marketplace
2. Find search box
3. Search for "AI"
4. Wait for results

Expected Results:
✓ Results filter to show only ideas with "AI" in title/description
✓ Results update in real-time (no refresh needed)
✓ Can search by keyword
```

---

### 3.3 Filter by Category
**Purpose:** Verify category filtering

```
Steps:
1. Go to marketplace
2. Find category filter
3. Select "Technology"

Expected Results:
✓ Ideas filter to only show "Technology" category
✓ Results update immediately
```

---

## 4. Real-time Messaging

### 4.1 Direct Messages (DMs)
**Purpose:** Verify user-to-user messaging

**Setup:**
- Open 2 browser windows/tabs
- Login as user1 in Tab 1
- Login as user2 in Tab 2

```
Steps (Tab 1 - Sender):
1. Go to /messages
2. Find user2 in conversation list (or search)
3. Type message: "Hello from User 1"
4. Click Send or press Enter

Steps (Tab 2 - Receiver):
1. Go to /messages
2. Should see message INSTANTLY appear
3. Click on conversation
4. See full message from User 1

Expected Results:
✓ Message appears instantly in both tabs (no refresh needed)
✓ Message shows correctly (sender/receiver)
✓ Conversation appears in both users' lists
✓ Timestamp shows message creation time
```

**Persistence Test:**
- Tab 2: Refresh page
- Message should still be there
- Conversation history loads from MongoDB

---

### 4.2 Message Persistence
**Purpose:** Verify messages survive refresh

```
Steps:
1. Tab 1: Send message "Test persistence"
2. Tab 2: See message appear
3. Tab 2: Refresh page (F5)

Expected Results:
✓ Message still visible after refresh
✓ Entire conversation history loads
✓ Messages in correct order
```

---

### 4.3 Unread Count
**Purpose:** Verify unread message tracking

```
Steps (Tab 1):
1. Go to /messages
2. Create new conversation with user2

Steps (Tab 2):
1. Go to /messages
2. Conversation should show unread count (badge with number)
3. Click conversation to open

Expected Results:
✓ Unread count shows (e.g., "1" in red badge)
✓ Count decreases when opening conversation
✓ Shows correctly in conversation list
```

---

### 4.4 Idea Discussion Messages
**Purpose:** Verify messaging within idea context

**Precondition:** Both users accepted collaboration on an idea

```
Steps (Tab 1):
1. Go to idea page
2. Scroll to discussion section
3. Type message: "I think we should implement X first"
4. Click Send

Steps (Tab 2):
1. Go to same idea page
2. Scroll to discussion
3. Message should appear INSTANTLY

Expected Results:
✓ Message appears in real-time
✓ Shows sender name and timestamp
✓ Message distinguishes between DMs and idea discussion
✓ Multiple messages form a thread
✓ Messages persist on refresh
```

---

## 5. Notifications

### 5.1 Real-time Notifications
**Purpose:** Verify instant notification delivery

**Setup:**
- Tab 1: Login as user1
- Tab 2: Login as user2

```
Steps (Tab 1):
1. Go to /notifications (click bell icon or navigate)
2. Leave this page open

Steps (Tab 2):
1. Create a new idea
2. Go to idea page
3. If you know user1's ID, click "Collaborate"

Steps (Tab 1):
Expected Results:
✓ New notification appears INSTANTLY
✓ Shows: "User2 wants to collaborate on [Idea Title]"
✓ Can see notification in /notifications page
✓ Notification has action button
✓ Notification type shows (collaboration_invite, message, etc.)
```

---

### 5.2 Notification Types
**Purpose:** Verify different notification triggers

Test each type:

**Collaboration Invitation:**
- User2 proposes collaboration on User1's idea
- User1 should get notification: "User2 wants to collaborate on..."

**Message Notification:**
- User2 sends direct message to User1
- User1 should get notification in notifications area (if not in chat)

**Favorite Notification:**
- User2 favorites User1's idea
- User1 should get notification: "User2 added your idea to favorites"

**Collaboration Acceptance:**
- User1 accepts User2's collaboration request
- User2 should get notification: "User1 accepted your collaboration proposal"

---

### 5.3 Mark as Read
**Purpose:** Verify read status management

```
Steps:
1. Go to /notifications
2. See unread notifications (different styling)
3. Click on notification to read
4. Notification should show as read (different style)

Expected Results:
✓ Can click to mark as read
✓ Read notifications appear different (grayed out, etc.)
✓ Unread count in header updates
```

---

### 5.4 Notification Persistence
**Purpose:** Verify notifications survive refresh

```
Steps:
1. Receive a notification (collaboration request, message, etc.)
2. See notification in /notifications
3. Refresh page (F5)

Expected Results:
✓ Notification still appears
✓ Status (read/unread) preserved
✓ Stored in MongoDB, not just in memory
```

---

## 6. Collaboration System

### 6.1 Send Collaboration Proposal
**Purpose:** Verify collaboration invitation flow

**Setup:**
- Tab 1: Login as user1 (idea creator)
- Tab 2: Login as user2 (wants to collaborate)

```
Steps (Tab 2 - Proposer):
1. Find idea created by user1
2. Click "Collaborate" button
3. Select role: "Developer", "Designer", etc.
4. Add optional message: "I'd love to work on this"
5. Click "Send Proposal"

Expected Results:
✓ No errors on page
✓ Proposal sent successfully
✓ Notification appears for user1 instantly
✓ Collaboration record created in MongoDB
```

---

### 6.2 Receive & Accept Invitation
**Purpose:** Verify invitation acceptance

**Precondition:** User2 sent collaboration proposal (from 6.1)

```
Steps (Tab 1 - Creator):
1. See notification: "User2 wants to collaborate"
2. Go to /dashboard
3. Click "Invitations" tab
4. See user2's proposal with:
   - Idea title
   - User2's name
   - Selected role
   - Optional message
5. Click "Accept" button

Expected Results:
✓ Collaboration status changes to "accepted"
✓ Idea status changes to "in-collaboration"
✓ User2 gets notification: "User1 accepted your proposal"
✓ Both users can now see each other in collaborators
```

---

### 6.3 Reject Invitation
**Purpose:** Verify invitation rejection

```
Steps:
1. In /dashboard → Invitations tab
2. Find unwanted collaboration proposal
3. Click "Reject" button

Expected Results:
✓ Proposal status changes to "rejected"
✓ No longer shows in invitations
✓ Proposer gets notification (optional)
```

---

### 6.4 View Active Collaborations
**Purpose:** Verify collaboration list

**Precondition:** Both users accepted a collaboration

```
Steps (Tab 1):
1. Go to /dashboard
2. Click "Collaborations" tab

Expected Results:
✓ See ideas you're collaborating on
✓ For each collaboration shows:
  - Idea title
  - Other collaborator names
  - Role you have
  - Link to view idea
```

---

## 7. Dashboards

### 7.1 Creator Dashboard - Overview Tab
**Purpose:** Verify dashboard stats for creators

```
Steps:
1. Login as user who created ideas
2. Go to /dashboard
3. Click "Overview" tab

Expected Results:
✓ See stat cards showing:
  - My Ideas: [number]
  - Pending Requests: [number]
  - Active Collaborations: [number]
  - Pending Invitations: [number]
✓ Stats are accurate
✓ Quick action buttons: "Create Idea", "Find Collaborators"
```

**Verify Stats:**
- Create an idea, refresh dashboard, count increases
- Send collaboration proposal, pending increases
- Accept collaboration, active increases

---

### 7.2 Creator Dashboard - My Ideas Tab
**Purpose:** Verify idea management view

```
Steps:
1. Go to /dashboard → "My Ideas" tab

Expected Results:
✓ See all ideas you created
✓ For each idea shows:
  - Title and description
  - Pending collaboration requests count
  - Active collaborators count
  - "View" button to see full idea
```

---

### 7.3 Creator Dashboard - Collaborations Tab
**Purpose:** Verify active collaboration view

```
Steps:
1. Go to /dashboard → "Collaborations" tab

Expected Results:
✓ See all ideas you're collaborating on
✓ Shows collaborator names
✓ Shows collaboration role
✓ Can click to view idea
```

---

### 7.4 Creator Dashboard - Invitations Tab
**Purpose:** Verify pending invitation management

```
Steps:
1. Go to /dashboard → "Invitations" tab

Expected Results:
✓ See all pending collaboration proposals
✓ For each proposal shows:
  - Idea title
  - Proposer name
  - Proposed role
  - Message (if provided)
✓ "Accept" and "Reject" buttons work
```

---

## 8. Favorites System

### 8.1 Add to Favorites
**Purpose:** Verify favorite tracking

**Setup:**
- Tab 1: Login as user1
- Tab 2: Login as user2

```
Steps (Tab 2):
1. Go to marketplace
2. Find idea by user1
3. Click heart icon (favorite button)

Expected Results:
✓ Heart icon fills in/highlights (visual feedback)
✓ User2 can see it's favorited
✓ Favorite data saved to MongoDB
```

---

### 8.2 Creator Gets Notification
**Purpose:** Verify favorite notifications work

**Precondition:** User2 just favorited user1's idea (from 8.1)

```
Steps (Tab 1):
1. Check /notifications

Expected Results:
✓ See notification: "User2 added your idea to favorites"
✓ Notification appears instantly (real-time)
✓ Can click to go to idea
```

---

### 8.3 Favorites Persist
**Purpose:** Verify favorites survive refresh

```
Steps:
1. Favorite an idea
2. Heart shows as filled
3. Refresh page (F5)

Expected Results:
✓ Heart still shows as filled
✓ Database persists favorite
✓ Works across devices/sessions
```

---

### 8.4 Remove from Favorites
**Purpose:** Verify unfavorite functionality

```
Steps:
1. Go to idea you favorited (heart is filled)
2. Click heart icon again

Expected Results:
✓ Heart unfills
✓ Favorite removed from database
✓ Creator gets notification: "Your idea was removed from favorites" (optional)
```

---

## 9. Profile Management

### 9.1 View Profile
**Purpose:** Verify profile page loads

```
Steps:
1. Go to /profile

Expected Results:
✓ See profile information:
  - Username
  - Email
  - Bio (if set)
  - Skills (if set)
  - Location (if set)
  - Avatar (if set)
```

---

### 9.2 Edit Profile
**Purpose:** Verify profile updates

```
Steps:
1. Go to /profile
2. Click "Edit" or find edit button
3. Change fields:
   - Bio: "Full-stack developer and AI enthusiast"
   - Skills: "JavaScript, React, Node.js"
   - Location: "San Francisco, CA"
4. Click "Save"

Expected Results:
✓ Changes saved to database
✓ Profile shows updated information
✓ No console errors
```

---

### 9.3 Profile Persistence Across Sessions
**Purpose:** Verify profile data survives logout/login

```
Steps:
1. Edit profile (add bio, skills, etc.)
2. Go to /logout
3. Confirm logout
4. Login again with same credentials
5. Go to /profile

Expected Results:
✓ Changes from step 1 still visible
✓ Profile is database-backed, not local storage
✓ Works across different browsers/devices
```

---

## 10. WebSocket & Real-time

### 10.1 WebSocket Connection
**Purpose:** Verify WebSocket is connected

```
Steps:
1. Open app in browser
2. Open DevTools (F12)
3. Go to Network tab
4. Filter by "WS" (WebSocket)
5. Refresh page or wait for connection

Expected Results:
✓ See socket.io connection entry
✓ Status: "101 Web Socket Protocol Handshake"
✓ URL includes socket.io path
✓ Connection is maintained (no red error icon)
```

---

### 10.2 Real-time Message Delivery
**Purpose:** Verify messages arrive without refresh

```
Steps (2 Browsers):
Browser 1 (User A):
1. Go to /messages with User B
2. Type: "Hello User B"
3. Send

Browser 2 (User B):
1. Go to /messages with User A
2. WAIT (do not refresh)

Expected Results:
✓ Message appears in Browser 2 within 1 second
✓ No page refresh needed
✓ Real-time via WebSocket, not polling
```

---

### 10.3 WebSocket Reconnection
**Purpose:** Verify auto-reconnect after disconnect

```
Steps:
1. Open app and go to /messages
2. Open DevTools → Network
3. Right-click socket.io connection → Block
4. Try to send message
5. Right-click socket.io → Unblock

Expected Results:
✓ WebSocket reconnects automatically
✓ Messages work again after reconnect
✓ Message history loads from API
✓ No manual refresh required
```

---

### 10.4 Real-time Notification Delivery
**Purpose:** Verify notifications arrive instantly

```
Steps (2 Browsers):
Browser 1 (User A):
1. Go to /notifications
2. Leave page open

Browser 2 (User B):
1. Go to idea by User A
2. Click "Collaborate"

Browser 1:
Expected Results:
✓ Notification appears within 1 second
✓ No page refresh needed
✓ Shows instantly via WebSocket
```

---

## Testing Checklist Summary

### Critical Path (Must Test First)
- [ ] Login/Logout
- [ ] Create Idea
- [ ] Browse Marketplace
- [ ] Send Direct Message (real-time)
- [ ] Receive Notification (real-time)
- [ ] Propose Collaboration
- [ ] Accept Collaboration
- [ ] View Dashboard

### Full Feature Testing
- [ ] User Registration
- [ ] Session Persistence
- [ ] Edit Idea
- [ ] Delete Idea
- [ ] Search/Filter Ideas
- [ ] Multiple Message Types
- [ ] Message Persistence
- [ ] Unread Counts
- [ ] Idea Discussion
- [ ] All Notification Types
- [ ] Reject Collaboration
- [ ] View Collaborations
- [ ] All Dashboard Tabs
- [ ] Add/Remove Favorites
- [ ] Profile Edit
- [ ] Profile Persistence
- [ ] WebSocket Connection
- [ ] WebSocket Reconnection

### Performance Tests
- [ ] Messages load in < 1 second (real-time)
- [ ] Notifications appear in < 1 second
- [ ] Dashboard stats load in < 2 seconds
- [ ] Marketplace loads in < 2 seconds
- [ ] No console errors on any page

---

## Troubleshooting Tips

### If Messages Don't Appear Real-time
1. Check DevTools → Network → WS
2. Verify socket.io connection shows 101
3. Check browser console for errors
4. Verify CORS_ORIGINS includes frontend URL
5. Try page refresh and resend

### If Notifications Don't Appear
1. Check DevTools console for errors
2. Verify user is logged in (token in localStorage)
3. Check backend logs for notification send errors
4. Try refreshing notifications page
5. Verify /api/notifications endpoint works

### If Collaboration Flow Fails
1. Verify both users exist in database
2. Check idea exists and creator is set
3. Look for errors in browser console
4. Check backend logs for API errors
5. Verify database has Collaboration record

### If Profile Changes Don't Persist
1. Check browser console for API errors
2. Verify MongoDB connection
3. Check backend logs
4. Verify PATCH /users/me endpoint works
5. Check database has updated User record

---

## Environment Setup for Testing

**Local Development:**
```bash
# Terminal 1: Start Backend
cd packages/backend
npm start
# Should show: "DreamCraft Backend with WebSocket running on port 3001"

# Terminal 2: Start Frontend
cd apps/web
npm run dev
# Should show: "VITE v5.4.21 dev server running at: http://localhost:5173/"

# Open http://localhost:5173 in browser
```

**Production Testing:**
```bash
# Use deployed URLs
Frontend: https://your-app.vercel.app
Backend API: https://your-api.onrender.com/api
WebSocket: https://your-api.onrender.com (socket.io)
```

---

## Success Criteria

**All features working when:**
- ✅ Can create ideas and see them in marketplace
- ✅ Can send messages and see them instantly in other tab
- ✅ Can receive notifications within 1 second
- ✅ Can propose collaboration and creator sees it
- ✅ Can accept/reject collaborations
- ✅ Dashboard shows accurate stats
- ✅ Can favorite ideas and creator gets notified
- ✅ Profile changes persist across sessions
- ✅ WebSocket shows 101 status in DevTools
- ✅ No red errors in browser console
- ✅ No errors in backend logs

---

**Last Updated:** December 11, 2025
**Total Test Cases:** 50+
**Estimated Testing Time:** 1-2 hours for complete test
**Critical Path Time:** 30 minutes for essential features
