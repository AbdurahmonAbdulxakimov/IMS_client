import { useEffect, useState } from 'react';
import { stocksAPI, transactionsAPI, clientsAPI, productsAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalStocks: 0,
    totalTransactions: 0,
    totalClients: 0,
    totalProducts: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      stocksAPI.getAll(),
      transactionsAPI.getAll(),
      clientsAPI.getAll(),
      productsAPI.getAll(),
    ])
      .then(([stocks, transactions, clients, products]) => {
        setStats({
          totalStocks: stocks.data.length,
          totalTransactions: transactions.data.length,
          totalClients: clients.data.length,
          totalProducts: products.data.length,
        });
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to load dashboard data');
      })
      .finally(() => setLoading(false));
  }, []);

  const statCards = [
    { label: 'Total Products', value: stats.totalProducts, icon: '📦', color: '#6366f1' },
    { label: 'Total Stocks', value: stats.totalStocks, icon: '📈', color: '#8b5cf6' },
    { label: 'Total Clients', value: stats.totalClients, icon: '👥', color: '#10b981' },
    { label: 'Total Transactions', value: stats.totalTransactions, icon: '💳', color: '#f59e0b' },
  ];

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="messages error">
        {error}
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className="card"
            style={{
              borderLeft: `4px solid ${stat.color}`,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>{stat.label}</p>
                <p style={{ margin: '8px 0 0', fontSize: '32px', fontWeight: 600 }}>{stat.value}</p>
              </div>
              <div style={{ fontSize: '48px', opacity: 0.2 }}>{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="card" style={{ marginTop: '24px' }}>
        <h3 style={{ marginTop: 0 }}>Welcome to Inventory Management System</h3>
        <p style={{ color: '#6b7280' }}>
          Use the sidebar to navigate through different sections of the system.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
