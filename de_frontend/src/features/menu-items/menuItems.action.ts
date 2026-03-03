import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-client';
import { menuItemsService } from './menuItems.service';

export function useMenuItems() {
  return useQuery({
    queryKey: queryKeys.menuItems.list(),
    queryFn: menuItemsService.getAll,
    staleTime: 5 * 60 * 1000,
  });
}

export function useMenuItem(id: string) {
  return useQuery({
    queryKey: queryKeys.menuItems.detail(id),
    queryFn: () => menuItemsService.getById(id),
    enabled: !!id,
  });
}
