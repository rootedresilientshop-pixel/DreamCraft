# Docker Setup - Quick Fix Guide

## 🚀 Quick Start (Windows)

### Option 1: Use the Setup Script (Easiest)
```cmd
cd venturelab-backend
setup.bat
```

### Option 2: Manual Docker Setup
```cmd
cd venturelab-backend

# Clean up any old containers
docker-compose down

# Build and start
docker-compose up --build -d

# Check logs
docker-compose logs -f api
```

## ✅ Verify It's Working

### 1. Check containers are running
```cmd
docker-compose ps
```

You should see:
```
NAME                IMAGE               STATUS
venturelab-api      ...                 Up
venturelab-db       postgres:15-alpine  Up (healthy)
```

### 2. Test the API
```cmd
curl http://localhost:3000/health
```

Expected response:
```json
{"status":"ok","timestamp":"...","uptime":...}
```

### 3. View logs
```cmd
docker-compose logs -f api
```

You should see:
```
🚀 DreamCraft API Server Started
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Server is ready to accept requests
```

## 🐛 Common Issues & Fixes

### Issue 1: "failed to solve: /dist not found"

**Cause:** Old Dockerfile cached

**Fix:**
```cmd
# Clean Docker cache
docker-compose down
docker system prune -f

# Rebuild
docker-compose up --build -d
```

### Issue 2: "service api is not running"

**Cause:** Container failed to start

**Fix:**
```cmd
# Check what went wrong
docker-compose logs api

# Common causes:
# - Port 3000 already in use
# - Database not ready
# - Migration failed
```

**If port 3000 is in use:**
```cmd
# Find what's using port 3000
netstat -ano | findstr :3000

# Kill that process (replace PID)
taskkill /PID <PID> /F

# Or change port in docker-compose.yml:
# ports:
#   - "3001:3000"  # Use 3001 instead
```

### Issue 3: "Cannot connect to database"

**Fix:**
```cmd
# Make sure database is healthy
docker-compose ps

# Should show "Up (healthy)" for db
# If not, check db logs:
docker-compose logs db

# Restart services
docker-compose restart
```

### Issue 4: "Migration failed"

**Fix:**
```cmd
# Run migration manually
docker-compose exec api npm run migrate

# If that fails, check logs:
docker-compose logs api

# Reset database (WARNING: deletes all data)
docker-compose down -v
docker-compose up --build -d
```

### Issue 5: Docker Desktop not running

**Error:** 
```
error during connect: this error may indicate that the docker daemon is not running
```

**Fix:**
1. Open Docker Desktop
2. Wait for it to fully start (whale icon in system tray)
3. Try again

## 🧪 Testing After Setup

### Register a user
```cmd
curl -X POST http://localhost:3000/api/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"test@venturelab.io\",\"password\":\"password123\",\"firstName\":\"Test\",\"lastName\":\"User\",\"role\":\"creator\"}"
```

### Login
```cmd
curl -X POST http://localhost:3000/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"test@venturelab.io\",\"password\":\"password123\"}"
```

Save the `accessToken` from the response!

### Create an idea
```cmd
curl -X POST http://localhost:3000/api/ideas ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer YOUR_TOKEN_HERE" ^
  -d "{\"title\":\"AI Budget Tracker\",\"category\":\"fintech\",\"problem\":\"People overspend\",\"solution\":\"AI predicts spending\"}"
```

### List ideas
```cmd
curl http://localhost:3000/api/ideas
```

## 🔧 Useful Commands

### View all logs
```cmd
docker-compose logs -f
```

### View API logs only
```cmd
docker-compose logs -f api
```

### Restart services
```cmd
docker-compose restart
```

### Stop services
```cmd
docker-compose down
```

### Stop and remove all data
```cmd
docker-compose down -v
```

### Enter API container
```cmd
docker-compose exec api sh
```

### Enter database container
```cmd
docker-compose exec db psql -U postgres venturelab
```

### Rebuild everything
```cmd
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

## 📊 Service Health Check

Run this to check everything:

```cmd
@echo off
echo Checking DreamCraft services...
echo.

echo [1] Docker status:
docker --version
echo.

echo [2] Container status:
docker-compose ps
echo.

echo [3] API health:
curl http://localhost:3000/health
echo.

echo [4] Database connection:
docker-compose exec db pg_isready -U postgres
echo.

echo Done!
```

Save as `check-health.bat` and run it.

## 🆘 Still Having Issues?

### Get detailed error info:
```cmd
# View all container logs
docker-compose logs

# Check Docker system
docker info

# Check disk space
docker system df
```

### Reset everything (nuclear option):
```cmd
# Stop all containers
docker-compose down -v

# Remove all Docker data (WARNING: removes EVERYTHING)
docker system prune -a --volumes

# Rebuild from scratch
cd venturelab-backend
docker-compose up --build -d
```

## 📱 Alternative: Run Without Docker

If Docker continues to cause issues, you can run locally:

```cmd
# Install Node.js 18+ from nodejs.org
# Install PostgreSQL from postgresql.org

# Setup
npm install
copy .env.example .env
# Edit .env with your local database credentials

# Create database
createdb venturelab

# Run migration
npm run migrate

# Start server
npm run dev
```

## ✅ Success Checklist

After setup, verify:
- [ ] `docker-compose ps` shows both containers "Up"
- [ ] `curl http://localhost:3000/health` returns `{"status":"ok"}`
- [ ] Can register a user
- [ ] Can login and get token
- [ ] Can create an idea with token
- [ ] Can list ideas

If all checked, you're ready to go! 🚀

---

**Need more help?** Check the main README.md or the WEEK_1-2_COMPLETE.md file.
