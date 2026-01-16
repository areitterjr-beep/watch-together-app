# 🚀 Deploy Watch Together App

## Quick Start (15 minutes)

Your watch-together app is ready to deploy! Follow these simple steps:

### 📋 What You Need

1. **GitHub account** (free)
2. **Railway account** (free tier available)
3. **Vercel account** (free tier available)

---

## Step-by-Step Guide

### 1️⃣ Push to GitHub (2 min)

```bash
cd /Users/allenreitter/my-health-app

# If not already a git repo
git init
git add .
git commit -m "Ready for deployment"

# Create repo on GitHub first, then:
git remote add origin https://github.com/YOUR_USERNAME/watch-together-app.git
git branch -M main
git push -u origin main
```

**Need help?** Create repo at: https://github.com/new

---

### 2️⃣ Deploy Backend to Railway (5 min)

1. **Sign up**: https://railway.app → Login with GitHub

2. **Create project**:
   - Click **"New Project"**
   - Select **"Deploy from GitHub repo"**
   - Choose your `watch-together-app` repository

3. **Configure**:
   - Click on the service
   - Go to **Settings** → **Root Directory**: `watch-together-backend`

4. **Environment Variables** (Variables tab):
   ```
   PORT=3003
   NODE_ENV=production
   FRONTEND_URL=https://placeholder.vercel.app
   ```

5. **Copy backend URL**: `https://your-app.up.railway.app`

---

### 3️⃣ Deploy Frontend to Vercel (5 min)

1. **Sign up**: https://vercel.com → Login with GitHub

2. **Import project**:
   - Click **"Add New..."** → **"Project"**
   - Select your `watch-together-app` repository
   - Click **"Import"**

3. **Configure**:
   - **Root Directory**: `watch-together-frontend`
   - **Framework Preset**: Next.js (auto-detected)

4. **Environment Variables**:
   - Add: `NEXT_PUBLIC_SOCKET_URL` = `https://your-app.up.railway.app` (from Step 2)

5. **Deploy**: Click **"Deploy"**

6. **Copy frontend URL**: `https://your-app.vercel.app`

---

### 4️⃣ Update Backend CORS (1 min)

1. Go back to **Railway**
2. Update `FRONTEND_URL` variable to your Vercel URL from Step 3
3. Railway automatically redeploys

---

### 5️⃣ Test! (2 min)

1. Open your Vercel URL
2. Create a room
3. Open in another browser/incognito window
4. Join the same room
5. ✅ Test video, audio, controls

---

## 🎉 You're Live!

**Share this URL**: `https://your-app.vercel.app`

Users can now:
- ✅ Create rooms
- ✅ Join rooms
- ✅ Video chat
- ✅ Share room links
- ✅ Use all features

---

## 📚 Detailed Guide

For troubleshooting and alternative options, see:
- **Full Guide**: [watch-together-app/DEPLOYMENT_GUIDE.md](./watch-together-app/DEPLOYMENT_GUIDE.md)
- **Quick Checklist**: [watch-together-app/QUICK_DEPLOY.md](./watch-together-app/QUICK_DEPLOY.md)

---

## 💡 Tips

- **Free tiers** are enough for testing with small groups
- **Railway** gives $5 credit/month (usually plenty)
- **Vercel** gives 100GB bandwidth/month
- Both auto-deploy on git push (after initial setup)

---

## 🐛 Common Issues

**Backend not connecting?**
- Check `FRONTEND_URL` matches your Vercel URL exactly
- Check Railway logs for errors

**Frontend can't connect?**
- Verify `NEXT_PUBLIC_SOCKET_URL` is correct
- Ensure backend is running (check Railway)

**WebRTC not working?**
- Requires HTTPS (both Vercel and Railway provide this)
- Modern browsers only (Chrome, Firefox, Safari, Edge)

---

## ✅ Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Backend deployed to Railway
- [ ] Backend URL tested (`/health` endpoint)
- [ ] Frontend deployed to Vercel
- [ ] Environment variables configured
- [ ] CORS updated with frontend URL
- [ ] Tested with multiple users
- [ ] All features working

---

**Ready to deploy?** Start with Step 1! 🚀
