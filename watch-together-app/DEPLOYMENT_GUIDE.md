# Watch Together App - Deployment Guide

This guide will help you deploy your watch-together app so external users can test it.

## 📋 Overview

The app consists of two parts:
1. **Frontend** (Next.js) - Deploy to **Vercel** (recommended) or Netlify
2. **Backend** (Node.js/Express/Socket.io) - Deploy to **Railway** (recommended) or Render

---

## 🚀 Quick Deployment (Recommended)

### Option 1: Railway for Both (Easiest)

Railway can deploy both frontend and backend, making it the simplest option.

### Option 2: Vercel + Railway (Best Performance)

- **Frontend**: Vercel (optimized for Next.js)
- **Backend**: Railway (simple Node.js hosting)

---

## 📦 Prerequisites

1. **GitHub Account** (for version control)
2. **Git installed** on your machine
3. **Node.js 18+** (already installed)

---

## Step 1: Push Code to GitHub

### 1.1 Initialize Git (if not already done)

```bash
cd /Users/allenreitter/my-health-app

# Initialize git repository
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Watch Together app ready for deployment"
```

### 1.2 Create GitHub Repository

1. Go to [github.com](https://github.com) and sign in
2. Click **"New repository"**
3. Name it: `watch-together-app` (or any name you prefer)
4. **Don't** initialize with README, .gitignore, or license
5. Click **"Create repository"**

### 1.3 Push to GitHub

```bash
# Add GitHub remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/watch-together-app.git

# Rename branch to main
git branch -M main

# Push to GitHub
git push -u origin main
```

---

## Step 2: Deploy Backend to Railway

Railway is recommended because it's simple, has a free tier, and works great with Socket.io.

### 2.1 Sign Up for Railway

1. Go to [railway.app](https://railway.app)
2. Click **"Login"** or **"Start a New Project"**
3. Sign in with **GitHub** (recommended)
4. Authorize Railway to access your repositories

### 2.2 Create New Project

1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Choose your `watch-together-app` repository
4. Railway will detect it's a Node.js project

### 2.3 Configure Backend Deployment

1. **Set Root Directory**:
   - Click on your service
   - Go to **Settings** tab
   - Under **"Root Directory"**, set it to: `watch-together-backend`
   - Click **"Update"**

2. **Add Environment Variables**:
   - Go to **"Variables"** tab
   - Add these environment variables:

   ```env
   PORT=3003
   NODE_ENV=production
   FRONTEND_URL=https://your-frontend-domain.vercel.app
   MONGODB_URI=your_mongodb_uri_optional
   ```

   **Note**: 
   - Leave `MONGODB_URI` empty if you're not using MongoDB (the app works without it)
   - You'll update `FRONTEND_URL` after deploying the frontend

3. **Configure Build & Start**:
   - Railway auto-detects this, but verify:
     - Build Command: `npm install` (or leave empty)
     - Start Command: `npm start`
   - These are already in `package.json`

### 2.4 Get Your Backend URL

1. Railway will assign a URL like: `https://your-app-name.up.railway.app`
2. Copy this URL - you'll need it for the frontend
3. The URL might take a minute to be ready

### 2.5 Test Backend

1. Go to your Railway service dashboard
2. Click on the service to see logs
3. Wait for "Server running on port 3003" message
4. Copy the public URL and test: `https://your-backend-url.railway.app/health`
   - You should see: `{ "status": "ok" }`

---

## Step 3: Deploy Frontend to Vercel

Vercel is the best platform for Next.js apps (made by the Next.js team).

### 3.1 Sign Up for Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **"Sign Up"**
3. Sign in with **GitHub** (recommended)
4. Authorize Vercel to access your repositories

### 3.2 Import Project

1. Click **"Add New..."** → **"Project"**
2. Find and select your `watch-together-app` repository
3. Click **"Import"**

### 3.3 Configure Frontend Deployment

1. **Set Root Directory**:
   - Under **"Root Directory"**, click **"Edit"**
   - Set it to: `watch-together-frontend`
   - Click **"Continue"**

2. **Framework Preset**:
   - Vercel should auto-detect **Next.js**
   - If not, select **Next.js** manually

3. **Add Environment Variables**:
   - Go to **"Environment Variables"** section
   - Add this variable:
     - **Name**: `NEXT_PUBLIC_SOCKET_URL`
     - **Value**: `https://your-backend-url.railway.app` (use the Railway URL from Step 2)
   - Make sure it's available in **Production**, **Preview**, and **Development**
   - Click **"Save"**

4. **Build Settings** (usually auto-detected):
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

### 3.4 Deploy

1. Click **"Deploy"**
2. Vercel will build and deploy your app
3. Wait for deployment to complete (usually 2-3 minutes)
4. You'll get a URL like: `https://your-app-name.vercel.app`

### 3.5 Update Backend CORS

1. Go back to **Railway** (backend)
2. Go to **Variables** tab
3. Update `FRONTEND_URL` to your Vercel URL:
   ```
   FRONTEND_URL=https://your-app-name.vercel.app
   ```
4. Railway will automatically redeploy with the new CORS settings

---

## Step 4: Test Your Deployment

### 4.1 Test Frontend

1. Open your Vercel URL in a browser
2. You should see the home page
3. Try creating a room
4. Check the browser console for any errors

### 4.2 Test with Multiple Users

1. Open your Vercel URL in **two different browsers** (or incognito windows)
2. Create a room in one browser
3. Join the same room in the other browser
4. Test:
   - ✅ Video chat works
   - ✅ Audio works
   - ✅ Controls work (mute, camera toggle)
   - ✅ Background effects work
   - ✅ Chat works
   - ✅ Video playback syncs

---

## 🔧 Alternative Deployment Options

### Frontend Alternatives

#### Netlify
1. Go to [netlify.com](https://netlify.com)
2. Sign in with GitHub
3. Click **"Add new site"** → **"Import an existing project"**
4. Select your repository
5. Set:
   - **Base directory**: `watch-together-frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
6. Add environment variable: `NEXT_PUBLIC_SOCKET_URL`

#### Railway (Both Frontend and Backend)
1. In Railway, create **two services** from the same repo:
   - Service 1: Root directory `watch-together-backend`
   - Service 2: Root directory `watch-together-frontend`
2. Configure environment variables for each
3. Link frontend service to backend service

### Backend Alternatives

#### Render
1. Go to [render.com](https://render.com)
2. Sign in with GitHub
3. Click **"New +"** → **"Web Service"**
4. Connect your repository
5. Set:
   - **Root Directory**: `watch-together-backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
6. Add environment variables (same as Railway)

---

## 🔐 Environment Variables Summary

### Backend (Railway/Render)

```env
PORT=3003
NODE_ENV=production
FRONTEND_URL=https://your-frontend-url.vercel.app
MONGODB_URI=optional_mongodb_connection_string
```

### Frontend (Vercel/Netlify)

```env
NEXT_PUBLIC_SOCKET_URL=https://your-backend-url.railway.app
```

---

## 🐛 Troubleshooting

### Backend Issues

#### "Connection refused" or Socket.io not connecting
- ✅ Check `FRONTEND_URL` matches your frontend domain exactly
- ✅ Ensure backend is running (check Railway logs)
- ✅ Verify CORS settings in `server.js`

#### Backend crashes on startup
- ✅ Check Railway logs for error messages
- ✅ Verify all environment variables are set
- ✅ Make sure `PORT` is set (Railway provides it automatically, but you can override)

### Frontend Issues

#### "Failed to connect to server"
- ✅ Check `NEXT_PUBLIC_SOCKET_URL` is correct
- ✅ Verify backend is running and accessible
- ✅ Check browser console for CORS errors

#### Build fails on Vercel
- ✅ Check build logs in Vercel dashboard
- ✅ Ensure `package.json` has correct scripts
- ✅ Verify all dependencies are in `package.json`

### WebRTC Issues

#### Video/audio not working
- ✅ Ensure HTTPS is enabled (required for WebRTC)
- ✅ Check browser permissions (camera/microphone)
- ✅ Modern browsers only (Chrome, Firefox, Safari, Edge)

---

## 📱 Sharing with External Users

### Share the Link

1. Share your Vercel URL: `https://your-app-name.vercel.app`
2. Users can:
   - Create a room
   - Share the room link with others
   - Join and start watching together

### Room Links

- Room links work automatically with your domain
- Format: `https://your-app-name.vercel.app/room/ROOM_ID`
- Users can share these links directly

---

## 🎯 Next Steps

1. ✅ Test with multiple users
2. ✅ Monitor performance and errors
3. ✅ Set up custom domain (optional)
4. ✅ Configure production monitoring (optional)

---

## 💰 Cost Estimate

### Free Tiers

- **Vercel**: Free tier includes 100GB bandwidth/month
- **Railway**: Free tier includes $5 credit/month (usually enough for testing)
- **Total**: **$0/month** for testing with small groups

### If You Need More

- **Railway**: $5/month for starter plan
- **Vercel**: Pro plan is $20/month (if needed)
- **Recommended**: Start with free tiers, upgrade if needed

---

## ✅ Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Backend deployed to Railway/Render
- [ ] Backend URL tested (`/health` endpoint)
- [ ] Frontend deployed to Vercel/Netlify
- [ ] Environment variables configured correctly
- [ ] CORS settings updated with frontend URL
- [ ] Tested with two browsers/users
- [ ] Video chat working
- [ ] Audio working
- [ ] Controls working
- [ ] Room sharing working

---

## 🎉 You're Done!

Your watch-together app is now live and ready for external users!

**Frontend URL**: `https://your-app-name.vercel.app`  
**Backend URL**: `https://your-app-name.railway.app`

Share your frontend URL with users to start testing! 🚀
