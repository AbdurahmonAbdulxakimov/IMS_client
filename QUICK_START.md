# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

```bash
# Copy example env file
cp .env.example .env

# Edit .env and set your API URL
# VITE_API_BASE_URL=http://localhost:8000/api
```

### 3. Start Development Server

```bash
npm run dev
```

Open http://localhost:5173 in your browser.

### 4. Login

Use your backend credentials to login. The app will:
- Store JWT tokens securely
- Cache user data in localStorage
- Redirect to dashboard

## 📋 Common Commands

```bash
# Development
npm run dev              # Start dev server
npm run type-check       # Check TypeScript types
npm run lint             # Run ESLint

# Production
npm run build            # Build for production
npm run build:prod       # Build with optimizations
npm run preview          # Preview production build

# Docker
docker-compose up -d     # Start with Docker
docker-compose down      # Stop Docker containers
```

## 🔑 Key Features

### Authentication
- Login at `/login`
- Automatic token refresh
- Persistent sessions (localStorage)
- Secure logout

### Navigation
- **Dashboard** (`/`) - Overview statistics
- **Profile** (`/profile`) - User information
- **Clients** (`/clients`) - Client management
- **Warehouses** (`/warehouses`) - Warehouse tracking
- **Products** (`/products`) - Product catalog
- **Stocks** (`/stocks`) - Stock levels
- **Transactions** (`/transactions`) - Transaction history

## 🎯 Quick Tips

### Search Functionality
- **Clients**: Search by name, email, phone, or address
- **Products**: Search by name, description, or category

### Filtering
- **Transactions**: Filter by type (sale, return, exchange, arrival)

### Status Indicators
- **Stocks**: 
  - 🔴 Low Stock (quantity ≤ minimum)
  - 🟡 Overstock (quantity ≥ maximum)
  - 🟢 Normal (between min and max)

### Warehouse Capacity
- Visual progress bars
- Color-coded by usage:
  - Green: < 60%
  - Yellow: 60-80%
  - Red: > 80%

## 🐛 Troubleshooting

### Can't connect to API?
1. Check `VITE_API_BASE_URL` in `.env`
2. Ensure backend is running
3. Check browser console for errors
4. Verify CORS settings on backend

### Login not working?
1. Verify credentials
2. Check network tab in DevTools
3. Ensure backend `/auth/token/` endpoint is accessible
4. Clear localStorage and try again

### Page refresh loses data?
This shouldn't happen! User data is stored in localStorage.
If it does:
1. Check browser console for errors
2. Verify localStorage is enabled
3. Check if storage quota is exceeded

### Build errors?
```bash
# Clear everything and rebuild
rm -rf node_modules dist
npm install
npm run type-check
npm run build
```

## 📱 Mobile Access

The app is fully responsive. Access from:
- Desktop browsers
- Tablets
- Mobile phones

## 🔐 Security Notes

- Never commit `.env` files
- Use HTTPS in production
- Keep dependencies updated
- Review CORS settings
- Enable security headers (see nginx.conf)

## 📊 Performance

Expected load times:
- Initial load: < 3 seconds
- Page navigation: Instant
- API calls: Depends on backend

## 🆘 Need Help?

1. Check [README.md](README.md) for detailed info
2. Review [TESTING.md](TESTING.md) for testing guide
3. See [DEPLOYMENT.md](DEPLOYMENT.md) for deployment
4. Check [CHANGELOG.md](CHANGELOG.md) for features

## 🎉 You're Ready!

Your Inventory Management System is now running. Start by:
1. Logging in with your credentials
2. Exploring the dashboard
3. Managing your inventory

Happy managing! 🚀
