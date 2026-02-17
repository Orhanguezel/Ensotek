import axios from '@/lib/axios';
import { LibraryItem, LibraryFile, LibraryImage, LibraryListParams, LibraryListResult } from './library.types';

export const libraryService = {
  getAll: async (params?: LibraryListParams): Promise<LibraryListResult> => {
    const response = await axios.get<LibraryListResult>('/library', { params });
    return response.data;
  },

  getBySlug: async (slug: string): Promise<LibraryItem> => {
    const response = await axios.get<LibraryItem>(`/library/by-slug/${slug}`);
    return response.data;
  },

  getFiles: async (id: string): Promise<LibraryFile[]> => {
    const response = await axios.get<LibraryFile[]>(`/library/${id}/files`);
    return response.data;
  },

  getImages: async (id: string): Promise<LibraryImage[]> => {
    const response = await axios.get<LibraryImage[]>(`/library/${id}/images`);
    return response.data;
  }
};
