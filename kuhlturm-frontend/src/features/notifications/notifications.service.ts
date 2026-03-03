import axios from '@/lib/axios';
import { NotificationListResponse } from './notifications.types';

export const notificationsService = {
  getAll: async (): Promise<NotificationListResponse> => {
    const response = await axios.get<NotificationListResponse>('/notifications');
    return response.data;
  },

  markAsRead: async (id: string): Promise<void> => {
    await axios.post(`/notifications/${id}/read`);
  },

  markAllAsRead: async (): Promise<void> => {
    await axios.post('/notifications/read-all');
  },

  getUnreadCount: async (): Promise<number> => {
    const response = await axios.get<{ count: number }>('/notifications/unread-count');
    return response.data.count;
  },

  delete: async (id: string): Promise<void> => {
    await axios.delete(`/notifications/${id}`);
  },
};
