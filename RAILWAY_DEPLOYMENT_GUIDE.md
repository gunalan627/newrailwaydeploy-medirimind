# Railway Deployment Guide - Medicine Reminder System

## 🚀 Quick Start

This guide will help you deploy the Medicine Reminder System to Railway's free tier.

---

## 📋 Prerequisites

- GitHub account
- Railway account (sign up at https://railway.app)
- Your code pushed to a GitHub repository
- Gmail account for email notifications (optional)

---

## 🔧 Deployment Steps

### Step 1: Prepare Your Repository

1. **Push your code to GitHub** (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```

2. **Ensure your repository structure**:
   ```
   your-repo/
   ├── src/                    # Backend source
   ├── pom.xml                 # Maven config
   ├── Dockerfile              # Backend Docker config
   └── frontend/               # Frontend source
       ├── src/
       ├── package.json
       └── vite.config.js
   ```

---

### Step 2: Deploy Backend to Railway

#### 2.1 Create New Project

1. Go to https://railway.app
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Authorize Railway to access your GitHub
5. Select your repository
6. Railway will create a new project

#### 2.2 Add PostgreSQL Database

1. In your Railway project dashboard, click **"New"**
2. Select **"Database"** → **"Add PostgreSQL"**
3. Railway will automatically provision a PostgreSQL database
4. The database credentials are auto-generated

#### 2.3 Configure Backend Service

1. Click on your backend service (the one Railway created from your repo)
2. Go to **"Variables"** tab
3. Click **"New Variable"** and add the following:

   | Variable Name | Value | Notes |
   |--------------|-------|-------|
   | `PORT` | `8080` | Server port |
   | `JWT_SECRET` | Generate a secure random string | Use: https://www.random.org/strings/ (64 chars) |
   | `SPRING_MAIL_USERNAME` | `mediremind.health@gmail.com` | Or your email |
   | `SPRING_MAIL_PASSWORD` | Your Gmail app password | See below for setup |
   | `FRONTEND_URL` | Leave empty for now | Will add after frontend deployment |

4. **Database variables** (auto-populated from PostgreSQL plugin):
   - Click **"New Variable"** → **"Add Reference"**
   - Select your PostgreSQL database
   - Add these references:
     - `DB_URL` → `DATABASE_URL`
     - `DB_USERNAME` → `PGUSER`
     - `DB_PASSWORD` → `PGPASSWORD`

#### 2.4 Configure Build Settings

1. Go to **"Settings"** tab
2. Under **"Build"**, ensure:
   - **Root Directory**: `/` (or leave empty)
   - **Build Command**: Auto-detected (Maven)
   - **Start Command**: Auto-detected (from Dockerfile)

3. Click **"Deploy"**

#### 2.5 Get Backend URL

1. Once deployed, go to **"Settings"** → **"Networking"**
2. Click **"Generate Domain"**
3. Copy the URL (e.g., `https://medicine-backend-production-xxxx.up.railway.app`)
4. **Save this URL** - you'll need it for frontend configuration

---

### Step 3: Deploy Frontend to Railway

#### 3.1 Create Frontend Service

**Option A: Monorepo (Recommended)**
1. In the same Railway project, click **"New"** → **"GitHub Repo"**
2. Select the same repository
3. Railway will create a new service

**Option B: Separate Repository**
1. Create a new Railway project
2. Deploy from your frontend repository

#### 3.2 Configure Frontend Build

1. Click on the frontend service
2. Go to **"Settings"** tab
3. Configure:
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Start Command**: `npm run preview` (or leave auto-detected)
   - **Install Command**: `npm install`

#### 3.3 Set Frontend Environment Variables

1. Go to **"Variables"** tab
2. Add:
   - **Variable**: `VITE_API_BASE_URL`
   - **Value**: Your backend URL from Step 2.5 (e.g., `https://medicine-backend-production-xxxx.up.railway.app`)

3. Click **"Deploy"**

#### 3.4 Get Frontend URL

1. Once deployed, go to **"Settings"** → **"Networking"**
2. Click **"Generate Domain"**
3. Copy the URL (e.g., `https://medicine-frontend-production-xxxx.up.railway.app`)

---

### Step 4: Update CORS Configuration

1. Go back to your **backend service**
2. Go to **"Variables"** tab
3. Add/Update:
   - **Variable**: `FRONTEND_URL`
   - **Value**: Your frontend URL from Step 3.4

4. **Redeploy** the backend service (it will auto-redeploy when you save the variable)

---

### Step 5: Update Backend SecurityConfig (Optional but Recommended)

To make CORS more flexible, update your backend code:

1. Open `src/main/java/com/medicine/reminder/config/SecurityConfig.java`
2. Modify the `corsConfigurationSource()` method to read from environment variable:

```java
@Bean
public org.springframework.web.cors.CorsConfigurationSource corsConfigurationSource() {
    org.springframework.web.cors.CorsConfiguration configuration =
            new org.springframework.web.cors.CorsConfiguration();

    // Get frontend URL from environment variable
    String frontendUrl = System.getenv("FRONTEND_URL");
    
    List<String> allowedOrigins = new ArrayList<>();
    if (frontendUrl != null && !frontendUrl.isEmpty()) {
        allowedOrigins.add(frontendUrl);
    }
    // Fallback URLs
    allowedOrigins.add("https://ui-mediremind-production.up.railway.app");
    allowedOrigins.add("http://localhost:5173");
    allowedOrigins.add("http://localhost:3000");
    
    configuration.setAllowedOrigins(allowedOrigins);
    
    // ... rest of the configuration
}
```

3. Commit and push to trigger redeployment

---

## 📧 Gmail App Password Setup (For Email Notifications)

1. Go to your Google Account settings
2. Enable **2-Step Verification**
3. Go to **Security** → **App passwords**
4. Generate a new app password for "Mail"
5. Copy the 16-character password
6. Use this as `SPRING_MAIL_PASSWORD` in Railway

---

## ✅ Verification

### 1. Check Backend Health

Open in browser:
```
https://your-backend-url.up.railway.app/actuator/health
```

Expected response:
```json
{"status":"UP"}
```

### 2. Check Frontend

1. Open your frontend URL in browser
2. You should see the login page
3. Check browser console for errors (should be none)

### 3. Test Registration

1. Click **"Register"**
2. Fill in the form:
   - Name: Test User
   - Email: test@example.com
   - Phone: 1234567890
   - Password: Test123!
   - Role: Patient
3. Submit
4. You should see a success message

### 4. Test Login

1. Go to **"Login"**
2. Enter credentials from registration
3. You should be redirected to the dashboard

### 5. Test Medicine Management

1. Click **"Add Medicine"**
2. Fill in medicine details
3. Add schedule times
4. Save
5. Verify medicine appears in the list

---

## 🐛 Troubleshooting

### Issue: "CORS Error" in Browser Console

**Symptoms**: 
```
Access to XMLHttpRequest at 'https://backend...' from origin 'https://frontend...' 
has been blocked by CORS policy
```

**Solution**:
1. Verify `FRONTEND_URL` is set correctly in backend variables
2. Ensure the URL matches exactly (no trailing slash)
3. Redeploy backend after changing variables
4. Clear browser cache and try again

---

### Issue: "Failed to connect to database"

**Symptoms**: Backend logs show database connection errors

**Solution**:
1. Check PostgreSQL service is running in Railway
2. Verify database reference variables are set correctly:
   - `DB_URL` → `DATABASE_URL`
   - `DB_USERNAME` → `PGUSER`
   - `DB_PASSWORD` → `PGPASSWORD`
3. Check Railway PostgreSQL logs for errors

---

### Issue: Frontend shows "Network Error"

**Symptoms**: Frontend can't reach backend API

**Solution**:
1. Verify `VITE_API_BASE_URL` is set correctly in frontend variables
2. Ensure backend is deployed and accessible
3. Check backend URL is correct (no typos)
4. Test backend health endpoint directly

---

### Issue: Build Fails

**Symptoms**: Railway deployment fails during build

**Solution**:
1. Check Railway build logs for specific errors
2. For backend: Ensure `pom.xml` is valid
3. For frontend: Ensure `package.json` is valid
4. Check root directory is set correctly
5. Verify all dependencies are available

---

### Issue: "Out of Memory" during build

**Solution**:
1. Railway free tier has memory limits
2. For Maven: Add to `pom.xml` in `maven-compiler-plugin`:
   ```xml
   <configuration>
       <fork>true</fork>
       <meminitial>128m</meminitial>
       <maxmem>512m</maxmem>
   </configuration>
   ```

---

## 💰 Railway Free Tier Limits

Railway offers **$5 free credit per month**:
- No time limit on free credit
- Services may sleep after inactivity
- Shared resources
- Limited build minutes

**Monitor your usage**:
1. Go to Railway dashboard
2. Check **"Usage"** tab
3. View current month's consumption

**Tips to stay within free tier**:
- Optimize build times
- Use efficient queries
- Minimize unnecessary API calls
- Consider upgrading if you exceed limits

---

## 🎉 Success!

Your Medicine Reminder System should now be deployed and accessible at:
- **Frontend**: `https://your-frontend-url.up.railway.app`
- **Backend**: `https://your-backend-url.up.railway.app`

### Next Steps

1. **Test all features thoroughly**
2. **Share the URL** with users
3. **Monitor Railway usage**
4. **Set up custom domain** (optional, requires Railway Pro)
5. **Configure email notifications** with your Gmail account
6. **Set up monitoring** and alerts

---

## 📚 Additional Resources

- [Railway Documentation](https://docs.railway.app/)
- [Railway Discord Community](https://discord.gg/railway)
- [Spring Boot on Railway](https://docs.railway.app/guides/spring-boot)
- [Vite on Railway](https://docs.railway.app/guides/vite)

---

## 🆘 Need Help?

If you encounter issues not covered here:
1. Check Railway build logs
2. Check browser console for errors
3. Review Railway documentation
4. Ask in Railway Discord community

---

**Happy Deploying! 🚀**
