import api from '@/lib/axios';
import type { FooterSection } from './footerSections.type';

const BASE = '/footer_sections';

export const footerSectionsService = {
  getAll: () => api.get<FooterSection[]>(BASE).then((r) => r.data),
  getById: (id: string) => api.get<FooterSection>(`${BASE}/${id}`).then((r) => r.data),
  getBySlug: (slug: string) => api.get<FooterSection>(`${BASE}/by-slug/${slug}`).then((r) => r.data),
};
