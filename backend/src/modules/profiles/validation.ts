import { z } from 'zod';

export const profileUpsertSchema = z.object({
  full_name: z.string().min(1).max(191).optional(),
  phone: z.string().max(64).optional(),
  avatar_url: z.string().max(2048).refine((s) => s.startsWith('http://') || s.startsWith('https://') || s.startsWith('/'), 'URL veya relative path olmalı').optional(),
  address_line1: z.string().max(255).optional(),
  address_line2: z.string().max(255).optional(),
  city: z.string().max(128).optional(),
  country: z.string().max(128).optional(),
  postal_code: z.string().max(32).optional(),
});

export type ProfileUpsertInput = z.infer<typeof profileUpsertSchema>;
