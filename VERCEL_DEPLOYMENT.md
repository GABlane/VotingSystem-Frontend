# Vercel Deployment Guide

Complete guide for deploying the Next.js frontend to Vercel.

## Prerequisites

- GitHub account
- Vercel account (sign up at [vercel.com](https://vercel.com))
- Frontend code pushed to GitHub
- Backend deployed on Railway

## Files for Vercel

The following files are configured for Vercel deployment:

- ✅ `vercel.json` - Vercel configuration
- ✅ `package.json` - Build scripts configured
- ✅ `.env.local.example` - Environment variables template (create this)

## Step-by-Step Deployment

### 1. Push Frontend to GitHub

```bash
cd frontend

# Initialize git if not already done
git init
git add .
git commit -m "Ready for Vercel deployment"

# Add remote and push
git remote add origin https://github.com/yourusername/voting-frontend.git
git branch -M main
git push -u origin main
```

**OR if using a monorepo:**
```bash
# From root directory
cd ..
git add .
git commit -m "Add Vercel config for frontend"
git push
```

### 2. Import Project to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **"Add New..."** → **"Project"**
3. Click **"Import Git Repository"**
4. Authorize Vercel to access your GitHub
5. Select your repository

### 3. Configure Project Settings

**If using a monorepo (backend + frontend in same repo):**
- **Root Directory:** `frontend`
- Click **"Continue"**

**If frontend is in its own repo:**
- Leave root directory as `./`
- Click **"Continue"**

**Framework Preset:** Next.js (auto-detected)

### 4. Set Environment Variables

In the "Environment Variables" section, add these variables:

| Variable Name | Value | Note |
|---------------|-------|------|
| `NEXT_PUBLIC_API_URL` | `https://web-production-90542.up.railway.app` | Your Railway backend URL |
| `NEXT_PUBLIC_SUPABASE_URL` | (from your .env.local) | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | (from your .env.local) | Your Supabase anon key |

**Important Notes:**
- All frontend env vars MUST start with `NEXT_PUBLIC_`
- Don't include quotes around values
- Use the Railway URL from your backend deployment

### 5. Deploy

1. Click **"Deploy"**
2. Wait for deployment to complete (2-3 minutes)
3. Vercel will show build logs in real-time

### 6. Get Your Vercel URL

After deployment succeeds:
- Vercel automatically generates a URL like: `https://voting-system-abc123.vercel.app`
- Copy this URL

### 7. Update Railway Backend

**IMPORTANT:** Update CORS settings in Railway:

1. Go to Railway dashboard
2. Select your backend project
3. Click **"Variables"** tab
4. Find `FRONTEND_URL` variable
5. Update value to your Vercel URL: `https://your-app.vercel.app`
6. Click **"Redeploy"** to apply changes

### 8. Test Your Deployed App

Visit your Vercel URL and test:

✅ Landing page loads
✅ Admin login works
✅ Dashboard shows projects
✅ Can create new project
✅ QR code displays
✅ Public voting page works

## Environment Variables Explained

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL from Railway | `https://web-production-90542.up.railway.app` |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | `https://abc123.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | `eyJhbGc...` (JWT token) |

## Getting Supabase Keys

If you don't have them:
1. Go to Supabase dashboard
2. Select your project
3. Click **Settings** (gear icon) → **API**
4. Copy:
   - **URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**⚠️ Use ANON key, NOT service_role key for frontend!**

## Troubleshooting

### Build Fails

**Check build logs in Vercel:**
1. Go to **Deployments** tab
2. Click failed deployment
3. View build logs

**Common issues:**
- Missing environment variables → Add all required vars
- TypeScript errors → Fix with `npm run build` locally
- Dependency issues → Check package.json

### App Loads But API Calls Fail

**CORS Error:**
- Check `FRONTEND_URL` in Railway matches Vercel URL exactly
- Verify Railway backend redeployed after updating variable
- Check browser console for specific CORS error

**404 on API calls:**
- Verify `NEXT_PUBLIC_API_URL` is correct
- Test backend directly: `curl https://your-railway.app/projects`
- Check Railway logs for incoming requests

### Images Not Loading

**Logo/QR code issues:**
- Verify Supabase Storage bucket is public
- Check image URLs in browser network tab
- Hard refresh: Ctrl/Cmd + Shift + R

### Realtime Updates Not Working

**WebSocket connection fails:**
- Check `NEXT_PUBLIC_SUPABASE_URL` is correct
- Check `NEXT_PUBLIC_SUPABASE_ANON_KEY` is correct
- Verify Supabase Realtime is enabled for your project

## Custom Domain (Optional)

To use your own domain:

1. Go to Vercel project **Settings** → **Domains**
2. Click **"Add Domain"**
3. Enter your domain (e.g., `vote.yourdomain.com`)
4. Follow DNS configuration instructions
5. Vercel auto-provisions SSL certificate

**After adding custom domain:**
- Update `FRONTEND_URL` in Railway to custom domain
- Redeploy Railway backend

## Automatic Deployments

Vercel automatically deploys when you push to `main` branch.

**Disable auto-deploy:**
1. Go to **Settings** → **Git**
2. Toggle off **"Production Branch"**

**Preview deployments:**
- Every PR gets a preview URL
- Test changes before merging

## Vercel CLI (Optional)

Install for local deployment testing:

```bash
npm install -g vercel

# Login
vercel login

# Deploy from local
cd frontend
vercel

# Deploy to production
vercel --prod
```

## Environment Variable Updates

To update env vars after deployment:

1. Go to Vercel project **Settings** → **Environment Variables**
2. Click **Edit** on variable
3. Update value
4. **Important:** Redeploy to apply changes
   - Go to **Deployments**
   - Click **"Redeploy"** on latest deployment

## Performance Optimization

Vercel automatically provides:
- ✅ Global CDN
- ✅ Edge caching
- ✅ Image optimization
- ✅ Automatic HTTPS
- ✅ DDoS protection

## Monitoring

### View Logs
1. Go to **Deployments** tab
2. Click active deployment
3. View **"Runtime Logs"**

### Analytics
- Go to **Analytics** tab
- View page views, performance, etc.
- Requires Vercel Pro for full features

## Rollback

To rollback to previous deployment:

1. Go to **Deployments** tab
2. Find previous successful deployment
3. Click **"..."** menu → **"Promote to Production"**

## Pricing

**Free Tier (Hobby):**
- Unlimited deployments
- 100GB bandwidth per month
- Custom domains
- Automatic HTTPS

**Pro Tier ($20/month):**
- More bandwidth
- Analytics
- Password protection
- Team collaboration

Check [vercel.com/pricing](https://vercel.com/pricing) for details.

## Security Checklist

Before going live:
- [ ] Environment variables set correctly
- [ ] No secrets in code/commits
- [ ] HTTPS enabled (automatic on Vercel)
- [ ] CORS configured properly (via Railway backend)
- [ ] Default admin password changed
- [ ] API endpoints protected with JWT

## Next Steps After Deployment

1. ✅ Test all features end-to-end
2. ✅ Create a real project and test voting
3. ✅ Share voting URL with test users
4. ✅ Monitor Railway backend logs
5. ✅ Set up custom domain (optional)
6. ✅ Configure analytics (optional)

## Support

- **Vercel Docs:** [vercel.com/docs](https://vercel.com/docs)
- **Vercel Support:** [vercel.com/support](https://vercel.com/support)
- **Vercel Status:** [vercel-status.com](https://vercel-status.com)

---

**Ready to deploy?** Follow the steps above and your frontend will be live in minutes! 🚀

## Quick Reference

```bash
# Deploy with Vercel CLI
vercel --prod

# View logs
vercel logs

# List deployments
vercel list

# Check environment variables
vercel env ls
```
