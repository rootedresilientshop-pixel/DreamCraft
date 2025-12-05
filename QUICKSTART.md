# DreamCraft Quick Start Guide

## 🚀 Get Running in 5 Minutes

### Option A: Docker (Recommended - Works Everywhere)

```powershell
# 1. Make sure backend is built
cd c:\Users\gardn\DreamCraft\packages\backend
npm run build

# 2. Start everything with docker-compose
cd c:\Users\gardn\DreamCraft
docker-compose up

# 3. Backend should be running on http://localhost:3001
# 4. MongoDB running on mongodb://localhost:27017
```

**Expected Output:**
```
dreamcraft-mongodb | MongoDB server started
dreamcraft-backend | DreamCraft Backend running on port 3001
dreamcraft-backend | Database connected successfully
```

**Test it:**
```powershell
Invoke-RestMethod -Uri http://localhost:3001/health
# Should return: {"status":"ok","timestamp":"..."}
```

**Stop everything:**
```powershell
docker-compose down
```

---

### Option B: Local Development (Node.js + Local MongoDB)

#### Prerequisites
- MongoDB running on `localhost:27017` (or Atlas connection string in .env)
- Node.js 24+

#### Steps

```powershell
# 1. Create .env.local in backend
Copy-Item packages\backend\.env.example packages\backend\.env.local

# Edit .env.local with your values:
# - MONGODB_URI=mongodb://localhost:27017/dreamcraft
# - JWT_SECRET=dev-key-xyz
# - STRIPE_SECRET_KEY=sk_test_xxx
# - OPENAI_API_KEY=sk-xxx

# 2. Start backend
cd packages\backend
npm install   # Only needed once
npm run build # Compile TypeScript
npm start     # Run compiled server

# Backend should start on port 3001
```

#### In separate terminals:

**Start web app for development:**
```powershell
cd apps\web
npm install   # Only needed once
npm run dev   # Vite dev server on http://localhost:5173
```

**Start mobile app for development:**
```powershell
cd apps\mobile
npm install   # Only needed once
npm run start # Expo dev server
```

---

## 📁 Project Structure

```
DreamCraft/
├── packages/backend/          Backend API (Node.js + Express)
│   ├── dist/                  Compiled JavaScript (ready for production)
│   ├── src/
│   │   ├── server.ts          Main Express app
│   │   ├── db.ts              MongoDB connection
│   │   ├── routes/            API endpoints (auth, ideas, marketplace, etc)
│   │   ├── models/            Database schemas (User, Idea, Transaction)
│   │   └── middleware/        Security (auth, rate limiting, validation, logging)
│   ├── Dockerfile             Docker image definition
│   ├── .env.example           Environment variables template
│   └── package.json
│
├── apps/web/                  Web Frontend (React + Vite)
│   ├── dist/                  Production build (ready to deploy)
│   ├── src/
│   │   ├── App.tsx            Main app with routing
│   │   ├── api.ts             Backend API client
│   │   ├── pages/             Login, Marketplace pages
│   │   └── index.tsx          React entry point
│   ├── vite.config.ts         Vite configuration
│   └── package.json
│
├── apps/mobile/               Mobile Frontend (React Native + Expo)
│   ├── src/
│   │   ├── App.tsx            Navigation structure
│   │   ├── api.ts             Backend API client
│   │   └── screens/           UI screens (Login, Home, Profile, etc)
│   ├── app.json               Expo configuration
│   └── package.json
│
├── packages/shared/           Shared TypeScript Types
│   ├── src/
│   │   ├── types.ts           Type definitions
│   │   └── index.ts           Export types
│   └── package.json
│
├── docker-compose.yml         Local dev environment (MongoDB + Backend)
├── .env.staging               Staging environment config template
├── .env.production            Production environment config template
└── package.json               Root workspace config
```

---

## 📝 Available Commands

### Backend

```powershell
cd packages\backend

# Install dependencies
npm install

# Build TypeScript to JavaScript
npm run build

# Start compiled server
npm start

# Development mode (auto-rebuild on changes)
npm run dev

# Run TypeScript compiler check
npm run tsc

# Clean build artifacts
npm run clean
```

### Web App

```powershell
cd apps\web

# Install dependencies
npm install

# Development server (http://localhost:5173)
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# TypeScript check
npm run tsc

# ESLint check
npm run lint
```

### Mobile App

```powershell
cd apps\mobile

# Install dependencies
npm install

# Start Expo dev server
npm run start

# Start on iOS (requires Mac)
npm run ios

# Start on Android (requires emulator/device)
npm run android

# TypeScript check
npm run tsc
```

### Docker

```powershell
# Build and start services
docker-compose up

# Stop services
docker-compose down

# View logs
docker-compose logs -f backend

# Rebuild backend image
docker build -t dreamcraft-backend:latest packages/backend/

# Test backend health
docker exec dreamcraft-backend curl http://localhost:3001/health
```

---

## 🔌 API Endpoints

All endpoints require `Authorization: Bearer {token}` header (except auth and public endpoints)

### Authentication
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Get JWT token

### Ideas
- `GET /api/ideas` - List user's ideas
- `POST /api/ideas` - Create new idea
- `GET /api/ideas/:id` - Get idea details
- `PUT /api/ideas/:id` - Update idea
- `DELETE /api/ideas/:id` - Delete idea
- `POST /api/ideas/:id/valuate` - AI valuation using OpenAI

### Marketplace
- `GET /api/marketplace/ideas` - Browse public ideas
- `GET /api/marketplace/search?q=keyword` - Search ideas

### Collaborators
- `GET /api/collaborators/search?skill=keyword` - Find collaborators by skill

### Payments
- `POST /api/payments/intent` - Create Stripe payment intent

### Health Check
- `GET /health` - System status

---

## 🐛 Debugging

### Check Backend Logs
```powershell
# Docker
docker-compose logs backend

# Or tail in real-time
docker-compose logs -f backend
```

### Check What's Running
```powershell
# Docker
docker-compose ps

# Ports in use
netstat -ano | findstr :3001    # Backend
netstat -ano | findstr :5173    # Web dev
netstat -ano | findstr :27017   # MongoDB
```

### Test API Endpoints
```powershell
# Health check
Invoke-RestMethod -Uri http://localhost:3001/health

# Register account
Invoke-RestMethod -Method Post -Uri http://localhost:3001/api/auth/register `
  -ContentType "application/json" `
  -Body '{"email":"test@dev.com","username":"testuser","password":"Password123"}'

# Login
Invoke-RestMethod -Method Post -Uri http://localhost:3001/api/auth/login `
  -ContentType "application/json" `
  -Body '{"email":"test@dev.com","password":"Password123"}'
```

### TypeScript Errors?
```powershell
# Check backend
cd packages\backend && npm run tsc

# Check web
cd apps\web && npm run tsc

# Check mobile
cd apps\mobile && npm run tsc
```

---

## 🚨 Common Issues

| Problem | Solution |
|---------|----------|
| `docker: command not found` | Install Docker Desktop: https://docker.com/products/docker-desktop |
| `Port 3001 already in use` | Kill process: `Get-Process -Name node \| Stop-Process` or use different port |
| `MongoDB connection failed` | Start MongoDB: `docker run -d -p 27017:27017 mongo:7` |
| `Cannot find module 'express'` | Run `npm install` in the appropriate directory |
| `CORS error in browser` | Update `CORS_ORIGINS` in `.env.local` |
| `JWT token invalid` | Make sure `JWT_SECRET` matches between .env and code |
| `Rate limit exceeded` | Middleware blocks >100 requests per 15 min (configurable) |

---

## 📊 Performance Notes

- **Backend startup:** ~2-3 seconds
- **Web build time:** ~4.76 seconds (Vite)
- **Web prod bundle:** 203 KB → 68 KB gzipped
- **Mobile TypeScript check:** <10 seconds
- **Rate limiting:** 100 requests per 15 minutes
- **JWT expiry:** 7 days

---

## 🔐 Security Features

✅ **Implemented:**
- JWT authentication (7-day expiry)
- bcryptjs password hashing
- CORS with origin whitelist
- Rate limiting (100 req/15 min)
- Input validation and sanitization
- Request logging and tracking
- SQL injection prevention (Mongoose)
- XSS protection (React, React Native)

⚠️ **Still Needed:**
- HTTPS/TLS certificates (deploy with reverse proxy)
- API key rotation schedule
- Database backups and recovery plan
- Monitoring and alerting (Sentry, DataDog)
- Automated security scanning (npm audit)
- Database encryption at rest
- CDN for static assets

---

## 📚 Learn More

- [Express.js Docs](https://expressjs.com)
- [React Docs](https://react.dev)
- [React Native Docs](https://reactnative.dev)
- [MongoDB Docs](https://docs.mongodb.com)
- [Docker Docs](https://docs.docker.com)
- [Vite Docs](https://vitejs.dev)
- [TypeScript Docs](https://www.typescriptlang.org)

---

## 🎯 Next Steps

1. ✅ Run `docker-compose up` to verify local setup
2. ✅ Create `.env.local` with test values
3. 🔑 Get API keys (MongoDB, OpenAI, Stripe)
4. 🚀 Deploy backend to cloud (ECS/Heroku/Cloud Run)
5. 🌐 Deploy web app (Vercel/Netlify)
6. 📱 Submit mobile apps (iOS/Android app stores)

---

**Questions?** Check `DEPLOYMENT_CHECKLIST.md` for detailed steps.  
**Need help?** See `ENV_SETUP_GUIDE.md` for environment configuration.  
**Running issues?** See troubleshooting section above.
