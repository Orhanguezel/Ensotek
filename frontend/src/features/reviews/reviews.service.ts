import api from '@/lib/axios';
import type { Review, CreateReviewRequest, ReviewReactionRequest } from './reviews.type';

const BASE = '/reviews';

export const reviewsService = {
  getAll: (params?: Record<string, unknown>) =>
    api.get<Review[]>(BASE, { params }).then((r) => r.data),
  getById: (id: string) =>
    api.get<Review>(`${BASE}/${id}`).then((r) => r.data),
  create: (data: CreateReviewRequest) =>
    api.post<Review>(BASE, data).then((r) => r.data),
  react: (id: string, data: ReviewReactionRequest) =>
    api.post(`${BASE}/${id}/reactions`, data).then((r) => r.data),
};
