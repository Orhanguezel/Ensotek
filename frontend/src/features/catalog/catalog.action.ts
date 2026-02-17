import { useMutation } from '@tanstack/react-query';
import { catalogService } from './catalog.service';
import type { CreateCatalogRequest } from './catalog.type';
import { toast } from 'sonner';

export function useRequestCatalog() {
  return useMutation({
    mutationFn: (data: CreateCatalogRequest) => catalogService.submit(data),
    onSuccess: () => {
      toast.success('Katalog talebiniz iletildi. En kısa sürede size ulaşacağız.');
    },
    onError: () => {
      toast.error('Talebiniz gönderilirken bir hata oluştu. Lütfen tekrar deneyin.');
    }
  });
}
