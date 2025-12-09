# Deployment Quick Reference Card

Print this or keep it open while deploying.

---

## Environment Variables Quick Reference

### Render Backend (REQUIRED)

```
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/dreamcraft
JWT_SECRET=<32+ random characters>
NODE_ENV=production
CORS_ORIGINS=https://your-vercel-domain.vercel.app
```

### Vercel Web (REQUIRED)

```
VITE_API_BASE=https://your-render-backend.onrender.com/api
```

### Mobile App (UPDATE app.json)

```json
"extra": {
  "apiUrl": "https://your-render-backend.onrender.com/api"
}
```

---

## Deployment Order

```
1. MongoDB Atlas Setup
   ├─ Create cluster
   └─ Get connection string

2. Generate JWT_SECRET
   └─ 32+ random characters

3. Deploy Backend to Render
   ├─ Set MONGODB_URI
   ├─ Set JWT_SECRET
   └─ Get URL: https://venturelab-backend-xxxx.onrender.com

4. Deploy Web to Vercel
   ├─ Set VITE_API_BASE to Render URL
   └─ Get URL: https://dreamcraft-abc.vercel.app

5. Update Render CORS
   └─ Add Vercel domain to CORS_ORIGINS

6. Update Mobile app.json
   └─ Set extra.apiUrl to Render URL

7. Test All Platforms
   └─ Login, create idea, verify end-to-end
```

---

## Key URLs

| Service        | URL Pattern                                           | Status                |
| -------------- | ----------------------------------------------------- | --------------------- |
| Render Backend | `https://venturelab-backend-xxxx.onrender.com`        | ⏳ After Phase 3      |
| Vercel Web     | `https://dreamcraft-abc.vercel.app`                   | ⏳ After Phase 4      |
| Health Check   | `https://venturelab-backend-xxxx.onrender.com/health` | ⏳ Test after Phase 3 |
| API Base       | `https://venturelab-backend-xxxx.onrender.com/api`    | ⏳ Use in Phase 4 & 6 |

---

## Critical Settings

| Setting            | Value                     | Where  |
| ------------------ | ------------------------- | ------ |
| Backend Root       | `packages/backend`        | Render |
| Web Root           | `apps/web`                | Vercel |
| Build (Backend)    | `npm ci && npm run build` | Render |
| Build (Web)        | Auto (Vite)               | Vercel |
| Start (Backend)    | `npm start`               | Render |
| Env: MONGODB_URI   | MongoDB Atlas string      | Render |
| Env: JWT_SECRET    | 32+ random chars          | Render |
| Env: NODE_ENV      | `production`              | Render |
| Env: VITE_API_BASE | Backend URL + `/api`      | Vercel |
| Env: CORS_ORIGINS  | Vercel domain             | Render |

---

## Generate JWT_SECRET

### PowerShell (Windows):

```powershell
$bytes = [System.Text.Encoding]::UTF8.GetBytes([guid]::NewGuid().ToString())
[Convert]::ToBase64String($bytes)
```

### Bash (Mac/Linux):

```bash
openssl rand -base64 32
```

### Online:

Use: https://www.uuidgenerator.net/ (copy 2-3 times, concatenate)

---

## Verify Deployments

### Backend Health:

```bash
curl https://venturelab-backend-xxxx.onrender.com/health
```

Expected: `{"status":"ok","timestamp":"..."}` ✅

### Web Accessible:

Visit: `https://dreamcraft-abc.vercel.app`

Expected: Login page loads ✅

### Login Works:

1. Register test account
2. Login
3. See home feed ✅

### Mobile Connects:

```bash
cd apps/mobile
npx expo start --clear --tunnel
```

Expected: Scan QR → App loads → Can login ✅

---

## Common Issues

| Problem              | Check                                                              |
| -------------------- | ------------------------------------------------------------------ |
| Backend won't start  | Is MONGODB_URI set? Is JWT_SECRET set?                             |
| Web shows CORS error | Is VITE_API_BASE set in Vercel? Is CORS_ORIGINS updated in Render? |
| Login fails          | Is backend running? Is JWT_SECRET correct?                         |
| Mobile offline       | Is app.json apiUrl correct? Use Tunnel mode?                       |

---

## Documentation Links

- `RENDER_ENV_SETUP.md` - Backend deployment (30 min)
- `VERCEL_ENV_SETUP.md` - Web deployment (10 min)
- `MOBILE_SETUP_GUIDE.md` - Mobile setup (5 min)
- `DEPLOYMENT_CHECKLIST.md` - Full checklist
- `ENV_VARIABLES_AUDIT.md` - All variables reference

---

## Timeline

| Phase                    | Est. Time   | Status  |
| ------------------------ | ----------- | ------- |
| Setup (MongoDB, secrets) | 10 min      | ⏳ TODO |
| Deploy Backend           | 10 min      | ⏳ TODO |
| Deploy Web               | 5 min       | ⏳ TODO |
| Update CORS              | 2 min       | ⏳ TODO |
| Update Mobile            | 2 min       | ⏳ TODO |
| Full E2E Test            | 15 min      | ⏳ TODO |
| **TOTAL**                | **~45 min** | ⏳ TODO |

---

**Start Now:** Open `RENDER_ENV_SETUP.md` and follow Step 1 🚀
