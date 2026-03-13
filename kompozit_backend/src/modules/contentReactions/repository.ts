import type { FastifyInstance } from 'fastify';
import type { ContentReactionCreateInput, ContentReactionTargetInput } from './validation';

export async function repoGetContentReactionSummary(
  app: FastifyInstance,
  input: ContentReactionTargetInput,
) {
  const mysql = (app as any).mysql;
  const [rows] = await mysql.query(
    `
    SELECT target_type, target_id, likes_count
    FROM content_reaction_totals
    WHERE target_type = ? AND target_id = ?
    LIMIT 1
    `,
    [input.target_type, input.target_id],
  );

  const row = (rows as any[])[0];

  return {
    target_type: input.target_type,
    target_id: input.target_id,
    likes_count: Number(row?.likes_count ?? 0),
  };
}

export async function repoAddContentReaction(
  app: FastifyInstance,
  input: ContentReactionCreateInput,
) {
  const mysql = (app as any).mysql;

  await mysql.query(
    `
    INSERT INTO content_reaction_totals
      (target_type, target_id, likes_count, created_at, updated_at)
    VALUES
      (?, ?, 1, NOW(3), NOW(3))
    ON DUPLICATE KEY UPDATE
      likes_count = likes_count + 1,
      updated_at = NOW(3)
    `,
    [input.target_type, input.target_id],
  );

  return repoGetContentReactionSummary(app, input);
}
