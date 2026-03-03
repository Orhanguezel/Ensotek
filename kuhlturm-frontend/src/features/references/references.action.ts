import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-client';
import { referencesService } from './references.service';

export function useReferences(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: queryKeys.references.list(params),
    queryFn: () => referencesService.getAll(params),
    staleTime: 10 * 60 * 1000,
  });
}

export function useReferenceBySlug(slug: string) {
  return useQuery({
    queryKey: queryKeys.references.bySlug(slug),
    queryFn: () => referencesService.getBySlug(slug),
    enabled: !!slug,
  });
}

export function useReferenceBySlugSuspense(slug: string) {
  return useSuspenseQuery({
    queryKey: queryKeys.references.bySlug(slug),
    queryFn: () => referencesService.getBySlug(slug),
  });
}
