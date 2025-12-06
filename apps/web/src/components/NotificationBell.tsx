import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../contexts/NotificationContext';

export default function NotificationBell() {
  const navigate = useNavigate();
  const { notifications, unreadCount, markAsRead } = useNotifications();
  const [showDropdown, setShowDropdown] = useState(false);

  const recentNotifications = notifications.slice(0, 5);

  const getNotificationColor = (type: string) => {
    const colors: any = {
      info: '#0099ff',
      success: '#00cc66',
      warning: '#ffaa00',
      error: '#ff6666',
    };
    return colors[type] || '#999';
  };

  return (
    <div style={styles.container}>
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        style={styles.bellButton}
        title="Notifications"
      >
        🔔
        {unreadCount > 0 && <span style={styles.badge}>{unreadCount}</span>}
      </button>

      {showDropdown && (
        <div style={styles.dropdown}>
          <div style={styles.dropdownHeader}>
            <h3 style={styles.dropdownTitle}>Notifications</h3>
            <button
              onClick={() => setShowDropdown(false)}
              style={{
                background: 'none',
                border: 'none',
                color: '#fff',
                cursor: 'pointer',
                fontSize: '18px',
              }}
            >
              ✕
            </button>
          </div>

          {recentNotifications.length === 0 ? (
            <div style={styles.dropdownEmpty}>
              <p>No notifications</p>
            </div>
          ) : (
            <>
              <div style={styles.dropdownList}>
                {recentNotifications.map((notif) => (
                  <div
                    key={notif.id}
                    style={{
                      ...styles.dropdownItem,
                      borderLeftColor: getNotificationColor(notif.type),
                      backgroundColor: !notif.read ? '#1a1a1a' : 'transparent',
                    }}
                    onClick={() => {
                      markAsRead(notif.id);
                      if (notif.actionUrl) {
                        navigate(notif.actionUrl);
                      }
                      setShowDropdown(false);
                    }}
                  >
                    <div style={styles.dropdownItemTitle}>{notif.title}</div>
                    <p style={styles.dropdownItemMessage}>{notif.message}</p>
                  </div>
                ))}
              </div>
              <button
                onClick={() => {
                  navigate('/notifications');
                  setShowDropdown(false);
                }}
                style={styles.dropdownViewAll}
              >
                View All Notifications
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

const styles: any = {
  container: {
    position: 'relative',
  },
  bellButton: {
    background: 'none',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    padding: '8px',
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#ff6666',
    color: '#fff',
    borderRadius: '50%',
    width: '20px',
    height: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    fontWeight: 'bold',
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    right: 0,
    backgroundColor: '#111',
    border: '1px solid #333',
    borderRadius: '8px',
    width: '350px',
    maxHeight: '500px',
    marginTop: '8px',
    zIndex: 1000,
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
  },
  dropdownHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px',
    borderBottom: '1px solid #333',
  },
  dropdownTitle: {
    margin: 0,
    fontSize: '16px',
    fontWeight: '600',
  },
  dropdownEmpty: {
    padding: '40px 15px',
    textAlign: 'center',
    color: '#666',
  },
  dropdownList: {
    maxHeight: '350px',
    overflowY: 'auto' as const,
  },
  dropdownItem: {
    padding: '12px 15px',
    borderLeft: '4px solid',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    borderBottom: '1px solid #222',
  },
  dropdownItemTitle: {
    fontWeight: '600',
    fontSize: '13px',
    color: '#ddd',
    marginBottom: '4px',
  },
  dropdownItemMessage: {
    fontSize: '12px',
    color: '#999',
    margin: 0,
    lineHeight: '1.4',
  },
  dropdownViewAll: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#0099ff',
    color: '#fff',
    border: 'none',
    borderRadius: '0 0 8px 8px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '13px',
  },
};
