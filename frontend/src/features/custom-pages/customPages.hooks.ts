import { useQuery } from '@tanstack/react-query';
import { customPagesService } from './customPages.service';
import { CustomPageListParams } from './customPages.type';

export const useCustomPages = (params?: CustomPageListParams) => {
  return useQuery({
    queryKey: ['customPages', params],
    queryFn: () => customPagesService.getAll(params),
  });
};

export const useCustomPageBySlug = (slug: string) => {
  return useQuery({
    queryKey: ['customPages', slug],
    queryFn: () => customPagesService.getBySlug(slug),
    enabled: !!slug,
  });
};
