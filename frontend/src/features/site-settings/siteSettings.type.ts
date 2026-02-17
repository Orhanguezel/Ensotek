// Backend: site_settings table (key-value with locale)
export interface SiteSetting {
  id: string;
  key: string;
  locale: string;
  value: string;
  created_at: string;
  updated_at: string;
}

export interface AppLocale {
  code: string;
  name?: string;
  label?: string;
  is_active?: boolean;
  is_default?: boolean;
}
