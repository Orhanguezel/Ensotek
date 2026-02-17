// Backend: notifications
export type NotificationType =
  | 'order_created'
  | 'order_paid'
  | 'order_failed'
  | 'catalog_request_created'
  | 'system'
  | 'custom'
  | (string & {});

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: NotificationType;
  is_read: boolean;
  created_at: string;
}

export interface CreateNotificationRequest {
  title: string;
  message: string;
  type: NotificationType;
}

export interface UnreadCountResponse {
  count: number;
}
