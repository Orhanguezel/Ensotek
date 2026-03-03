// Backend: reviews + review_i18n (polymorphic: target_type + target_id)
export interface Review {
  id: string;
  target_type: string;       // 'product' | 'service' | etc.
  target_id: string;
  name: string;
  email: string;
  rating: number;            // 1-5
  is_active: boolean;
  is_approved: boolean;
  display_order: number;
  likes_count: number;
  dislikes_count: number;
  helpful_count: number;
  submitted_locale: string;
  // i18n (coalesced)
  title: string | null;
  comment: string;
  admin_reply: string | null;
  locale: string;
  created_at: string;
  updated_at: string;
}

export interface CreateReviewRequest {
  target_type: string;
  target_id: string;
  name: string;
  email: string;
  rating: number;
  title?: string;
  comment: string;
}

export type ReactionType = 'like' | 'dislike' | 'helpful';

export interface ReviewReactionRequest {
  type: ReactionType;
}
