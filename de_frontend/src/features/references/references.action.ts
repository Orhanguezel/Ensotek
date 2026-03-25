import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { useLocale } from 'next-intl';
import { queryKeys } from '@/lib/query-client';
import { referencesService } from './references.service';

export function useReferences(params?: Record<string, unknown>) {
  const locale = useLocale();
  return useQuery({
    queryKey: queryKeys.references.list({ ...params, locale }),
    queryFn: () => referencesService.getAll({ ...params, locale }),
    staleTime: 10 * 60 * 1000,
  });
}

export function useReferenceBySlug(slug: string) {
  const locale = useLocale();
  return useQuery({
    queryKey: [...queryKeys.references.bySlug(slug), locale],
    queryFn: () => referencesService.getBySlug(slug, locale),
    enabled: !!slug,
  });
}

export function useReferenceBySlugSuspense(slug: string) {
  const locale = useLocale();
  return useSuspenseQuery({
    queryKey: [...queryKeys.references.bySlug(slug), locale],
    queryFn: () => referencesService.getBySlug(slug, locale),
  });
}
