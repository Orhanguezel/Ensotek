import api from '@/lib/axios';
import type { Faq } from './faqs.type';

const BASE = '/faqs';

export const faqsService = {
  getAll: (params?: Record<string, unknown>) =>
    api.get<Faq[]>(BASE, { params }).then((r) => r.data),
  getById: (id: string) =>
    api.get<Faq>(`${BASE}/${id}`).then((r) => r.data),
  getBySlug: (slug: string) =>
    api.get<Faq>(`${BASE}/by-slug/${slug}`).then((r) => r.data),
};
