// src/components/i18n/LanguageSwitcher.tsx
"use client";
import Link from "next/link";
import { useRouter } from "next/router";
import { LOCALES} from "@/i18n/config";
import type { SupportedLocale } from "@/types/common";

import { localizePath } from "@/i18n/url";

export default function LanguageSwitcher() {
  const router = useRouter();
  const { asPath } = router;

  return (
    <nav aria-label="Language switcher">
      <ul className="list-inline m-0">
        {LOCALES.map((l) => (
          <li key={l} className="list-inline-item">
            <Link href={localizePath(l as SupportedLocale, asPath)}>
              {l.toUpperCase()}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
