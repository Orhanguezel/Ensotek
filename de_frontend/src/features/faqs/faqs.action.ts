import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-client';
import { faqsService } from './faqs.service';

export function useFaqs(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: queryKeys.faqs.list(params),
    queryFn: () => faqsService.getAll(params),
    staleTime: 10 * 60 * 1000,
  });
}

export function useFaqBySlug(slug: string) {
  return useQuery({
    queryKey: queryKeys.faqs.bySlug(slug),
    queryFn: () => faqsService.getBySlug(slug),
    enabled: !!slug,
  });
}
