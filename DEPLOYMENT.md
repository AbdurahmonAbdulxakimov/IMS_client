# Deployment Guide

## Prerequisites

- Node.js 18+ installed
- Backend API running and accessible
- Environment variables configured

## Environment Configuration

1. Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=https://your-api-domain.com/api
```

For production, create `.env.production`:

```env
VITE_API_BASE_URL=https://api.production.com/api
```

## Build for Production

```bash
# Install dependencies
npm install

# Type check
npm run type-check

# Build for production
npm run build:prod
```

The production build will be in the `dist/` directory.

## Deployment Options

### Option 1: Static Hosting (Netlify, Vercel, etc.)

1. Build the project:
```bash
npm run build:prod
```

2. Deploy the `dist/` folder to your hosting provider

3. Configure redirects for SPA routing:

**Netlify** - Create `public/_redirects`:
```
/*    /index.html   200
```

**Vercel** - Create `vercel.json`:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

### Option 2: Docker

Create `Dockerfile`:

```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build:prod

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Create `nginx.conf`:

```nginx
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://backend:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

Build and run:
```bash
docker build -t ims-frontend .
docker run -p 80:80 ims-frontend
```

### Option 3: Traditional Server (Apache/Nginx)

1. Build the project
2. Copy `dist/` contents to your web server directory
3. Configure server for SPA routing

**Nginx configuration:**
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/ims/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

## Performance Optimization

The production build includes:

- ✅ Code minification
- ✅ Tree shaking
- ✅ Code splitting (React, Axios vendors)
- ✅ Console logs removed
- ✅ Source maps disabled

## Security Checklist

- [ ] HTTPS enabled
- [ ] CORS configured on backend
- [ ] API base URL uses HTTPS
- [ ] Environment variables not committed
- [ ] Content Security Policy configured
- [ ] Rate limiting on API endpoints

## Monitoring

Consider adding:

- Error tracking (Sentry, LogRocket)
- Analytics (Google Analytics, Plausible)
- Performance monitoring (Web Vitals)

## Troubleshooting

### API Connection Issues

1. Check VITE_API_BASE_URL in environment
2. Verify CORS settings on backend
3. Check network tab in browser DevTools

### Routing Issues

Ensure your server is configured to serve `index.html` for all routes (SPA routing).

### Build Errors

Run type check first:
```bash
npm run type-check
```

Clear cache and rebuild:
```bash
rm -rf node_modules dist
npm install
npm run build:prod
```
