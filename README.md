# Inventory Management System (IMS)

A production-ready, minimalistic dashboard application for managing inventory, stocks, transactions, clients, and warehouses.

## ✨ Features

- **🔐 Authentication**: Secure login with JWT tokens and automatic refresh
- **📊 Dashboard**: Real-time overview with key statistics
- **👤 Profile**: View user profile and account information
- **👥 Clients**: Manage company clients with advanced search
- **🏢 Warehouses**: Track warehouse capacity and utilization
- **📦 Products**: Browse products with categories and pricing
- **📈 Stocks**: Monitor stock levels with intelligent status indicators
- **💳 Transactions**: Complete transaction history with filtering

## 🚀 Tech Stack

- **React 19** + TypeScript
- **React Router** for navigation
- **Axios** for API communication
- **Vite** for blazing fast builds
- **Custom CSS** inspired by django-unfold

## 📋 Prerequisites

- Node.js 18 or higher
- npm or yarn
- Backend API running (see API Configuration)

## 🛠️ Quick Start

1. **Clone and install dependencies:**
```bash
git clone <repository-url>
cd ims
npm install
```

2. **Configure environment:**
```bash
cp .env.example .env
# Edit .env and set VITE_API_BASE_URL
```

3. **Start development server:**
```bash
npm run dev
```

4. **Open browser:**
```
http://localhost:5173
```

## 📦 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run build:prod   # Build with production optimizations
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:8000/api
```

For production, create `.env.production`:

```env
VITE_API_BASE_URL=https://api.yourdomain.com/api
```

### API Configuration

The application expects a backend API with the following endpoints:

**Authentication:**
- `POST /auth/token/` - Login
- `POST /auth/token/refresh/` - Refresh token
- `GET /auth/users/me/` - Get current user

**Resources:**
- `/clients/clients/` - Clients management
- `/inventory/warehouses/` - Warehouses management
- `/inventory/products/` - Products listing
- `/inventory/stocks/` - Stocks management
- `/inventory/transactions/` - Transactions history

See `swagger.json` for complete API documentation.

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout.tsx      # Main layout with sidebar
│   ├── ErrorBoundary.tsx
│   ├── LoadingSpinner.tsx
│   └── EmptyState.tsx
├── context/            # React context providers
│   └── AuthContext.tsx # Authentication state
├── pages/              # Page components
│   ├── Dashboard.tsx
│   ├── Profile.tsx
│   ├── Clients.tsx
│   ├── Warehouses.tsx
│   ├── Products.tsx
│   ├── Stocks.tsx
│   └── Transactions.tsx
├── services/           # API service layer
│   └── api.ts         # Axios configuration
├── types/              # TypeScript definitions
│   └── index.ts
├── utils/              # Utility functions
│   └── formatters.ts
└── unfold-custom.css   # Custom styling
```

## 🐳 Docker Deployment

Build and run with Docker:

```bash
# Build image
docker build -t ims-frontend .

# Run container
docker run -p 3000:80 ims-frontend

# Or use docker-compose
docker-compose up -d
```

## 🚢 Production Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions including:
- Static hosting (Netlify, Vercel)
- Docker deployment
- Traditional server setup (Nginx, Apache)
- Environment configuration
- Security checklist

## 🧪 Testing

See [TESTING.md](TESTING.md) for comprehensive testing guide including:
- Manual testing checklist
- API testing scenarios
- Browser compatibility
- Performance testing
- Security testing

## 🎨 Features Highlights

### Smart Error Handling
- Network error detection
- Automatic token refresh
- User-friendly error messages
- Error boundaries for crash recovery

### Performance Optimized
- Code splitting
- Lazy loading
- Minified production builds
- Gzip compression
- Asset caching

### User Experience
- Loading states for all async operations
- Empty states with helpful messages
- Responsive design (mobile, tablet, desktop)
- Smooth transitions and animations
- Intuitive navigation

### Security
- JWT token authentication
- Automatic token refresh
- Protected routes
- XSS protection
- Secure headers (in nginx config)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and type checking
5. Submit a pull request

## 📄 License

See LICENSE file for details.

## 🆘 Support

For issues and questions:
1. Check [TESTING.md](TESTING.md) for common issues
2. Review [DEPLOYMENT.md](DEPLOYMENT.md) for deployment problems
3. Open an issue on GitHub

## 🔮 Future Enhancements

- [ ] Unit and integration tests
- [ ] E2E testing with Playwright
- [ ] Real-time updates with WebSockets
- [ ] Advanced filtering and sorting
- [ ] Export functionality (CSV, PDF)
- [ ] Dark mode support
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
