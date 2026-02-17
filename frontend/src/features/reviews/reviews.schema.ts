import { z } from 'zod';

export const reviewSchema = z.object({
  target_type: z.string().min(1),
  target_id: z.string().min(1),
  name: z.string().min(2, 'İsim en az 2 karakter'),
  email: z.string().email('Geçerli e-posta giriniz'),
  rating: z.number().min(1).max(5),
  title: z.string().optional(),
  comment: z.string().min(3, 'Yorum en az 3 karakter'),
});

export type ReviewFormData = z.infer<typeof reviewSchema>;
