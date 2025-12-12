import { useState, useEffect } from 'react';
import CreatorDashboard from './CreatorDashboard';
import CollaboratorDashboard from './CollaboratorDashboard';
import CreatorIntroModal from '../components/CreatorIntroModal';
import api from '../api';

export default function DashboardPage() {
  const [userType, setUserType] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showIntroModal, setShowIntroModal] = useState(false);

  useEffect(() => {
    const initializeDashboard = async () => {
      try {
        // Get userType from localStorage
        const userData = localStorage.getItem('userData');
        if (userData) {
          const parsed = JSON.parse(userData);
          setUserType(parsed.userType || 'creator');
        }

        // Check if creator needs to see intro modal
        try {
          const profileRes = await api.getProfile();
          if (
            profileRes.success &&
            profileRes.data?.userType === 'creator' &&
            !profileRes.data?.onboarding?.creatorIntroShown
          ) {
            setShowIntroModal(true);
          }
        } catch (err) {
          console.error('Failed to check intro status:', err);
        }
      } catch (err) {
        console.error('Failed to load user type:', err);
        setUserType('creator'); // default fallback
      } finally {
        setLoading(false);
      }
    };

    initializeDashboard();
  }, []);

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <p style={styles.loading}>Loading dashboard...</p>
      </div>
    );
  }

  // Determine which dashboard to show
  const DashboardComponent = userType === 'collaborator' ? CollaboratorDashboard : CreatorDashboard;

  return (
    <>
      <CreatorIntroModal isOpen={showIntroModal} onDismiss={() => setShowIntroModal(false)} />
      <DashboardComponent />
    </>
  );
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
