import api from '@/lib/axios';
import type { MenuItem } from './menuItems.type';

const BASE = '/menu_items';

export const menuItemsService = {
  getAll: () => api.get<MenuItem[]>(BASE).then((r) => r.data),
  getById: (id: string) => api.get<MenuItem>(`${BASE}/${id}`).then((r) => r.data),
};
