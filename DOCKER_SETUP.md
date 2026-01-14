# Docker Setup for VentureLab Testing

**Status**: Quick Setup Guide
**Date**: January 14, 2026
**Purpose**: Get MongoDB running via Docker for Phase 3 testing

---

## Quick Start (3 minutes)

### Step 1: Start MongoDB Container

```bash
docker run -d \
  --name venturelab-mongo \
  -p 27017:27017 \
  -e MONGO_INITDB_DATABASE=dreamcraft \
  mongo:7.0
```

**Expected Output**: A container ID (long string of characters)

### Step 2: Verify Container Running

```bash
docker ps | grep venturelab-mongo
```

**Expected**: See the venturelab-mongo container listed and "Up" status

### Step 3: Seed Templates

```bash
npm run templates:seed
```

**Expected Output**:
```
🔌 Connecting to MongoDB...
✅ Connected to MongoDB
Cleared existing templates
✅ Created 4 templates
  - SaaS Product (Technology)
  - Mobile App (Technology)
  - Healthcare Innovation (Healthcare)
  - Marketplace Platform (Marketplace)
```

### Step 4: Clear Test Data

```bash
npm run db:clear
```

**Expected Output**:
```
🔌 Connecting to MongoDB...
✅ Connected to MongoDB
Clearing all collections...
✅ Database cleared successfully
```

### Step 5: Start Services (3 terminals)

**Terminal 1 - Backend**:
```bash
npm run backend
```
Expected: Server listening on port 3002

**Terminal 2 - Web App**:
```bash
npm run web
```
Expected: App running on http://localhost:3000

**Terminal 3 - Ready for testing**:
```bash
# Stay in main directory
# Ready to run tests manually or via script
```

---

## Verification Steps

### Verify MongoDB Connection

```bash
# Check MongoDB is accessible
docker exec venturelab-mongo mongosh --eval "db.adminCommand('ping')"
```

Expected: `{ ok: 1 }`

### Verify Templates Exist

```bash
# Check backend is running and templates load
curl http://localhost:3002/api/templates
```

Expected: JSON array with 4 templates (SaaS, Mobile, Healthcare, Marketplace)

### Verify Database Clean

```bash
# Check ideas collection is empty
curl http://localhost:3002/api/ideas
```

Expected: `{ "success": true, "data": [] }` (empty array)

---

## Cleanup (When Done)

### Stop Container (Keep Data)
```bash
docker stop venturelab-mongo
```

### Remove Container (Clean Slate Next Time)
```bash
docker rm venturelab-mongo
```

### Remove Data Volume
```bash
docker volume rm venturelab-mongo-data
```

---

## Troubleshooting

### Port Already in Use (27017)
```bash
# Kill whatever is using port 27017
lsof -i :27017
kill -9 <PID>

# Or use different port
docker run -d --name venturelab-mongo -p 27018:27017 mongo:7.0
# Then update .env: MONGODB_URI=mongodb://localhost:27018/dreamcraft
```

### Docker Daemon Not Running
```bash
# Make sure Docker Desktop is open and running
# On Windows: Click Docker Desktop in taskbar
# On Mac: Open /Applications/Docker.app
# On Linux: systemctl start docker
```

### Container Won't Start
```bash
# Check logs
docker logs venturelab-mongo

# Try removing and restarting
docker rm venturelab-mongo
docker run -d --name venturelab-mongo -p 27017:27017 mongo:7.0
```

### MongoDB Connection Timeout
```bash
# Wait a few seconds - MongoDB takes time to start
sleep 5
npm run templates:seed
```

---

## Environment Check

### Verify .env has Correct MongoDB URI

```bash
cat .env | grep MONGODB_URI
```

Expected:
```
MONGODB_URI=mongodb://localhost:27017/dreamcraft
```

If different, update it:
```bash
# Edit .env
MONGODB_URI=mongodb://localhost:27017/dreamcraft
```

---

## All Set! Ready to Test

Once all 5 steps above are complete:

1. ✅ MongoDB running via Docker
2. ✅ Templates seeded (4 default templates)
3. ✅ Database cleaned (no test data)
4. ✅ Backend running on port 3002
5. ✅ Web app running on port 3000

**Next**: Open PHASE_3_TESTING_GUIDE.md and execute test scenarios

---

## Quick Reference Commands

```bash
# Start MongoDB
docker run -d --name venturelab-mongo -p 27017:27017 mongo:7.0

# Seed templates
npm run templates:seed

# Clear test data
npm run db:clear

# Start backend
npm run backend

# Start web app
npm run web

# Check logs
docker logs venturelab-mongo

# Stop MongoDB
docker stop venturelab-mongo

# Remove MongoDB
docker rm venturelab-mongo
```

---

**Docker Setup Status**: Ready
**Next Step**: Execute PHASE_3_TESTING_GUIDE.md
