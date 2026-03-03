export interface FAQ {
  id: string;
  question: string;
  answer: string;
  order: number;
}

export const faqsService = {
  getAll: async (): Promise<FAQ[]> => {
    return [];
  }
};

import { useQuery } from '@tanstack/react-query';

export const useFaqs = () => {
    return useQuery({
        queryKey: ['faqs'],
        queryFn: faqsService.getAll,
        initialData: []
    });
};
