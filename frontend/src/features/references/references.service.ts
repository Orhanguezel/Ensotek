import api from '@/lib/axios';
import type { Reference } from './references.type';

const BASE = '/references';

export const referencesService = {
  getAll: (params?: Record<string, unknown>) =>
    api.get<Reference[]>(BASE, { params }).then((r) => r.data),
  getById: (id: string) =>
    api.get<Reference>(`${BASE}/${id}`).then((r) => r.data),
  getBySlug: (slug: string) =>
    api.get<Reference>(`${BASE}/by-slug/${slug}`).then((r) => r.data),
};
