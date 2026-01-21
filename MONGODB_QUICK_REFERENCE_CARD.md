# MongoDB Authentication - Quick Reference Card

## THE PROBLEM
```
Error: MongoServerError: bad auth : authentication failed
```
**Cause:** Password mismatch or special characters in password

---

## THE SOLUTION (In 6 Steps)

### Step 1: Check MongoDB
```
https://cloud.mongodb.com
→ dreamcraft cluster
→ Security → Database Access
→ Find dreamcraft_user → Edit
→ Note the password
```

### Step 2: Check Render
```
https://render.com/dashboard
→ dreamcraft backend service
→ Environment tab
→ Find MONGODB_URI
→ Note the password
```

### Step 3: Do they match?
```
YES ✓ → But might have special chars, skip to Step 5
NO ✗ → Generate new password, go to Step 4
```

### Step 4: Generate new password (if needed)
```
MongoDB Atlas → Database Access → Edit dreamcraft_user
→ Click "Auto Generate Secure Password"
→ If password has special chars (@, #, %, &):
   → Click "Generate" again
   → Keep clicking until ONLY letters and numbers
→ Click "Update User"
```

### Step 5: Get full connection string
```
MongoDB Atlas → Deployments → dreamcraft cluster
→ CONNECT button
→ Drivers → Node.js
→ Copy the template
→ Replace <password> with your password
```

### Step 6: Update Render
```
Render Dashboard → dreamcraft service
→ Environment tab
→ MONGODB_URI = [paste your full connection string]
→ Click Save
→ Wait 2-3 minutes
→ Check logs for "running on port" message ✅
```

---

## THE ANSWER FORMAT

```
mongodb+srv://dreamcraft_user:PASSWORD@dreamcraft.ged81bl.mongodb.net/?retryWrites=true&w=majority&appName=MongoDB
```

**Replace PASSWORD with:** Only letters and numbers (a-z, A-Z, 0-9)

---

## CRITICAL CHECKLIST

- [ ] Password = alphanumeric ONLY (no @, #, %, &, !, etc.)
- [ ] Full connection string includes `?retryWrites=true&w=majority`
- [ ] Using `mongodb+srv://` (not `mongodb://`)
- [ ] Username = `dreamcraft_user`
- [ ] Cluster = `dreamcraft.ged81bl.mongodb.net`
- [ ] Entire string pasted into Render MONGODB_URI
- [ ] Render redeployed (wait 2-3 minutes)
- [ ] Logs show "running on port" ✅

---

## TROUBLESHOOTING

| Problem | Solution |
|---------|----------|
| Still "bad auth" error | Generate new password (NO special chars) |
| Frontend shows 404 | Hard refresh browser (Ctrl+Shift+R) |
| Render keeps crashing | Check logs for full error message |
| Timeout connecting | Check IP whitelist in MongoDB → Security → Network Access |

---

## WHAT NOT TO DO

- ❌ Use password with special characters
- ❌ Manually type the connection string
- ❌ Commit credentials to git
- ❌ Use old password: `FBZun8CkGw0Rpj1f` (EXPOSED)

---

## EXPECTED SUCCESS MESSAGE

When you look at Render logs, you'll see:
```
✅ DreamCraft Backend with WebSocket running on port 10000
```

Then test:
```bash
curl https://dreamcraft-f8w8.onrender.com/api/health
```

Response:
```json
{"status":"ok","timestamp":"2026-01-21T..."}
```

---

## FULL GUIDES AVAILABLE

- **Quick Fix (15 min):** `AUTHENTICATION_MISMATCH_QUICK_FIX.md`
- **Checklist:** `MONGODB_FIX_CHECKLIST.md`
- **Deep Dive:** `MONGODB_AUTH_DIAGNOSIS_AND_SOLUTION.md`
- **Overview:** `AUTHENTICATION_ISSUE_SUMMARY.md`

---

**Time to fix:** 15-20 minutes | **Difficulty:** Easy | **Priority:** CRITICAL
