import api from '@/lib/axios';
import type { CatalogRequest, CreateCatalogRequest } from './catalog.type';

export const catalogService = {
  submit: (data: CreateCatalogRequest) =>
    api.post<CatalogRequest>('/catalog-requests', data).then((r) => r.data),
};
