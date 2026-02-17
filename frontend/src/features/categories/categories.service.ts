import axios from '@/lib/axios';
import { Category, CategoryListResponse } from './categories.types';

export const categoriesService = {
  getAll: async (params?: any): Promise<Category[]> => {
    const response = await axios.get<Category[]>('/categories', { params });
    // Backend returns flat array, but we check for .data just in case
    return Array.isArray(response.data) ? response.data : (response.data as any).data || [];
  },

  getBySlug: async (slug: string): Promise<Category> => {
    const response = await axios.get<Category>(`/categories/by-slug/${slug}`);
    return response.data;
  },
};
