# 🚀 Railway Deployment - Quick Reference

## 📝 Pre-Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Railway account created
- [ ] Gmail app password ready (for email notifications)

---

## ⚡ Quick Deploy Steps

### 1️⃣ Backend + Database (5 minutes)

1. **Railway**: New Project → Deploy from GitHub
2. **Add PostgreSQL**: New → Database → PostgreSQL
3. **Set Variables**:
   ```
   PORT=8080
   JWT_SECRET=<generate-64-char-random-string>
   SPRING_MAIL_USERNAME=mediremind.health@gmail.com
   SPRING_MAIL_PASSWORD=<your-gmail-app-password>
   ```
4. **Add DB References**:
   - `DB_URL` → `DATABASE_URL`
   - `DB_USERNAME` → `PGUSER`
   - `DB_PASSWORD` → `PGPASSWORD`
5. **Generate Domain** → Copy backend URL

### 2️⃣ Frontend (3 minutes)

1. **Same Project**: New → GitHub Repo (same repo)
2. **Settings**:
   - Root Directory: `frontend`
   - Build: `npm run build`
   - Start: `npm run preview`
3. **Set Variable**:
   ```
   VITE_API_BASE_URL=<your-backend-url>
   ```
4. **Generate Domain** → Copy frontend URL

### 3️⃣ Update CORS (1 minute)

1. **Backend Variables**: Add `FRONTEND_URL=<your-frontend-url>`
2. **Auto-redeploys**

---

## 🔗 Important URLs

After deployment, save these:

- **Frontend**: `https://your-app-production-xxxx.up.railway.app`
- **Backend**: `https://your-backend-production-xxxx.up.railway.app`
- **Health Check**: `https://your-backend-production-xxxx.up.railway.app/actuator/health`

---

## ✅ Quick Verification

1. **Backend Health**: Visit `<backend-url>/actuator/health` → Should show `{"status":"UP"}`
2. **Frontend**: Visit frontend URL → Should see login page
3. **Register**: Create test account
4. **Login**: Test authentication
5. **Add Medicine**: Test core functionality

---

## 🐛 Common Issues & Fixes

| Issue | Fix |
|-------|-----|
| CORS Error | Check `FRONTEND_URL` in backend variables |
| Can't connect to DB | Verify DB reference variables are set |
| Frontend can't reach backend | Check `VITE_API_BASE_URL` is correct |
| Build fails | Check Railway build logs for errors |

---

## 💰 Free Tier Info

- **$5/month free credit**
- Monitor usage in Railway dashboard
- Services may sleep after inactivity

---

## 📚 Full Guide

For detailed instructions, see: [RAILWAY_DEPLOYMENT_GUIDE.md](./RAILWAY_DEPLOYMENT_GUIDE.md)

---

## 🆘 Need Help?

1. Check [RAILWAY_DEPLOYMENT_GUIDE.md](./RAILWAY_DEPLOYMENT_GUIDE.md) troubleshooting section
2. Review Railway build logs
3. Check browser console for errors
4. Visit [Railway Discord](https://discord.gg/railway)
