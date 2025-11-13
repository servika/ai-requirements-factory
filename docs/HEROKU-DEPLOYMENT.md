# Heroku Deployment Guide for AI Factory

This guide will walk you through deploying AI Factory to Heroku as a single application that serves both the backend API and frontend React app.

## Prerequisites

1. **Heroku Account**: Sign up at [heroku.com](https://heroku.com)
2. **Heroku CLI**: Install from [devcenter.heroku.com/articles/heroku-cli](https://devcenter.heroku.com/articles/heroku-cli)
3. **Git**: Ensure your project is a git repository
4. **Anthropic API Key**: Get your API key from [console.anthropic.com](https://console.anthropic.com/)

## Architecture Overview

The Heroku deployment uses this architecture:

```
Heroku Dyno
├── Backend (Express + Socket.IO) - Port assigned by Heroku
│   ├── Serves API endpoints (/api/*)
│   ├── Handles WebSocket connections
│   └── Serves frontend static files (production)
│
└── Frontend (React build)
    └── Static files served from backend/../../frontend/dist
```

## Step 1: Prepare Your Application

The necessary files have already been created:

✅ **Procfile** - Tells Heroku how to start the app
✅ **package.json** - Updated with `heroku-postbuild` script
✅ **Backend server** - Configured to serve frontend static files in production
✅ **Frontend** - Configured to connect to the same origin in production

## Step 2: Login to Heroku

```bash
heroku login
```

This will open a browser for authentication.

## Step 3: Create a Heroku App

```bash
# Create a new Heroku app
heroku create your-ai-factory-app

# Or if you want Heroku to generate a random name:
heroku create
```

This creates the app and adds a git remote named `heroku`.

## Step 4: Set Environment Variables

Configure your Anthropic API key and other environment variables:

```bash
# Required: Set your Anthropic API key
heroku config:set ANTHROPIC_API_KEY=your_api_key_here

# Optional: Set the Claude model (defaults to claude-sonnet-4-5-20250929)
heroku config:set CLAUDE_MODEL=claude-sonnet-4-5-20250929

# Required: Set Node environment to production
heroku config:set NODE_ENV=production

# Optional: Configure frontend URL (defaults to app URL)
heroku config:set FRONTEND_URL=https://your-ai-factory-app.herokuapp.com
```

### View your configuration:

```bash
heroku config
```

## Step 5: Deploy to Heroku

### Initial Deployment

```bash
# Make sure all changes are committed
git add .
git commit -m "Prepare for Heroku deployment"

# Push to Heroku (this triggers the build and deploy)
git push heroku master
```

If you're working on a different branch:

```bash
git push heroku your-branch:master
```

### What Happens During Deployment:

1. **Build Phase** (`heroku-postbuild` script runs):
   - Installs root dependencies
   - Installs frontend dependencies
   - Installs backend dependencies
   - Builds frontend (creates `frontend/dist/`)

2. **Release Phase**:
   - Sets up environment variables
   - Prepares the dyno

3. **Start Phase** (Procfile):
   - Starts the backend server
   - Backend serves API and frontend static files

## Step 6: Open Your Application

```bash
heroku open
```

Or visit: `https://your-ai-factory-app.herokuapp.com`

## Step 7: Monitor Your Application

### View Logs

```bash
# View real-time logs
heroku logs --tail

# View recent logs
heroku logs --num 200
```

### Check App Status

```bash
# View app info
heroku apps:info

# Check dyno status
heroku ps
```

### Health Check

Your app has a health endpoint at:
```
https://your-ai-factory-app.herokuapp.com/health
```

## Troubleshooting

### Build Fails

**Issue**: Build fails during `heroku-postbuild`

**Solutions**:
1. Check the build logs: `heroku logs --tail`
2. Verify package.json scripts are correct
3. Ensure all dependencies are listed in package.json (not devDependencies for production)

### Application Crashes

**Issue**: Application crashes on startup

**Solutions**:
1. Check logs: `heroku logs --tail`
2. Verify environment variables: `heroku config`
3. Ensure `ANTHROPIC_API_KEY` is set
4. Check that PORT is not hardcoded (use `process.env.PORT`)

### WebSocket Connection Issues

**Issue**: Frontend can't connect to WebSocket

**Solutions**:
1. Ensure Socket.IO is configured for both WebSocket and polling transports
2. Check CORS configuration allows your frontend URL
3. Verify `NODE_ENV=production` is set

### API Key Not Found

**Issue**: "ANTHROPIC_API_KEY is required" error

**Solution**:
```bash
heroku config:set ANTHROPIC_API_KEY=your_key_here
heroku restart
```

### Frontend Shows 404 or Blank Page

**Issue**: Frontend doesn't load

**Solutions**:
1. Verify frontend was built: Check logs for "Building frontend"
2. Ensure `frontend/dist/` exists after build
3. Check server.js has the static file serving code
4. Restart the app: `heroku restart`

## Updating Your Deployment

After making changes to your code:

```bash
# Commit your changes
git add .
git commit -m "Your commit message"

# Deploy to Heroku
git push heroku master

# View the deployment
heroku logs --tail
```

## Scaling Your Application

### Upgrade Dyno Type

For better performance, upgrade from free/hobby to standard dynos:

```bash
# View available dyno types
heroku ps

# Scale to standard-1x dyno
heroku ps:scale web=1:standard-1x
```

### Add Database (Optional)

If you want to persist sessions:

```bash
# Add Heroku Postgres
heroku addons:create heroku-postgresql:mini

# Or add Redis
heroku addons:create heroku-redis:mini
```

## Cost Considerations

- **Free Tier**:
  - 550-1000 free dyno hours per month
  - Sleeps after 30 minutes of inactivity
  - Good for testing

- **Hobby Tier** ($7/month):
  - Never sleeps
  - SSL included
  - Good for small projects

- **Standard Tier** ($25-50/month):
  - Better performance
  - Horizontal scaling
  - Metrics
  - Good for production

## Environment Variables Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `ANTHROPIC_API_KEY` | Yes | - | Your Anthropic API key |
| `CLAUDE_MODEL` | No | claude-sonnet-4-5-20250929 | Claude model to use |
| `NODE_ENV` | Yes | - | Set to `production` |
| `PORT` | No | (Set by Heroku) | Server port |
| `FRONTEND_URL` | No | App URL | Frontend URL for CORS |

## Security Best Practices

1. **Never commit .env files** - They're in .gitignore
2. **Use Heroku config vars** for all secrets
3. **Enable 2FA** on your Heroku account
4. **Use SSL** (included with Heroku apps)
5. **Rotate API keys** regularly
6. **Monitor usage** to prevent unexpected charges

## Custom Domain (Optional)

To use your own domain:

```bash
# Add domain to Heroku
heroku domains:add www.yourdomain.com

# Get DNS target
heroku domains

# Configure DNS with your provider
# Add CNAME record pointing to the DNS target

# Add SSL
heroku certs:auto:enable
```

## Useful Heroku Commands

```bash
# Restart your app
heroku restart

# Run a one-off command
heroku run bash

# View environment variables
heroku config

# Set environment variable
heroku config:set KEY=value

# Unset environment variable
heroku config:unset KEY

# View app information
heroku apps:info

# Open app in browser
heroku open

# View logs
heroku logs --tail

# Scale dynos
heroku ps:scale web=1

# Access Heroku dashboard
# https://dashboard.heroku.com/apps/your-app-name
```

## Rollback Deployment

If something goes wrong:

```bash
# View releases
heroku releases

# Rollback to previous version
heroku rollback

# Or rollback to specific version
heroku rollback v123
```

## Getting Help

- **Heroku Docs**: [devcenter.heroku.com](https://devcenter.heroku.com/)
- **Heroku Status**: [status.heroku.com](https://status.heroku.com/)
- **Support**: Contact via Heroku dashboard

## Next Steps

After deployment:

1. ✅ Test all wizard stages
2. ✅ Verify WebSocket connections work
3. ✅ Test feedback and navigation features
4. ✅ Monitor logs for any errors
5. ✅ Set up monitoring/alerting (optional)
6. ✅ Configure custom domain (optional)
7. ✅ Add database for session persistence (optional)

---

**Your AI Factory is now live on Heroku! 🚀**

Visit your app at: `https://your-ai-factory-app.herokuapp.com`