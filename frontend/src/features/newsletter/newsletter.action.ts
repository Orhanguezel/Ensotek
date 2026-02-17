import { useMutation } from '@tanstack/react-query';
import { newsletterService } from './newsletter.service';

export function useSubscribe() {
  return useMutation({
    mutationFn: (email: string) => newsletterService.subscribe(email),
  });
}

export function useUnsubscribe() {
  return useMutation({
    mutationFn: (email: string) => newsletterService.unsubscribe(email),
  });
}
