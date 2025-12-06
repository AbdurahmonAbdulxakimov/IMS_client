import type { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/', label: 'Dashboard', icon: '📊' },
    { path: '/profile', label: 'Profile', icon: '👤' },
    { path: '/clients', label: 'Clients', icon: '👥' },
    { path: '/warehouses', label: 'Warehouses', icon: '🏢' },
    { path: '/products', label: 'Products', icon: '📦' },
    { path: '/categories', label: 'Categories', icon: '🏷️' },
    { path: '/stocks', label: 'Stocks', icon: '📈' },
    { path: '/transactions', label: 'Transactions', icon: '💳' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <aside className="sidebar" style={{ width: '240px', padding: '20px 0' }}>
        <div style={{ padding: '0 16px 24px', borderBottom: '1px solid #e5e7eb' }}>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 600 }}>IMS</h2>
          <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#6b7280' }}>
            Inventory System
          </p>
        </div>
        <nav style={{ marginTop: '16px' }}>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="sidebar-link"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                textDecoration: 'none',
                fontWeight: location.pathname === item.path ? 600 : 400,
                backgroundColor: location.pathname === item.path ? '#f3f4f6' : 'transparent',
              }}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <header className="header" style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 600 }}>
            {navItems.find(item => item.path === location.pathname)?.label || 'Dashboard'}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontSize: '14px', color: '#6b7280' }}>
              {user?.username} ({user?.role})
            </span>
            <button
              onClick={handleLogout}
              style={{
                padding: '8px 16px',
                borderRadius: '6px',
                border: '1px solid #d1d5db',
                background: 'white',
                cursor: 'pointer',
                fontSize: '14px',
              }}
            >
              Logout
            </button>
          </div>
        </header>

        <main className="content" style={{ flex: 1, margin: '20px' }}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
