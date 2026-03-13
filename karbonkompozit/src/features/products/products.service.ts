import api from '@/lib/axios';

export interface Product {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  image_url?: string | null;
  alt?: string | null;
  caption?: string | null;
  width?: number | string | null;
  height?: number | string | null;
  price?: number | string;
  category_id?: string;
  item_type?: string;
  is_active?: number;
  tags?: string[];
  meta_title?: string | null;
  meta_description?: string | null;
  created_at?: string;
  updated_at?: string | null;
}

export const productsService = {
  getAll: async (params?: Record<string, unknown>): Promise<Product[]> => {
    const res = await api.get('/products', {
      params: { item_type: 'kompozit', is_active: 1, ...params },
    });
    return Array.isArray(res.data) ? res.data : (res.data as any)?.items ?? [];
  },

  getBySlug: async (slug: string, locale?: string): Promise<Product> => {
    const res = await api.get(`/products/by-slug/${encodeURIComponent(slug)}`, {
      params: { item_type: 'kompozit', ...(locale ? { locale } : {}) },
    });
    return res.data;
  },
};
