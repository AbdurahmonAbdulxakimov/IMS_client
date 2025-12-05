import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

const Profile = () => {
  const { user } = useAuth();

  if (!user) return <LoadingSpinner />;

  return (
    <div className="card">
      <h3 style={{ marginTop: 0 }}>Profile Information</h3>
      <div style={{ display: 'grid', gap: '16px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>
            Username
          </label>
          <p style={{ margin: 0, fontSize: '16px', fontWeight: 500 }}>{user.username}</p>
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>
            Email
          </label>
          <p style={{ margin: 0, fontSize: '16px', fontWeight: 500 }}>{user.email || 'N/A'}</p>
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>
            Full Name
          </label>
          <p style={{ margin: 0, fontSize: '16px', fontWeight: 500 }}>
            {user.first_name} {user.last_name}
          </p>
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>
            Role
          </label>
          <span className="badge" style={{ background: '#dbeafe', color: '#1e40af' }}>
            {user.role}
          </span>
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>
            Status
          </label>
          <span className="badge" style={{ background: user.status ? '#d1fae5' : '#fee2e2', color: user.status ? '#065f46' : '#991b1b' }}>
            {user.status ? 'Active' : 'Inactive'}
          </span>
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>
            Last Login
          </label>
          <p style={{ margin: 0, fontSize: '16px', fontWeight: 500 }}>
            {user.last_login ? new Date(user.last_login).toLocaleString() : 'N/A'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
