import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authService } from './auth.service';
import { useAuthStore } from './auth.store';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { AxiosError } from 'axios';

export const useLogin = () => {
  const { setUser, setToken } = useAuthStore();
  const router = useRouter();

  return useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      setToken(data.access_token);
      setUser(data.user);
      toast.success('Giriş başarılı');
      router.push('/');
    },
    onError: (error: AxiosError<any>) => {
      toast.error(error.response?.data?.message || 'Giriş başarısız');
    },
  });
};

export const useSignup = () => {
  const { setUser, setToken } = useAuthStore();
  const router = useRouter();

  return useMutation({
    mutationFn: authService.signup,
    onSuccess: (data) => {
      setToken(data.access_token);
      setUser(data.user);
      toast.success('Kayıt başarılı');
      router.push('/');
    },
    onError: (error: AxiosError<any>) => {
      toast.error(error.response?.data?.message || 'Kayıt başarısız');
    },
  });
};

export const useLogout = () => {
  const { clearAuth } = useAuthStore();
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      clearAuth();
      queryClient.clear();
      toast.success('Çıkış yapıldı');
      router.push('/login');
    },
    onError: () => {
      // Force logout on error anyway
      clearAuth();
      queryClient.clear();
      router.push('/login');
    }
  });
};

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: authService.forgotPassword,
    onSuccess: () => {
      toast.success('Şifre sıfırlama bağlantısı gönderildi');
    },
    onError: (error: AxiosError<any>) => { // eslint-disable-line @typescript-eslint/no-explicit-any
      toast.error((error.response?.data as any)?.message || 'İşlem başarısız');
    },
  });
};

export const useUser = () => {
  const { isAuthenticated } = useAuthStore();
  
  return useQuery({
    queryKey: ['auth', 'user'],
    queryFn: authService.getMe,
    enabled: isAuthenticated,
    retry: false,
  });
};
