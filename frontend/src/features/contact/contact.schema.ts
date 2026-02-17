import { z } from 'zod';

export const contactFormSchema = z.object({
  name: z.string().min(2, 'İsim en az 2 karakter'),
  email: z.string().email('Geçerli e-posta giriniz'),
  phone: z.string().min(5, 'Geçerli telefon giriniz'),
  subject: z.string().min(3, 'Konu en az 3 karakter'),
  message: z.string().min(10, 'Mesaj en az 10 karakter'),
  website: z.string().max(0).optional(),  // honeypot: must be empty
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
