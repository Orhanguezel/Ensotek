import { z } from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '@/lib/axios';
import { toast } from 'sonner';

export const profileSchema = z.object({
  full_name: z.string().min(2, 'Ad Soyad en az 2 karakter olmalıdır'),
  email: z.string().email('Geçerli bir e-posta adresi giriniz'),
  phone: z.string().optional(),
  company_name: z.string().optional(),
  avatar_url: z.string().optional(),
});

export type ProfileFormData = z.infer<typeof profileSchema>;

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  company_name?: string;
  avatar_url?: string;
}

export const profilesService = {
  get: async (): Promise<UserProfile> => {
    const response = await axios.get<UserProfile>('/auth/user'); // Re-using auth user endpoint for profile
    return response.data;
  },
  update: async (data: ProfileFormData): Promise<UserProfile> => {
    const response = await axios.put<UserProfile>('/auth/user', data);
    return response.data;
  }
};

export const useProfile = () => {
    return useQuery({
        queryKey: ['profile'],
        queryFn: profilesService.get,
    });
};

export const useUpdateProfile = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: profilesService.update,
        onSuccess: () => {
             queryClient.invalidateQueries({ queryKey: ['profile'] });
             queryClient.invalidateQueries({ queryKey: ['auth', 'user'] });
             toast.success('Profil güncellendi');
        },
        onError: () => {
            toast.error('Profil güncellenemedi');
        }
    });
};
