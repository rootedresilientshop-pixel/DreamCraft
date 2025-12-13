# 🚀 DreamCraft - Google Play Store Launch Plan (TODAY)

**Goal:** Get DreamCraft live on Google Play Store for testing/alpha

**Current Status:**
- ✅ APK Building (Build ID: f1043ec4-1f17-4b3d-8e2e-762ec9ff6885)
- ✅ Backend deployed on Render
- ✅ Web deployed on Vercel
- ✅ All features implemented (Profile wizard, creator intro, skill filtering)

---

## ⏱️ Timeline

**Phase 1: Testing (Now - 1 hour)**
- Download APK from build
- Test collaborator profile wizard on phone
- Verify all features work

**Phase 2: Google Play Setup (1-2 hours)**
- Create Google Play Developer account (if needed)
- Create app listing
- Set up pricing and countries

**Phase 3: Build for Store (15 mins)**
- Build production AAB using eas build
- Download from EAS

**Phase 4: Upload & Review (2-24 hours)**
- Upload to internal testing (instant, no review)
- OR Upload to alpha (1-3 hour review)

---

## 🎯 Quick Launch: Internal Testing (FASTEST)

**For immediate testing with friends/team:**

```bash
# When APK is ready, get download link from:
# https://expo.dev/accounts/gardners/projects/dreamcraft/builds/f1043ec4-1f17-4b3d-8e2e-762ec9ff6885
```

**Then:**
1. Go to Google Play Console
2. Go to Testing → Internal Testing
3. Click "Create release"
4. Upload the APK
5. Share link with testers (up to 100 people)
6. No Google review needed - instant!

---

## 📋 Pre-Launch Checklist

### Account Setup (if first time)
- [ ] Google Play Developer Account (https://play.google.com/console)
- [ ] Pay $25 one-time fee
- [ ] Complete business profile

### Create App on Play Console
- [ ] App name: "DreamCraft"
- [ ] Default language: English
- [ ] App type: Free
- [ ] Category: Business or Productivity
- [ ] Save the App ID for reference

### App Configuration
Already set in `apps/mobile/app.json`:
```json
{
  "expo": {
    "name": "DreamCraft",
    "slug": "dreamcraft",
    "version": "1.0.0",
    "android": {
      "package": "com.dreamcraft.app"
    }
  }
}
```

---

## 🔧 Build for Google Play Store

**Option 1: Production Build (AAB - for Play Store submission)**
```bash
cd apps/mobile
# This will create AAB (app-bundle format for Play Store)
npx eas build --platform android --profile production
# Takes ~15 minutes
```

**Option 2: Testing Build (APK - for direct testing)**
```bash
cd apps/mobile
# This creates APK (directly installable)
npx eas build --platform android --profile preview
# Takes ~15 minutes
```

---

## 📝 Store Listing Details

### App Details (in Play Console)

**Name:** DreamCraft

**Short description (80 chars):**
"Connect innovators with collaborators"

**Full description:**
```
DreamCraft connects idea creators with skilled collaborators.

Pitch your ideas, find experts, collaborate, and build together.

Features:
✓ Post your innovative ideas
✓ Find collaborators by expertise
✓ Get AI-powered valuations
✓ Communicate directly with collaborators
✓ Build your collaboration portfolio

Perfect for entrepreneurs, innovators, and subject matter experts
looking to turn ideas into reality.
```

**Category:** Business

**Contact email:** (your email)

---

## 🎨 Store Assets (Required)

You'll need to create/upload:

1. **App Icon** (512×512 PNG)
   - Square, no transparency
   - Can use DreamCraft logo

2. **Screenshots** (5-6 required)
   - Size: 1080×1920 (portrait)
   - Show:
     1. Registration/Login
     2. Role selection
     3. Creator dashboard
     4. Collaborator profile
     5. Marketplace/Ideas
     6. Messaging

3. **Featured Image** (1024×500 PNG)
   - Marketing banner

---

## 🔐 Data & Privacy

**Data Safety (required):**
- [ ] Data collected: Email, name, profile info
- [ ] Data usage: App functionality
- [ ] Third-party sharing: None
- [ ] Data retention: User account lifetime

**Privacy Policy:** (required for production)
- Can use simple template: https://www.termsfeed.com/privacy-policy-generator/
- Or create your own

**Content Rating:** (required)
- Complete questionnaire
- Mark all as "No"

---

## 🚀 Upload Steps

### For Internal Testing (Instant - Recommended First)

1. **Go to Play Console**
   - https://play.google.com/console
   - Select DreamCraft app

2. **Testing → Internal Testing**
   - Click "Create release"
   - Click "Upload APK" or "Upload AAB"
   - Select your built file
   - Review and save

3. **Share with Testers**
   - Testers need Google accounts
   - Copy internal testing link
   - Share with up to 100 people
   - They install directly from Play Store
   - No review needed - instant!

### For Alpha Testing (Optional - 1-3 hour review)

1. **Testing → Closed Testing**
   - Create test group
   - Upload APK/AAB
   - Set release notes
   - Submit for review
   - Google reviews ~1-3 hours
   - Once approved, testers can install

---

## ✅ Pre-Upload Testing Checklist

Before uploading to Play Store, test on your phone:

- [ ] Registration (creator and collaborator)
- [ ] Login
- [ ] Role selection
- [ ] Collaborator profile wizard
- [ ] Creator intro modal (appears and dismisses)
- [ ] Search collaborators by skill
- [ ] Browse ideas
- [ ] Create idea (if creator)
- [ ] Messaging between users
- [ ] App doesn't crash

---

## 📊 Post-Launch

**After uploading, monitor:**
- Play Console dashboard (crashes, installs, ratings)
- Backend logs on Render
- User feedback and reviews

---

## 📱 Current Build Info

**Testing APK:**
- Build ID: f1043ec4-1f17-4b3d-8e2e-762ec9ff6885
- Profile: preview (APK format - directly installable)
- Status: Building...
- Download: Will be available at https://expo.dev/artifacts/eas/...

**For Production Submission:**
- Will use profile: production (AAB format - Play Store format)
- Build when ready

---

## 🎯 Next Actions

1. ✅ Wait for APK build to complete (f1043ec4-1f17-4b3d-8e2e-762ec9ff6885)
2. ✅ Download APK
3. ✅ Test all features on phone
4. ✅ Confirm 401 error is fixed
5. 📝 Create/complete Google Play Console app listing
6. 📸 Create store screenshots
7. 🔑 Upload APK to internal testing
8. 👥 Share with testers
9. 📊 Monitor feedback
10. 🎉 When ready, move to alpha/production

---

## 💡 Key Points

- **APK vs AAB**: APK is direct install, AAB is Play Store format
- **Internal Testing**: Fastest way (instant, no review)
- **Alpha Testing**: More formal (1-3 hour review by Google)
- **Version Code**: Always increment (3→4→5) for each build
- **Signing**: EAS handles automatically with remote credentials

---

**Ready to launch! Just wait for build to complete.** 🚀
