import api from '@/lib/axios';
import type { Reference } from './references.type';

const BASE = '/references';

export const referencesService = {
  getAll: (params?: Record<string, unknown>) =>
    api.get<Reference[]>(BASE, { params }).then((r) => r.data),
  getById: (id: string, locale?: string) =>
    api.get<Reference>(`${BASE}/${id}`, { params: locale ? { locale } : {} }).then((r) => r.data),
  getBySlug: (slug: string, locale?: string) =>
    api.get<Reference>(`${BASE}/by-slug/${slug}`, { params: locale ? { locale } : {} }).then((r) => r.data),
};
