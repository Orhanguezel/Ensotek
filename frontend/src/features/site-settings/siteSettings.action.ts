import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-client';
import { siteSettingsService } from './siteSettings.service';

export function useSiteSettings() {
  return useQuery({
    queryKey: queryKeys.siteSettings.list(),
    queryFn: siteSettingsService.getAll,
    staleTime: 5 * 60 * 1000,
  });
}

export function useSiteSetting(key: string) {
  return useQuery({
    queryKey: queryKeys.siteSettings.byKey(key),
    queryFn: () => siteSettingsService.getByKey(key),
    enabled: !!key,
  });
}

export function useAppLocales() {
  return useQuery({
    queryKey: queryKeys.siteSettings.locales(),
    queryFn: siteSettingsService.getAppLocales,
    staleTime: 30 * 60 * 1000,
  });
}

export function useDefaultLocale() {
  return useQuery({
    queryKey: queryKeys.siteSettings.defaultLocale(),
    queryFn: siteSettingsService.getDefaultLocale,
    staleTime: 30 * 60 * 1000,
  });
}
