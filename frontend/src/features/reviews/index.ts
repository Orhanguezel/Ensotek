export interface Review {
  id: string;
  author: string;
  content: string;
  rating: number; // 1-5
  avatar_url?: string;
  created_at: string;
}

export const reviewsService = {
  getAll: async (): Promise<Review[]> => {
    return [];
  },
  getApproved: async (): Promise<Review[]> => {
      return [];
  }
};

import { useQuery } from '@tanstack/react-query';

export const useReviews = () => {
    return useQuery({
        queryKey: ['reviews'],
        queryFn: reviewsService.getAll,
        initialData: []
    });
};

export const useApprovedReviews = () => {
    return useQuery({
        queryKey: ['reviews', 'approved'],
        queryFn: reviewsService.getApproved,
        initialData: []
    });
};
