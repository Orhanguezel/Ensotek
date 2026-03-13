import api from '@/lib/axios';

export interface SiteSetting {
  key: string;
  value: unknown;
  locale?: string;
}

export const siteSettingsService = {
  getByKey: async (key: string, locale?: string): Promise<SiteSetting | null> => {
    try {
      const res = await api.get(`/site_settings/${encodeURIComponent(key)}`, {
        params: { locale, prefix: 'kompozit__' },
      });
      return res.data;
    } catch {
      return null;
    }
  },
};
