// Re-export from shared core — single source of truth
import type { ReactionType } from '@ensotek/core/types';

export type {
  Review,
  CreateReviewRequest,
  ReactionType,
  ReviewListParams,
} from '@ensotek/core/types';

// Client-only request body type
export interface ReviewReactionRequest {
  type: ReactionType;
}
