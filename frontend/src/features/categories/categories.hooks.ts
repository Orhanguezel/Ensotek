import { useQuery } from '@tanstack/react-query';
import { categoriesService } from './categories.service';

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: categoriesService.getAll,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useCategoryBySlug = (slug: string) => {
  return useQuery({
    queryKey: ['categories', slug],
    queryFn: () => categoriesService.getBySlug(slug),
    enabled: !!slug,
  });
};
