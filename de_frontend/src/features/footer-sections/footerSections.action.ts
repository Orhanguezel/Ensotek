import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-client';
import { footerSectionsService } from './footerSections.service';

export function useFooterSections() {
  return useQuery({
    queryKey: queryKeys.footerSections.list(),
    queryFn: footerSectionsService.getAll,
    staleTime: 10 * 60 * 1000,
  });
}

export function useFooterSectionBySlug(slug: string) {
  return useQuery({
    queryKey: queryKeys.footerSections.bySlug(slug),
    queryFn: () => footerSectionsService.getBySlug(slug),
    enabled: !!slug,
  });
}
