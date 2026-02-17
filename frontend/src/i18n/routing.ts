import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";
import { AVAILABLE_LOCALES, FALLBACK_LOCALE } from "./locales";

export const routing = defineRouting({
  locales: AVAILABLE_LOCALES as [string, ...string[]],
  defaultLocale: FALLBACK_LOCALE,
  localePrefix: "always",
});

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
