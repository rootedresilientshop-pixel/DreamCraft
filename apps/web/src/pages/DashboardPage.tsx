import { useState, useEffect } from 'react';
import CreatorDashboard from './CreatorDashboard';
import CollaboratorDashboard from './CollaboratorDashboard';

export default function DashboardPage() {
  const [userType, setUserType] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get userType from localStorage
    try {
      const userData = localStorage.getItem('userData');
      if (userData) {
        const parsed = JSON.parse(userData);
        setUserType(parsed.userType || 'creator');
      }
    } catch (err) {
      console.error('Failed to load user type:', err);
      setUserType('creator'); // default fallback
    } finally {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <p style={styles.loading}>Loading dashboard...</p>
      </div>
    );
  }

  // Route to role-specific dashboard
  if (userType === 'creator') {
    return <CreatorDashboard />;
  } else if (userType === 'collaborator') {
    return <CollaboratorDashboard />;
  }

  // Fallback to creator dashboard
  return <CreatorDashboard />;
}

const styles: any = {
  loadingContainer: {
    minHeight: '100vh',
    backgroundColor: '#000',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loading: {
    color: '#999',
    textAlign: 'center',
  },
};
