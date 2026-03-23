"use client";

import { useAdminUiCopy } from "@/app/(main)/admin/_components/common/useAdminUiCopy";

export function AdminFooter() {
  const { copy } = useAdminUiCopy();

  return (
    <footer className="mt-auto border-t bg-background/50 px-6 py-4 backdrop-blur-sm">
      <div className="flex flex-col items-center justify-between gap-4 text-muted-foreground text-xs sm:flex-row">
        <div className="flex items-center gap-2">
          <span className="font-semibold">{copy.app_name || "Ensotek"}</span>
          <span className="text-border">|</span>
          <span className="font-mono">{copy.app_version || "v1.4.2"}</span>
        </div>

        <div className="flex items-center gap-1">
          <span>Designed & Developed by</span>
          <a
            href={copy.developer_branding?.url || "https://guezelwebdesign.com"}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-foreground underline underline-offset-2 transition-colors hover:text-primary"
            title={copy.developer_branding?.full_name || "guezelwebdesign.com"}
          >
            {copy.developer_branding?.name || "GWD"}
          </a>
        </div>
      </div>
    </footer>
  );
}
