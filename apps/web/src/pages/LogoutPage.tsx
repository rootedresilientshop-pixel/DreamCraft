import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { removeToken, dispatchAuthChanged } from '../utils/authStorage';

export default function LogoutPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const performLogout = async () => {
      // Remove token from storage
      removeToken();

      // Dispatch auth-changed event to notify App component
      dispatchAuthChanged();

      // Wait a moment for state to update before navigating
      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 100);
    };

    performLogout();
  }, [navigate]);

  return <div style={{ padding: '20px', color: '#fff' }}>Logging out...</div>;
}
