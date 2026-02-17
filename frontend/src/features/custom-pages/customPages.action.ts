import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-client';
import { customPagesService } from './customPages.service';

export function useCustomPages(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: queryKeys.customPages.list(params),
    queryFn: () => customPagesService.getAll(params),
    staleTime: 5 * 60 * 1000,
  });
}

export function useCustomPageBySlug(slug: string) {
  return useQuery({
    queryKey: queryKeys.customPages.bySlug(slug),
    queryFn: () => customPagesService.getBySlug(slug),
    enabled: !!slug,
  });
}

export function useCustomPageBySlugSuspense(slug: string) {
  return useSuspenseQuery({
    queryKey: queryKeys.customPages.bySlug(slug),
    queryFn: () => customPagesService.getBySlug(slug),
  });
}
