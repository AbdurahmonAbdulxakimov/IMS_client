import { useEffect, useState } from 'react';
import { stocksAPI } from '../services/api';
import type { Stock } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

const Stocks = () => {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    stocksAPI.getAll()
      .then((res) => setStocks(res.data))
      .catch((err) => {
        console.error(err);
        setError('Failed to load stocks');
      })
      .finally(() => setLoading(false));
  }, []);

  const getStockStatus = (stock: Stock) => {
    if (stock.quantity_on_stock <= stock.minimum_stock_level) {
      return { label: 'Low Stock', color: '#fee2e2', textColor: '#991b1b' };
    }
    if (stock.quantity_on_stock >= stock.maximum_stock_level) {
      return { label: 'Overstock', color: '#fef3c7', textColor: '#92400e' };
    }
    return { label: 'Normal', color: '#d1fae5', textColor: '#065f46' };
  };

  if (loading) return <LoadingSpinner />;

  if (error) {
    return <div className="messages error">{error}</div>;
  }

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Product</th>
            <th>Warehouse</th>
            <th>Quantity</th>
            <th>Min Level</th>
            <th>Max Level</th>
            <th>Status</th>
            <th>Last Updated</th>
          </tr>
        </thead>
        <tbody>
          {stocks.map((stock) => {
            const status = getStockStatus(stock);
            return (
              <tr key={stock.stock_uuid}>
                <td style={{ fontWeight: 500 }}>{stock.product.name}</td>
                <td>{stock.warehouse.name}</td>
                <td>{stock.quantity_on_stock}</td>
                <td>{stock.minimum_stock_level}</td>
                <td>{stock.maximum_stock_level}</td>
                <td>
                  <span className="badge" style={{ background: status.color, color: status.textColor }}>
                    {status.label}
                  </span>
                </td>
                <td>{new Date(stock.last_updated).toLocaleString()}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {stocks.length === 0 && (
        <EmptyState message="No stocks found" icon="📈" />
      )}
    </div>
  );
};

export default Stocks;
