// =============================================================
// modules/auth/auth.action.ts
// =============================================================

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-client';
import { authService } from './auth.service';
import { useAuthStore } from './auth.store';
import type {
  LoginRequest,
  SignupRequest,
  PasswordResetRequestBody,
  PasswordResetConfirmBody,
  ChangePasswordRequest,
  UpdateUserRequest,
} from './auth.type';

// ── Queries ──────────────────────────────────────────────────

export function useUser() {
  return useQuery({
    queryKey: queryKeys.auth.user(),
    queryFn: authService.getMe,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
}

export function useAuthStatus() {
  return useQuery({
    queryKey: queryKeys.auth.status(),
    queryFn: authService.getStatus,
    retry: false,
  });
}

// ── Mutations ────────────────────────────────────────────────

export function useLogin() {
  const qc = useQueryClient();
  const { setUser, setToken } = useAuthStore();

  return useMutation({
    mutationFn: (data: LoginRequest) => authService.login(data),
    onSuccess: (res) => {
      setToken(res.access_token);
      setUser(res.user);
      qc.setQueryData(queryKeys.auth.user(), res.user);
    },
  });
}

export function useSignup() {
  const qc = useQueryClient();
  const { setUser, setToken } = useAuthStore();

  return useMutation({
    mutationFn: (data: SignupRequest) => authService.signup(data),
    onSuccess: (res) => {
      setToken(res.access_token);
      setUser(res.user);
      qc.setQueryData(queryKeys.auth.user(), res.user);
    },
  });
}

export function useLogout() {
  const qc = useQueryClient();
  const { clearAuth } = useAuthStore();

  return useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      clearAuth();
      qc.removeQueries({ queryKey: queryKeys.auth.all });
    },
  });
}

export function useUpdateUser() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateUserRequest) => authService.updateUser(data),
    onSuccess: (user) => {
      qc.setQueryData(queryKeys.auth.user(), user);
    },
  });
}

export function useRequestPasswordReset() {
  return useMutation({
    mutationFn: (data: PasswordResetRequestBody) => authService.forgotPassword(data),
  });
}

export function useConfirmPasswordReset() {
  return useMutation({
    mutationFn: (data: PasswordResetConfirmBody) => authService.confirmPasswordReset(data),
  });
}

export function useGoogleStart() {
  return useMutation({
    mutationFn: authService.googleStart,
  });
}

export function useGoogleToken() {
  const qc = useQueryClient();
  const { setUser, setToken } = useAuthStore();

  return useMutation({
    mutationFn: (code: string) => authService.googleToken(code),
    onSuccess: (res) => {
      setToken(res.access_token);
      setUser(res.user);
      qc.setQueryData(queryKeys.auth.user(), res.user);
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (data: ChangePasswordRequest) => authService.changePassword(data.password),
  });
}
