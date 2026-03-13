import api from '@/lib/axios';

export interface ContactPayload {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  subject?: string;
  message: string;
  source?: string;
}

export const contactService = {
  send: async (payload: ContactPayload) => {
    const res = await api.post('/contacts', { ...payload, source: 'kompozit' });
    return res.data;
  },
};
