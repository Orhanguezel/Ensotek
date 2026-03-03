import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-client';
import { projectsService } from './projects.service';
import type { ProjectListParams } from './projects.type';

export function useProjects(params?: ProjectListParams) {
  return useQuery({
    queryKey: queryKeys.projects.list(params as Record<string, unknown>),
    queryFn: () => projectsService.getAll(params),
    staleTime: 10 * 60 * 1000,
  });
}

export function useProjectBySlug(slug: string, params?: Record<string, unknown>) {
  return useQuery({
    queryKey: queryKeys.projects.bySlug(slug, params),
    queryFn: () => projectsService.getBySlug(slug, params),
    enabled: !!slug,
  });
}

export function useProjectBySlugSuspense(slug: string, params?: Record<string, unknown>) {
  return useSuspenseQuery({
    queryKey: queryKeys.projects.bySlug(slug, params),
    queryFn: () => projectsService.getBySlug(slug, params),
  });
}

export function useProjectImages(projectId: string, params?: Record<string, unknown>) {
  return useQuery({
    queryKey: queryKeys.projects.images(projectId),
    queryFn: () => projectsService.getImages(projectId, params),
    enabled: !!projectId,
    staleTime: 10 * 60 * 1000,
  });
}
