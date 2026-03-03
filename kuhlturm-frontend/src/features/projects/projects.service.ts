import api from '@/lib/axios';
import type { Project, ProjectImage, ProjectListParams } from './projects.type';

const BASE = '/projects';

export const projectsService = {
  getAll: (params?: ProjectListParams) =>
    api.get<Project[]>(BASE, { params }).then((r) => r.data),

  getById: (id: string, params?: Record<string, unknown>) =>
    api.get<Project>(`${BASE}/${id}`, { params }).then((r) => r.data),

  getBySlug: (slug: string, params?: Record<string, unknown>) =>
    api.get<Project>(`${BASE}/by-slug/${slug}`, { params }).then((r) => r.data),

  getImages: (projectId: string, params?: Record<string, unknown>) =>
    api.get<ProjectImage[]>(`${BASE}/${projectId}/images`, { params }).then((r) => r.data),
};
