export interface FooterSection {
  id: string;
  title: string;
  content: string; // HTML or text
}

export const footerSectionsService = {
  getAll: async (): Promise<FooterSection[]> => {
    return [];
  }
};

import { useQuery } from '@tanstack/react-query';

export const useFooterSections = () => {
    return useQuery({
        queryKey: ['footer-sections'],
        queryFn: footerSectionsService.getAll,
        initialData: []
    });
};
