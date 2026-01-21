# Force Render Rebuild

The backend isn't responding because Render hasn't rebuilt with the new environment variables yet.

## Quick Fix: Restart Backend Service

1. Go to [render.com](https://render.com)
2. Click on your `dreamcraft` backend service
3. Go to **"Settings"** tab (bottom of left menu)
4. Click **"Restart"** button at the bottom
5. This forces a rebuild with the new environment variables
6. Wait 2-3 minutes for rebuild to complete
7. Check the **"Logs"** tab for "Server running on port 3002"

---

## After Restart

Once rebuilt, test:

```bash
curl https://dreamcraft-f8w8.onrender.com/api/health
```

Should return:
```json
{"status":"ok","timestamp":"2026-01-20T..."}
```

---

## If Still Not Working

In the Logs tab, look for:
- `Connected to MongoDB` - means DB connection worked
- `❌ Missing required environment variables` - means env vars not set
- `Server error` - means something else failed

Share what you see in the logs!

---

**Go restart the backend service in Render now!**
