import { useMutation } from '@tanstack/react-query';
import { contactService } from './contact.service';
import type { CreateContactRequest } from './contact.type';

export function useSubmitContact() {
  return useMutation({
    mutationFn: (data: CreateContactRequest) => contactService.submit(data),
  });
}
