import { useEffect } from 'react';
import { removeToken, dispatchAuthChanged } from '../utils/authStorage';

export default function LogoutPage() {
  useEffect(() => {
    removeToken();
    dispatchAuthChanged();
    window.location.href = '/';
  }, []);

  return <div style={{ padding: '20px', color: '#fff' }}>Logging out...</div>;
}
