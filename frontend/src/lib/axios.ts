// =============================================================
// lib/axios.ts — Axios HTTP client
// =============================================================

import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

// If env variable is set, use it. Otherwise fallback.
// Note: If NEXT_PUBLIC_API_URL includes /api, we should use it directly or handle it.
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15_000,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true, // cookie-based refresh token
});

// ── Request Interceptor ──────────────────────────────────────
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  // Auth token
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  // Locale headers for backend locale resolution
  if (typeof window !== 'undefined') {
    const locale = document.documentElement.lang || 'tr';
    config.headers['x-locale'] = locale;
    config.headers['accept-language'] = locale;
  }

  return config;
});

// ── Response Interceptor (401 → refresh → retry) ────────────
let isRefreshing = false;
let failedQueue: {
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}[] = [];

const processQueue = (error: unknown, token: string | null) => {
  failedQueue.forEach((p) => {
    if (token) p.resolve(token);
    else p.reject(error);
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Skip refresh for auth endpoints
    if (
      error.response?.status !== 401 ||
      originalRequest._retry ||
      originalRequest.url?.includes('/auth/token')
    ) {
      return Promise.reject(normalizeError(error));
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: (token: string) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(api(originalRequest));
          },
          reject,
        });
      });
    }

    isRefreshing = true;
    originalRequest._retry = true;

    try {
      // Construct refresh URL correctly
      const refreshUrl = API_BASE_URL.endsWith('/api') 
        ? `${API_BASE_URL}/auth/token/refresh` 
        : `${API_BASE_URL}/api/auth/token/refresh`;

      const { data } = await axios.post(
        refreshUrl,
        {},
        { withCredentials: true },
      );

      const newToken = data.access_token || data.data?.access_token;
      if (newToken) {
        localStorage.setItem('access_token', newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        processQueue(null, newToken);
        return api(originalRequest);
      }

      throw new Error('No token in refresh response');
    } catch (refreshError) {
      processQueue(refreshError, null);
      // Clear auth state
      if (typeof window !== 'undefined') {
        localStorage.removeItem('access_token');
        // Redirect to login can be handled by AuthProvider
        window.dispatchEvent(new Event('auth:logout'));
      }
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

// ── Error normalizer ─────────────────────────────────────────
function normalizeError(error: AxiosError) {
  if (error.response?.data) {
    const data = error.response.data as Record<string, unknown>;
    return {
      statusCode: error.response.status,
      message: (data.message as string) || error.message,
      error: data.error as string | undefined,
    };
  }
  return {
    statusCode: 0,
    message: error.message || 'Network error',
    error: 'NETWORK_ERROR',
  };
}

export default api;
