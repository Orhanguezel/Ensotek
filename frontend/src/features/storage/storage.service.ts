import api from '@/lib/axios';
import type { UploadResponse } from './storage.type';

export const storageService = {
  // GET /storage/{bucket}/{*} — get file URL (public)
  getFileUrl: (bucket: string, path: string) =>
    `${api.defaults.baseURL}/storage/${bucket}/${path}`,

  // POST /storage/{bucket}/upload — upload file (auth required)
  upload: (bucket: string, file: File, folder?: string) => {
    const formData = new FormData();
    formData.append('file', file);
    if (folder) formData.append('folder', folder);

    return api
      .post<UploadResponse>(`/storage/${bucket}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((r) => r.data);
  },
};
