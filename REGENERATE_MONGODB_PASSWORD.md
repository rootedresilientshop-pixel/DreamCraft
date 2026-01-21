# Regenerate MongoDB Password - Step by Step

The password you provided didn't work. Let's generate a new one and be careful with the exact value.

## Step 1: Go to MongoDB Atlas
1. Visit https://cloud.mongodb.com
2. Login to your account
3. Click on the `dreamcraft` cluster

## Step 2: Access Database Access
1. In the left sidebar, find **Security** section
2. Click on **Database Access** (or **Database Users**)
3. You should see a list of users, including `dreamcraft_user`

## Step 3: Edit the User
1. Find `dreamcraft_user` in the list
2. Click the three dots menu (•••) on the right
3. Click **Edit Password**

## Step 4: Generate New Password
1. Click the **Auto Generate Secure Password** button
2. MongoDB will generate a random password like: `xK9mP2vL4nQ7wR5sT8uJ3bC6dF1eH0gY`
3. **IMPORTANT**: Copy the password EXACTLY as shown
   - Don't retype it
   - Don't add spaces
   - Use Ctrl+C to copy the entire string

## Step 5: View the Complete URI
After generating the password, MongoDB shows you the connection string. Look for:
```
mongodb+srv://dreamcraft_user:PASSWORD@dreamcraft.ged81bl.mongodb.net/?appName=DreamCraft
```

**Copy the complete URI** - don't construct it yourself. Just copy what MongoDB provides.

## Step 6: Update Render
1. Go to https://render.com
2. Click `dreamcraft` backend service
3. **Environment** tab
4. Find `MONGODB_URI`
5. **Paste the complete URI** from MongoDB
6. Click **Save**
7. Render will redeploy automatically

## Step 7: Wait for Restart
- Wait 2-3 minutes
- Check **Logs** tab
- Should see: **"✅ DreamCraft Backend with WebSocket running on port"**
- If still "bad auth" error, the password copy was incorrect

---

## Common Issues

**Issue: Still getting "bad auth" error**
- Make sure you copied the ENTIRE URI from MongoDB
- Don't manually construct it - paste what MongoDB provides
- Check for extra spaces before/after the password

**Issue: Getting "Deployment failed"**
- Usually means MongoDB is still rejecting the password
- Double-check the password matches exactly

---

## After Password Works

Once the Render logs show "running on port":
1. Go to https://dreamcraft-khaki.vercel.app
2. Hard refresh: Ctrl+Shift+R
3. Try creating an idea
4. Should work! ✅

---

**Do this now and paste the complete URI that MongoDB provides!**
