# ICEAS Deployment Guide - Vercel

This guide will help you deploy ICEAS to Vercel in under 10 minutes.

## Prerequisites

- GitHub account (you already have this!)
- Vercel account (free) - Sign up at https://vercel.com

## Quick Deploy Steps

### Step 1: Install Vercel CLI (Optional)

```bash
npm i -g vercel
```

Or deploy directly from the Vercel dashboard (recommended for first deployment).

### Step 2: Deploy to Vercel

#### Option A: Deploy via Vercel Dashboard (Easiest)

1. **Go to https://vercel.com**
2. **Sign in** with your GitHub account
3. **Click "Add New Project"**
4. **Import your repository**: `SardarDawar/test-iq-project`
5. **Select the branch**: `claude/iceas-mvp-specification-011CUMGYjwZ2dJdqvj8RngQf`
6. **Configure Project**:
   - Framework Preset: **Next.js** (should auto-detect)
   - Build Command: `npm run vercel-build` or `prisma generate && next build`
   - Output Directory: `.next` (default)
   - Install Command: `npm install`

7. **Before deploying, add Environment Variables** (see Step 3)

#### Option B: Deploy via Vercel CLI

```bash
vercel
```

Follow the prompts and configure when asked.

### Step 3: Set Up Database (Vercel Postgres)

**Option 1: Use Vercel Postgres (Recommended)**

1. In your Vercel project dashboard, go to the **Storage** tab
2. Click **Create Database**
3. Select **Postgres**
4. Choose a name (e.g., `iceas-db`)
5. Select region (choose closest to your users)
6. Click **Create**

Vercel will automatically:
- Create the database
- Add `DATABASE_URL`, `POSTGRES_URL`, etc. to your environment variables

**Option 2: Use External PostgreSQL**

You can also use:
- **Supabase** (https://supabase.com) - Free tier includes PostgreSQL
- **Railway** (https://railway.app) - Free tier available
- **Neon** (https://neon.tech) - Serverless Postgres
- **ElephantSQL** (https://www.elephantsql.com) - Free tier available

Get your connection string and add it to Vercel environment variables.

### Step 4: Add Environment Variables

In your Vercel project dashboard:

1. Go to **Settings** → **Environment Variables**
2. Add the following variables:

```env
# Database (auto-added if using Vercel Postgres)
DATABASE_URL=postgresql://...

# NextAuth (REQUIRED)
NEXTAUTH_SECRET=<generate-a-random-secret>
NEXTAUTH_URL=https://your-app.vercel.app

# OpenAI (Optional - for AI features)
OPENAI_API_KEY=sk-...

# App Config
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

**Generate NEXTAUTH_SECRET**:
```bash
openssl rand -base64 32
```

Or use: https://generate-secret.vercel.app/32

3. **Important**: Add these for **Production**, **Preview**, and **Development** environments

### Step 5: Deploy

1. Click **Deploy** in Vercel dashboard
2. Wait for build to complete (2-3 minutes)
3. Vercel will give you a live URL like: `https://iceas-mvp.vercel.app`

### Step 6: Initialize Database

After deployment, you need to seed the database with sample questions.

**Option A: Using Vercel CLI**

```bash
# Connect to your production database
vercel env pull .env.production
```

Then run locally connected to production:
```bash
npm run db:seed
```

**Option B: Run via Vercel Dashboard**

Unfortunately, Vercel doesn't support running arbitrary scripts. You have two options:

1. **Temporary API endpoint** - Create a one-time seed endpoint (see below)
2. **Connect locally** - Run seed script from your local machine connected to production DB

**Temporary Seed Endpoint** (Quick Method):

I can create a protected API endpoint at `/api/admin/seed` that you can call once to seed the database. Let me know if you want me to add this.

### Step 7: Create Admin Account

Since the seed creates an admin account, you can log in with:

- **Email**: `admin@iceas.app`
- **Password**: `admin123`

**IMPORTANT**: Change this password immediately in production!

### Step 8: Test Your Deployment

1. Visit your Vercel URL
2. Click "Get Started"
3. Register a new account or log in with admin credentials
4. Try taking an assessment
5. View results and dashboard

## Troubleshooting

### Build Fails with Prisma Error

If you see Prisma-related errors:

1. Make sure `DATABASE_URL` is set in environment variables
2. Try adding this to `next.config.js`:

```javascript
webpack: (config, { isServer }) => {
  if (isServer) {
    config.externals.push('_http_common');
  }
  return config;
}
```

### Database Connection Error

1. Check that `DATABASE_URL` is correct
2. Ensure your database allows connections from Vercel IPs
3. Verify SSL mode in connection string (add `?sslmode=require` if needed)

### Environment Variables Not Working

1. Make sure you've added them to the correct environment (Production/Preview)
2. Redeploy after adding new environment variables
3. Check variable names match exactly (case-sensitive)

## Post-Deployment Tasks

### 1. Add Custom Domain (Optional)

1. Go to **Settings** → **Domains**
2. Add your custom domain
3. Follow DNS configuration instructions

### 2. Enable Analytics

1. Go to **Analytics** tab
2. Enable **Web Analytics** (free)
3. Monitor traffic and performance

### 3. Security Hardening

1. **Change admin password** immediately
2. **Rotate NEXTAUTH_SECRET** regularly
3. **Set up proper CORS** if using widget on external sites
4. **Enable rate limiting** for API endpoints (consider Vercel Edge Config)

### 4. Monitoring

- Set up **Vercel Monitoring** for errors and performance
- Enable **Error Tracking** with Sentry (optional)
- Monitor database usage in Vercel Postgres dashboard

## Scaling Considerations

For production use:

1. **Database**: Upgrade from Vercel Postgres free tier as needed
2. **OpenAI API**: Monitor API usage and set limits
3. **CDN**: Images/assets are automatically served via Vercel Edge Network
4. **Caching**: Implement ISR (Incremental Static Regeneration) for results pages
5. **Rate Limiting**: Add API rate limiting for security

## Cost Estimate

- **Vercel Hosting**: Free for hobby projects (generous limits)
- **Vercel Postgres**:
  - Free: 256 MB storage, 60 hours compute/month
  - Pro: $10/month for more resources
- **OpenAI API**:
  - ~$0.002 per question reframe (GPT-4o-mini)
  - ~$0.005 per insight generation
  - Estimate: ~$0.01 per full assessment with AI

For 1000 users/month with AI: ~$10-20/month

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Review environment variables
3. Test database connectivity
4. Check the README.md for additional troubleshooting

## Next Steps

Once deployed:
1. ✅ Test all user flows
2. ✅ Add more questions via admin portal
3. ✅ Customize branding
4. ✅ Set up custom domain
5. ✅ Invite users!

---

**Ready to deploy?** Let's get your ICEAS application live! 🚀
