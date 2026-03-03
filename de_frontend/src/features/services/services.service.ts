import api from '@/lib/axios';
import type { Service, ServiceImage } from './services.type';
import axios from 'axios';

const BASE = '/services';

export const servicesService = {
  getAll: (params?: Record<string, unknown>) =>
    api.get<Service[]>(BASE, { params }).then((r) => r.data),
  getById: (id: string) =>
    api.get<Service>(`${BASE}/${id}`).then((r) => r.data),
  getBySlug: async (slug: string) => {
    try {
      const res = await api.get<Service>(`${BASE}/by-slug/${slug}`);
      return res.data;
    } catch (err) {
      const alt = slug.includes('_') ? slug.replace(/_/g, '-') : slug;
      if (alt !== slug && axios.isAxiosError(err) && err.response?.status === 404) {
        const resAlt = await api.get<Service>(`${BASE}/by-slug/${alt}`);
        return resAlt.data;
      }
      throw err;
    }
  },
  getImages: (serviceId: string) =>
    api.get<ServiceImage[]>(`${BASE}/${serviceId}/images`).then((r) => r.data),
};
