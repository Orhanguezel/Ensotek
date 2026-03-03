import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-client';
import { libraryService } from './library.service';

export function useLibrary(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: queryKeys.library.list(params),
    queryFn: () => libraryService.getAll(params),
    staleTime: 10 * 60 * 1000,
  });
}

export function useLibraryItem(slug: string) {
  return useQuery({
    queryKey: queryKeys.library.bySlug(slug),
    queryFn: () => libraryService.getBySlug(slug),
    enabled: !!slug,
  });
}

export function useLibraryItemSuspense(slug: string) {
  return useSuspenseQuery({
    queryKey: queryKeys.library.bySlug(slug),
    queryFn: () => libraryService.getBySlug(slug),
  });
}

export function useLibraryImages(libraryId: string) {
  return useQuery({
    queryKey: queryKeys.library.images(libraryId),
    queryFn: () => libraryService.getImages(libraryId),
    enabled: !!libraryId,
  });
}

export function useLibraryFiles(libraryId: string) {
  return useQuery({
    queryKey: queryKeys.library.files(libraryId),
    queryFn: () => libraryService.getFiles(libraryId),
    enabled: !!libraryId,
  });
}
