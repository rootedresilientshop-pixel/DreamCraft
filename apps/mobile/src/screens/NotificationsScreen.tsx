import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
}

export default function NotificationsScreen({ navigation }: any) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading notifications from storage or API
    // For now, we'll just set an empty list and show the empty state
    setTimeout(() => {
      setLoading(false);
    }, 500);

    navigation.setOptions({
      headerTitle: 'Notifications',
    });
  }, []);

  const getNotificationColor = (type: string) => {
    const colors: any = {
      info: '#0099ff',
      success: '#00cc66',
      warning: '#ffaa00',
      error: '#ff6666',
    };
    return colors[type] || '#999';
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

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
  };

  const renderNotification = ({ item }: { item: Notification }) => (
    <TouchableOpacity
      style={[
        styles.notificationItem,
        {
          borderLeftColor: getNotificationColor(item.type),
          backgroundColor: !item.read ? '#1a1a1a' : '#0a0a0a',
        },
      ]}
      onPress={() => {
        markAsRead(item.id);
        if (item.actionUrl) {
          navigation.navigate(item.actionUrl);
        }
      }}
    >
      <View style={styles.notificationContent}>
        <View style={styles.notificationTitleRow}>
          <Text style={styles.notificationIcon}>{getNotificationIcon(item.type)}</Text>
          <Text style={styles.notificationTitle}>{item.title}</Text>
          {!item.read && <View style={styles.unreadBadge} />}
        </View>
        <Text style={styles.notificationMessage}>{item.message}</Text>
        <Text style={styles.notificationTime}>
          {new Date(item.timestamp).toLocaleString()}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => deleteNotification(item.id)}
      >
        <Text style={styles.deleteButtonText}>✕</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0099ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {notifications.length > 0 && (
        <View style={styles.actionBar}>
          <TouchableOpacity onPress={markAllAsRead} style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Mark All Read</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={clearAllNotifications} style={[styles.actionButton, styles.clearButton]}>
            <Text style={styles.actionButtonText}>Clear All</Text>
          </TouchableOpacity>
        </View>
      )}

      {notifications.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>🔔</Text>
          <Text style={styles.emptyTitle}>No Notifications</Text>
          <Text style={styles.emptyText}>
            You'll see notifications for collaborator invites, purchases, and more here.
          </Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          renderItem={renderNotification}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  actionBar: {
    flexDirection: 'row',
    gap: 12,
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#0099ff',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  clearButton: {
    backgroundColor: '#333',
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
  },
  listContent: {
    padding: 15,
  },
  notificationItem: {
    flexDirection: 'row',
    backgroundColor: '#1a1a1a',
    borderLeftWidth: 4,
    borderRadius: 8,
    padding: 15,
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  notificationIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  notificationTitle: {
    flex: 1,
    fontWeight: '600',
    fontSize: 14,
    color: '#ddd',
  },
  unreadBadge: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#0099ff',
    marginLeft: 8,
  },
  notificationMessage: {
    fontSize: 13,
    color: '#999',
    lineHeight: 18,
    marginBottom: 8,
  },
  notificationTime: {
    fontSize: 11,
    color: '#666',
  },
  deleteButton: {
    padding: 8,
  },
  deleteButtonText: {
    fontSize: 16,
    color: '#666',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#999',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
    lineHeight: 18,
  },
});
