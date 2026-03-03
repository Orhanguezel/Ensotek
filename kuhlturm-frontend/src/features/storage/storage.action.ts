import { useMutation } from '@tanstack/react-query';
import { storageService } from './storage.service';

export function useUploadFile(bucket: string) {
  return useMutation({
    mutationFn: ({ file, folder }: { file: File; folder?: string }) =>
      storageService.upload(bucket, file, folder),
  });
}
