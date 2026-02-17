import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-client';
import { profilesService } from './profiles.service';
import type { UpdateProfileRequest } from './profiles.type';

export function useProfile(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: queryKeys.profiles.me(),
    queryFn: profilesService.getMe,
    enabled: options?.enabled ?? true,
  });
}

export function useUpdateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateProfileRequest) => profilesService.updateMe(data),
    onSuccess: (profile) => {
      qc.setQueryData(queryKeys.profiles.me(), profile);
    },
  });
}
