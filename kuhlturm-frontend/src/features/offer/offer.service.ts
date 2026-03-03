import api from '@/lib/axios';
import type { Offer, CreateOfferRequest } from './offer.type';

export const offerService = {
  submit: (data: CreateOfferRequest) =>
    api.post<Offer>('/offers', data).then((r) => r.data),
};
