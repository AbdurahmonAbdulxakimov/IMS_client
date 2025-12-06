import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { warehousesAPI } from '../services/api';
import type { Warehouse } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import Modal from '../components/Modal';

const Warehouses = () => {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWarehouse, setEditingWarehouse] = useState<Warehouse | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    total_capacity: 0,
    available_capacity: 0,
  });
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    loadWarehouses();
  }, []);

  const loadWarehouses = () => {
    warehousesAPI.getAll()
      .then((res) => setWarehouses(res.data))
      .catch((err) => {
        console.error(err);
        setError('Failed to load warehouses');
      })
      .finally(() => setLoading(false));
  };

  const handleOpenModal = (warehouse?: Warehouse) => {
    if (warehouse) {
      setEditingWarehouse(warehouse);
      setFormData({
        name: warehouse.name,
        description: warehouse.description || '',
        location: warehouse.location,
        total_capacity: warehouse.total_capacity,
        available_capacity: warehouse.available_capacity,
      });
    } else {
      setEditingWarehouse(null);
      setFormData({ name: '', description: '', location: '', total_capacity: 0, available_capacity: 0 });
    }
    setIsModalOpen(true);
    setError('');
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingWarehouse(null);
    setFormData({ name: '', description: '', location: '', total_capacity: 0, available_capacity: 0 });
    setError('');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      if (editingWarehouse) {
        await warehousesAPI.update(editingWarehouse.warehouse_uuid, formData);
        setSuccessMessage('Warehouse updated successfully');
      } else {
        await warehousesAPI.create(formData);
        setSuccessMessage('Warehouse created successfully');
      }
      handleCloseModal();
      loadWarehouses();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save warehouse');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (uuid: string) => {
    if (!confirm('Are you sure you want to delete this warehouse?')) return;

    try {
      await warehousesAPI.delete(uuid);
      setSuccessMessage('Warehouse deleted successfully');
      loadWarehouses();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete warehouse');
    }
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
          + Add Warehouse
        </button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Location</th>
            <th>Description</th>
            <th>Total Capacity</th>
            <th>Available Capacity</th>
            <th>Usage</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {warehouses.map((warehouse) => {
            const usagePercent = ((warehouse.total_capacity - warehouse.available_capacity) / warehouse.total_capacity * 100).toFixed(1);
            return (
              <tr key={warehouse.warehouse_uuid}>
                <td style={{ fontWeight: 500 }}>{warehouse.name}</td>
                <td>{warehouse.location}</td>
                <td>{warehouse.description || 'N/A'}</td>
                <td>{warehouse.total_capacity}</td>
                <td>{warehouse.available_capacity}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ flex: 1, height: '8px', background: '#e5e7eb', borderRadius: '4px', overflow: 'hidden' }}>
                      <div
                        style={{
                          width: `${usagePercent}%`,
                          height: '100%',
                          background: Number(usagePercent) > 80 ? '#ef4444' : Number(usagePercent) > 60 ? '#f59e0b' : '#10b981',
                          transition: 'width 0.3s',
                        }}
                      />
                    </div>
                    <span style={{ fontSize: '12px', color: '#6b7280', minWidth: '45px' }}>{usagePercent}%</span>
                  </div>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => handleOpenModal(warehouse)}
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
                      onClick={() => handleDelete(warehouse.warehouse_uuid)}
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

      {warehouses.length === 0 && (
        <EmptyState message="No warehouses found" icon="🏢" />
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingWarehouse ? 'Edit Warehouse' : 'Add New Warehouse'}
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
              Location *
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              required
              style={{ width: '100%', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              style={{ width: '100%', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>
                Total Capacity *
              </label>
              <input
                type="number"
                value={formData.total_capacity}
                onChange={(e) => setFormData({ ...formData, total_capacity: Number(e.target.value) })}
                required
                min="0"
                style={{ width: '100%', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>
                Available Capacity *
              </label>
              <input
                type="number"
                value={formData.available_capacity}
                onChange={(e) => setFormData({ ...formData, available_capacity: Number(e.target.value) })}
                required
                min="0"
                max={formData.total_capacity}
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
              {submitting ? 'Saving...' : editingWarehouse ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Warehouses;
