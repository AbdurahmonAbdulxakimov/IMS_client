import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { categoriesAPI } from '../services/api';
import type { ProductCategory } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import Modal from '../components/Modal';

const Categories = () => {
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ProductCategory | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = () => {
    categoriesAPI
      .getAll()
      .then((res) => setCategories(res.data))
      .catch((err) => {
        console.error(err);
        setError('Failed to load categories');
      })
      .finally(() => setLoading(false));
  };

  const handleOpenModal = (category?: ProductCategory) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        description: category.description,
      });
    } else {
      setEditingCategory(null);
      setFormData({ name: '', description: '' });
    }
    setIsModalOpen(true);
    setError('');
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    setFormData({ name: '', description: '' });
    setError('');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      if (editingCategory) {
        await categoriesAPI.update(editingCategory.category_uuid, formData);
        setSuccessMessage('Category updated successfully');
      } else {
        await categoriesAPI.create(formData);
        setSuccessMessage('Category created successfully');
      }
      handleCloseModal();
      loadCategories();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save category');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (uuid: string) => {
    if (!confirm('Are you sure you want to delete this category? This may affect products using this category.')) return;

    try {
      await categoriesAPI.delete(uuid);
      setSuccessMessage('Category deleted successfully');
      loadCategories();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete category');
    }
  };

  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(search.toLowerCase()) ||
      category.description.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      {error && (
        <div className="messages error" style={{ marginBottom: '20px' }}>
          {error}
        </div>
      )}
      {successMessage && (
        <div className="messages success" style={{ marginBottom: '20px' }}>
          {successMessage}
        </div>
      )}

      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
        <input
          type="text"
          placeholder="Search categories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
          style={{ flex: 1, maxWidth: '400px' }}
        />
        <button onClick={() => handleOpenModal()} className="button-primary" style={{ border: 'none', color: 'white', whiteSpace: 'nowrap' }}>
          + Add Category
        </button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredCategories.map((category) => (
            <tr key={category.category_uuid}>
              <td style={{ fontWeight: 500 }}>{category.name}</td>
              <td>{category.description}</td>
              <td>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => handleOpenModal(category)}
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
                    onClick={() => handleDelete(category.category_uuid)}
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
          ))}
        </tbody>
      </table>

      {filteredCategories.length === 0 && <EmptyState message="No categories found" icon="🏷️" />}

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingCategory ? 'Edit Category' : 'Add New Category'}>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              style={{ width: '100%', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>Description *</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              rows={4}
              style={{ width: '100%', boxSizing: 'border-box' }}
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
              {submitting ? 'Saving...' : editingCategory ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Categories;
