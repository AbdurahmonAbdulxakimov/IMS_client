# Production Deployment Checklist

## Pre-Deployment

### Code Quality
- [x] TypeScript compilation passes (`npm run type-check`)
- [x] No ESLint errors (`npm run lint`)
- [x] Production build succeeds (`npm run build:prod`)
- [x] All imports are correct
- [x] No console.log in production code
- [x] Error boundaries implemented
- [x] Loading states for all async operations

### Configuration
- [ ] `.env.production` file created
- [ ] `VITE_API_BASE_URL` points to production API
- [ ] API URL uses HTTPS
- [ ] Environment variables not committed to git
- [ ] `.gitignore` includes `.env*` files

### Security
- [ ] HTTPS enabled on hosting
- [ ] CORS configured on backend
- [ ] JWT tokens stored securely
- [ ] XSS protection enabled
- [ ] Content Security Policy configured
- [ ] Security headers in nginx.conf
- [ ] No sensitive data in localStorage
- [ ] API endpoints use authentication

### Performance
- [x] Code splitting enabled
- [x] Assets minified
- [x] Gzip compression configured
- [x] Images optimized (if any)
- [ ] CDN configured (optional)
- [x] Caching headers set
- [ ] Performance monitoring setup (optional)

### Testing
- [ ] Manual testing completed (see TESTING.md)
- [ ] All pages load correctly
- [ ] Authentication flow works
- [ ] Search functionality tested
- [ ] Filters work correctly
- [ ] Error states display properly
- [ ] Mobile responsive verified
- [ ] Cross-browser tested

## Deployment Steps

### Option 1: Docker Deployment

```bash
# 1. Build Docker image
docker build -t ims-frontend:latest .

# 2. Test locally
docker run -p 3000:80 ims-frontend:latest

# 3. Verify at http://localhost:3000

# 4. Push to registry (if using)
docker tag ims-frontend:latest registry.example.com/ims-frontend:latest
docker push registry.example.com/ims-frontend:latest

# 5. Deploy to production server
docker-compose up -d
```

### Option 2: Static Hosting (Netlify/Vercel)

```bash
# 1. Build production bundle
npm run build:prod

# 2. Test preview
npm run preview

# 3. Deploy dist/ folder to hosting
# - Netlify: drag & drop or CLI
# - Vercel: vercel deploy
```

### Option 3: Traditional Server

```bash
# 1. Build production bundle
npm run build:prod

# 2. Copy dist/ to server
scp -r dist/* user@server:/var/www/ims/

# 3. Configure nginx (see nginx.conf)

# 4. Restart nginx
sudo systemctl restart nginx
```

## Post-Deployment

### Verification
- [ ] Production URL accessible
- [ ] HTTPS working (no mixed content warnings)
- [ ] Login functionality works
- [ ] API calls successful
- [ ] All pages load correctly
- [ ] No console errors
- [ ] Mobile view works
- [ ] Performance acceptable (< 3s load time)

### Monitoring
- [ ] Error tracking configured (Sentry, etc.)
- [ ] Analytics setup (optional)
- [ ] Uptime monitoring (optional)
- [ ] Performance monitoring (optional)
- [ ] Log aggregation (optional)

### Documentation
- [ ] Update README with production URL
- [ ] Document deployment process
- [ ] Share credentials securely
- [ ] Update API documentation
- [ ] Create user guide (optional)

## Health Checks

### Application Health
```bash
# Check if app is running
curl https://your-domain.com/

# Check health endpoint (if configured)
curl https://your-domain.com/health
```

### API Connectivity
```bash
# Test API connection
curl https://your-api-domain.com/api/

# Test authentication
curl -X POST https://your-api-domain.com/api/auth/token/ \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"test"}'
```

## Rollback Plan

If deployment fails:

### Docker
```bash
# Rollback to previous version
docker-compose down
docker pull registry.example.com/ims-frontend:previous
docker-compose up -d
```

### Static Hosting
- Netlify: Use rollback feature in dashboard
- Vercel: Revert to previous deployment

### Traditional Server
```bash
# Restore previous version
cp -r /var/www/ims-backup/* /var/www/ims/
sudo systemctl restart nginx
```

## Common Issues

### Issue: White screen after deployment
**Solution:**
- Check browser console for errors
- Verify API URL in environment variables
- Check CORS settings on backend
- Ensure all assets loaded correctly

### Issue: API calls failing
**Solution:**
- Verify VITE_API_BASE_URL is correct
- Check CORS configuration
- Ensure backend is accessible
- Check network tab in DevTools

### Issue: Authentication not working
**Solution:**
- Clear localStorage
- Check JWT token format
- Verify backend authentication endpoint
- Check token expiration settings

### Issue: Slow performance
**Solution:**
- Enable gzip compression
- Check CDN configuration
- Optimize images
- Review bundle size
- Enable caching headers

## Maintenance

### Regular Tasks
- [ ] Update dependencies monthly
- [ ] Review error logs weekly
- [ ] Monitor performance metrics
- [ ] Backup configuration files
- [ ] Review security updates

### Updates
```bash
# Update dependencies
npm update

# Check for security vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix
```

## Support Contacts

- **Frontend Issues**: [Your contact]
- **Backend Issues**: [Backend team contact]
- **Infrastructure**: [DevOps contact]
- **Emergency**: [Emergency contact]

## Success Criteria

Deployment is successful when:
- ✅ Application loads without errors
- ✅ Users can login successfully
- ✅ All features work as expected
- ✅ Performance meets requirements
- ✅ No critical errors in logs
- ✅ Mobile experience is smooth
- ✅ Security measures in place

---

**Deployment Date**: _____________

**Deployed By**: _____________

**Version**: 1.0.0

**Notes**: _____________
