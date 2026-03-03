import api from '@/lib/axios';

const BASE = '/newsletter';

export const newsletterService = {
  subscribe: (email: string) =>
    api.post(`${BASE}/subscribe`, { email }).then((r) => r.data),
  unsubscribe: (email: string) =>
    api.post(`${BASE}/unsubscribe`, { email }).then((r) => r.data),
};
