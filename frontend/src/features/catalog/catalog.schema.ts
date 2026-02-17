import { z } from 'zod';

export const catalogRequestSchema = z.object({
  customer_name: z.string().min(2, 'İsim en az 2 karakter'),
  email: z.string().email('Geçerli e-posta giriniz'),
  phone: z.string().optional(),
  company_name: z.string().optional(),
  message: z.string().optional(),
  consent_terms: z.boolean().refine((v) => v === true, { message: 'Koşulları kabul etmelisiniz' }),
  consent_marketing: z.boolean().optional(),
});

export type CatalogRequestFormData = z.infer<typeof catalogRequestSchema>;
