# Local Testing Guide - Simple Steps

## Prerequisites
- MongoDB running locally (`mongod`)
- Node.js installed
- Port 3000 and 3002 available

---

## Step 1: Clear Database (Fresh Start)

```bash
npm run db:clear
```

**Expected Output:**
```
🔌 Connecting to MongoDB...
✅ Connected to MongoDB
📊 Found X collections to clear
  ✓ Dropped: users
  ✓ Dropped: ideas
  ...
🎉 Successfully cleared X collections!
```

---

## Step 2: Start Backend (Terminal 1)

```bash
npm run backend
```

**Expected Output:**
```
MongoDB connected
Express server running on port 3002
```

**What it does:**
- Connects to MongoDB at `localhost:27017/dreamcraft`
- Starts API server at `http://localhost:3002`
- Ready to receive requests

---

## Step 3: Start Web App (Terminal 2)

```bash
npm run web
```

**Expected Output:**
```
VITE v5.0.0
➜  Local:   http://localhost:3000
```

**What it does:**
- Starts React dev server on `http://localhost:3000`
- Automatically proxies `/api` calls to `http://localhost:3002`

---

## Step 4: Test in Browser

Open: **http://localhost:3000**

### 4A: Register as Creator

1. Click "Register" or go to login page
2. Enter credentials:
   ```
   Email:    test-creator@example.com
   Password: password123
   Username: testcreator
   ```
3. Click "Register"
4. Select **Creator** role
5. You're logged in!

### 4B: Create an Idea

1. Click "Create Idea" or go to `/create-idea`
2. Fill in:
   ```
   Title:       My AI Startup
   Description: An AI tool that helps with X
   Category:    Technology
   Visibility:  Private
   ```
3. Click "Create"
4. See success message ✓

### 4C: View Dashboard

1. Click "Dashboard" or `/dashboard`
2. See your new idea in "My Ideas" tab
3. Stats show: 1 idea created

### 4D: Make Idea Public

1. In dashboard, click the idea
2. Click "Make Public"
3. Idea now visible in marketplace

---

## Step 5: Test Error Handling

### 5A: Test Invalid Input

1. Go to "Create Idea"
2. Try submitting with **empty title**
3. See error message (inline, not alert)
4. Fix and try again

### 5B: Test Network Error

1. Stop the backend (`Ctrl+C` in Terminal 1)
2. Try to create an idea
3. See error: "Failed to create idea"
4. Restart backend

---

## Step 6: Test Marketplace

1. Register another account:
   ```
   Email:    collaborator@example.com
   Password: password123
   Username: collaborator
   ```
2. Select **Collaborator** role
3. Complete profile wizard
4. Go to **Marketplace** (`/`)
5. See creator's public idea
6. Click on it to view details

---

## What You're Testing

| Feature | How to Test | Expected Result |
|---------|-------------|-----------------|
| **Registration** | Register new account | User created, logged in |
| **Login** | Use credentials | Token saved, dashboard loads |
| **Create Idea** | Fill form, submit | Idea saved, success message |
| **Dashboard** | Click Dashboard tab | Shows user's ideas with stats |
| **Marketplace** | Click Marketplace link | Shows all public ideas |
| **Error Handling** | Submit empty form | Inline error message (no alert) |
| **API Consistency** | Check network tab | All responses have `success` field |

---

## Verify Fixes

### Port Configuration ✓
- Backend on 3002: `http://localhost:3002` (terminal output)
- Web on 3000: `http://localhost:3000` (browser)
- API calls work: Dashboard loads without errors

### API Response Format ✓
1. Open browser DevTools (F12)
2. Go to **Network** tab
3. Create an idea (or trigger any action)
4. Click the request (e.g., `POST /api/ideas`)
5. See Response:
   ```json
   {
     "success": true,
     "data": { ... }
   }
   ```
   Or on error:
   ```json
   {
     "success": false,
     "error": "Error message"
   }
   ```

### Error Display ✓
1. Go to Create Idea
2. Submit empty form
3. See red error box (not browser alert)
4. Error disappears when you fix it

### Mobile Polling ✓
1. Open DevTools Console
2. Leave page open for 30 seconds
3. Should see minimal console spam
4. Before: would see lots of polling logs
5. After: only logs on actual changes

---

## Quick Checklist

- [ ] Database cleared successfully
- [ ] Backend starts without errors
- [ ] Web app loads at http://localhost:3000
- [ ] Can register as creator
- [ ] Can create an idea
- [ ] Dashboard shows the idea
- [ ] Can view marketplace
- [ ] Error messages display inline (no alerts)
- [ ] Network responses include `success` field
- [ ] No TypeScript errors in console

---

## Troubleshooting

### "Cannot connect to MongoDB"
```bash
# Start MongoDB in another terminal
mongod
```

### "Port 3000/3002 already in use"
```bash
# Kill process using port (on Windows)
netstat -ano | findstr :3002
taskkill /PID <PID> /F
```

### "Backend not responding"
- Check Terminal 1: Backend should say "Express server running on port 3002"
- Check DevTools Network tab for failed requests
- Restart backend

### "API calls show errors"
- Check browser DevTools Console (F12)
- Check backend Terminal 1 for errors
- Verify `.env` has `VITE_API_BASE=http://localhost:3002/api`

---

## After Testing

1. **Everything works?** Great! The fixes are solid.
2. **Found an issue?** Note it and restart to test again.
3. **Want fresh data?** Run `npm run db:clear` again
4. **Want to stop?** Press `Ctrl+C` in both terminals

---

**Total time: ~10 minutes for basic testing**
