import Notification from '../models/Notification';
import { getIO } from './socketService';

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

    try {
      const io = getIO();
      io.to(`user:${payload.userId}`).emit('notification', {
        id: notification._id.toString(),
        type: notification.type,
        title: notification.title,
        message: notification.message,
        actionUrl: notification.actionUrl,
        timestamp: notification.createdAt,
        read: false
      });
    } catch (ioError) {
      // Socket.io not initialized yet, notification still saved
      console.debug('Socket.io not available for notification:', (ioError as Error).message);
    }

    return notification;
  } catch (error) {
    console.error('Error sending notification:', error);
    throw error;
  }
};
