// Backend: offers + offer_number_counters
export interface Offer {
  id: string;
  offer_no: string | null;
  status: string;           // 'new' | 'pending' | 'sent' | 'accepted' | 'rejected'
  locale: string | null;
  country_code: string | null;
  customer_name: string;
  company_name: string | null;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string | null;
  product_id: string | null;
  form_data: string | null;   // JSON string
  consent_marketing: boolean;
  consent_terms: boolean;
  currency: string;
  net_total: string | null;
  vat_rate: string | null;
  vat_total: string | null;
  shipping_total: string | null;
  gross_total: string | null;
  valid_until: string | null;
  admin_notes: string | null;
  pdf_url: string | null;
  pdf_asset_id: string | null;
  email_sent_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateOfferRequest {
  customer_name: string;
  email: string;
  phone?: string;
  company_name?: string;
  subject?: string;
  message?: string;
  product_id?: string;
  locale?: string;
  country_code?: string;
  consent_marketing?: boolean;
  consent_terms?: boolean;
  form_data?: any;
}
