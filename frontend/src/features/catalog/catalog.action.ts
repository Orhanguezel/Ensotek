import { useMutation } from '@tanstack/react-query';
import { catalogService } from './catalog.service';
import type { CreateCatalogRequest } from './catalog.type';

export function useRequestCatalog() {
  return useMutation({
    mutationFn: (data: CreateCatalogRequest) => catalogService.submit(data),
  });
}
