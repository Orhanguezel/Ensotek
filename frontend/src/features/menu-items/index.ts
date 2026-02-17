export interface MenuItem {
  id: string;
  label: string;
  url: string;
  children?: MenuItem[];
  order: number;
}

export const menuItemsService = {
  getAll: async (): Promise<MenuItem[]> => {
    // const response = await import('@/lib/axios').then(m => m.default.get<MenuItem[]>('/menu-items'));
    // return response.data;
     return [
        { id: '1', label: 'Anasayfa', url: '/', order: 1 },
        { id: '2', label: 'Hakkımızda', url: '/about', order: 2 },
        { id: '3', label: 'Ürünler', url: '/products', order: 3 },
        { id: '4', label: 'İletişim', url: '/contact', order: 4 },
     ];
  }
};

import { useQuery } from '@tanstack/react-query';

export const useMenuItems = () => {
    return useQuery({
        queryKey: ['menu-items'],
        queryFn: menuItemsService.getAll,
        initialData: []
    });
};
