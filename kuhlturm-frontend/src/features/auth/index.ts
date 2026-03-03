export * from './auth.types';
export * from './auth.service';
export * from './auth.store';
export * from './auth.hooks';

// Aliases for legacy compatibility
export { useSignup as useRegister } from './auth.hooks';
export { signupSchema as registerSchema } from './auth.types';
export type { SignupRequest as RegisterFormData } from './auth.types';
export type { LoginRequest as LoginFormData } from './auth.types';
export { useLogin } from './auth.hooks';
