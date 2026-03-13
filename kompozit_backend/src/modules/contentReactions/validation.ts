import { z } from 'zod';

export const ContentReactionTargetSchema = z.object({
  target_type: z.string().trim().min(1).max(50),
  target_id: z.string().trim().min(1).max(36),
});

export const ContentReactionCreateSchema = ContentReactionTargetSchema.extend({
  type: z.enum(['like']).default('like'),
});

export type ContentReactionTargetInput = z.infer<typeof ContentReactionTargetSchema>;
export type ContentReactionCreateInput = z.infer<typeof ContentReactionCreateSchema>;
