import api from '@/lib/axios';
import type { CreateContactRequest } from './contact.type';

export const contactService = {
  submit: (data: CreateContactRequest) =>
    api.post('/contacts', data).then((r) => r.data),
};
