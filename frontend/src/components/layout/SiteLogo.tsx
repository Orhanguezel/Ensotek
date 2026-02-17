"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/lib/query-client";
import { siteSettingsService } from "@/features/site-settings/siteSettings.service";
import FallbackLogo from "public/img/logo/logo.png";

type Variant = "default" | "dark" | "light";

type SiteLogoProps = {
  variant?: Variant;
  alt?: string;
  className?: string;
  priority?: boolean;
};

const DEFAULT_W = 160;
const DEFAULT_H = 60;

const variantKeyMap: Record<Variant, string> = {
  default: "site_logo",
  dark: "site_logo_dark",
  light: "site_logo_light",
};

const safeStr = (v: unknown) => (v === null || v === undefined ? "" : String(v).trim());

const pickUrl = (obj: Record<string, unknown> | null | undefined) =>
  safeStr(obj?.url) || safeStr(obj?.src) || safeStr(obj?.path);

function extractMedia(value: unknown): { url: string; width?: number; height?: number } {
  if (value === null || value === undefined) return { url: "" };

  if (typeof value === "string") {
    const raw = value.trim();
    if (!raw) return { url: "" };

    const looksLikeJson =
      (raw.startsWith("{") && raw.endsWith("}")) || (raw.startsWith("[") && raw.endsWith("]"));

    if (!looksLikeJson) return { url: raw };

    try {
      const parsed = JSON.parse(raw) as
        | { url?: unknown; src?: unknown; path?: unknown; width?: unknown; height?: unknown }
        | Array<{ url?: unknown; src?: unknown; path?: unknown; width?: unknown; height?: unknown }>;
      const item = Array.isArray(parsed) ? parsed[0] : parsed;
      const url = pickUrl(item);
      return {
        url,
        width: typeof item?.width === "number" ? item.width : undefined,
        height: typeof item?.height === "number" ? item.height : undefined,
      };
    } catch {
      return { url: raw };
    }
  }

  if (typeof value === "object") {
    const parsed = value as
      | { url?: unknown; src?: unknown; path?: unknown; width?: unknown; height?: unknown }
      | Array<{ url?: unknown; src?: unknown; path?: unknown; width?: unknown; height?: unknown }>;
    const obj = Array.isArray(parsed) ? parsed[0] : parsed;
    return {
      url: pickUrl(obj),
      width: typeof obj?.width === "number" ? obj.width : undefined,
      height: typeof obj?.height === "number" ? obj.height : undefined,
    };
  }

  return { url: "" };
}

export default function SiteLogo({
  variant = "default",
  alt = "Ensotek",
  className,
  priority = true,
}: SiteLogoProps) {
  const { data: siteSettings } = useQuery({
    queryKey: queryKeys.siteSettings.list(),
    queryFn: siteSettingsService.getAll,
    staleTime: 10 * 60 * 1000,
  });

  const srcMeta = useMemo(() => {
    const preferredKey = variantKeyMap[variant];
    const fallbackKeys = ["site_logo", "site_logo_light", "site_logo_dark"];
    const keys = [preferredKey, ...fallbackKeys.filter((k) => k !== preferredKey)];

    for (const key of keys) {
      const setting = siteSettings?.find((s: any) => s.key === key);
      const media = extractMedia(setting?.value);
      if (media.url) {
        return media;
      }
    }
    return { url: "", width: DEFAULT_W, height: DEFAULT_H };
  }, [siteSettings, variant]);

  const logoSrc = useMemo(() => {
    if (!srcMeta.url) return "";
    const preferredKey = variantKeyMap[variant];
    const fallbackKeys = ["site_logo", "site_logo_light", "site_logo_dark"];
    const keys = [preferredKey, ...fallbackKeys.filter((k) => k !== preferredKey)];
    const matchedSetting = keys
      .map((key) => siteSettings?.find((s: any) => s.key === key))
      .find((s) => extractMedia(s?.value).url === srcMeta.url);
    const version = matchedSetting?.updated_at ? String(matchedSetting.updated_at) : "";
    if (!version) return srcMeta.url;
    const separator = srcMeta.url.includes("?") ? "&" : "?";
    return `${srcMeta.url}${separator}v=${encodeURIComponent(version)}`;
  }, [siteSettings, srcMeta.url, variant]);

  if (!logoSrc) {
    return <Image src={FallbackLogo} alt={alt} className={className} priority={priority} />;
  }

  return (
    <Image
      src={logoSrc}
      alt={alt}
      width={srcMeta.width || DEFAULT_W}
      height={srcMeta.height || DEFAULT_H}
      className={className}
      sizes="(max-width: 992px) 120px, 160px"
      priority={priority}
    />
  );
}
