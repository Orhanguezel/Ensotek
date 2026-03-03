export interface Reference {
  id: string;
  name: string;
  image_url: string;
  order: number;
}

export const referencesService = {
  getAll: async (): Promise<Reference[]> => {
     return [];
  }
};

import { useQuery } from '@tanstack/react-query';

export const useReferences = () => {
    return useQuery({
        queryKey: ['references'],
        queryFn: referencesService.getAll,
        initialData: []
    });
};
