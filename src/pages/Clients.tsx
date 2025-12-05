import { useEffect, useState } from 'react';
import { clientsAPI } from '../services/api';
import type { Client } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

const Clients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = () => {
    clientsAPI.getAll()
      .then((res) => setClients(res.data))
      .catch((err) => {
        console.error(err);
        setError('Failed to load clients');
      })
      .finally(() => setLoading(false));
  };

  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(search.toLowerCase()) ||
    client.email.toLowerCase().includes(search.toLowerCase()) ||
    client.phone.includes(search) ||
    client.address.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <LoadingSpinner />;

  if (error) {
    return <div className="messages error">{error}</div>;
  }

  return (
    <div>
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <input
          type="text"
          placeholder="Search by name, email, phone, or address..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
          style={{ flex: 1, maxWidth: '400px' }}
        />
      </div>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Address</th>
            <th>Registration Date</th>
          </tr>
        </thead>
        <tbody>
          {filteredClients.map((client) => (
            <tr key={client.client_uuid}>
              <td style={{ fontWeight: 500 }}>{client.name}</td>
              <td>{client.email}</td>
              <td>{client.phone}</td>
              <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{client.address}</td>
              <td>{new Date(client.registration_date).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {filteredClients.length === 0 && (
        <EmptyState message="No clients found" icon="👥" />
      )}
    </div>
  );
};

export default Clients;
