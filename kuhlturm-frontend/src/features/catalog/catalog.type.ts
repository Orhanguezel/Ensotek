// Backend: catalog_requests
export interface CatalogRequest {
  id: string;
  status: string;            // 'new' | 'sent' | etc.
  locale: string | null;
  country_code: string | null;
  customer_name: string;
  company_name: string | null;
  email: string;
  phone: string | null;
  message: string | null;
  consent_marketing: boolean;
  consent_terms: boolean;
  admin_notes: string | null;
  email_sent_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateCatalogRequest {
  customer_name: string;
  email: string;
  phone?: string;
  company_name?: string;
  message?: string;
  locale?: string;
  country_code?: string;
  consent_marketing?: boolean;
  consent_terms?: boolean;
}
