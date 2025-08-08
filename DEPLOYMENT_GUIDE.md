# Deployment Branch Setup Guide

This guide explains how to set up separate branches for deploying the backend and frontend independently.

## 📁 Repository Structure

```
main branch (development)
├── backend-deploy branch (backend only)
└── frontend-deploy branch (frontend only)
```

## 🚀 Backend Branch Setup

### 1. Create Backend Deploy Branch
```bash
# Create and switch to backend branch
git checkout -b backend-deploy

# Remove frontend directory
rm -rf frontend/

# Copy backend-specific .gitignore
cp backend-only.gitignore .gitignore

# Remove frontend-specific files
rm frontend-only.gitignore

# Commit changes
git add .
git commit -m "Setup backend-only deployment branch"

# Push to GitHub
git push origin backend-deploy
```

### 2. Backend Deployment Files

The backend branch will contain:
- `src/` - Core Python business logic
- `web/` - Flask web application
- `config/` - Configuration files
- `data/` - Database and data files
- `requirements.txt` - Python dependencies
- Backend documentation files

### 3. Backend Environment Variables
Create a `.env` file for production:
```env
FLASK_ENV=production
SECRET_KEY=your-secret-key-here
JWT_SECRET_KEY=your-jwt-secret-here
DATABASE_URL=your-database-url
CORS_ORIGINS=https://your-frontend-domain.com
```

## 🎨 Frontend Branch Setup

### 1. Create Frontend Deploy Branch
```bash
# Switch back to main
git checkout main

# Create and switch to frontend branch
git checkout -b frontend-deploy

# Remove backend directories
rm -rf src/ web/ config/ data/
rm -rf .venv/
rm requirements.txt run_web.py start_web.py main.py example.py

# Move frontend contents to root
mv frontend/* .
rm -rf frontend/

# Copy frontend-specific .gitignore
cp frontend-only.gitignore .gitignore

# Remove backend-specific files
rm backend-only.gitignore

# Update package.json if needed
# (adjust any relative paths if necessary)

# Commit changes
git add .
git commit -m "Setup frontend-only deployment branch"

# Push to GitHub
git push origin frontend-deploy
```

### 2. Frontend Deployment Files

The frontend branch will contain:
- `src/` - React source code
- `public/` - Static assets
- `package.json` - Node.js dependencies
- `vite.config.js` - Build configuration
- Frontend documentation files

### 3. Frontend Environment Variables
Create a `.env` file for production:
```env
VITE_API_BASE_URL=https://your-backend-domain.com
VITE_APP_TITLE=Real Estate Investment Platform
```

## 🔧 Deployment Platforms

### Backend Deployment Options:
1. **Heroku**: Easy Python/Flask deployment
2. **Railway**: Modern alternative to Heroku
3. **DigitalOcean App Platform**: Scalable option
4. **AWS Elastic Beanstalk**: AWS managed service
5. **Google Cloud Run**: Serverless container deployment

### Frontend Deployment Options:
1. **Vercel**: Optimized for React/Vite
2. **Netlify**: Great for static sites with forms
3. **GitHub Pages**: Free for public repos
4. **AWS S3 + CloudFront**: Scalable CDN
5. **Firebase Hosting**: Google's hosting solution

## 🔄 Workflow for Updates

### Updating Backend:
```bash
# On main branch, make your changes
git checkout main
# ... make changes to backend code ...

# Merge to backend branch
git checkout backend-deploy
git merge main
# Resolve any conflicts (mainly .gitignore)
git push origin backend-deploy
```

### Updating Frontend:
```bash
# On main branch, make your changes
git checkout main
# ... make changes to frontend code ...

# Merge to frontend branch
git checkout frontend-deploy
git merge main
# Resolve any conflicts and move files if needed
git push origin frontend-deploy
```

## 📋 Pre-Deployment Checklist

### Backend:
- [ ] Update `requirements.txt`
- [ ] Set environment variables
- [ ] Configure database connection
- [ ] Update CORS origins
- [ ] Test API endpoints
- [ ] Configure logging

### Frontend:
- [ ] Update API base URL
- [ ] Build and test production bundle
- [ ] Optimize assets
- [ ] Configure routing for SPA
- [ ] Test authentication flow
- [ ] Verify all environment variables

## 🔐 Security Considerations

### Backend:
- Use environment variables for secrets
- Configure proper CORS origins
- Use HTTPS in production
- Implement rate limiting
- Set up proper logging

### Frontend:
- Never expose API keys in frontend code
- Use HTTPS for all API calls
- Implement proper error handling
- Configure CSP headers
- Optimize bundle size

## 📊 Monitoring & Maintenance

### Backend:
- Monitor API response times
- Track error rates
- Monitor database performance
- Set up health checks
- Configure backup strategies

### Frontend:
- Monitor page load times
- Track user interactions
- Monitor build sizes
- Set up error tracking
- Configure analytics

This setup allows you to deploy and scale your backend and frontend independently while maintaining a unified development experience on the main branch.
