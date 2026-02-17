import axios from '@/lib/axios';
import { AuthResponse, LoginRequest, SignupRequest, User } from './auth.type';

export const authService = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await axios.post('/auth/token', {
      grant_type: 'password',
      email: data.email,
      password: data.password,
    });
    return response.data;
  },

  signup: async (data: SignupRequest): Promise<AuthResponse> => {
    const response = await axios.post('/auth/signup', data);
    return response.data;
  },

  logout: async (): Promise<void> => {
    // await axios.post('/auth/logout');
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
  },

  forgotPassword: async (data: { email: string }): Promise<void> => {
    await axios.post('/auth/forgot-password', data);
  },

  getMe: async (): Promise<User> => {
    const response = await axios.get('/auth/user');
    return response.data;
  },

  refreshToken: async (token: string): Promise<{ access_token: string }> => {
    const response = await axios.post('/auth/token/refresh', { refresh_token: token });
    return response.data;
  },

  getStatus: async (): Promise<boolean> => {
    const response = await axios.get('/auth/status');
    return response.data;
  },

  updateUser: async (data: any): Promise<User> => {
    const response = await axios.put('/auth/user', data);
    return response.data;
  },

  changePassword: async (password: string): Promise<void> => {
    await axios.put('/auth/user', { password });
  },

  confirmPasswordReset: async (data: any): Promise<void> => {
    await axios.post('/auth/password-reset/confirm', data);
  },

  googleStart: async (): Promise<{ url: string }> => {
    const response = await axios.post('/auth/google/start');
    return response.data;
  },

  googleToken: async (code: string): Promise<AuthResponse> => {
    const response = await axios.post('/auth/google', { code });
    return response.data;
  },
};
