import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { productsAPI, categoriesAPI } from '../services/api';
import type { Product, ProductCategory } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import Modal from '../components/Modal';

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    prime_cost: '',
    price: '',
    category_id: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  const loadProducts = () => {
    productsAPI.getAll()
      .then((res) => setProducts(res.data))
      .catch((err) => {
        console.error(err);
        setError('Failed to load products');
      })
      .finally(() => setLoading(false));
  };

  const loadCategories = () => {
    categoriesAPI.getAll()
      .then((res) => setCategories(res.data))
      .catch(console.error);
  };

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        description: product.description,
        prime_cost: product.prime_cost,
        price: product.price,
        category_id: product.category.category_uuid,
      });
    } else {
      setEditingProduct(null);
      setFormData({ name: '', description: '', prime_cost: '', price: '', category_id: '' });
    }
    setIsModalOpen(true);
    setError('');
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setFormData({ name: '', description: '', prime_cost: '', price: '', category_id: '' });
    setError('');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        prime_cost: formData.prime_cost,
        price: formData.price,
        category: formData.category_id,
      };

      if (editingProduct) {
        await productsAPI.update(editingProduct.product_uuid, payload);
        setSuccessMessage('Product updated successfully');
      } else {
        await productsAPI.create(payload);
        setSuccessMessage('Product created successfully');
      }
      handleCloseModal();
      loadProducts();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save product');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (uuid: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      await productsAPI.delete(uuid);
      setSuccessMessage('Product deleted successfully');
      loadProducts();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete product');
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase()) ||
    product.description.toLowerCase().includes(search.toLowerCase()) ||
    product.category.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      {error && <div className="messages error" style={{ marginBottom: '20px' }}>{error}</div>}
      {successMessage && <div className="messages success" style={{ marginBottom: '20px' }}>{successMessage}</div>}

      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
          style={{ flex: 1, maxWidth: '400px' }}
        />
        <button
          onClick={() => handleOpenModal()}
          className="button-primary"
          style={{ border: 'none', color: 'white', whiteSpace: 'nowrap' }}
        >
          + Add Product
        </button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Category</th>
            <th>Prime Cost</th>
            <th>Price</th>
            <th>Margin</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((product) => {
            const margin = ((Number(product.price) - Number(product.prime_cost)) / Number(product.prime_cost) * 100).toFixed(1);
            return (
              <tr key={product.product_uuid}>
                <td style={{ fontWeight: 500 }}>{product.name}</td>
                <td>{product.description}</td>
                <td>
                  <span className="badge" style={{ background: '#f3f4f6', color: '#374151' }}>
                    {product.category.name}
                  </span>
                </td>
                <td>${Number(product.prime_cost).toFixed(2)}</td>
                <td>${Number(product.price).toFixed(2)}</td>
                <td>
                  <span className="badge" style={{ background: '#d1fae5', color: '#065f46' }}>
                    {margin}%
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => handleOpenModal(product)}
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
                      onClick={() => handleDelete(product.product_uuid)}
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

      {filteredProducts.length === 0 && (
        <EmptyState message="No products found" icon="📦" />
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingProduct ? 'Edit Product' : 'Add New Product'}
      >
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>
              Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              style={{ width: '100%', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              rows={3}
              style={{ width: '100%', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>
              Category *
            </label>
            <select
              value={formData.category_id}
              onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
              required
              style={{ width: '100%', boxSizing: 'border-box', padding: '8px 12px' }}
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.category_uuid} value={cat.category_uuid}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>
                Prime Cost *
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.prime_cost}
                onChange={(e) => setFormData({ ...formData, prime_cost: e.target.value })}
                required
                min="0"
                style={{ width: '100%', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>
                Price *
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
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
              {submitting ? 'Saving...' : editingProduct ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Products;
