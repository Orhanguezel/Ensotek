import api from '@/lib/axios';

export interface Gallery {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  cover_image?: string | null;
  cover_image_url_resolved?: string | null;
  cover_image_alt?: string | null;
  updated_at?: string | null;
  image_count?: number;
  module_key?: string;
  is_active?: number;
  images?: GalleryImage[];
}

export interface GalleryImage {
  id: string;
  gallery_id?: string;
  image_url?: string | null;
  image_url_resolved?: string | null;
  asset_url?: string | null;
  asset_width?: number | string | null;
  asset_height?: number | string | null;
  alt?: string | null;
  caption?: string | null;
  width?: number | string | null;
  height?: number | string | null;
  updated_at?: string | null;
  display_order: number;
}

export const galleryService = {
  getAll: async (params?: Record<string, unknown>): Promise<Gallery[]> => {
    const res = await api.get('/galleries', {
      params: { module_key: 'kompozit', is_active: 1, ...params },
    });
    return Array.isArray(res.data) ? res.data : (res.data as any)?.items ?? [];
  },

  getBySlug: async (slug: string, locale?: string): Promise<Gallery> => {
    const res = await api.get(`/galleries/${encodeURIComponent(slug)}`, {
      params: locale ? { locale } : undefined,
    });
    return res.data;
  },

  getImages: async (galleryId: string, locale?: string): Promise<GalleryImage[]> => {
    const res = await api.get(`/galleries/${encodeURIComponent(galleryId)}/images`, {
      params: locale ? { locale } : undefined,
    });
    return Array.isArray(res.data) ? res.data : [];
  },
};
