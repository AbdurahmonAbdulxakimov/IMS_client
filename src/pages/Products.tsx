import { useEffect, useState } from 'react';
import { productsAPI } from '../services/api';
import type { Product } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    productsAPI.getAll()
      .then((res) => setProducts(res.data))
      .catch((err) => {
        console.error(err);
        setError('Failed to load products');
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase()) ||
    product.description.toLowerCase().includes(search.toLowerCase()) ||
    product.category.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <LoadingSpinner />;

  if (error) {
    return <div className="messages error">{error}</div>;
  }

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
          style={{ maxWidth: '400px' }}
        />
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
              </tr>
            );
          })}
        </tbody>
      </table>

      {filteredProducts.length === 0 && (
        <EmptyState message="No products found" icon="📦" />
      )}
    </div>
  );
};

export default Products;
