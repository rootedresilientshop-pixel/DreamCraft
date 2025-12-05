# DreamCraft Deployment Checklist

## Phase 1: Local Development Setup ✓

### Environment
- [x] Node.js 24+ installed
- [x] npm packages installed (2,211+ packages)
- [x] Docker Desktop installed
- [x] MongoDB running (local or Atlas connection)

### Code Quality
- [x] Backend TypeScript compiles without errors
- [x] Web app Vite build successful (203 KB JS → 68 KB gzipped)
- [x] Mobile app TypeScript strict mode passes (0 errors)
- [x] All routes implemented and compiled

### Security Middleware
- [x] CORS configured with origin whitelist
- [x] Rate limiting: 100 requests per 15 minutes
- [x] Input validation: sanitization + required field checks
- [x] Request logging with response times
- [x] JWT authentication on protected routes
- [x] Password hashing with bcryptjs

### Infrastructure
- [x] Dockerfile created (node:20-alpine with health check)
- [x] docker-compose.yml created (MongoDB + backend services)
- [x] .env templates created (.env.staging, .env.production)
- [x] .env.example created for reference

---

## Phase 2: Pre-Deployment Tasks ⚠️ (User Action Required)

### API Keys & Services
- [ ] **MongoDB Atlas Account Created**
  - Go to: https://www.mongodb.com/cloud/atlas
  - Create free M0 cluster
  - Save connection string (format: mongodb+srv://user:pass@cluster.mongodb.net/venturelab)

- [ ] **OpenAI API Key Obtained** (Optional but recommended)
  - Go to: https://platform.openai.com/account/api-keys
  - Create API key
  - Keep key secure

- [ ] **Stripe Account Created** (Optional but recommended)
  - Go to: https://stripe.com
  - Get API keys (use sk_test_xxx for testing)
  - Keep secret key secure

### Local Testing
- [ ] Docker Desktop installed and running
- [ ] Backend builds successfully: `cd packages/backend && npm run build`
- [ ] `.env.local` created with test values
- [ ] `docker-compose up` starts without errors
- [ ] GET http://localhost:3001/health returns 200 OK
- [ ] Backend rate limiting works (100 requests per 15 min)
- [ ] Request logging shows in console

### Environment Configuration
- [ ] `.env.local` created in `packages/backend/` with:
  - [x] MONGODB_URI (local or Atlas)
  - [x] JWT_SECRET (generated, 32+ chars)
  - [x] STRIPE_SECRET_KEY (sk_test_xxx)
  - [x] OPENAI_API_KEY

---

## Phase 3: Docker Build & Test 🐳

### Build Local Image
- [ ] Run: `docker build -t venturelab-backend:latest packages/backend/`
- [ ] Verify: `docker images | grep venturelab`
- [ ] Test image: `docker run -p 3001:3001 venturelab-backend:latest`
- [ ] Health check: `curl http://localhost:3001/health`

### Docker Registry Setup
- [ ] Choose registry: Docker Hub OR AWS ECR
- [ ] **Docker Hub Option:**
  - Create account: https://hub.docker.com
  - Tag image: `docker tag venturelab-backend:latest USERNAME/venturelab-backend:latest`
  - Push: `docker push USERNAME/venturelab-backend:latest`

- [ ] **AWS ECR Option:**
  - Create AWS account: https://aws.amazon.com
  - Create ECR repository: `aws ecr create-repository --repository-name venturelab-backend`
  - Get login: `aws ecr get-login-password | docker login --username AWS --password-stdin xxx.dkr.ecr.region.amazonaws.com`
  - Push: `docker push xxx.dkr.ecr.region.amazonaws.com/venturelab-backend:latest`

---

## Phase 4: Backend Deployment ☁️

### Option A: AWS ECS (Recommended for Production)
- [ ] Create AWS account: https://aws.amazon.com
- [ ] Create ECS cluster
- [ ] Create task definition (memory: 512 MB, CPU: 256, port 3001)
- [ ] Create service (replicas: 1)
- [ ] Note load balancer URL: `https://venturelab-api-xxx.us-east-1.elb.amazonaws.com`
- [ ] Set environment variables in task definition (pull from Secrets Manager)
- [ ] Test: `curl https://venturelab-api-xxx.us-east-1.elb.amazonaws.com/health`

### Option B: Heroku (Easiest, Free for Small Apps)
- [ ] Install Heroku CLI: https://devcenter.heroku.com/articles/heroku-cli
- [ ] Login: `heroku login`
- [ ] Create app: `heroku create venturelab-api`
- [ ] Set env vars: `heroku config:set MONGODB_URI=xxx --app venturelab-api`
- [ ] Deploy: `git push heroku main`
- [ ] Test: `curl https://venturelab-api.herokuapp.com/health`

### Option C: Google Cloud Run (Serverless)
- [ ] Create GCP account: https://cloud.google.com
- [ ] Push image to Google Container Registry
- [ ] Deploy: `gcloud run deploy venturelab-backend --image gcr.io/PROJECT/venturelab-backend:latest`
- [ ] Note service URL from deployment output
- [ ] Test: `curl SERVICE_URL/health`

### API Endpoint Configuration
- [ ] Backend deployed and accessible
- [ ] Health check passes: GET `/health`
- [ ] Auth endpoint works: POST `/api/auth/register`
- [ ] CORS configured correctly for frontend domains

---

## Phase 5: Web App Deployment 🌐

### Build Web App
- [ ] Run: `cd apps/web && npm run build`
- [ ] Verify: `dist/` folder exists with index.html
- [ ] Size check: Should be ~203 KB JS (68 KB gzipped)

### Option A: Vercel (Recommended, Fastest)
- [ ] Create Vercel account: https://vercel.com
- [ ] Connect GitHub repo (or upload folder)
- [ ] Set environment variable: `VITE_API_BASE=https://your-backend-url/api`
- [ ] Deploy → Live URL provided automatically
- [ ] Test: Visit app, try login endpoint
- [ ] Note: `https://venturelab-xxx.vercel.app`

### Option B: Netlify
- [ ] Create Netlify account: https://netlify.com
- [ ] Drag & drop `apps/web/dist/` folder
- [ ] Set build command: (leave empty, using pre-built)
- [ ] Set environment variable: `VITE_API_BASE=https://your-backend-url/api`
- [ ] Set redirect rule: `/* /index.html 200` (for SPA)
- [ ] Deploy → Live URL provided
- [ ] Note: `https://venturelab-xxx.netlify.app`

### Option C: AWS S3 + CloudFront
- [ ] Create S3 bucket: `venturelab-app`
- [ ] Upload contents of `apps/web/dist/`
- [ ] Set bucket policy to allow public read
- [ ] Create CloudFront distribution (OAI restricted)
- [ ] Point custom domain to CloudFront
- [ ] Set SPA routing in CloudFront error responses

### Web App Configuration
- [ ] Frontend deployed and accessible
- [ ] Can access login page
- [ ] Backend API calls work (no CORS errors)
- [ ] Authentication flow works end-to-end

---

## Phase 6: Mobile App Deployment 📱

### Prerequisites
- [ ] Apple Developer account ($99/year) for iOS
- [ ] Google Play Developer account ($25 one-time) for Android
- [ ] Mac with Xcode for iOS builds (or use EAS)

### iOS (Apple App Store)
- [ ] Create Apple Developer account: https://developer.apple.com
- [ ] Create App ID and provisioning profile
- [ ] Install Xcode: `xcode-select --install`
- [ ] Build: `cd apps/mobile && eas build --platform ios`
- [ ] Submit via App Store Connect
- [ ] App Review (typically 24-48 hours)

### Android (Google Play Store)
- [ ] Create Google Play account: https://play.google.com/console
- [ ] Build signed APK: `cd apps/mobile && eas build --platform android --release`
- [ ] Upload to Google Play Console
- [ ] Internal testing first, then rollout to production

### Mobile Configuration
- [ ] Update API endpoints in `apps/mobile/src/api.ts`
- [ ] Point to production backend URL
- [ ] Test login and idea search flows

---

## Phase 7: Monitoring & Operations 📊

### Error Tracking
- [ ] Setup Sentry (optional but recommended)
  - Create account: https://sentry.io
  - Initialize in backend: `npm install @sentry/node`
  - Add to server.ts error handling

- [ ] Enable CloudWatch (if using AWS)
  - Check logs in CloudWatch console
  - Setup alarms for error rates

### Performance Monitoring
- [ ] Monitor backend response times
- [ ] Track rate limiting hits
- [ ] Monitor database query times
- [ ] Setup alerts for high latency (>1000ms)

### Database Backups
- [ ] Enable MongoDB Atlas automated backups
- [ ] Test restore process monthly
- [ ] Verify backup contains production data

### Security Scanning
- [ ] Run `npm audit` regularly
- [ ] Update dependencies monthly
- [ ] Rotate API keys quarterly
- [ ] Scan Docker images for vulnerabilities: `trivy image venturelab-backend:latest`

---

## Phase 8: CI/CD Setup (Optional but Recommended) 🔄

### GitHub Actions Workflow
- [ ] Create `.github/workflows/deploy.yml`
- [ ] On push to main: Run tests, build Docker image, push to registry
- [ ] On success: Trigger deployment to staging
- [ ] Manual approval for production deployment

### Auto-Deploy Pipeline
```yaml
# Triggers on every push
- Run tests
- Build Docker image
- Push to registry (Docker Hub or ECR)
- Deploy to staging ECS/Heroku
- Run smoke tests
- Notify on Slack
```

---

## Phase 9: Documentation & Knowledge Transfer 📚

### API Documentation
- [ ] Generate OpenAPI/Swagger docs: https://swagger.io
- [ ] Document all endpoints with examples
- [ ] Include auth token requirements
- [ ] Add code samples for common tasks

### Deployment Runbook
- [ ] Document how to rollback failed deployment
- [ ] Incident response procedures
- [ ] How to scale horizontally (add more backend instances)
- [ ] How to update database migrations

### Operational Procedures
- [ ] Secrets rotation process
- [ ] Database maintenance schedule
- [ ] Log retention and archiving policy
- [ ] Disaster recovery procedure

---

## Deployment Status Summary

| Component | Status | Live URL |
|-----------|--------|----------|
| Backend API | ⚠️ Ready to deploy | TBD |
| Web App | ⚠️ Ready to deploy | TBD |
| Mobile App (iOS) | ⚠️ Ready to submit | TBD |
| Mobile App (Android) | ⚠️ Ready to submit | TBD |
| Database (MongoDB) | ⚠️ Needs Atlas account | TBD |
| Monitoring | ⚠️ Optional (Sentry) | TBD |
| CI/CD | ⚠️ Optional (GitHub Actions) | TBD |

---

## Next Steps

1. **Immediate (Today):** ✅ Install Docker, get API keys, create `.env.local`
2. **Short-term (This week):** ☁️ Deploy backend to cloud (ECS/Heroku/Cloud Run)
3. **Short-term (This week):** 🌐 Deploy web app (Vercel/Netlify)
4. **Medium-term (Next week):** 📱 Submit mobile apps to app stores
5. **Ongoing:** 📊 Monitor, update, scale as needed

---

## Support & Troubleshooting

### Common Issues:

**Docker build fails:** Make sure `npm run build` completes successfully first
```bash
cd packages/backend && npm run build
```

**CORS errors in frontend:** Update `CORS_ORIGINS` to include your frontend URL
```bash
CORS_ORIGINS=https://venturelab-xxx.vercel.app,https://venturelab-xxx.netlify.app
```

**MongoDB connection timeout:** Whitelist your server IP in MongoDB Atlas
```bash
Go to MongoDB Atlas → Network Access → Add IP Address → Your server IP
```

**Rate limiting too aggressive:** Adjust in `packages/backend/src/middleware/rateLimiter.ts`
```typescript
const MAX_REQUESTS = 100; // Increase this for testing
const TIME_WINDOW = 15 * 60 * 1000; // 15 minutes
```

---

**Last Updated:** 2025-11-30  
**Version:** 1.0 - MVP Ready for Deployment  
**Maintained by:** DreamCraft DevOps
