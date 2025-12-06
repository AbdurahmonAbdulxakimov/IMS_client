# Inventory Management System (IMS)

A production-ready, minimalistic dashboard application for managing inventory, stocks, transactions, clients, and warehouses.

## ✨ Features

- **🔐 Authentication**: Secure login with JWT tokens and automatic refresh
- **📊 Dashboard**: Real-time overview with key statistics
- **👤 Profile**: View user profile and account information
- **👥 Clients**: Full CRUD operations - Create, Read, Update, Delete clients with advanced search
- **🏢 Warehouses**: Create and manage warehouses with capacity tracking
- **📦 Products**: Add and edit products with categories and pricing
- **🏷️ Categories**: Manage product categories with full CRUD operations
- **📈 Stocks**: Create and update stock levels with intelligent status indicators
- **💳 Transactions**: Create new transactions (sale, return, exchange, arrival) with automatic calculations

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

Note: `swagger.json` can be found in backend api through the url `/swagger.json`.

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
