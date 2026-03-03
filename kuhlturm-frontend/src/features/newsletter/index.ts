import { useMutation } from '@tanstack/react-query';
import axios from '@/lib/axios';
import { toast } from 'sonner';

export const newsletterService = {
  subscribe: async (email: string): Promise<void> => {
    await axios.post('/newsletter/subscribe', { email });
  }
};

export const useSubscribe = () => {
    return useMutation({
        mutationFn: newsletterService.subscribe,
        onSuccess: () => {
            toast.success('Bültenimize abone oldunuz.');
        },
        onError: () => {
            toast.error('Abonelik işlemi başarısız.');
        }
    });
};
