# DreamCraft Environment Setup Guide

## Quick Start - Local Development

1. **Copy the example file:**
   ```powershell
   Copy-Item .env.example packages/backend/.env.local
   ```

2. **Update `packages/backend/.env.local` with your values:**
   ```
   PORT=3001
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/dreamcraft
   JWT_SECRET=dev-secret-key-for-local-testing
   STRIPE_SECRET_KEY=sk_test_YOUR_STRIPE_TEST_KEY
   OPENAI_API_KEY=sk-YOUR_OPENAI_API_KEY
   ```

3. **Start MongoDB locally** (if installed) or use Atlas:
   ```powershell
   # Using Docker
   docker run -d -p 27017:27017 --name mongodb mongo:7
   ```

4. **Start backend:**
   ```powershell
   cd packages/backend
   npm run dev
   ```

---

## Staging Environment Setup

### For Cloud Deployment (AWS/Azure/GCP):

1. **Create `.env.staging` file locally** (do NOT commit to git)
2. **Fill in staging values:**
   - Use MongoDB Atlas staging cluster
   - Use Stripe test keys (sk_test_xxx)
   - Generate random JWT_SECRET
3. **Upload to Cloud Secrets Manager:**
   - AWS: Create secret in AWS Secrets Manager
   - Azure: Create secret in Azure Key Vault
   - GCP: Create secret in Google Secret Manager

4. **Example for AWS Secrets Manager:**
   ```bash
   aws secretsmanager create-secret \
     --name dreamcraft/staging/env \
     --secret-string "$(cat .env.staging)"
   ```

---

## Production Environment Setup

### ⚠️ CRITICAL SECURITY STEPS:

1. **NEVER commit `.env.production` to git**
2. **Create `.env.production` locally** (with real values)
3. **Store secrets in enterprise vault:**
   - ✅ AWS Secrets Manager (Recommended)
   - ✅ Azure Key Vault
   - ✅ Google Secret Manager
   - ✅ HashiCorp Vault
   - ❌ DON'T store in git
   - ❌ DON'T hardcode in source code

4. **Required Production Values:**

   | Variable | How to Get | Security Level |
   |----------|-----------|-----------------|
   | `JWT_SECRET` | Generate random 32+ char string | 🔴 Critical |
   | `MONGODB_URI` | MongoDB Atlas production cluster | 🔴 Critical |
   | `STRIPE_SECRET_KEY` | Stripe dashboard → live keys | 🔴 Critical |
   | `OPENAI_API_KEY` | OpenAI account → API keys | 🔴 Critical |
   | `CORS_ORIGINS` | Your production domain | 🟡 Important |

5. **Generate JWT_SECRET:**
   ```bash
   # On Mac/Linux
   openssl rand -base64 32
   
   # On Windows PowerShell
   [Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes([System.Guid]::NewGuid().ToString())) -replace '=', ''
   ```

6. **Upload to AWS Secrets Manager:**
   ```bash
   aws secretsmanager create-secret \
     --name dreamcraft/prod/env \
     --secret-string file://.env.production \
     --region us-east-1
   ```

---

## Environment Variables Explained

### Core Configuration
- `PORT` - Server port (default: 3001)
- `NODE_ENV` - Mode: development, staging, or production

### Database
- `MONGODB_URI` - Full connection string to MongoDB
  - Local: `mongodb://localhost:27017/dreamcraft`
  - Atlas: `mongodb+srv://user:pass@cluster.mongodb.net/dreamcraft`

### Authentication
- `JWT_SECRET` - Secret key for signing JWT tokens
  - ⚠️ Must be 32+ characters
  - ⚠️ Different for each environment
  - ⚠️ Change periodically in production

### Payment Processing
- `STRIPE_SECRET_KEY` - Stripe API secret key
  - Test mode: `sk_test_xxx` (starts with sk_test)
  - Live mode: `sk_live_xxx` (starts with sk_live)

### AI Integration
- `OPENAI_API_KEY` - OpenAI API key for idea valuation
  - Get from https://platform.openai.com/account/api-keys

### Security
- `CORS_ORIGINS` - Comma-separated allowed origins
  - Development: `http://localhost:3000,http://localhost:5173`
  - Production: `https://dreamcraft.app` only

---

## Testing Your Setup

### Test Backend Connection:
```bash
curl http://localhost:3001/health
# Expected: {"status":"ok","timestamp":"2025-11-30T..."}
```

### Test Database Connection:
```bash
curl http://localhost:3001/health
# If DB connected: should see no errors
```

### Test API Endpoint:
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@local.dev","username":"testuser","password":"Password123"}'
```

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| `ECONNREFUSED 127.0.0.1:27017` | MongoDB not running. Start with `docker run -d -p 27017:27017 mongo:7` |
| `JWT_SECRET not set` | Add `JWT_SECRET=dev-key` to .env.local |
| `CORS error in browser` | Update `CORS_ORIGINS` in .env to include your frontend URL |
| `Cannot connect to MongoDB Atlas` | Check connection string format and whitelist your IP in Atlas |
| `Stripe key rejected` | Use test key (sk_test_) in development, live key (sk_live_) in production |

---

## Summary

✅ **Local Dev:** Copy `.env.example` → `.env.local` → Run `docker-compose up`  
✅ **Staging:** Use `.env.staging` → Upload to AWS Secrets Manager  
✅ **Production:** Use `.env.production` → NEVER commit to git → Use enterprise vault  

**Next Step:** Start Docker containers with `docker-compose up`
