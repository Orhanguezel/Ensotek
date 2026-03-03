import { useQuery } from '@tanstack/react-query';
import { productsService } from './products.service';
import { ProductListParams } from './products.types';

export const useProducts = (params?: ProductListParams) => {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => productsService.getAll(params),
  });
};

export const useProductBySlug = (slug: string) => {
  return useQuery({
    queryKey: ['products', slug],
    queryFn: () => productsService.getBySlug(slug),
    enabled: !!slug,
  });
};

export const useFeaturedProducts = () => {
  return useQuery({
    queryKey: ['products', 'featured'],
    queryFn: productsService.getFeatured,
  });
};
