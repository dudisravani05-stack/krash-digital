# Krash Digital - GitHub & Vercel Deployment Guide

## ✅ Completed Steps

Your project is now ready for GitHub and Vercel deployment!

- ✓ Git repository initialized
- ✓ All files committed
- ✓ Google AI Studio references removed
- ✓ Project title updated to "Krash Digital"

## 📋 Manual Steps Required

### Step 1: Create GitHub Repository

1. Go to **https://github.com/dudisravani05-stack**
2. Click **"New repository"** button
3. **Repository name**: `krash-digital`
4. **Description**: AI-powered web application for Krash Digital
5. **Visibility**: Public (recommended for Vercel)
6. Click **"Create repository"**

### Step 2: Get Your GitHub Repository URL

After creating the repo, you'll see instructions. Copy the HTTPS URL (should look like):
```
https://github.com/dudisravani05-stack/krash-digital.git
```

### Step 3: Push Your Code to GitHub

Run these commands in PowerShell (in your project directory):

```powershell
$git = "C:\Program Files\Git\bin\git.exe"

# Add remote repository
& $git remote add origin https://github.com/dudisravani05-stack/krash-digital.git

# Rename branch to main
& $git branch -M main

# Push to GitHub
& $git push -u origin main
```

### Step 4: Deploy to Vercel

1. Go to **https://vercel.com/new**
2. Click **"Import Git Repository"**
3. Paste your GitHub URL: `https://github.com/dudisravani05-stack/krash-digital`
4. Click **"Import"**
5. **Configure Project**:
   - Framework Preset: **Vite**
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `dist`
6. Add Environment Variables (if needed):
   - `VITE_GEMINI_API_KEY`: Your API key from [.env.local](.env.local)
7. Click **"Deploy"**

### Step 5: Monitor Your Deployment

Vercel will build and deploy automatically. You can monitor progress at:
- https://vercel.com/dudisravani05-stack

Your app will be live at something like:
- `https://krash-digital.vercel.app`

## 🔐 Environment Variables for Vercel

Make sure these are set in your Vercel project settings:

- `GEMINI_API_KEY`: Your Google Gemini API key
- `FIREBASE_API_KEY`: Your Firebase API key (from firebase-applet-config.json)

## 🚀 Future Deployments

After the initial setup:
1. Make changes locally
2. Commit with `git commit -m "message"`
3. Push with `& $git push`
4. Vercel will automatically redeploy!

## 📞 Support

If you need help:
- GitHub Docs: https://docs.github.com
- Vercel Docs: https://vercel.com/docs
- Vite Docs: https://vitejs.dev
