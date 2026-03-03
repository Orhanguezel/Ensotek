// =============================================================
// modules/auth/auth.type.ts
// Backend: src/modules/auth/schema.ts + src/modules/userRoles/schema.ts
// =============================================================

export interface User {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  is_active: boolean;
  email_verified: boolean;
  created_at: string;
  updated_at: string;
  last_sign_in_at: string | null;
  roles?: UserRole[];
}

export interface UserRole {
  id: string;
  user_id: string;
  role: 'admin' | 'moderator' | 'user';
  created_at: string;
}

// ── Request Types ────────────────────────────────────────────

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  full_name?: string;
  phone?: string;
  company_name?: string;
}

export interface PasswordResetRequestBody {
  email: string;
}

export interface PasswordResetConfirmBody {
  token: string;
  new_password: string;
}

export interface UpdateUserRequest {
  full_name?: string;
  phone?: string;
  email?: string;
  password?: string;
}

export interface ChangePasswordRequest {
  password: string;
}

// ── Response Types ───────────────────────────────────────────

export interface AuthResponse {
  access_token: string;
  refresh_token?: string;
  user: User;
}

export interface AuthStatusResponse {
  authenticated: boolean;
  user: User | null;
}

export interface GoogleOAuthStartResponse {
  url: string;
}
