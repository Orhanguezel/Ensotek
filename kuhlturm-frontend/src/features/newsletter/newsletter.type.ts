// Backend: newsletter_subscribers
export interface NewsletterSubscriber {
  id: string;
  email: string;
  is_verified: boolean;
  locale: string | null;
  meta: string;         // JSON string
  unsubscribed_at: string | null;
  created_at: string;
  updated_at: string;
}
