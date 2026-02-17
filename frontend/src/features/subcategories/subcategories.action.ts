import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-client';
import { subcategoriesService } from './subcategories.service';
import type { SubCategoryListParams } from './subcategories.type';

export function useSubCategories(params?: SubCategoryListParams) {
  return useQuery({
    queryKey: queryKeys.subcategories.list(params as Record<string, unknown>),
    queryFn: () => subcategoriesService.getAll(params),
    staleTime: 5 * 60 * 1000,
  });
}

export function useSubCategoryBySlug(slug: string) {
  return useQuery({
    queryKey: queryKeys.subcategories.bySlug(slug),
    queryFn: () => subcategoriesService.getBySlug(slug),
    enabled: !!slug,
  });
}
