"use client";
import React from "react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-client";
import { siteSettingsService } from "@/features/site-settings/siteSettings.service";
import { AVAILABLE_LOCALES } from "@/i18n/locales";

type LanguageSwitcherProps = {
  className?: string;
};

function normalizeLocaleCode(value: unknown): string {
  if (typeof value !== "string") return "";
  const normalized = value.trim().toLowerCase().replace("_", "-");
  if (!normalized) return "";
  return normalized.split("-")[0] || "";
}

const LanguageSwitcher = ({ className = "" }: LanguageSwitcherProps) => {
  const currentLocale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();

  // Fetch available locales from backend site settings
  const { data: appLocales } = useQuery({
    queryKey: queryKeys.siteSettings.locales(),
    queryFn: siteSettingsService.getAppLocales,
    staleTime: 60 * 1000,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
  const { data: defaultLocaleData } = useQuery({
    queryKey: queryKeys.siteSettings.defaultLocale(),
    queryFn: siteSettingsService.getDefaultLocale,
    staleTime: 60 * 1000,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  const runtimeDefaultLocale = normalizeLocaleCode(defaultLocaleData?.locale);

  const locales =
    appLocales && appLocales.length > 0
      ? appLocales
          .filter((l) => l.is_active !== false)
          .map((l) => ({
            code: normalizeLocaleCode(l.code),
            label: l.label || l.name || (l.code || "").toUpperCase(),
          }))
          .filter((l) => AVAILABLE_LOCALES.includes(l.code))
          .sort((a, b) => {
            if (a.code === runtimeDefaultLocale) return -1;
            if (b.code === runtimeDefaultLocale) return 1;
            return a.code.localeCompare(b.code);
          })
      : AVAILABLE_LOCALES.map((code) => ({
          code,
          label: code.toUpperCase(),
        }));

  const handleLocaleChange = (newLocale: string) => {
    if (!newLocale || newLocale === currentLocale) return;
    if (!AVAILABLE_LOCALES.includes(newLocale)) return;

    const currentPath = pathname || "/";
    const segments = currentPath.split("/").filter(Boolean);
    const normalizedSegments = AVAILABLE_LOCALES.includes(segments[0] || "")
      ? segments.slice(1)
      : segments;
    const suffix = normalizedSegments.join("/");
    const targetPath = suffix ? `/${newLocale}/${suffix}` : `/${newLocale}`;

    queryClient.clear();
    router.replace(targetPath);
    router.refresh();
  };

  return (
    <div className={`language-switcher ${className}`.trim()}>
      <select
        aria-label="Language"
        value={normalizeLocaleCode(currentLocale)}
        onChange={(e) => handleLocaleChange(e.target.value)}
        className="form-select form-select-sm"
        style={{
          minWidth: "108px",
          borderColor: "rgba(0,0,0,0.1)",
          color: "#666",
          fontSize: "12px",
          borderRadius: "4px",
          paddingTop: "4px",
          paddingBottom: "4px",
        }}
      >
        {locales.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSwitcher;
