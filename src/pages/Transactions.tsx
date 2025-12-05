import { useEffect, useState } from 'react';
import { transactionsAPI } from '../services/api';
import type { Transaction } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

const Transactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [error, setError] = useState('');

  useEffect(() => {
    transactionsAPI.getAll()
      .then((res) => setTransactions(res.data))
      .catch((err) => {
        console.error(err);
        setError('Failed to load transactions');
      })
      .finally(() => setLoading(false));
  }, []);

  const getTypeStyle = (type: string) => {
    const styles: Record<string, { bg: string; text: string }> = {
      sale: { bg: '#d1fae5', text: '#065f46' },
      return: { bg: '#fee2e2', text: '#991b1b' },
      exchange: { bg: '#dbeafe', text: '#1e40af' },
      arrival: { bg: '#fef3c7', text: '#92400e' },
    };
    return styles[type] || styles.sale;
  };

  const getStatusStyle = (status: string) => {
    const styles: Record<string, { bg: string; text: string }> = {
      pending: { bg: '#fef3c7', text: '#92400e' },
      cempleted: { bg: '#d1fae5', text: '#065f46' },
      cancelled: { bg: '#fee2e2', text: '#991b1b' },
    };
    return styles[status] || styles.pending;
  };

  const filteredTransactions = filter === 'all'
    ? transactions
    : transactions.filter((t) => t.transaction_type === filter);

  if (loading) return <LoadingSpinner />;

  if (error) {
    return <div className="messages error">{error}</div>;
  }

  return (
    <div>
      <div style={{ marginBottom: '20px', display: 'flex', gap: '8px' }}>
        {['all', 'sale', 'return', 'exchange', 'arrival'].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              border: '1px solid #d1d5db',
              background: filter === type ? '#6366f1' : 'white',
              color: filter === type ? 'white' : '#374151',
              cursor: 'pointer',
              textTransform: 'capitalize',
            }}
          >
            {type}
          </button>
        ))}
      </div>

      <table>
        <thead>
          <tr>
            <th>Type</th>
            <th>Product</th>
            <th>Client</th>
            <th>Quantity</th>
            <th>Unit Price</th>
            <th>Total Amount</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {filteredTransactions.map((transaction) => {
            const typeStyle = getTypeStyle(transaction.transaction_type);
            const statusStyle = getStatusStyle(transaction.status);
            return (
              <tr key={transaction.transaction_uuid}>
                <td>
                  <span className="badge" style={{ background: typeStyle.bg, color: typeStyle.text }}>
                    {transaction.transaction_type}
                  </span>
                </td>
                <td style={{ fontWeight: 500 }}>{transaction.stock.product.name}</td>
                <td>{transaction.client.name}</td>
                <td>{transaction.quantity}</td>
                <td>${Number(transaction.unit_price).toFixed(2)}</td>
                <td style={{ fontWeight: 600 }}>${Number(transaction.total_amount).toFixed(2)}</td>
                <td>
                  <span className="badge" style={{ background: statusStyle.bg, color: statusStyle.text }}>
                    {transaction.status}
                  </span>
                </td>
                <td>{new Date(transaction.transaction_time).toLocaleString()}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {filteredTransactions.length === 0 && (
        <EmptyState message="No transactions found" icon="💳" />
      )}
    </div>
  );
};

export default Transactions;
