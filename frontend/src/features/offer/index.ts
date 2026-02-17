import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import axios from '@/lib/axios';
import { toast } from 'sonner';

export const offerSchema = z.object({
  name: z.string().min(2, 'Adınız en az 2 karakter olmalıdır'),
  email: z.string().email(),
  phone: z.string().min(10, 'Telefon numarası gereklidir'),
  company_name: z.string().optional(),
  message: z.string().optional(),
  product_id: z.string().optional(),
});

export type OfferFormData = z.infer<typeof offerSchema>;

export const offerService = {
  submit: async (data: OfferFormData): Promise<void> => {
    await axios.post('/offer', data);
  }
};

export const useSubmitOffer = () => {
    return useMutation({
        mutationFn: offerService.submit,
        onSuccess: () => {
            toast.success('Teklif talebiniz alındı.');
        },
        onError: () => {
            toast.error('Talebiniz alınamadı.');
        }
    });
};
