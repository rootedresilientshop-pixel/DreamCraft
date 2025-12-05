# DreamCraft Backend API

Week 1-2 Deliverable: Authentication + Core API + Database Setup

## 🎯 What's Included

### ✅ Completed Features

**Authentication:**
- ✅ User registration (creator/builder roles)
- ✅ Login with JWT tokens
- ✅ Token refresh
- ✅ Password reset flow
- ✅ Email verification (structure ready)
- ✅ Profile management

**Ideas API:**
- ✅ Create, read, update, delete ideas
- ✅ List ideas with filters (category, score, status)
- ✅ Search ideas
- ✅ Leaderboard (top-scored ideas)
- ✅ User's own ideas
- ✅ Publish/mark as sold

**Database:**
- ✅ Complete PostgreSQL schema
- ✅ 7 core tables (users, ideas, collaboration_requests, etc.)
- ✅ Indexes for performance
- ✅ Automatic timestamps
- ✅ Migration script

**Security:**
- ✅ JWT authentication
- ✅ Password hashing (bcrypt)
- ✅ Rate limiting
- ✅ CORS protection
- ✅ Helmet security headers
- ✅ Input validation

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- PostgreSQL 12+ installed and running
- Git (optional)

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment

```bash
# Copy example environment file
cp .env.example .env

# Edit .env with your database credentials
nano .env  # or use your editor
```

### 3. Create Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE venturelab;

# Exit
\q
```

### 4. Run Migrations

```bash
npm run migrate
```

You should see:
```
✅ Database schema created successfully!
📊 Tables created:
  - users
  - ideas
  - collaboration_requests
  - leaderboard_rankings
  - battles
  - battle_votes
  - roasts
```

### 5. Start Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

You should see:
```
🚀 DreamCraft API Server Started
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 Port: 3000
🌍 Environment: development
📊 Database: venturelab
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Server is ready to accept requests
```

### 6. Test the API

```bash
# Health check
curl http://localhost:3000/health

# Should return: {"status":"ok", ...}
```

## 📡 API Endpoints

### Authentication (`/api/auth`)

```
POST   /api/auth/register          - Register new user
POST   /api/auth/login             - Login
POST   /api/auth/refresh           - Refresh access token
POST   /api/auth/forgot-password   - Request password reset
POST   /api/auth/reset-password/:token - Reset password
GET    /api/auth/verify-email/:token - Verify email
GET    /api/auth/me                - Get current user (protected)
PUT    /api/auth/me                - Update profile (protected)
POST   /api/auth/logout            - Logout (protected)
```

### Ideas (`/api/ideas`)

```
GET    /api/ideas                  - List ideas (with filters)
GET    /api/ideas/leaderboard      - Get top ideas
GET    /api/ideas/search?q=term    - Search ideas
GET    /api/ideas/:id              - Get idea by ID
POST   /api/ideas                  - Create idea (protected)
PUT    /api/ideas/:id              - Update idea (protected)
DELETE /api/ideas/:id              - Delete idea (protected)
GET    /api/ideas/user/my-ideas    - Get user's ideas (protected)
POST   /api/ideas/:id/publish      - Publish idea (protected)
POST   /api/ideas/:id/mark-sold    - Mark as sold (protected)
```

## 🧪 Testing the API

### Register a User

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "creator@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe",
    "role": "creator"
  }'
```

Response:
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "...",
    "email": "creator@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "creator",
    "subscriptionTier": "free"
  },
  "accessToken": "eyJhbGci...",
  "refreshToken": "eyJhbGci..."
}
```

### Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "creator@example.com",
    "password": "password123"
  }'
```

### Create an Idea

```bash
# Replace YOUR_TOKEN with the accessToken from login
curl -X POST http://localhost:3000/api/ideas \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "AI-Powered Budget Tracker",
    "category": "fintech",
    "problem": "People struggle to track spending across multiple accounts and don't see where money goes until it's too late.",
    "solution": "AI analyzes all transactions, categorizes automatically, predicts future spending, and alerts users before they overspend.",
    "targetAudience": "Millennials and Gen Z earning $40K-$80K/year",
    "monetization": "$9.99/month subscription with premium tier at $19.99",
    "pricingModel": "Subscription (SaaS)"
  }'
```

### List Ideas

```bash
# Get all active ideas
curl http://localhost:3000/api/ideas?status=active

# Filter by category
curl http://localhost:3000/api/ideas?category=fintech

# Get leaderboard
curl http://localhost:3000/api/ideas/leaderboard?limit=10

# Search
curl http://localhost:3000/api/ideas/search?q=AI
```

### Get User's Ideas

```bash
curl http://localhost:3000/api/ideas/user/my-ideas \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 📁 Project Structure

```
venturelab-backend/
├── src/
│   ├── config/
│   │   └── database.js          # Database connection
│   ├── controllers/
│   │   ├── authController.js    # Auth logic
│   │   └── ideasController.js   # Ideas logic
│   ├── database/
│   │   └── migrate.js           # Database migrations
│   ├── middleware/
│   │   ├── auth.js              # JWT authentication
│   │   └── validator.js         # Input validation
│   ├── models/
│   │   ├── User.js              # User model
│   │   └── Idea.js              # Idea model
│   ├── routes/
│   │   ├── auth.js              # Auth routes
│   │   └── ideas.js             # Ideas routes
│   └── server.js                # Main server file
├── .env.example                  # Environment template
├── package.json                  # Dependencies
└── README.md                     # This file
```

## 🔧 Environment Variables

```env
# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/venturelab
DB_HOST=localhost
DB_PORT=5432
DB_NAME=venturelab
DB_USER=postgres
DB_PASSWORD=password

# Server
NODE_ENV=development
PORT=3000
API_URL=http://localhost:3000

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d

# Email (for future)
EMAIL_FROM=noreply@venturelab.io
SENDGRID_API_KEY=your-key

# CORS
CORS_ORIGIN=http://localhost:8080

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 🗄️ Database Schema

### Users Table
- id (UUID, PK)
- email (unique)
- password_hash
- first_name, last_name
- role (creator/builder/admin)
- subscription_tier (free/explorer/builder/enterprise)
- email_verified
- profile fields (bio, location, website, etc.)
- timestamps

### Ideas Table
- id (UUID, PK)
- user_id (FK → users)
- title, category, status
- problem, solution, target_audience
- monetization, pricing_model
- validation scores (overall, market_demand, originality, feasibility, monetization)
- price, is_for_sale, is_seeking_collaborators
- views_count, interest_count
- timestamps

### Other Tables
- collaboration_requests
- leaderboard_rankings
- battles
- battle_votes
- roasts

## 🔐 Authentication Flow

1. **Register:** POST /api/auth/register → Returns tokens
2. **Login:** POST /api/auth/login → Returns tokens
3. **Use API:** Include `Authorization: Bearer {accessToken}` header
4. **Token Expires:** Use refresh token to get new access token
5. **Refresh:** POST /api/auth/refresh with refreshToken

## 🚨 Common Issues

### Database Connection Error

```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Fix:** Make sure PostgreSQL is running:
```bash
# macOS
brew services start postgresql

# Linux
sudo service postgresql start

# Windows
# Start PostgreSQL from Services
```

### Port Already in Use

```
Error: listen EADDRINUSE: address already in use :::3000
```

**Fix:** Change port in .env or kill process:
```bash
# Find process
lsof -i :3000

# Kill it
kill -9 PID
```

### Migration Fails

```
Error: relation "users" already exists
```

**Fix:** Drop and recreate database:
```bash
psql -U postgres
DROP DATABASE venturelab;
CREATE DATABASE venturelab;
\q
npm run migrate
```

## 📊 API Response Formats

### Success Response
```json
{
  "message": "Success message",
  "data": { ... }
}
```

### Error Response
```json
{
  "error": "Error message",
  "details": [ ... ]
}
```

### Paginated Response
```json
{
  "ideas": [ ... ],
  "total": 100,
  "limit": 20,
  "offset": 0
}
```

## 🎯 Next Steps (Week 3-4)

After this foundation, we'll add:

- ✅ AI validation scoring (OpenAI integration)
- ✅ Roast generation
- ✅ Content moderation
- ✅ Email notifications (SendGrid)
- ✅ Collaboration request handling
- ✅ Battle voting system

## 💡 Tips

**Testing with Postman:**
1. Import endpoints
2. Set environment variable for token
3. Use `{{token}}` in headers

**Testing with curl:**
```bash
# Save token to variable
TOKEN=$(curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}' \
  | jq -r '.accessToken')

# Use token
curl http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

## 📞 Support

If you encounter issues:
1. Check the logs in the terminal
2. Verify environment variables
3. Ensure PostgreSQL is running
4. Check database exists and migrations ran

## ✅ Verification Checklist

- [ ] PostgreSQL installed and running
- [ ] Database created (`venturelab`)
- [ ] Dependencies installed (`npm install`)
- [ ] Environment file configured (`.env`)
- [ ] Migrations run successfully (`npm run migrate`)
- [ ] Server starts without errors (`npm run dev`)
- [ ] Health endpoint works (`curl http://localhost:3000/health`)
- [ ] Can register a user
- [ ] Can login
- [ ] Can create an idea
- [ ] Can list ideas

---

**🎉 You now have a fully functional backend API!**

This is production-ready code with:
- ✅ Proper error handling
- ✅ Security best practices
- ✅ Input validation
- ✅ Rate limiting
- ✅ JWT authentication
- ✅ Database migrations
- ✅ Clean code structure

**Ready for Week 3-4: AI Integration!** 🚀
