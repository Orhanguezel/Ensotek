"use client";
import React, { useState, useEffect } from "react";
import * as Select from "@radix-ui/react-select";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-client";
import { siteSettingsService } from "@/features/site-settings/siteSettings.service";
import { AVAILABLE_LOCALES } from "@/i18n/locales";
import { ChevronDown, Globe } from "lucide-react";

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
  const [isMounted, setIsMounted] = useState(false);
  const currentLocale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { data: appLocales } = useQuery({
    queryKey: queryKeys.siteSettings.locales(),
    queryFn: siteSettingsService.getAppLocales,
    staleTime: 60 * 1000,
  });
  
  const { data: defaultLocaleData } = useQuery({
    queryKey: queryKeys.siteSettings.defaultLocale(),
    queryFn: siteSettingsService.getDefaultLocale,
    staleTime: 60 * 1000,
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

  const selectedLocale = locales.find(l => l.code === normalizeLocaleCode(currentLocale)) || locales[0];

  if (!isMounted) {
    return (
      <div className={`ens-lang-switcher ${className}`.trim()}>
        <button 
          className="ens-lang-switcher__trigger" 
          aria-label="Language Selector"
          type="button"
        >
          <Globe size={14} className="ens-lang-switcher__globe" />
          <span>{selectedLocale.label}</span>
          <span className="ens-lang-switcher__icon">
            <ChevronDown size={14} />
          </span>
        </button>
      </div>
    );
  }

  return (
    <div className={`ens-lang-switcher ${className}`.trim()}>
      <Select.Root value={selectedLocale.code} onValueChange={handleLocaleChange}>
        <Select.Trigger className="ens-lang-switcher__trigger" aria-label="Language Selector">
          <Globe size={14} className="ens-lang-switcher__globe" />
          <Select.Value>{selectedLocale.label}</Select.Value>
          <Select.Icon className="ens-lang-switcher__icon">
            <ChevronDown size={14} />
          </Select.Icon>
        </Select.Trigger>

        <Select.Portal>
          <Select.Content position="popper" sideOffset={5} className="ens-lang-switcher__content">
            <Select.Viewport className="ens-lang-switcher__viewport">
              {locales.map((lang) => (
                <Select.Item key={lang.code} value={lang.code} className="ens-lang-switcher__item">
                  <Select.ItemText>{lang.label}</Select.ItemText>
                </Select.Item>
              ))}
            </Select.Viewport>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </div>
  );
};

export default LanguageSwitcher;
