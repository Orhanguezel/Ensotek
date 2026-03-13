import api from '@/lib/axios';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  image_url?: string | null;
  module_key?: string;
  is_active?: number;
}

export const categoriesService = {
  getAll: async (params?: Record<string, unknown>): Promise<Category[]> => {
    const res = await api.get('/categories', {
      params: { module_key: 'kompozit', is_active: 1, ...params },
    });
    return Array.isArray(res.data) ? res.data : (res.data as any)?.items ?? [];
  },

  getBySlug: async (slug: string): Promise<Category> => {
    const res = await api.get(`/categories/by-slug/${encodeURIComponent(slug)}`);
    return res.data;
  },
};
