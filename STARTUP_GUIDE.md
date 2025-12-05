# DreamCraft - Startup Guide

## 🚀 Starting the DreamCraft Platform

### Prerequisites
- Node.js 18+ installed
- npm 9+ installed
- MongoDB running locally or Atlas connection string
- Optional: Expo CLI for mobile (`npm install -g expo-cli`)

### Directory
All code is located in: **`c:\Users\gardn\DreamCraft`**

## 📱 Starting Services

### Option 1: Start All Services (Recommended)

Open 3 separate PowerShell/Terminal windows and run:

**Terminal 1 - Backend API Server (port 3001)**
```powershell
cd c:\Users\gardn\DreamCraft\packages\backend
npm run dev
```
Expected output:
```
DreamCraft Backend running on port 3001
```
Test: http://localhost:3001/health

**Terminal 2 - Mobile App (Expo)**
```powershell
cd c:\Users\gardn\DreamCraft\apps\mobile
npm start
```
Then press:
- `i` for iOS simulator
- `a` for Android emulator
- `w` for web browser

**Terminal 3 - Web App (Vite dev server on port 3000)**
```powershell
cd c:\Users\gardn\DreamCraft\apps\web
npm start
```
Access at: http://localhost:3000

---

### Option 2: Start Individual Services

**Just Backend:**
```powershell
cd c:\Users\gardn\DreamCraft\packages\backend
npm run dev
```

**Just Mobile:**
```powershell
cd c:\Users\gardn\DreamCraft\apps\mobile
npm start
```

**Just Web:**
```powershell
cd c:\Users\gardn\DreamCraft\apps\web
npm start
```

---

## 🔑 Environment Setup

1. Create `.env.local` in `c:\Users\gardn\DreamCraft`:

```env
# Server
PORT=3001
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/dreamcraft
# Or use MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/dreamcraft

# Authentication
JWT_SECRET=your-super-secret-key-change-in-production

# Stripe (Optional for now)
STRIPE_SECRET_KEY=sk_test_your_stripe_key_here

# OpenAI (For AI features)
OPENAI_API_KEY=sk-your-openai-api-key-here
```

2. Backend will automatically read from `.env.local`

---

## 📊 API Endpoints Available

### Health Check
```
GET http://localhost:3001/health
```

### Authentication (Ready)
```
POST /api/auth/register
{
  "email": "user@example.com",
  "username": "johndoe",
  "password": "password123",
  "userType": "creator"
}

POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}
```

### Not Yet Implemented
- `/api/ideas` - CRUD operations for ideas
- `/api/collaborators` - Collaborator matching
- `/api/transactions` - Payment and sales tracking

---

## 🎮 App Walkthroughs

### Mobile App (Expo)
1. **Splash Screen** - Loading state with DreamCraft branding
2. **Login Screen** - Email/password authentication
3. **Dashboard** - Shows stats (5 ideas, 2 collaborators, $13.5K value)
4. **Document Idea** - AI-guided form to input ideas
5. **Find Collaborators** - Browse and connect with builders
6. **Profile** - Account settings and subscription management

### Web App (React)
1. Welcome screen placeholder
2. Ready for page implementation
3. Shares same API backend

---

## 🛠️ Development Commands

### Backend
```powershell
# Development with auto-reload
npm run dev

# Production build
npm run build

# Start production server
npm start
```

### Mobile
```powershell
# Start Expo dev server
npm start

# iOS simulator
npm run ios

# Android emulator
npm run android

# Web version
npm run web
```

### Web
```powershell
# Development server
npm start

# Production build
npm run build

# Preview production build
npm run preview
```

---

## 📦 Project Structure Quick Reference

```
DreamCraft/
├── apps/
│   ├── mobile/     ← React Native app
│   └── web/        ← React web app
├── packages/
│   ├── backend/    ← Express API server
│   └── shared/     ← Shared TypeScript types
├── .env.local      ← Your environment variables (create this)
├── BUILD_SUMMARY.md ← Detailed build documentation
└── README.md       ← Main project documentation
```

---

## 🐛 Troubleshooting

### Backend won't start
- Make sure MongoDB is running: `mongod` or use MongoDB Atlas
- Check port 3001 isn't in use: `netstat -ano | findstr :3001`
- Verify `.env.local` has correct MONGODB_URI

### Mobile app won't start
- Clear cache: `npm install --legacy-peer-deps`
- Make sure Expo CLI is installed: `npm install -g expo-cli`
- Try: `npm start -- --clear`

### Web app won't start
- Clear node_modules: `rm -r node_modules && npm install --legacy-peer-deps`
- Make sure port 3000 isn't in use

### Dependencies not installing
- Always use: `npm install --legacy-peer-deps`
- This fixes React Native compatibility issues

---

## 📱 Testing the Full Flow (Once Connected)

1. **Backend Running** ✅
   - Health check: `curl http://localhost:3001/health`

2. **Register User**
   ```bash
   curl -X POST http://localhost:3001/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","username":"testuser","password":"test123","userType":"creator"}'
   ```

3. **Login**
   ```bash
   curl -X POST http://localhost:3001/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"test123"}'
   ```

4. **Use returned JWT token** for authenticated requests

---

## 🎯 Next Development Priorities

1. Connect frontend to backend authentication
2. Build idea CRUD API endpoints
3. Integrate OpenAI for idea valuation
4. Create marketplace listing/search
5. Implement payment processing with Stripe
6. Add collaborator matching algorithm
7. Build messaging system

---

**Ready to build!** 🚀

For detailed architecture and features, see `BUILD_SUMMARY.md`
