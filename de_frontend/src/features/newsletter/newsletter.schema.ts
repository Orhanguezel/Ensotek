import { z } from 'zod';

export const newsletterSchema = z.object({
  email: z.string().email('Geçerli e-posta giriniz'),
});

export type NewsletterFormData = z.infer<typeof newsletterSchema>;
