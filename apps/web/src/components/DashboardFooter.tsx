import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function DashboardFooter() {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      localStorage.removeItem('userToken');
      localStorage.removeItem('userData');
      window.dispatchEvent(new Event('auth-changed'));
      navigate('/login');
    }
  };

  return (
    <footer style={styles.footer}>
      <div style={styles.footerContent}>
        <div style={styles.footerLeft}>
          <p style={styles.footerText}>© 2026 VentureLab. All rights reserved.</p>
        </div>
        <div style={styles.footerRight}>
          <button
            onClick={handleLogout}
            style={styles.logoutBtn}
          >
            Logout
          </button>
        </div>
      </div>
    </footer>
  );
}

const styles: any = {
  footer: {
    backgroundColor: '#0a0a0a',
    borderTop: '1px solid #333',
    padding: '20px 40px',
    marginTop: 'auto',
  },
  footerContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerLeft: {
    flex: 1,
  },
  footerRight: {
    display: 'flex',
    gap: '16px',
    alignItems: 'center',
  },
  footerText: {
    color: '#666',
    fontSize: '12px',
    margin: '0',
  },
  logoutBtn: {
    padding: '8px 16px',
    backgroundColor: '#ff4444',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'all 0.3s',
  },
};
