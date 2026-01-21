# CRITICAL: Set Environment Variable in Vercel NOW

The reason you're getting 404 errors is almost certainly because `VITE_API_BASE` is NOT set in Vercel.

## Do This Now (2 minutes):

### 1. Go to Vercel Dashboard
Visit: https://vercel.com/dashboard

### 2. Click on `dreamcraft-khaki` project

### 3. Go to Settings Tab
- Click **Settings** in the top navigation
- Find **Environment Variables** in the left sidebar

### 4. Add the Variable
Click **Add New**:
- **Name:** `VITE_API_BASE`
- **Value:** `https://dreamcraft-f8w8.onrender.com/api`
- **Under "Select environments":** Make sure **ALL THREE** are checked:
  - ☑ Production
  - ☑ Preview
  - ☑ Development
- Click **Add** button

### 5. You'll see it listed, something like:
```
VITE_API_BASE
https://dreamcraft-f8w8.onrender.com/api
Production, Preview, Development
```

### 6. Trigger Redeploy
This is CRITICAL - the environment variable won't take effect without a redeploy!

Option A (Easier):
- Go to **Deployments** tab
- Find the latest deployment (top of the list)
- Click the three dots (•••) on the right
- Click **Redeploy**
- Wait for green checkmark (2-3 minutes)

Option B (Via Git):
- Make any small change (like adding a comment)
- Commit: `git commit -m "trigger: set api endpoint"`
- Push: `git push origin main`
- Wait for Vercel to deploy (you'll see it in Deployments)

### 7. Wait for Green Checkmark
The deployment must complete before testing. Look at:
- https://vercel.com/dashboard > dreamcraft-khaki > Deployments
- Latest deployment should have green ✅ checkmark

### 8. Test It
- Go to https://dreamcraft-khaki.vercel.app
- Hard refresh: **Ctrl+Shift+R** (Windows) or **Cmd+Shift+R** (Mac)
- Try to create an idea
- Should work with no 404 error!

---

## If You're Confused

The problem is simple:
- Frontend code says: "use VITE_API_BASE environment variable"
- Vercel env variable not set = frontend defaults to localhost
- localhost doesn't exist on Vercel = 404 error

---

**CRITICAL: Do this right now. Without this step, nothing will work.**

Let me know when VITE_API_BASE is added and the redeploy is complete!
