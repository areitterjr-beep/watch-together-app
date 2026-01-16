# Quick Deployment Checklist

Follow these steps to deploy your watch-together app in 15 minutes:

## ✅ Step 1: Push to GitHub (2 minutes)

```bash
cd /Users/allenreitter/my-health-app
git init
git add .
git commit -m "Ready for deployment"
git remote add origin https://github.com/YOUR_USERNAME/watch-together-app.git
git branch -M main
git push -u origin main
```

## ✅ Step 2: Deploy Backend to Railway (5 minutes)

1. Go to [railway.app](https://railway.app) → Sign in with GitHub
2. **New Project** → **Deploy from GitHub repo** → Select your repo
3. In service **Settings**:
   - **Root Directory**: `watch-together-backend`
4. In **Variables** tab, add:
   ```
   PORT=3003
   NODE_ENV=production
   FRONTEND_URL=https://placeholder.vercel.app
   ```
5. Copy your Railway URL: `https://your-app.up.railway.app`

## ✅ Step 3: Deploy Frontend to Vercel (5 minutes)

1. Go to [vercel.com](https://vercel.com) → Sign in with GitHub
2. **Add New Project** → Import your repo
3. Configure:
   - **Root Directory**: `watch-together-frontend`
   - **Framework Preset**: Next.js (auto-detected)
4. **Environment Variables**:
   - `NEXT_PUBLIC_SOCKET_URL` = `https://your-app.up.railway.app` (from Step 2)
5. Click **Deploy**
6. Copy your Vercel URL: `https://your-app.vercel.app`

## ✅ Step 4: Update Backend CORS (1 minute)

1. Go back to Railway → Your service → **Variables**
2. Update `FRONTEND_URL` to your Vercel URL from Step 3
3. Railway auto-redeploys

## ✅ Step 5: Test (2 minutes)

1. Open your Vercel URL
2. Create a room
3. Open in another browser/incognito
4. Join the same room
5. Test video, audio, controls ✅

## 🎉 Done!

**Share this URL**: `https://your-app.vercel.app`

---

**Need help?** See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed instructions.
