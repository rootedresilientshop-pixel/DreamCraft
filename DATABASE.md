# Database Management Guide

This document explains how to manage the VentureLab database for testing and development.

## Prerequisites

- MongoDB must be running locally at `mongodb://localhost:27017/dreamcraft`
- Or set `MONGODB_URI` environment variable to your MongoDB connection string

## Clearing the Database

### Option 1: Using npm script (Recommended)

```bash
npm run db:clear
```

This will:
- Connect to MongoDB
- List all collections
- Drop all collections
- Show you the progress
- Disconnect cleanly

### Option 2: Direct Node.js script

```bash
node clear-db.js
```

### Option 3: Using the HTTP endpoint (if backend is running)

```bash
curl -X POST http://localhost:3002/api/users/clear-database \
  -H "x-clear-token: dev-clear-token" \
  -H "Content-Type: application/json"
```

The clear token defaults to `dev-clear-token` and can be overridden with the `CLEAR_DB_TOKEN` environment variable.

## Database Structure

VentureLab uses MongoDB with the following collections:

- **users** - User accounts (creators, collaborators, admins)
- **ideas** - Business ideas with descriptions, valuations, etc.
- **collaborations** - Collaboration invitations and partnerships
- **messages** - Direct messages and idea discussion threads
- **notifications** - User notifications
- **favorites** - User's bookmarked ideas
- **transactions** - Payment records (future feature)

## Fresh Start Workflow

1. **Clear all data:**
   ```bash
   npm run db:clear
   ```

2. **Start the backend:**
   ```bash
   npm run backend
   ```

3. **Start the web app:**
   ```bash
   npm run web
   ```

4. **Register a new test account** in the web app

## Sample Data

To create sample public ideas for testing the marketplace:

1. Clear the database: `npm run db:clear`
2. Start the backend: `npm run backend`
3. Register as a creator
4. Navigate to creator dashboard
5. Click "Create Sample Ideas" button (for testing)

Or use the API endpoint directly:
```bash
curl -X POST http://localhost:3002/api/ideas/dev/create-samples \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json"
```

## Notes

- **Development only**: The clear database endpoint is intended for development and testing only. It requires authentication via token.
- **No backup**: Clearing the database permanently deletes all data. Use only for testing.
- **Fresh start**: After clearing, you can start fresh testing from registration through all features.

## Troubleshooting

### "Cannot connect to MongoDB"
- Ensure MongoDB is running: `mongod`
- Check connection string matches your setup
- Verify MongoDB is listening on `localhost:27017`

### "Connection timeout"
- MongoDB might not be started
- Try: `mongo mongodb://localhost:27017/dreamcraft` to test connection

### "Permission denied" error
- Check MongoDB user permissions
- Ensure the dreamcraft database exists or MongoDB can create it

## Development Best Practices

1. **Always clear before major testing sessions** - Keeps data consistent
2. **Use the API endpoints during testing** - Tests real backend behavior
3. **Keep test accounts simple** - Use easy-to-remember credentials
4. **Document your test users** - Note down test account emails/passwords used

---

**Last updated:** After comprehensive VentureLab debugging and refactoring
