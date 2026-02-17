import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-client';
import { sliderService } from './slider.service';

export function useSliders() {
  return useQuery({
    queryKey: queryKeys.slider.list(),
    queryFn: sliderService.getAll,
    staleTime: 5 * 60 * 1000,
  });
}

export function useSlider(idOrSlug: string) {
  return useQuery({
    queryKey: queryKeys.slider.detail(idOrSlug),
    queryFn: () => sliderService.getByIdOrSlug(idOrSlug),
    enabled: !!idOrSlug,
  });
}
