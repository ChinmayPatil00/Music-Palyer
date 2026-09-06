# 🚀 WanderX Deployment Guide

This guide walks you through deploying **WanderX** across different cloud platforms.

---

## ⚡ Option 1: Vercel (Recommended — Fastest & Easiest)

Because WanderX is built with Next.js App Router, **Vercel** provides instant zero-configuration deployment with edge caching and automatic SSL.

### Steps:
1. Go to [vercel.com](https://vercel.com) and sign in with your GitHub account.
2. Click **"Add New..."** → **"Project"**.
3. Locate and select the repository: `ChinmayPatil00/CyberDash`.
4. Leave settings as default:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./`
   - **Build Command**: `next build`
   - **Output Directory**: `.next`
5. *(Optional)* If you have Supabase configured, add Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   *(Note: Mock fallbacks are built-in, so it will run even without these!)*
6. Click **"Deploy"**.
7. In ~60 seconds, your site will be live with a free `https://*.vercel.app` domain and free SSL certificate!

---

## 🌐 Option 2: Netlify

1. Go to [netlify.com](https://netlify.com) and sign in.
2. Click **"Add new site"** → **"Import an existing project"**.
3. Connect your GitHub account and choose `ChinmayPatil00/CyberDash`.
4. Netlify will detect Next.js:
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
5. Click **"Deploy WanderX"**.

---

## 🚂 Option 3: Render / Railway (Full Web Service)

### On Render:
1. Go to [render.com](https://render.com).
2. Click **"New +"** → **"Web Service"**.
3. Connect `ChinmayPatil00/CyberDash`.
4. Configure:
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start`
   - **Plan**: Free or Starter
5. Click **"Create Web Service"**.

---

## 🐳 Option 4: Docker Container (Any Cloud / VPS)

WanderX includes a production multi-stage `Dockerfile` and `.dockerignore`.

```bash
# 1. Build the Docker container
docker build -t travelx .

# 2. Run container on port 3000
docker run -p 3000:3000 -d travelx
```

Compatible with:
- **AWS ECS / App Runner**
- **Google Cloud Run**
- **DigitalOcean App Platform**
- **Fly.io**: `fly launch`

---

## 🖥️ Option 5: Self-Hosted VPS (Ubuntu/Debian with PM2 & Nginx)

```bash
# 1. SSH into server & clone repository
git clone https://github.com/ChinmayPatil00/CyberDash.git travelx
cd travelx

# 2. Install dependencies & build
npm install --production=false
npm run build

# 3. Start with PM2
npm install -g pm2
pm2 start npm --name "travelx" -- start
pm2 save
pm2 startup
```
