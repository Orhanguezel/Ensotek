// Backend: contact_messages
export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: 'new' | 'in_progress' | 'closed';
  is_resolved: boolean;
  created_at: string;
}

export interface CreateContactRequest {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  website?: string;  // honeypot anti-spam
}
