import Notification from '../models/Notification.js';
import { io } from '../server.js';

export interface NotificationPayload {
  userId: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'collaboration_invite' | 'message' | 'favorite';
  title: string;
  message: string;
  actionUrl?: string;
  metadata?: {
    ideaId?: string;
    fromUserId?: string;
    inviteId?: string;
  };
}

export const sendNotification = async (payload: NotificationPayload) => {
  try {
    const notification = await Notification.create(payload);

    if (io) {
      io.to(`user:${payload.userId}`).emit('notification', {
        id: notification._id.toString(),
        type: notification.type,
        title: notification.title,
        message: notification.message,
        actionUrl: notification.actionUrl,
        timestamp: notification.createdAt,
        read: false
      });
    }

    return notification;
  } catch (error) {
    console.error('Error sending notification:', error);
    throw error;
  }
};
