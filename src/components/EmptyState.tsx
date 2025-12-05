interface EmptyStateProps {
  message: string;
  icon?: string;
}

const EmptyState = ({ message, icon = '📭' }: EmptyStateProps) => {
  return (
    <div style={{
      textAlign: 'center',
      padding: '60px 20px',
      color: '#6b7280'
    }}>
      <div style={{ fontSize: '64px', marginBottom: '16px', opacity: 0.5 }}>
        {icon}
      </div>
      <p style={{ margin: 0, fontSize: '16px' }}>{message}</p>
    </div>
  );
};

export default EmptyState;
