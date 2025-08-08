# Fly.io Deployment Guide

This guide walks you through deploying your Real Estate Investment Platform on Fly.io with separate backend and frontend apps.

## 🚀 Prerequisites

1. Install the Fly CLI:
```bash
# macOS
brew install flyctl

# Linux
curl -L https://fly.io/install.sh | sh

# Windows
iwr https://fly.io/install.ps1 -useb | iex
```

2. Login to Fly.io:
```bash
fly auth login
```

## 🖥️ Backend Deployment

### 1. Setup Backend Branch
```bash
# Create backend deployment branch
git checkout -b backend-deploy

# Remove frontend directory
rm -rf frontend/

# Copy backend-specific files
cp backend-only.gitignore .gitignore
rm frontend-fly.toml frontend-Dockerfile nginx.conf

# Commit changes
git add .
git commit -m "Setup backend for Fly.io deployment"
```

### 2. Initialize Fly App
```bash
# Create the Fly app (replace with your app name)
fly apps create real-estate-backend-your-name

# Or use the existing fly.toml
fly deploy --no-deploy
```

### 3. Set Environment Variables
```bash
# Set production environment variables
fly secrets set FLASK_ENV=production
fly secrets set SECRET_KEY=$(openssl rand -base64 32)
fly secrets set JWT_SECRET_KEY=$(openssl rand -base64 32)

# Optional: Set CORS origins for your frontend domain
fly secrets set CORS_ORIGINS=https://your-frontend-app.fly.dev
```

### 4. Deploy Backend
```bash
# Deploy the backend
fly deploy

# Check deployment status
fly status

# View logs
fly logs
```

### 5. Test Backend
```bash
# Check health endpoint
curl https://your-backend-app.fly.dev/health

# Test API endpoint
curl https://your-backend-app.fly.dev/api/dashboard/stats
```

## 🎨 Frontend Deployment

### 1. Setup Frontend Branch
```bash
# Switch back to main and create frontend branch
git checkout main
git checkout -b frontend-deploy

# Remove backend directories
rm -rf src/ web/ config/ data/ .venv/
rm requirements.txt *.py fly.toml Dockerfile

# Move frontend to root
mv frontend/* .
rm -rf frontend/

# Use frontend-specific files
mv frontend-fly.toml fly.toml
mv frontend-Dockerfile Dockerfile
cp frontend-only.gitignore .gitignore

# Update package.json scripts if needed
```

### 2. Update Environment Variables
Create `.env.production` file:
```env
VITE_API_BASE_URL=https://your-backend-app.fly.dev
VITE_APP_TITLE=Real Estate Investment Platform
```

### 3. Initialize Frontend Fly App
```bash
# Create the frontend Fly app
fly apps create real-estate-frontend-your-name

# Deploy without building first
fly deploy --no-deploy
```

### 4. Deploy Frontend
```bash
# Deploy the frontend
fly deploy

# Check status
fly status

# View logs
fly logs
```

## 🔧 Configuration Details

### Backend Configuration (fly.toml)
- **Port**: 8080 (configured for Flask/Gunicorn)
- **Health Check**: `/health` endpoint
- **Auto-scaling**: Enabled with min 0 machines
- **Memory**: 256MB (can be increased if needed)

### Frontend Configuration (fly.toml)
- **Port**: 8080 (Nginx serves on this port)
- **Static Files**: Served via Nginx
- **SPA Routing**: Configured to serve index.html for all routes
- **Compression**: Enabled via Nginx

## 🌐 Custom Domains (Optional)

### Backend Domain
```bash
# Add custom domain to backend
fly certs create api.yourdomain.com

# Update DNS
# Create a CNAME record: api.yourdomain.com -> your-backend-app.fly.dev
```

### Frontend Domain
```bash
# Add custom domain to frontend
fly certs create app.yourdomain.com

# Update DNS
# Create a CNAME record: app.yourdomain.com -> your-frontend-app.fly.dev
```

## 📊 Monitoring & Scaling

### View Application Metrics
```bash
# Backend metrics
fly dashboard real-estate-backend-your-name

# Frontend metrics
fly dashboard real-estate-frontend-your-name
```

### Scale Applications
```bash
# Scale backend (increase memory if needed)
fly scale memory 512 --app real-estate-backend-your-name

# Scale frontend
fly scale memory 256 --app real-estate-frontend-your-name

# Set machine count
fly scale count 2 --app real-estate-backend-your-name
```

### View Logs
```bash
# Backend logs
fly logs --app real-estate-backend-your-name

# Frontend logs
fly logs --app real-estate-frontend-your-name

# Follow logs in real-time
fly logs -f --app real-estate-backend-your-name
```

## 🔄 Deployment Workflow

### Updating Backend
```bash
# On main branch, make changes
git checkout main
# ... make backend changes ...

# Deploy to backend branch
git checkout backend-deploy
git merge main
# Resolve conflicts (mainly .gitignore and removed frontend files)
fly deploy --app real-estate-backend-your-name
```

### Updating Frontend
```bash
# On main branch, make changes
git checkout main
# ... make frontend changes ...

# Deploy to frontend branch
git checkout frontend-deploy
git merge main
# Move frontend files to root and resolve conflicts
mv frontend/* . && rm -rf frontend/
fly deploy --app real-estate-frontend-your-name
```

## 🚨 Troubleshooting

### Backend Issues
```bash
# Check backend health
curl https://your-backend-app.fly.dev/health

# SSH into backend machine
fly ssh console --app real-estate-backend-your-name

# View detailed logs
fly logs --app real-estate-backend-your-name
```

### Frontend Issues
```bash
# Check if frontend loads
curl https://your-frontend-app.fly.dev

# Check nginx logs
fly ssh console --app real-estate-frontend-your-name
# Inside machine: tail -f /var/log/nginx/error.log
```

### Common Fixes
1. **Database Issues**: Ensure database files are created on first run
2. **CORS Errors**: Update CORS_ORIGINS environment variable
3. **API Connection**: Verify VITE_API_BASE_URL points to correct backend
4. **Memory Issues**: Scale up memory if applications crash

## 💰 Cost Optimization

- **Auto-stop**: Enabled by default, machines stop when not in use
- **Shared CPU**: Uses shared CPU instances for cost efficiency
- **Min Machines**: Set to 0 to avoid charges when not used
- **Memory**: Start with 256MB, scale up only if needed

Your apps will be available at:
- **Backend**: `https://real-estate-backend-your-name.fly.dev`
- **Frontend**: `https://real-estate-frontend-your-name.fly.dev`

## 🔐 Security Best Practices

1. **Environment Variables**: Never commit secrets to git
2. **HTTPS**: Fly.io provides automatic SSL certificates
3. **CORS**: Configure proper origins for your frontend domain
4. **Headers**: Security headers configured in nginx for frontend
5. **Database**: Consider using Fly.io Postgres for production data persistence
