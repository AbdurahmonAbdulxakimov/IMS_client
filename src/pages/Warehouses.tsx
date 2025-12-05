import { useEffect, useState } from 'react';
import { warehousesAPI } from '../services/api';
import type { Warehouse } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

const Warehouses = () => {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    warehousesAPI.getAll()
      .then((res) => setWarehouses(res.data))
      .catch((err) => {
        console.error(err);
        setError('Failed to load warehouses');
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  if (error) {
    return <div className="messages error">{error}</div>;
  }

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Location</th>
            <th>Description</th>
            <th>Total Capacity</th>
            <th>Available Capacity</th>
            <th>Usage</th>
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
              </tr>
            );
          })}
        </tbody>
      </table>

      {warehouses.length === 0 && (
        <EmptyState message="No warehouses found" icon="🏢" />
      )}
    </div>
  );
};

export default Warehouses;
