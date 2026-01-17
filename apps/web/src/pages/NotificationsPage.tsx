import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../contexts/NotificationContext';

export default function NotificationsPage() {
  const navigate = useNavigate();
  const { notifications, markAsRead, markAllAsRead, deleteNotification, clearNotifications } = useNotifications();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const getNotificationStyles = (type: string) => {
    const baseStyle = {
      padding: '15px',
      borderRadius: '8px',
      marginBottom: '12px',
      cursor: 'pointer',
      transition: 'all 0.2s',
      borderLeft: '4px solid',
    };

    const typeStyles: any = {
      info: {
        backgroundColor: '#1a3d4d',
        borderLeftColor: '#0099ff',
        color: '#0099ff',
      },
      success: {
        backgroundColor: '#1a3d1a',
        borderLeftColor: '#00cc66',
        color: '#00cc66',
      },
      warning: {
        backgroundColor: '#3d3d1a',
        borderLeftColor: '#ffaa00',
        color: '#ffaa00',
      },
      error: {
        backgroundColor: '#3d1f1f',
        borderLeftColor: '#ff6666',
        color: '#ff6666',
      },
    };

    return { ...baseStyle, ...typeStyles[type] };
  };

  const getNotificationIcon = (type: string) => {
    const icons: any = {
      info: 'ℹ️',
      success: '✓',
      warning: '⚠️',
      error: '✕',
    };
    return icons[type] || '•';
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button
          onClick={() => navigate('/dashboard')}
          style={{
            background: 'none',
            border: 'none',
            color: '#0099ff',
            cursor: 'pointer',
            fontSize: '14px',
            marginBottom: '20px',
          }}
        >
          ← Back to Dashboard
        </button>
      </div>

      <div style={styles.card}>
        <div style={styles.titleSection}>
          <div>
            <h1 style={styles.title}>Notifications</h1>
            <p style={styles.subtitle}>
              {notifications.length === 0
                ? 'No notifications yet'
                : `${notifications.filter((n) => !n.read).length} unread`}
            </p>
          </div>
          {notifications.length > 0 && (
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={markAllAsRead}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#0099ff',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '14px',
                }}
              >
                Mark All Read
              </button>
              <button
                onClick={clearNotifications}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#333',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '14px',
                }}
              >
                Clear All
              </button>
            </div>
          )}
        </div>

        {notifications.length === 0 ? (
          <div style={styles.emptyState}>
            <p style={styles.emptyText}>No notifications at this time</p>
            <p style={styles.emptySubtext}>You'll see notifications for collaborator invites, purchases, and more here.</p>
          </div>
        ) : (
          <div style={styles.notificationsList}>
            {notifications.map((notification) => (
              <div
                key={notification.id}
                style={getNotificationStyles(notification.type)}
                onClick={() => {
                  if (!notification.read) {
                    markAsRead(notification.id);
                  }
                  if (notification.actionUrl) {
                    navigate(notification.actionUrl);
                  }
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.opacity = '0.9';
                  el.style.transform = 'translateX(4px)';
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.opacity = '1';
                  el.style.transform = 'translateX(0)';
                }}
              >
                <div style={styles.notificationHeader}>
                  <div style={styles.notificationTitle}>
                    <span style={{ marginRight: '8px' }}>{getNotificationIcon(notification.type)}</span>
                    {notification.title}
                    {!notification.read && <span style={styles.unreadBadge}>New</span>}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(notification.id);
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'inherit',
                      cursor: 'pointer',
                      fontSize: '18px',
                      padding: '0',
                    }}
                  >
                    ✕
                  </button>
                </div>
                <p style={styles.notificationMessage}>{notification.message}</p>
                <span style={styles.notificationTime}>
                  {new Date(notification.timestamp).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const styles: any = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#000',
    color: '#fff',
    padding: '20px',
  },
  header: {
    marginBottom: '20px',
  },
  card: {
    backgroundColor: '#111',
    borderRadius: '12px',
    padding: '40px',
    maxWidth: '700px',
    margin: '0 auto',
    border: '1px solid #333',
  },
  titleSection: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '30px',
    paddingBottom: '30px',
    borderBottom: '1px solid #333',
  },
  title: {
    fontSize: '36px',
    fontWeight: 'bold',
    margin: '0 0 12px 0',
  },
  subtitle: {
    color: '#999',
    fontSize: '14px',
    margin: '0',
  },
  notificationsList: {
    display: 'flex',
    flexDirection: 'column',
  },
  notificationHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
  },
  notificationTitle: {
    fontWeight: '600',
    fontSize: '15px',
    display: 'flex',
    alignItems: 'center',
  },
  unreadBadge: {
    marginLeft: '8px',
    backgroundColor: '#0099ff',
    color: '#000',
    padding: '2px 8px',
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: '600',
  },
  notificationMessage: {
    margin: '8px 0',
    fontSize: '14px',
    lineHeight: '1.5',
    color: '#ccc',
  },
  notificationTime: {
    fontSize: '12px',
    color: '#666',
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
  },
  emptyText: {
    fontSize: '18px',
    color: '#999',
    margin: '0 0 10px 0',
  },
  emptySubtext: {
    fontSize: '14px',
    color: '#666',
    margin: '0',
  },
};
