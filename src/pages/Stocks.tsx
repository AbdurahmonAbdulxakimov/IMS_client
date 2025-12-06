import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { stocksAPI, warehousesAPI, productsAPI } from '../services/api';
import type { Stock, Warehouse, Product } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import Modal from '../components/Modal';

const Stocks = () => {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStock, setEditingStock] = useState<Stock | null>(null);
  const [formData, setFormData] = useState({
    warehouse: '',
    product: '',
    quantity_on_stock: 0,
    minimum_stock_level: 0,
    maximum_stock_level: 0,
  });
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    loadStocks();
    loadWarehouses();
    loadProducts();
  }, []);

  const loadStocks = () => {
    stocksAPI.getAll()
      .then((res) => setStocks(res.data))
      .catch((err) => {
        console.error(err);
        setError('Failed to load stocks');
      })
      .finally(() => setLoading(false));
  };

  const loadWarehouses = () => {
    warehousesAPI.getAll()
      .then((res) => setWarehouses(res.data))
      .catch(console.error);
  };

  const loadProducts = () => {
    productsAPI.getAll()
      .then((res) => setProducts(res.data))
      .catch(console.error);
  };

  const handleOpenModal = (stock?: Stock) => {
    if (stock) {
      setEditingStock(stock);
      setFormData({
        warehouse: stock.warehouse.warehouse_uuid,
        product: stock.product.product_uuid,
        quantity_on_stock: stock.quantity_on_stock,
        minimum_stock_level: stock.minimum_stock_level,
        maximum_stock_level: stock.maximum_stock_level,
      });
    } else {
      setEditingStock(null);
      setFormData({ warehouse: '', product: '', quantity_on_stock: 0, minimum_stock_level: 0, maximum_stock_level: 0 });
    }
    setIsModalOpen(true);
    setError('');
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingStock(null);
    setFormData({ warehouse: '', product: '', quantity_on_stock: 0, minimum_stock_level: 0, maximum_stock_level: 0 });
    setError('');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      if (editingStock) {
        await stocksAPI.update(editingStock.stock_uuid, formData);
        setSuccessMessage('Stock updated successfully');
      } else {
        await stocksAPI.create(formData);
        setSuccessMessage('Stock created successfully');
      }
      handleCloseModal();
      loadStocks();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save stock');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (uuid: string) => {
    if (!confirm('Are you sure you want to delete this stock entry?')) return;

    try {
      await stocksAPI.delete(uuid);
      setSuccessMessage('Stock deleted successfully');
      loadStocks();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete stock');
    }
  };

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

  return (
    <div>
      {error && <div className="messages error" style={{ marginBottom: '20px' }}>{error}</div>}
      {successMessage && <div className="messages success" style={{ marginBottom: '20px' }}>{successMessage}</div>}

      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'flex-end' }}>
        <button
          onClick={() => handleOpenModal()}
          className="button-primary"
          style={{ border: 'none', color: 'white' }}
        >
          + Add Stock
        </button>
      </div>
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
            <th>Actions</th>
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
                <td>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => handleOpenModal(stock)}
                      style={{
                        padding: '4px 12px',
                        fontSize: '14px',
                        borderRadius: '4px',
                        border: '1px solid #d1d5db',
                        background: 'white',
                        cursor: 'pointer',
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(stock.stock_uuid)}
                      style={{
                        padding: '4px 12px',
                        fontSize: '14px',
                        borderRadius: '4px',
                        border: '1px solid #ef4444',
                        background: 'white',
                        color: '#ef4444',
                        cursor: 'pointer',
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {stocks.length === 0 && (
        <EmptyState message="No stocks found" icon="📈" />
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingStock ? 'Edit Stock' : 'Add New Stock'}
      >
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>
              Warehouse *
            </label>
            <select
              value={formData.warehouse}
              onChange={(e) => setFormData({ ...formData, warehouse: e.target.value })}
              required
              disabled={!!editingStock}
              style={{ width: '100%', boxSizing: 'border-box', padding: '8px 12px' }}
            >
              <option value="">Select a warehouse</option>
              {warehouses.map((wh) => (
                <option key={wh.warehouse_uuid} value={wh.warehouse_uuid}>
                  {wh.name} - {wh.location}
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>
              Product *
            </label>
            <select
              value={formData.product}
              onChange={(e) => setFormData({ ...formData, product: e.target.value })}
              required
              disabled={!!editingStock}
              style={{ width: '100%', boxSizing: 'border-box', padding: '8px 12px' }}
            >
              <option value="">Select a product</option>
              {products.map((prod) => (
                <option key={prod.product_uuid} value={prod.product_uuid}>
                  {prod.name}
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>
              Quantity on Stock *
            </label>
            <input
              type="number"
              value={formData.quantity_on_stock}
              onChange={(e) => setFormData({ ...formData, quantity_on_stock: Number(e.target.value) })}
              required
              min="0"
              style={{ width: '100%', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>
                Minimum Level *
              </label>
              <input
                type="number"
                value={formData.minimum_stock_level}
                onChange={(e) => setFormData({ ...formData, minimum_stock_level: Number(e.target.value) })}
                required
                min="0"
                style={{ width: '100%', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>
                Maximum Level *
              </label>
              <input
                type="number"
                value={formData.maximum_stock_level}
                onChange={(e) => setFormData({ ...formData, maximum_stock_level: Number(e.target.value) })}
                required
                min="0"
                style={{ width: '100%', boxSizing: 'border-box' }}
              />
            </div>
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
              {submitting ? 'Saving...' : editingStock ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Stocks;
