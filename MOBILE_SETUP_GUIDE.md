# Mobile App Setup Guide

## Update API URL for Production

The mobile app needs to know where to reach your backend API. Update the configuration after deploying to Render.

### Step 1: Update app.json with Backend URL

Edit `apps/mobile/app.json` and replace the API URL:

```json
{
  "expo": {
    "name": "VentureLab",
    "slug": "venturelab",
    // ... other config ...
    "extra": {
      "apiUrl": "https://venturelab-backend-xxxx.onrender.com/api"
    }
  }
}
```

Replace `venturelab-backend-xxxx` with your actual Render backend URL.

### Step 2: Restart Expo in Tunnel Mode

Tunnel mode bypasses LAN/firewall issues and works reliably on devices:

```powershell
cd "C:\Users\gardn\VentureLab\apps\mobile"
npx expo start --clear --tunnel
```

### Step 3: Scan QR Code with Expo Go

1. Open **Expo Go** app on your phone (iOS: App Store, Android: Google Play)
2. Scan the QR code displayed in terminal
3. App should load and connect to your Render backend

### Step 4: Test Login

1. Go to the **Login** screen
2. Register a test account:
   - Email: `test@example.com`
   - Password: `testpassword123` (8+ characters)
3. Click **Register**, then **Login**
4. You should see the home feed

---

## Environment Variables (Optional)

For EAS builds, you can override the API URL via environment variable:

### Using EAS Secrets

```bash
# Set the environment variable in EAS
eas secret create --name EXPO_PUBLIC_API_URL

# Then use it in EAS build config
eas build --platform ios --secret-env EXPO_PUBLIC_API_URL
```

This takes precedence over `app.json`.

### Development Fallback

If neither `EXPO_PUBLIC_API_URL` nor `app.json` is configured:
- Dev mode: Uses `http://localhost:3001/api` (local testing)
- Production: Uses placeholder (must be updated)

---

## Tunnel Mode vs LAN

| Mode | URL | Use Case | Pros | Cons |
|------|-----|----------|------|------|
| **Tunnel** | `exp://xxx.tunnel.exp.direct` | Production/Testing | Works anywhere, bypasses firewall | Slightly slower |
| **LAN** | `exp://192.168.x.x:8081` | Local dev | Very fast | Requires same network |
| **Local** | `exp://localhost:8081` | Web/Simulator only | Works on machine | Not for physical devices |

Use **Tunnel** for reliability.

---

## Troubleshooting

### "Cannot find module" or "Red screen"

```bash
cd apps/mobile
rm -r node_modules .expo/cache
npm install
npx expo start --clear --tunnel
```

### "Localhost refused connection"

Make sure you updated `app.json` with your Render URL, not `localhost`.

### "Invalid API URL"

Check that URL format is exactly:
```
https://venturelab-backend-xxxx.onrender.com/api
```
(Includes `/api` at the end)

---

## Next Steps

1. ✅ Deploy Render backend (see `RENDER_ENV_SETUP.md`)
2. ✅ Deploy Vercel web (see `VERCEL_ENV_SETUP.md`)
3. ✅ Update mobile app.json (this guide)
4. Test full end-to-end flow:
   - Register on mobile
   - Login
   - View ideas
   - Test all screens

---

## Production Build (Optional)

To create a production build for App Store/Play Store:

```bash
# Build for iOS
eas build --platform ios --non-interactive

# Build for Android
eas build --platform android --non-interactive
```

This requires EAS account setup and provisioning. See: https://docs.expo.dev/build/setup/
