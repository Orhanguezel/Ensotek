import api from '@/lib/axios';

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  content?: string | null;
  image_url?: string | null;
  category_id?: string;
  is_active?: number;
  meta_title?: string | null;
  meta_description?: string | null;
  created_at?: string;
}

export const blogService = {
  getAll: async (params?: Record<string, unknown>): Promise<BlogPost[]> => {
    const res = await api.get('/custom_pages', {
      params: { module_key: 'kompozit_blog', is_active: 1, ...params },
    });
    return Array.isArray(res.data) ? res.data : (res.data as any)?.items ?? [];
  },

  getBySlug: async (slug: string, locale?: string): Promise<BlogPost> => {
    const res = await api.get(`/custom_pages/by-slug/${encodeURIComponent(slug)}`, {
      params: locale ? { locale } : undefined,
    });
    return res.data;
  },
};
