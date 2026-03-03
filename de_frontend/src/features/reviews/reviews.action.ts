import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-client';
import { reviewsService } from './reviews.service';
import type { CreateReviewRequest, ReviewReactionRequest } from './reviews.type';

export function useReviews(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: queryKeys.reviews.list(params),
    queryFn: () => reviewsService.getAll(params),
  });
}

export function useSubmitReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateReviewRequest) => reviewsService.create(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: queryKeys.reviews.all }); },
  });
}

export function useReviewReaction(reviewId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: ReviewReactionRequest) => reviewsService.react(reviewId, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: queryKeys.reviews.all }); },
  });
}

export function useApprovedReviews() {
  return useReviews({ status: 'approved' });
}
