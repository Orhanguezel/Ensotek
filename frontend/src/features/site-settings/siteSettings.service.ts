import { AxiosRequestConfig } from 'axios';
import api from '@/lib/axios';
import type { SiteSetting, AppLocale } from './siteSettings.type';

const BASE = '/site_settings';

export const siteSettingsService = {
  getAll: (config?: AxiosRequestConfig) => api.get<SiteSetting[]>(BASE, config).then((r) => r.data),
  getByKey: (key: string, config?: AxiosRequestConfig) => api.get<SiteSetting>(`${BASE}/${key}`, config).then((r) => r.data),
  getAppLocales: () => api.get<AppLocale[]>(`${BASE}/app-locales`).then((r) => r.data),
  getDefaultLocale: () =>
    api
      .get<string | { locale?: string }>(`${BASE}/default-locale`)
      .then((r) =>
        typeof r.data === "string"
          ? { locale: r.data }
          : { locale: r.data?.locale ?? "" },
      ),
};
