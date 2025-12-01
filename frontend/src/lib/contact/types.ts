// Çok basit tipler – BE ile hizalı
export interface IContactMessage {
  _id: string;
  name: string;
  tenant: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  isArchived: boolean;
  createdAt: string; // ISO
  updatedAt: string; // ISO
}

// Public form payload (slice'taki Omit ile hizalı)
export type ContactSendPayload = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

// Admin list paramları (ileride filtrelere genişleyebilir)
export type ContactListParams = {
  page?: number;
  limit?: number;
  q?: string;
};

// BE response zarfı
export type ApiEnvelope<T> = {
  success: boolean;
  message?: string;
  data: T;
  meta?: unknown;
};
