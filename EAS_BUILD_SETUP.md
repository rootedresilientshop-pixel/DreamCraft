# 🔧 EAS Build Setup - Complete Requirements

## What is EAS?
**EAS = Expo Application Services** - Expo's cloud build service that compiles your React Native app into a native Android APK/AAB that you can submit to Google Play Store.

---

## ✅ Requirements Checklist

### 1. **Expo Account** (Free)
- [ ] Create account at https://expo.dev
- [ ] Verify email
- [ ] Username & password saved

### 2. **Node.js & npm** (Already have this)
```bash
node --version  # Should be v20+
npm --version   # Should be v10+
```

### 3. **EAS CLI** (Install)
```bash
npm install -g eas-cli
```

Verify:
```bash
eas --version  # Should show: eas-cli/X.X.X
```

### 4. **Git** (Already have this)
```bash
git --version
```

### 5. **Android Configuration in app.json**
Currently in `apps/mobile/app.json`:
```json
{
  "expo": {
    "name": "VentureLab",
    "slug": "venturelab",
    "version": "1.0.0",
    "android": {
      "package": "com.venturelab.app"
    }
  }
}
```

✅ Already configured correctly!

### 6. **eas.json Configuration**
Currently in `apps/mobile/eas.json`:
```json
{
  "cli": {
    "version": ">= 5.4.0"
  },
  "build": {
    "preview": {
      "android": {
        "buildType": "apk"
      }
    },
    "preview2": {
      "android": {
        "buildType": "aab"
      }
    },
    "production": {
      "android": {
        "buildType": "aab"
      }
    }
  }
}
```

✅ Already configured correctly!

---

## 🔑 Signing Key Requirements

For publishing to Google Play Store, you need a **signing key** that signs your APK.

### Option 1: Let EAS Manage It (Recommended - Easiest)
EAS will automatically create and manage your signing key. You just need to:
1. Login with Expo account
2. Run build command
3. EAS handles the rest

**No action needed on your part!**

### Option 2: Manual Signing (Advanced)
If you want to manage the key yourself:

```bash
# Create key with keytool (comes with Java)
keytool -genkey -v -keystore venturelab-release-key.jks \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000 \
  -alias venturelab-key
```

Then configure in `eas.json`:
```json
{
  "build": {
    "production": {
      "android": {
        "buildType": "aab",
        "secureKeyStore": true
      }
    }
  }
}
```

---

## 📋 Step-by-Step Setup

### Step 1: Install EAS CLI
```bash
npm install -g eas-cli
eas --version
```

### Step 2: Login to Expo
```bash
eas login
```
- Enter your Expo account email
- Enter your password
- Will authenticate with Expo

### Step 3: Configure EAS (One-time)
```bash
cd C:\Users\gardn\VentureLab\apps\mobile
eas build:configure
```

This will:
- Ask which platforms to build for: **Select Android**
- Create/configure `eas.json`
- Set up default build profiles

### Step 4: Verify Configuration
```bash
# Check eas.json is configured
cat eas.json

# Check app.json has required fields
cat app.json
```

Should see:
- `expo.name`: "VentureLab"
- `expo.slug`: "venturelab"
- `expo.version`: "1.0.0"
- `android.package`: "com.venturelab.app"

---

## 🏗️ Building the APK

### Command 1: Build for Testing (APK)
```bash
cd C:\Users\gardn\VentureLab\apps\mobile
eas build --platform android --profile preview
```

This will:
- Build your app in the cloud (takes 10-20 minutes)
- Compile to Android APK format
- Sign with EAS-managed key
- Output download link

**Profile "preview" = APK format = Good for testing**

### Command 2: Build for Play Store (AAB)
```bash
eas build --platform android --profile production
```

This will:
- Build your app
- Compile to Android App Bundle (AAB) format
- Sign with production key
- Output download link

**Profile "production" = AAB format = Required for Play Store**

---

## 📥 Monitoring the Build

While building, EAS will:
1. Show real-time build logs
2. Display build progress
3. Provide download link when done

You can also:
```bash
# Check build status
eas build:list

# View logs for a build
eas build:view [BUILD_ID]
```

---

## 💾 Output Files

After successful build, you'll get:

### For Testing (preview profile):
- **File:** `venturelab-1.0.0.apk`
- **Size:** ~80-150 MB
- **Use:** Upload to internal testing on Play Store

### For Production (production profile):
- **File:** `venturelab-1.0.0.aab`
- **Size:** ~50-100 MB
- **Use:** Upload to Play Store for release

---

## 🆘 Common Issues & Fixes

### Issue 1: "not logged in"
```bash
# Solution: Login first
eas login
# Enter credentials
```

### Issue 2: "eas.json not found"
```bash
# Solution: Configure EAS
cd apps/mobile
eas build:configure
```

### Issue 3: "Invalid app.json"
Check these fields exist:
```json
{
  "expo": {
    "name": "VentureLab",
    "slug": "venturelab",
    "version": "1.0.0",
    "android": {
      "package": "com.venturelab.app"
    }
  }
}
```

### Issue 4: Build fails with "No Android SDK"
- Don't worry! EAS builds in the cloud
- You don't need Android SDK installed
- Just need Node.js and EAS CLI

### Issue 5: Build times out
- EAS has generous timeout (usually 1 hour)
- Free tier is slower than paid
- Just wait, it will complete

---

## ✨ Current Status

✅ **What's Already Done:**
- `app.json` configured correctly
- `eas.json` configured correctly
- Mobile app fully built
- Backend API ready
- Environment configured for Render backend

✅ **What You Need to Do:**
1. [ ] Install EAS CLI: `npm install -g eas-cli`
2. [ ] Create Expo account at https://expo.dev
3. [ ] Login: `eas login`
4. [ ] Configure: `cd apps/mobile && eas build:configure`
5. [ ] Build: `eas build --platform android --profile preview`
6. [ ] Download APK
7. [ ] Upload to Play Store

---

## 🚀 Quick Start Commands

Copy and paste these in order:

```bash
# 1. Install EAS
npm install -g eas-cli

# 2. Go to mobile folder
cd C:\Users\gardn\VentureLab\apps\mobile

# 3. Login (will prompt for credentials)
eas login

# 4. Configure (interactive, select Android when asked)
eas build:configure

# 5. Build for testing
eas build --platform android --profile preview

# 6. Wait for build to complete (10-20 minutes)
# 7. Download APK from provided link
```

---

## 📊 What Happens During Build

```
Step 1: EAS receives build request
         ↓
Step 2: EAS clones your repo from GitHub
         ↓
Step 3: EAS installs dependencies (npm install)
         ↓
Step 4: EAS runs build scripts
         ↓
Step 5: EAS compiles React Native → Android
         ↓
Step 6: EAS creates APK/AAB file
         ↓
Step 7: EAS signs with key
         ↓
Step 8: EAS uploads to your account
         ↓
Step 9: You download the file
```

**Total time: 10-20 minutes**

---

## 💡 Pro Tips

1. **First build is slowest** (downloads/caches dependencies)
2. **Subsequent builds are faster** (5-10 minutes)
3. **Keep EAS CLI updated:** `npm install -g eas-cli@latest`
4. **Monitor build here:** https://expo.dev/accounts/[your-username]/projects/venturelab
5. **Free tier is fine** for testing - only pay if you need faster builds

---

## ✅ Ready to Build?

Once you've completed the checklist above, run:

```bash
cd C:\Users\gardn\VentureLab\apps\mobile
eas build --platform android --profile preview
```

That's it! EAS will handle the rest.

---

## 📞 Help Resources

- **EAS Docs:** https://docs.expo.dev/build/introduction/
- **Build Configuration:** https://docs.expo.dev/build/eas-json/
- **Troubleshooting:** https://docs.expo.dev/build/troubleshooting/
- **Expo Dashboard:** https://expo.dev

---

**Next Step:** Run the quick start commands above!
