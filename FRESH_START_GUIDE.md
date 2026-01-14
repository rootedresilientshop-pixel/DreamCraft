# VentureLab Fresh Start Guide

## Quick Start for Clean Testing

### 1️⃣ Clear the Database

```bash
npm run db:clear
```

**Output:**
```
🔌 Connecting to MongoDB...
✅ Connected to MongoDB

📊 Found X collections to clear:

  ✓ Dropped: users
  ✓ Dropped: ideas
  ✓ Dropped: collaborations
  ✓ Dropped: messages
  ✓ Dropped: notifications
  ✓ Dropped: favorites
  ✓ Dropped: transactions

🎉 Successfully cleared 7 collections!

Database is now fresh and ready for new testing.
```

### 2️⃣ Start the Backend

```bash
npm run backend
```

Waits for:
```
MongoDB connected
Express server running on port 3002
```

### 3️⃣ Start the Web App (in another terminal)

```bash
npm run web
```

Waits for:
```
VITE v5.0.0
➜  Local:   http://localhost:3000
```

### 4️⃣ Test Fresh Workflow

1. **Register new user** → http://localhost:3000/login
2. **Select role** → Creator or Collaborator
3. **Complete profile** → Follow the wizard
4. **Explore features** → Create ideas, browse marketplace, etc.

---

## What Gets Cleared

When you run `npm run db:clear`, **all** test data is deleted:

- ✅ All test user accounts
- ✅ All test ideas
- ✅ All collaborations and invitations
- ✅ All messages
- ✅ All notifications
- ✅ All favorites
- ✅ All transactions

**Nothing is kept** - You get a completely fresh database.

---

## Alternative: Keep Some Test Data

If you want to keep the database but delete only **users**, you can:

1. Stop the backend
2. Use MongoDB Compass or mongo CLI:
   ```bash
   mongo mongodb://localhost:27017/dreamcraft
   > db.users.deleteMany({})
   ```
3. Restart the backend

This keeps ideas, messages, etc. but removes all user accounts.

---

## Troubleshooting

### MongoDB not running?
```bash
# On Windows (if installed)
net start MongoDB

# Or manually start mongod
mongod
```

### Need to see what's in the database?
Use MongoDB Compass (GUI) or mongo CLI:
```bash
mongo mongodb://localhost:27017/dreamcraft
> show collections
> db.users.find()
> db.ideas.find()
```

### Want to keep data but just clear users?
```bash
mongo mongodb://localhost:27017/dreamcraft
> db.users.deleteMany({})
```

---

## Testing Checklist

After clearing and fresh starting, test:

- [ ] Register as Creator
- [ ] Register as Collaborator
- [ ] Create an idea
- [ ] View marketplace
- [ ] Invite collaborator to idea
- [ ] Message functionality
- [ ] Send notification
- [ ] Toggle favorite idea
- [ ] View dashboard
- [ ] Update profile

---

**For detailed info, see:** [DATABASE.md](./DATABASE.md)
