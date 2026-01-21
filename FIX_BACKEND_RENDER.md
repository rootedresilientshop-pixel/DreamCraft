# Fix Backend on Render - Step by Step

## Problem
Backend is running but returning 404 on all API routes. This means the Express app isn't loading routes properly, likely because MongoDB isn't connecting.

## Solution

**Go to Render dashboard and verify/update these environment variables:**

1. Go to [render.com](https://render.com)
2. Click on your `dreamcraft` backend service
3. Go to **"Environment"** tab
4. **Verify/Update each variable** (copy-paste exact values):

### Variable 1: NODE_ENV
```
Name: NODE_ENV
Value: production
```

### Variable 2: PORT
```
Name: PORT
Value: 3002
```

### Variable 3: MONGODB_URI
```
Name: MONGODB_URI
Value: mongodb+srv://dreamcraft_user:FBZun8CkGw0Rpj1f@dreamcraft.ged81bl.mongodb.net/?appName=DreamCraft
```
⚠️ **IMPORTANT**: Make sure the password `FBZun8CkGw0Rpj1f` is exactly right!

### Variable 4: JWT_SECRET
```
Name: JWT_SECRET
Value: a572eed63f66464f3650ae198990309975ce40b0a097ece53ce0f810cd292db9
```

### Variable 5: CORS_ORIGINS
```
Name: CORS_ORIGINS
Value: https://dreamcraft-khaki.vercel.app
```

### Variable 6: STRIPE_SECRET_KEY
```
Name: STRIPE_SECRET_KEY
Value: sk_test_dummy_for_now
```

### Variable 7: OPENAI_API_KEY
```
Name: OPENAI_API_KEY
Value: sk_test_dummy_for_now
```

---

## After Updating

1. Click "Save" (or save each one individually)
2. Render will redeploy automatically
3. Wait 2-3 minutes for the deployment to complete
4. Check the Logs tab - look for "Server running on port 3002"
5. Test the health endpoint:
   ```
   curl https://dreamcraft-f8w8.onrender.com/api/health
   ```
   Should return: `{"status":"ok"}`

---

## If Still Not Working

Come back and tell me:
1. What errors you see in the Render Logs
2. Confirm all 7 environment variables are set correctly
3. Let me know if the rebuild completed successfully

---

**Do this now and let me know when all variables are saved!**
