# 📁 DreamCraft Project File Guide

## 📚 Documentation Files (Read These First)

| File | Purpose | Read Time |
|------|---------|-----------|
| **INDEX.md** | Start here - Navigation guide for all docs | 5 min |
| **COMPLETE.md** | Executive summary of entire build | 5 min |
| **STARTUP_GUIDE.md** | How to start all services (Backend, Mobile, Web) | 10 min |
| **BUILD_REPORT.md** | Detailed technical specifications & architecture | 15 min |
| **BUILD_SUMMARY.md** | Feature inventory and implementation status | 10 min |
| **README.md** | Project overview and business model | 5 min |
| **.env.example** | Environment variables template (copy to .env.local) | 2 min |

---

## 🏢 Backend Files (Express API Server)

**Location**: `packages/backend/`

### Configuration
- `package.json` - Dependencies and scripts
- `tsconfig.json` - TypeScript configuration

### Source Code (`src/`)
- `server.ts` - Main Express application
- `routes/auth.ts` - Authentication endpoints (register, login)
- `models/User.ts` - User database schema
- `models/Idea.ts` - Idea database schema
- `models/Transaction.ts` - Transaction database schema
- `middleware/auth.ts` - JWT authentication middleware
- `services/aiService.ts` - OpenAI integration service

### Compiled Output (`dist/`)
- Automatically generated TypeScript compilation
- Ready to run with `npm run dev`

### How to Use
```bash
cd packages/backend
npm run dev           # Development with hot reload
npm run build         # Compile TypeScript
npm start             # Production server
```

---

## 📱 Mobile App Files (React Native + Expo)

**Location**: `apps/mobile/`

### Configuration
- `package.json` - Dependencies and scripts
- `tsconfig.json` - TypeScript configuration
- `app.json` - Expo configuration (app name, version, etc.)
- `index.js` - Entry point

### Source Code (`src/`)
- `App.tsx` - Navigation setup and auth flow
- `screens/SplashScreen.tsx` - Loading screen
- `screens/LoginScreen.tsx` - Email/password login
- `screens/HomeScreen.tsx` - Dashboard with stats
- `screens/IdeaDocumentationScreen.tsx` - Idea submission form
- `screens/CollaboratorBrowseScreen.tsx` - Find builders
- `screens/ProfileScreen.tsx` - User account settings
- `store/` - Zustand state management (placeholder)
- `hooks/` - Custom React hooks (placeholder)

### How to Use
```bash
cd apps/mobile
npm start              # Start Expo dev server
npm run ios            # iOS simulator
npm run android        # Android emulator
npm run web            # Web version
```

---

## 🌐 Web App Files (React + Vite)

**Location**: `apps/web/`

### Configuration
- `package.json` - Dependencies and scripts
- `tsconfig.json` - TypeScript configuration
- `tsconfig.node.json` - Node TypeScript config
- `vite.config.ts` - Vite bundler configuration

### Source Code (`src/`)
- `App.tsx` - Main React component
- `index.tsx` - React DOM entry point
- `index.css` - Global styles

### Public Files (`public/`)
- `index.html` - HTML template

### How to Use
```bash
cd apps/web
npm start              # Development server (port 3000)
npm run build          # Production build
npm run preview        # Preview production build
```

---

## 🔗 Shared Type Files

**Location**: `packages/shared/`

### Source Code (`src/`)
- `types.ts` - All TypeScript type definitions used across the app
  - User, Idea, Transaction, Subscription types
  - Collaboration request types
  - API response types
  - Business model types

- `index.ts` - Exports all types

### How to Use
Import types:
```typescript
import { User, Idea, Transaction } from 'dreamcraft-shared';
```

---

## ⚙️ Project Configuration Files (Root)

- `.env.example` - Environment variables template
- `.gitignore` - Git ignore rules
- `package.json` - Root project scripts
- `tsconfig.json` - Root TypeScript configuration
- `README.md` - Project overview

---

## 📂 Complete Directory Structure

```
DreamCraft/
│
├── 📄 Documentation
│   ├── INDEX.md                    ← Start here
│   ├── COMPLETE.md                 ← Executive summary
│   ├── STARTUP_GUIDE.md            ← How to run
│   ├── BUILD_REPORT.md             ← Technical details
│   ├── BUILD_SUMMARY.md            ← Feature list
│   ├── README.md                   ← Project overview
│   └── FILE_GUIDE.md               ← This file
│
├── 📁 apps/
│   │
│   ├── 📱 mobile/                  (React Native - iOS/Android)
│   │   ├── src/
│   │   │   ├── App.tsx
│   │   │   ├── screens/
│   │   │   │   ├── SplashScreen.tsx
│   │   │   │   ├── LoginScreen.tsx
│   │   │   │   ├── HomeScreen.tsx
│   │   │   │   ├── IdeaDocumentationScreen.tsx
│   │   │   │   ├── CollaboratorBrowseScreen.tsx
│   │   │   │   └── ProfileScreen.tsx
│   │   │   ├── store/
│   │   │   └── hooks/
│   │   ├── node_modules/           (698 packages)
│   │   ├── index.js
│   │   ├── app.json
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── README.md
│   │
│   └── 🌐 web/                     (React + Vite)
│       ├── src/
│       │   ├── App.tsx
│       │   ├── index.tsx
│       │   └── index.css
│       ├── public/
│       │   └── index.html
│       ├── node_modules/           (1,319 packages)
│       ├── vite.config.ts
│       ├── tsconfig.json
│       ├── tsconfig.node.json
│       ├── package.json
│       └── README.md
│
├── 📁 packages/
│   │
│   ├── 🔧 backend/                 (Express API Server)
│   │   ├── src/
│   │   │   ├── server.ts
│   │   │   ├── models/
│   │   │   │   ├── User.ts
│   │   │   │   ├── Idea.ts
│   │   │   │   └── Transaction.ts
│   │   │   ├── routes/
│   │   │   │   └── auth.ts
│   │   │   ├── middleware/
│   │   │   │   └── auth.ts
│   │   │   └── services/
│   │   │       └── aiService.ts
│   │   ├── dist/                   (Compiled JavaScript)
│   │   │   ├── server.js
│   │   │   ├── models/
│   │   │   ├── routes/
│   │   │   ├── middleware/
│   │   │   └── services/
│   │   ├── node_modules/           (194 packages)
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── README.md
│   │
│   └── 🔗 shared/                  (TypeScript Types)
│       ├── src/
│       │   ├── types.ts
│       │   └── index.ts
│       ├── package.json
│       └── README.md
│
├── 📄 Configuration Files
│   ├── .env.example                (Copy to .env.local)
│   ├── .gitignore
│   ├── package.json                (Root scripts)
│   └── tsconfig.json               (Root TypeScript config)
│
└── 📄 Root Documentation
    ├── INDEX.md
    ├── COMPLETE.md
    ├── STARTUP_GUIDE.md
    ├── BUILD_REPORT.md
    ├── BUILD_SUMMARY.md
    ├── FILE_GUIDE.md
    └── README.md
```

---

## 🚀 Quick Reference Commands

### Backend Commands
```bash
cd packages/backend
npm run dev              # Start development server
npm run build            # Compile TypeScript
npm start                # Start production server
npm test                 # Run tests (when available)
```

### Mobile Commands
```bash
cd apps/mobile
npm start                # Start Expo dev server
npm run ios              # iOS simulator
npm run android          # Android emulator
npm run web              # Web version
```

### Web Commands
```bash
cd apps/web
npm start                # Development server
npm run build            # Production build
npm run preview          # Preview production
npm test                 # Run tests (when available)
```

---

## 🔑 Key Files to Know

### For Backend Development
1. `packages/backend/src/server.ts` - Add new routes here
2. `packages/backend/src/routes/` - API endpoints
3. `packages/backend/src/models/` - Database schemas
4. `packages/backend/src/middleware/` - Auth & validation

### For Mobile Development
1. `apps/mobile/src/App.tsx` - Navigation setup
2. `apps/mobile/src/screens/` - UI components
3. `apps/mobile/src/store/` - State management
4. `apps/mobile/src/hooks/` - Custom hooks

### For Web Development
1. `apps/web/src/App.tsx` - Main component
2. `apps/web/src/index.tsx` - Entry point
3. `apps/web/vite.config.ts` - Build configuration

### For Types
1. `packages/shared/src/types.ts` - All TypeScript interfaces
2. `packages/shared/src/index.ts` - Type exports

---

## 📋 File Sizes (Approximate)

| Component | Size |
|-----------|------|
| Mobile node_modules | 400 MB |
| Web node_modules | 600 MB |
| Backend node_modules | 200 MB |
| Source code (all) | 50 MB |
| **Total** | **~1.25 GB** |

---

## 🎯 Development Workflow

1. **Backend Development**
   - Edit files in `packages/backend/src/`
   - `npm run dev` auto-recompiles
   - Test at `http://localhost:3001`

2. **Mobile Development**
   - Edit files in `apps/mobile/src/`
   - Changes hot-reload in Expo
   - Test in simulator/emulator

3. **Web Development**
   - Edit files in `apps/web/src/`
   - Vite provides HMR
   - Preview at `http://localhost:3000`

4. **Type Updates**
   - Edit `packages/shared/src/types.ts`
   - Types auto-import in other packages
   - No build needed (TypeScript only)

---

## 🔗 File Dependencies

```
Frontend (Mobile/Web)
    ↓
Calls API Endpoints
    ↓
Backend Express Server
    ↓
Uses Middleware (Auth, Errors)
    ↓
Calls Database Models
    ↓
MongoDB Database
```

---

## 📝 Notes

- All TypeScript files in `src/` compile to JavaScript in `dist/`
- `node_modules/` folders are auto-generated, don't edit
- Environment variables go in `.env.local` (copy from `.env.example`)
- All files use TypeScript strict mode for type safety
- Database models are ready for MongoDB connection

---

**Happy coding!** 🚀

For more info, see:
- **STARTUP_GUIDE.md** - How to run everything
- **BUILD_REPORT.md** - Architecture details
- **README.md** - Project overview
