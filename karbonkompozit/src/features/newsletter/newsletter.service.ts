import api from '@/lib/axios';

export const newsletterService = {
  subscribe: async (email: string) => {
    const res = await api.post('/newsletter/subscribe', { email, source: 'kompozit' });
    return res.data;
  },
};
