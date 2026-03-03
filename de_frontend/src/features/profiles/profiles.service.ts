import api from '@/lib/axios';
import type { Profile, UpdateProfileRequest } from './profiles.type';

const BASE = '/profiles';

export const profilesService = {
  getMe: () => api.get<Profile>(`${BASE}/me`).then((r) => r.data),
  updateMe: (data: UpdateProfileRequest) =>
    api
      .put<Profile>(`${BASE}/me`, { profile: data })
      .then((r) => r.data),
};
