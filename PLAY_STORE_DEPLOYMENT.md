# 🚀 Google Play Store - Alpha Launch Guide

**Goal:** Deploy VentureLab as an alpha/beta app on Google Play Store

**Timeline:** ~3-5 hours (includes build time)

---

## 📋 Pre-Deployment Checklist

### Step 1: Google Play Developer Account (30 minutes)
- [ ] Go to https://play.google.com/console
- [ ] Create/login to Google Play Developer account
- [ ] Pay $25 one-time registration fee
- [ ] Complete business profile and tax info
- [ ] Save your **Developer Account ID** - you'll need it

### Step 2: Create App on Play Console (15 minutes)
- [ ] Go to Play Console → "Create app"
- [ ] **App name:** VentureLab
- [ ] **Default language:** English
- [ ] **App type:** Free app
- [ ] **Category:** Business or Productivity
- [ ] Create the app
- [ ] Save your **App ID** (e.g., com.venturelab.app)

### Step 3: Update app.json (5 minutes)
Update these values in `apps/mobile/app.json`:

```json
{
  "expo": {
    "name": "VentureLab",
    "version": "1.0.0",
    "android": {
      "package": "com.venturelab.app",
      "versionCode": 1,
      "permissions": [
        "INTERNET",
        "ACCESS_NETWORK_STATE",
        "CAMERA",
        "RECORD_AUDIO"
      ]
    }
  }
}
```

### Step 4: Create Signing Key (Important!)
This is critical for Play Store publishing.

**Option A: Let EAS Create It (Easiest - Recommended)**
```bash
cd apps/mobile
npx eas build --platform android --local # Will create signing key
```

**Option B: Create Manually with keytool**
```bash
keytool -genkey -v -keystore venturelab-release-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias venturelab-key
```

**Save these values - you'll need them:**
- Keystore path: `venturelab-release-key.jks`
- Keystore password: (your password)
- Key alias: `venturelab-key`
- Key password: (your password)

---

## 🔧 Build & Sign APK

### Option 1: Using EAS Build (Recommended - Easier)

**1. Install EAS CLI:**
```bash
npm install -g eas-cli
```

**2. Login to Expo:**
```bash
eas login
# Use your Expo account
```

**3. Configure EAS:**
```bash
cd apps/mobile
eas build:configure
```

**4. Build for Android:**
```bash
eas build --platform android --profile preview
```

This will:
- Build your app
- Sign it with the key
- Output an APK file
- Take 10-15 minutes

**5. Download the APK:**
- Watch for build completion URL
- Download the `.apk` file
- Save it: `venturelab-v1.0.0.apk`

---

### Option 2: Manual Build with Gradle

```bash
cd apps/mobile
npx expo prebuild --clean
cd android
./gradlew assembleRelease
```

Output: `android/app/build/outputs/apk/release/app-release.apk`

---

## 📤 Upload to Play Store

### Step 1: Prepare Store Listing (30 minutes)

In **Play Console → VentureLab app:**

**App details:**
- [ ] App name: "VentureLab"
- [ ] Short description: "Collaborate on innovative ideas"
- [ ] Full description:
```
VentureLab connects idea creators with skilled collaborators.

Features:
- Post your innovative ideas
- Find collaborators by expertise
- Get AI-powered valuations
- Communicate directly with collaborators
- Build your collaboration portfolio

Perfect for entrepreneurs, innovators, and subject matter experts.
```

**Category:** Business or Productivity

**Age rating:** Complete questionnaire (mostly "No")

**Screenshots:**
- [ ] Create 5-6 screenshots showing:
  1. Login/Registration
  2. Creator Dashboard
  3. Marketplace
  4. Collaboration invite
  5. Messaging
  6. User profile

**Icon:** 512x512 PNG (upload in app details)

**Featured image:** 1024x500 PNG

**Content rating:** Complete questionnaire

**Privacy policy:** https://your-site.com/privacy (or create one)

---

### Step 2: Upload APK (10 minutes)

**In Play Console:**

1. **Testing → Internal Testing**
   - [ ] Create internal test track
   - [ ] Click "Upload APK"
   - [ ] Select your signed APK
   - [ ] Wait for processing (2-5 minutes)

2. **Or: Testing → Closed Testing (Alpha)**
   - [ ] Create alpha track
   - [ ] Upload APK
   - [ ] Set test users (optional)
   - [ ] Review and submit

---

### Step 3: Complete Store Listings

In Play Console, fill out:

- [ ] Privacy policy
- [ ] Data safety
  - Check what data your app accesses
  - Mark as "No sensitive data"
- [ ] App access
  - [ ] Select "No access"
- [ ] Target audience
  - Mark age groups
- [ ] Content ratings
  - Complete questionnaire

---

### Step 4: Set Pricing & Distribution

- [ ] Pricing: Free
- [ ] Available in countries: Worldwide (or select countries)
- [ ] Device categories: Phones & tablets

---

### Step 5: Submit for Review

**Option A: Internal Testing (No review needed - instant)**
1. Go to **Testing → Internal Testing**
2. Upload your APK
3. Invite testers via Google accounts
4. Share link: `https://play.google.com/apps/internaltest/...`
5. Testers can install immediately from Play Store

**Option B: Closed Testing (Alpha) - Requires Review (1-3 hours)**
1. Go to **Testing → Closed Testing**
2. Create test group
3. Upload APK
4. Click "Create Release"
5. Review everything and submit
6. Google reviews for ~1-3 hours
7. Once approved, testers can install

**Option C: Production - Requires Full Review (24-48 hours)**
- Not recommended for initial launch
- Better to use internal/alpha first

---

## ✅ Testing Before Upload

**Before submitting, test:**

```bash
cd apps/mobile

# Test the build locally first
npx expo prebuild

# Or use Android Emulator:
# 1. Install Android Studio
# 2. Create virtual device
# 3. Run: npx expo run:android
```

**On the emulator/device test:**
- [ ] Registration flow
- [ ] Login
- [ ] Role selection
- [ ] Creator dashboard
- [ ] Collaborator dashboard
- [ ] Create idea (if Creator)
- [ ] Browse ideas
- [ ] Messaging
- [ ] Invite collaborators

---

## 🔄 Version Management

For updates after initial release:

**Update version in app.json:**
```json
{
  "expo": {
    "version": "1.0.1",
    "android": {
      "versionCode": 2
    }
  }
}
```

**Important:**
- Always increment `versionCode` (int) when updating
- Update `version` (string) for user-facing changes
- Each build needs a higher `versionCode`

---

## 📊 Post-Launch Monitoring

After your app goes live:

1. **Check Play Console Dashboard:**
   - User count
   - Crashes
   - ANR (frozen app)
   - Reviews

2. **Set up crash reporting:**
   - Already in code: `Firebase Crashlytics` (via Expo)
   - Check `eas build` logs

3. **Respond to reviews:**
   - Reply to user feedback
   - Address reported issues in next build

4. **Monitor backend:**
   - Check Render logs for errors
   - Monitor API response times
   - Set up alerts for failures

---

## 🆘 Troubleshooting

**Build fails:**
- Check `eas build:configure` setup
- Verify signing key is correct
- Check app.json syntax

**Upload fails:**
- Verify app.json values match Play Console
- Check package name matches
- Ensure screenshots are correct size

**App crashes on device:**
- Check browser console in dev server
- Look at Play Console crash reports
- Test locally on emulator first

**Users can't login:**
- Verify backend URL in environment.ts
- Check CORS settings on backend
- Test API endpoint manually

---

## 📱 What Users Will See

**Internal Testing Link (Instant):**
- Share this with testers
- No review needed
- Up to 100 testers
- Can be shared publicly (not recommended for alpha)

**Alpha/Beta Track:**
- Moderated by Google (1-3 hours review)
- Better for "pre-release" status
- Can have up to 1000 or more testers
- Shows "Alpha" or "Beta" badge on Play Store

---

## 💡 Recommended Launch Strategy

1. **Day 1:** Build APK and upload to **Internal Testing**
   - Test with close team/friends
   - Get feedback
   - Fix bugs

2. **Day 2:** Move to **Closed Testing (Alpha)**
   - Submit for review (1-3 hours)
   - Test with 20-50 testers
   - Collect feedback and ratings

3. **Day 3-5:** Fix issues from feedback
   - Update v1.0.1
   - Re-submit for alpha approval
   - Polish before production

4. **Production (Later):**
   - Once confident, submit for production
   - 24-48 hour review
   - Goes live to all Play Store users

---

## 📚 Helpful Resources

- **EAS Build Docs:** https://docs.expo.dev/build/introduction/
- **Play Store Publishing:** https://developer.android.com/studio/publish
- **App Store Optimization:** https://support.google.com/googleplay/android-developer/
- **Privacy Policy Generator:** https://www.termsfeed.com/privacy-policy-generator/

---

## Next Steps

1. Create Google Play Developer account
2. Create app on Play Console
3. Update app.json with correct values
4. Build APK with EAS
5. Upload to internal testing
6. Distribute to testers
7. Collect feedback
8. Submit to alpha track
9. Monitor and iterate

**Ready to start? Follow the checklist above!**
