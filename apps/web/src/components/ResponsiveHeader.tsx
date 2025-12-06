import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NotificationBell from './NotificationBell';

interface ResponsiveHeaderProps {
  title: string;
  subtitle?: string;
}

export default function ResponsiveHeader({ title, subtitle }: ResponsiveHeaderProps) {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <div>
            <h1 style={styles.title}>{title}</h1>
            {subtitle && <p style={styles.subtitle}>{subtitle}</p>}
          </div>
          <div style={styles.desktopNav}>
            <NotificationBell />
            <a href="/create-idea" style={styles.button}>
              + New Idea
            </a>
            <a href="/collaborators" style={{ ...styles.button, backgroundColor: '#0099ff' }}>
              👥 Collaborators
            </a>
            <a href="/profile" style={{ ...styles.button, backgroundColor: '#00ccaa' }}>
              👤 Profile
            </a>
          </div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={styles.mobileMenuButton}
            aria-label="Toggle menu"
          >
            ☰
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div style={styles.mobileMenu}>
          <a href="/create-idea" style={styles.mobileMenuItem}>
            + New Idea
          </a>
          <a href="/collaborators" style={styles.mobileMenuItem}>
            👥 Collaborators
          </a>
          <a href="/profile" style={styles.mobileMenuItem}>
            👤 Profile
          </a>
          <a href="/notifications" style={styles.mobileMenuItem}>
            🔔 Notifications
          </a>
          <button
            onClick={() => {
              navigate('/logout');
              setMobileMenuOpen(false);
            }}
            style={{ ...styles.mobileMenuItem, color: '#ff6666' }}
          >
            Logout
          </button>
        </div>
      )}
    </>
  );
}

const styles: any = {
  header: {
    backgroundColor: '#111',
    borderBottom: '1px solid #333',
    marginBottom: '20px',
    padding: '15px 20px',
  },
  headerContent: {
    maxWidth: '1400px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '20px',
  },
  title: {
    fontSize: 'clamp(20px, 5vw, 32px)',
    fontWeight: 'bold',
    margin: '0',
    color: '#fff',
  },
  subtitle: {
    color: '#999',
    margin: '5px 0 0 0',
    fontSize: 'clamp(12px, 3vw, 14px)',
  },
  desktopNav: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
    '@media (max-width: 768px)': {
      display: 'none',
    },
  },
  button: {
    padding: '10px 16px',
    backgroundColor: '#00cc66',
    color: '#000',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '13px',
    whiteSpace: 'nowrap',
  },
  mobileMenuButton: {
    display: 'none',
    background: 'none',
    border: 'none',
    color: '#fff',
    fontSize: '24px',
    cursor: 'pointer',
    padding: '0',
    '@media (max-width: 768px)': {
      display: 'block',
    },
  },
  mobileMenu: {
    display: 'none',
    flexDirection: 'column',
    backgroundColor: '#0a0a0a',
    borderBottom: '1px solid #333',
    padding: '10px 0',
    '@media (max-width: 768px)': {
      display: 'flex',
    },
  },
  mobileMenuItem: {
    padding: '12px 20px',
    color: '#0099ff',
    textDecoration: 'none',
    fontSize: '14px',
    borderTop: '1px solid #222',
    fontWeight: '600',
  },
};
