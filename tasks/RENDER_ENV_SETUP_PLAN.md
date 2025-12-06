# Plan: Set Render Environment Variables

## Current Goal
Configure all required environment variables in Render dashboard for dreamcraft-backend service to be deployable and functional.

## Step-by-Step Plan

### 1. Gather Information
- [ ] Confirm MongoDB Atlas production cluster connection string
- [ ] Confirm actual Vercel domain for CORS_ORIGINS
- [ ] Confirm whether Stripe/OpenAI/Sentry are enabled/needed
- [ ] Clarify what values are available vs what needs to be generated

### 2. Generate Required Secrets
- [ ] Generate JWT_SECRET (32-char random string)
- [ ] Document all variable names and formats

### 3. Prepare Render Configuration
- [ ] Create list of all variables with descriptions
- [ ] Note which are CRITICAL (will break server if missing)
- [ ] Note which are OPTIONAL (nice-to-have)

### 4. Execute Render Setup (via Render API or dashboard instructions)
- [ ] Validate all variables are set
- [ ] Trigger deployment on Render
- [ ] Monitor build logs

### 5. Verify Deployment
- [ ] Test /health endpoint
- [ ] Test /api/auth/login endpoint (if MongoDB accessible)
- [ ] Check Render logs for errors

## Required Information from User

**CRITICAL** - Need these actual production values:

1. **MONGODB_URI**
   - Current: `mongodb+srv://prod_user:CHANGE_ME@cluster.mongodb.net/dreamcraft`
   - Question: Do you have a MongoDB Atlas production cluster already set up?
   - What is the actual connection string?

2. **CORS_ORIGINS**
   - Current: `https://dreamcraft.app,https://app.dreamcraft.app,https://api.dreamcraft.app`
   - Question: What is your actual Vercel domain?
   - Is it something like: `https://myapp.vercel.app`?

3. **STRIPE_SECRET_KEY** (Optional)
   - Question: Is payments/Stripe enabled?
   - Do you have a Stripe account and live secret key?

4. **OPENAI_API_KEY** (Optional)
   - Question: Are AI features enabled?
   - Do you have an OpenAI API key?

5. **SENTRY_DSN** (Optional but recommended)
   - Question: Do you want error monitoring on production?
   - Do you have a Sentry account/project?

## Assumptions

1. MongoDB Atlas production cluster is already created (or using MongoDB Atlas free tier)
2. Vercel frontend is already deployed to a live URL
3. User has access to Render dashboard
4. User has credentials/access to all required services (MongoDB, Stripe, OpenAI, Sentry)

## Approach

- If actual values are available → use them directly
- If values need to be generated (JWT_SECRET) → generate securely and provide
- If values are not available → provide instructions for obtaining them
- Once all variables confirmed → can set via Render dashboard or API

## Safety Notes

- Never commit actual production secrets to git
- Store secrets only in Render dashboard (marked as "sync: false")
- JWT_SECRET should be long random string, not predictable
- CORS_ORIGINS should be restricted to actual production domains only
