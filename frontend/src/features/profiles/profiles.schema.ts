import { z } from 'zod';

export const profileSchema = z.object({
  full_name: z.string().min(2).optional(),
  phone: z.string().optional(),
  avatar_url: z.string().url().optional().or(z.literal('')),
  address_line1: z.string().optional(),
  address_line2: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  postal_code: z.string().optional(),
});

export type ProfileFormData = z.infer<typeof profileSchema>;
