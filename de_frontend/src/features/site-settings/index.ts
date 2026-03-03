export interface SiteSettings {
  site_title: string;
  site_description: string;
  logo_url?: string;
  favicon_url?: string;
  contact_email?: string;
  contact_phone?: string;
  social_media?: { platform: string; url: string }[];
  address?: string;
  logo_white?: string;
  logo_dark?: string;
}

export const siteSettingsService = {
  get: async (): Promise<SiteSettings> => {
    // const response = await import('@/lib/axios').then(m => m.default.get<SiteSettings>('/site-settings'));
    // return response.data;
    // Mock for now until API is ready or verified
    return {
        site_title: 'Ensotek',
        site_description: 'Ensotek - Endüstriyel Soğutma Sistemleri',
        contact_email: 'info@ensotek.com',
        contact_phone: '+90 216 123 45 67',
        address: 'İstanbul, Türkiye',
    } as SiteSettings;
  }
};

import { useQuery } from '@tanstack/react-query';

export const useSiteSettings = () => {
    return useQuery({
        queryKey: ['site-settings'],
        queryFn: siteSettingsService.get,
        initialData: {
            site_title: 'Ensotek',
            site_description: 'Ensotek',
        } as SiteSettings
    });
};
