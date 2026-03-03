// =============================================================
// modules/auth/auth.schema.ts
// =============================================================

import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Geçerli bir e-posta adresi giriniz'),
  password: z.string().min(6, 'Şifre en az 6 karakter olmalıdır'),
});

export const signupSchema = z.object({
  email: z.string().email('Geçerli bir e-posta adresi giriniz'),
  password: z.string().min(6, 'Şifre en az 6 karakter olmalıdır'),
  full_name: z.string().min(2, 'Ad en az 2 karakter olmalıdır').optional(),
  phone: z.string().optional(),
});

export const passwordResetRequestSchema = z.object({
  email: z.string().email('Geçerli bir e-posta adresi giriniz'),
});

export const passwordResetConfirmSchema = z.object({
  token: z.string().min(1, 'Token gerekli'),
  new_password: z.string().min(6, 'Şifre en az 6 karakter olmalıdır'),
});

export const updateUserSchema = z.object({
  full_name: z.string().min(2).optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
export type PasswordResetRequestFormData = z.infer<typeof passwordResetRequestSchema>;
export type PasswordResetConfirmFormData = z.infer<typeof passwordResetConfirmSchema>;
export type UpdateUserFormData = z.infer<typeof updateUserSchema>;
