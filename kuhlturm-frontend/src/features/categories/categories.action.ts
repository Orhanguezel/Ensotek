import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-client';
import { categoriesService } from './categories.service';
import type { CategoryListParams } from './categories.type';

export function useCategories(params?: CategoryListParams) {
  return useQuery({
    queryKey: queryKeys.categories.list(params as Record<string, unknown>),
    queryFn: () => categoriesService.getAll(params),
    staleTime: 5 * 60 * 1000,
  });
}

export function useCategoryBySlug(slug: string) {
  return useQuery({
    queryKey: queryKeys.categories.bySlug(slug),
    queryFn: () => categoriesService.getBySlug(slug),
    enabled: !!slug,
  });
}

/** SSR: use in Server Components via prefetch */
export function useCategoryBySlugSuspense(slug: string) {
  return useSuspenseQuery({
    queryKey: queryKeys.categories.bySlug(slug),
    queryFn: () => categoriesService.getBySlug(slug),
  });
}
