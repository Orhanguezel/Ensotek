import { z } from 'zod';

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

export function fromZodSchema(schema: z.ZodTypeAny, name: string): JsonSchema {
  void name;
  return schema as unknown as JsonSchema;
}
