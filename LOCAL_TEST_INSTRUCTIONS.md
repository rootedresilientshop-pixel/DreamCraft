# Local Testing Instructions

All 6 phases have been successfully implemented and committed to GitHub!

## How to Start the Development Environment

### Terminal 1 - Backend Server
```bash
cd packages/backend
npm start
```

Expected output:
```
✅ Environment validation passed
✅ DreamCraft Backend with WebSocket running on port 3002
📡 CORS enabled for: http://localhost:5173,http://127.0.0.1:5173,https://dreamcraft-khaki.vercel.app
```

### Terminal 2 - Frontend Dev Server
```bash
cd apps/web
npm run dev
```

Expected output:
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  press h to show help
```

---

## What to Test

### Phase 0 - Bug Fixes
1. **Valuation Fix**
   - Go to an idea
   - Click "Generate Valuation" button
   - Should show valuation data WITHOUT 404 error
   - Page should persist data after refresh

2. **NDA Display**
   - Click "View NDA" button
   - Should open modal popup with NDA text
   - Modal should have download button
   - Close modal without opening collaboration flow

3. **Leaderboard**
   - Navigate to `/leaderboard` or click leaderboard link in navbar
   - Should show top 20 ideas ranked by valuation score
   - Each card shows rank, title, score, creator

4. **Dashboard Cards**
   - Go to Collaborator Dashboard
   - Stat cards should be clickable
   - Clicking card navigates to idea detail

### Phase 1 - Invite Codes
1. **Registration with Invite Code**
   - Logout if logged in
   - Try registering without invite code → Should fail
   - Register with valid code (admin must create first)
   - User should see `betaAccess` data in profile

2. **Admin Create Invite Code**
   - Login as admin user
   - Go to `/admin` dashboard
   - Click "Invite Codes" tab
   - Create new invite code
   - Code should appear in list

### Phase 2 - Admin Dashboard
1. **Access Admin Panel**
   - Login as admin
   - Click "Admin Dashboard" in navbar
   - Should see 4 tabs: Overview, Invite Codes, Beta Users, Feedback

2. **View Statistics**
   - Overview tab shows:
     - Total users
     - Active collaborations
     - Ideas created
     - Beta access distribution

3. **Manage Invite Codes**
   - Invite Codes tab shows all codes
   - Can create new codes
   - Can deactivate codes
   - See usage stats

4. **View Beta Users**
   - Beta Users tab shows recently registered users
   - Shows which invite code each user used
   - Shows join date and last active

### Phase 3 - Feedback System
1. **Floating Feedback Button**
   - Should appear on all authenticated pages
   - Bottom-right corner of screen
   - Click opens feedback modal

2. **Submit Feedback**
   - Click feedback button
   - Fill out form:
     - Type: Bug/Feature/Improvement/Other
     - Category: UI/Performance/Auth/Ideas/etc
     - Title: Required
     - Description: Required
   - Click "Submit Feedback"
   - Should see success message

### Phase 4 - Feedback Board
1. **View Feedback Board**
   - Go to `/feedback` or click "Feedback Board" in navbar
   - Should see all submitted feedback
   - Shows stats at top (Total, Open, In Progress, Resolved)

2. **Filter and Search**
   - Filter by category
   - Filter by status
   - Search by keyword
   - Sort by newest/most upvoted

3. **Upvote Feedback**
   - Click upvote button on any feedback
   - Count should increase
   - Click again to remove upvote

4. **View Detail Page**
   - Click on feedback item
   - Goes to `/feedback/:id`
   - Shows full details
   - Can upvote and delete if owner

### Phase 5 - Admin Feedback Management
1. **Admin Controls**
   - Login as admin
   - Go to `/feedback/:id` (any feedback)
   - Should see admin controls:
     - Status dropdown (open/in-progress/resolved/closed)
     - Priority dropdown (low/medium/high/critical)
     - Admin notes textarea

2. **Update Status**
   - Change feedback status
   - Should save immediately
   - Feedback creator receives notification

3. **Admin Dashboard Feedback**
   - Go to Admin Dashboard
   - Feedback tab shows:
     - Feedback statistics
     - List of all feedback
     - Can filter by status/category

### Phase 6 - Real-time Updates
1. **Socket.io Real-time**
   - Open feedback board in 2 browser windows
   - Submit feedback in window 1
   - Should appear in window 2 instantly (no page refresh)

2. **Upvote Real-time**
   - Upvote feedback in window 1
   - Count updates in window 2 instantly

3. **Admin Status Update**
   - Admin changes status in window 1
   - Notification appears in user's window 2

---

## Test Data Setup

### Create Admin User (First Time)
```bash
# In MongoDB (mongo shell or Compass)
db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { userType: "admin" } }
)
```

### Create Invite Code (Via Admin Dashboard)
1. Login as admin
2. Go to Admin Dashboard
3. Invite Codes tab
4. Click "Create New Code"
5. Generated code appears

### Create Test Ideas
1. Login as creator
2. Create a few public ideas
3. Generate valuations for them
4. Should appear on leaderboard

---

## Troubleshooting

**Backend won't start:**
```bash
# Check if port 3002 is in use
lsof -i :3002
# Kill process if needed
kill -9 <PID>
```

**Frontend won't start:**
```bash
# Check if port 5173 is in use
lsof -i :5173
# Check for TypeScript errors
npm run build
```

**Database connection issues:**
- Verify MongoDB is running
- Check MONGODB_URI in .env
- Confirm network access in Atlas (IP whitelist)

**CORS errors:**
- Check CORS_ORIGINS in backend .env
- Should include http://localhost:5173
- Backend must be restarted after .env change

---

## URLs to Test

**Frontend:**
- http://localhost:5173/ - Main page
- http://localhost:5173/login - Login/Register
- http://localhost:5173/dashboard - User dashboard
- http://localhost:5173/admin - Admin dashboard
- http://localhost:5173/leaderboard - Idea leaderboard
- http://localhost:5173/feedback - Feedback board
- http://localhost:5173/ideas/:id - Idea detail

**Backend API:**
- http://localhost:3002/api/health - Health check
- http://localhost:3002/api/ideas/leaderboard/top - Leaderboard data
- http://localhost:3002/api/feedback - Feedback list
- http://localhost:3002/api/admin/beta-users - Beta users list

---

## Success Indicators

✅ All 6 phases working if:
- ✅ Valuations don't crash with 404
- ✅ NDA shows in modal popup
- ✅ Leaderboard displays top ideas
- ✅ Dashboard cards are clickable
- ✅ Invite codes required for registration
- ✅ Admin dashboard loads and functions
- ✅ Feedback button appears on all pages
- ✅ Feedback board shows submissions
- ✅ Admin controls appear for admins
- ✅ Real-time updates work (Socket.io)

---

## Next: Deploy to Production

Once local testing passes:

```bash
# Commit any local test changes
git add .
git commit -m "test: Local testing complete, all phases working"
git push origin main

# Vercel redeploys automatically
# Wait 2-3 minutes for deployment to complete

# Test live at:
# https://dreamcraft-khaki.vercel.app
```
