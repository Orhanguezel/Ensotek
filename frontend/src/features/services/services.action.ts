import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-client';
import { servicesService } from './services.service';

export function useServices(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: queryKeys.services.list(params),
    queryFn: () => servicesService.getAll(params),
    staleTime: 10 * 60 * 1000,
  });
}

export function useServiceBySlug(slug: string) {
  return useQuery({
    queryKey: queryKeys.services.bySlug(slug),
    queryFn: () => servicesService.getBySlug(slug),
    enabled: !!slug,
  });
}

export function useServiceBySlugSuspense(slug: string) {
  return useSuspenseQuery({
    queryKey: queryKeys.services.bySlug(slug),
    queryFn: () => servicesService.getBySlug(slug),
  });
}

export function useServiceImages(serviceId: string) {
  return useQuery({
    queryKey: queryKeys.services.images(serviceId),
    queryFn: () => servicesService.getImages(serviceId),
    enabled: !!serviceId,
  });
}
