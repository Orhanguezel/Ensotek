'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/features/auth/auth.store';
import { authService } from '@/features/auth/auth.service';

/**
 * Hydrates auth state on mount.
 * Listens for 'auth:logout' event from axios interceptor.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, clearAuth, setHydrated } = useAuthStore();

  useEffect(() => {
    let mounted = true;
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;

    const bootstrap = async () => {
      if (!token) {
        if (mounted) setHydrated(true);
        return;
      }

      try {
        const user = await authService.getMe();
        if (mounted) setUser(user);
      } catch {
        if (mounted) clearAuth();
      } finally {
        if (mounted) setHydrated(true);
      }
    };

    void bootstrap();

    const handleLogout = () => clearAuth();
    window.addEventListener('auth:logout', handleLogout);
    return () => {
      mounted = false;
      window.removeEventListener('auth:logout', handleLogout);
    };
  }, [setUser, clearAuth, setHydrated]);

  return <>{children}</>;
}
