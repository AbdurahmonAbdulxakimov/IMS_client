import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { transactionsAPI, stocksAPI, clientsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import type { Transaction, Stock, Client } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import Modal from '../components/Modal';

const Transactions = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    transaction_type: 'sale' as 'sale' | 'return' | 'exchange' | 'arrival',
    stock: '',
    client: '',
    user: '',
    quantity: 0,
    unit_price: '',
    total_amount: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    loadTransactions();
    loadStocks();
    loadClients();
  }, []);

  const loadTransactions = () => {
    transactionsAPI.getAll()
      .then((res) => setTransactions(res.data))
      .catch((err) => {
        console.error(err);
        setError('Failed to load transactions');
      })
      .finally(() => setLoading(false));
  };

  const loadStocks = () => {
    stocksAPI.getAll()
      .then((res) => setStocks(res.data))
      .catch(console.error);
  };

  const loadClients = () => {
    clientsAPI.getAll()
      .then((res) => setClients(res.data))
      .catch(console.error);
  };

  const handleOpenModal = () => {
    setFormData({
      transaction_type: 'sale',
      stock: '',
      client: '',
      user: user?.user_uuid || '',
      quantity: 0,
      unit_price: '',
      total_amount: '',
    });
    setIsModalOpen(true);
    setError('');
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({
      transaction_type: 'sale',
      stock: '',
      client: '',
      user: '',
      quantity: 0,
      unit_price: '',
      total_amount: '',
    });
    setError('');
  };

  const handleQuantityOrPriceChange = (quantity: number, unitPrice: string) => {
    const total = quantity * Number(unitPrice);
    setFormData({
      ...formData,
      quantity,
      unit_price: unitPrice,
      total_amount: total.toFixed(2),
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      await transactionsAPI.create(formData);
      setSuccessMessage('Transaction created successfully');
      handleCloseModal();
      loadTransactions();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create transaction');
    } finally {
      setSubmitting(false);
    }
  };

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

  return (
    <div>
      {error && <div className="messages error" style={{ marginBottom: '20px' }}>{error}</div>}
      {successMessage && <div className="messages success" style={{ marginBottom: '20px' }}>{successMessage}</div>}

      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
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
        <button
          onClick={handleOpenModal}
          className="button-primary"
          style={{ border: 'none', color: 'white', whiteSpace: 'nowrap' }}
        >
          + Add Transaction
        </button>
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

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Add New Transaction"
      >
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>
              Transaction Type *
            </label>
            <select
              value={formData.transaction_type}
              onChange={(e) => setFormData({ ...formData, transaction_type: e.target.value as any })}
              required
              style={{ width: '100%', boxSizing: 'border-box', padding: '8px 12px' }}
            >
              <option value="sale">Sale</option>
              <option value="return">Return</option>
              <option value="exchange">Exchange</option>
              <option value="arrival">Arrival</option>
            </select>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>
              Stock *
            </label>
            <select
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              required
              style={{ width: '100%', boxSizing: 'border-box', padding: '8px 12px' }}
            >
              <option value="">Select a stock</option>
              {stocks.map((stock) => (
                <option key={stock.stock_uuid} value={stock.stock_uuid}>
                  {stock.product.name} - {stock.warehouse.name} (Qty: {stock.quantity_on_stock})
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>
              Client *
            </label>
            <select
              value={formData.client}
              onChange={(e) => setFormData({ ...formData, client: e.target.value })}
              required
              style={{ width: '100%', boxSizing: 'border-box', padding: '8px 12px' }}
            >
              <option value="">Select a client</option>
              {clients.map((client) => (
                <option key={client.client_uuid} value={client.client_uuid}>
                  {client.name} - {client.email}
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>
              Quantity *
            </label>
            <input
              type="number"
              value={formData.quantity}
              onChange={(e) => handleQuantityOrPriceChange(Number(e.target.value), formData.unit_price)}
              required
              min="1"
              style={{ width: '100%', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>
              Unit Price *
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.unit_price}
              onChange={(e) => handleQuantityOrPriceChange(formData.quantity, e.target.value)}
              required
              min="0"
              style={{ width: '100%', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>
              Total Amount
            </label>
            <input
              type="text"
              value={`$${formData.total_amount}`}
              readOnly
              style={{ width: '100%', boxSizing: 'border-box', background: '#f3f4f6', fontWeight: 600 }}
            />
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={handleCloseModal}
              style={{
                padding: '10px 20px',
                borderRadius: '6px',
                border: '1px solid #d1d5db',
                background: 'white',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="button-primary"
              style={{ border: 'none', color: 'white', cursor: submitting ? 'not-allowed' : 'pointer' }}
            >
              {submitting ? 'Creating...' : 'Create Transaction'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Transactions;
