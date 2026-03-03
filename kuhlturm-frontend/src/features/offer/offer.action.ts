import { useMutation } from '@tanstack/react-query';
import { offerService } from './offer.service';
import type { CreateOfferRequest } from './offer.type';

export function useSubmitOffer() {
  return useMutation({
    mutationFn: (data: CreateOfferRequest) => offerService.submit(data),
  });
}
