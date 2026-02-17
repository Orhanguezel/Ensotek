import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import axios from '@/lib/axios';
import { toast } from 'sonner';

export const catalogRequestSchema = z.object({
  name: z.string().min(2, 'Adınız en az 2 karakter olmalıdır'),
  email: z.string().email(),
  company_name: z.string().optional(),
  phone: z.string().optional(),
});

export type CatalogRequestFormData = z.infer<typeof catalogRequestSchema>;

export const catalogService = {
  request: async (data: CatalogRequestFormData): Promise<void> => {
    await axios.post('/catalog-request', data);
  }
};

export const useRequestCatalog = () => {
    return useMutation({
        mutationFn: catalogService.request,
        onSuccess: () => {
            toast.success('Katalog talebiniz alındı.');
        },
        onError: () => {
            toast.error('Talebiniz alınamadı.');
        }
    });
};
