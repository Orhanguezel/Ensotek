import api from '@/lib/axios';
import type { SubCategory, SubCategoryListParams } from './subcategories.type';

const BASE = '/sub-categories';

export const subcategoriesService = {
  getAll: (params?: SubCategoryListParams) =>
    api.get<SubCategory[]>(BASE, { params }).then((r) => r.data),

  getById: (id: string) =>
    api.get<SubCategory>(`${BASE}/${id}`).then((r) => r.data),

  getBySlug: (slug: string) =>
    api.get<SubCategory>(`${BASE}/by-slug/${slug}`).then((r) => r.data),
};
