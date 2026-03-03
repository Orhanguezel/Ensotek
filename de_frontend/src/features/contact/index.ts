import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import axios from '@/lib/axios';
import { toast } from 'sonner';

export const contactFormSchema = z.object({
  name: z.string().min(2, 'Adınız en az 2 karakter olmalıdır'),
  email: z.string().email(),
  subject: z.string().min(1, 'Konu gereklidir'),
  message: z.string().min(10, 'Mesajınız en az 10 karakter olmalıdır'),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

export const contactService = {
  submit: async (data: ContactFormData): Promise<void> => {
    await axios.post('/contact', data);
  }
};

export const useSubmitContact = () => {
    return useMutation({
        mutationFn: contactService.submit,
        onSuccess: () => {
            toast.success('Mesajınız gönderildi.');
        },
        onError: () => {
            toast.error('Mesaj gönderilemedi.');
        }
    });
};
