import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

type JsonSchema = Record<string, unknown>;

export const okResponseSchema = {} as JsonSchema;

export const idParamsSchema = {
  type: 'object',
  required: ['id'],
  properties: {
    id: { type: 'string', format: 'uuid' },
  },
} satisfies JsonSchema;

export const authSecurity = [{ bearerAuth: [] }] as const;

/**
 * Zod schema'yı Fastify/ajv'nin anlayacağı JSON Schema'ya çevirir.
 * Önceden sadece cast yapıyordu — Fastify schema build patliyordu.
 */
export function fromZodSchema(schema: z.ZodTypeAny, name: string): JsonSchema {
  return zodToJsonSchema(schema, {
    name,
    target: 'jsonSchema7',
    $refStrategy: 'none',
  }) as JsonSchema;
}
