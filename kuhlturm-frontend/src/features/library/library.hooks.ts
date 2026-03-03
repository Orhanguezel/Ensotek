import { useQuery } from '@tanstack/react-query';
import { libraryService } from './library.service';
import { LibraryListParams } from './library.types';

export const useLibrary = (params?: LibraryListParams) => {
  return useQuery({
    queryKey: ['library', params],
    queryFn: () => libraryService.getAll(params),
  });
};

export const useLibraryItem = (slug: string) => {
  return useQuery({
    queryKey: ['library', slug],
    queryFn: () => libraryService.getBySlug(slug),
    enabled: !!slug,
  });
};

export const useLibraryFiles = (id: string) => {
    return useQuery({
      queryKey: ['library', id, 'files'],
      queryFn: () => libraryService.getFiles(id),
      enabled: !!id,
    });
};

export const useLibraryImages = (id: string) => {
    return useQuery({
      queryKey: ['library', id, 'images'],
      queryFn: () => libraryService.getImages(id),
      enabled: !!id,
    });
};
