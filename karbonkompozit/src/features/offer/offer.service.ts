import api from '@/lib/axios';

export interface OfferPayload {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message?: string;
  product_interest?: string;
  quantity?: string;
  source?: string;
}

export const offerService = {
  create: async (payload: OfferPayload) => {
    const res = await api.post('/offers', { ...payload, source: 'kompozit' });
    return res.data;
  },
};
