// =============================================================
// FILE: src/components/admin/site-settings/tabs/SeoSettingsTab.tsx
// SEO Ayarları Tab İskeleti
// =============================================================

import React from "react";

export type SeoSettingsTabProps = {
  locale: string;
};

export const SeoSettingsTab: React.FC<SeoSettingsTabProps> = ({
  locale,
}) => {
  return (
    <div className="card">
      <div className="card-header py-2 d-flex justify-content-between align-items-center">
        <span className="small fw-semibold">SEO Ayarları</span>
        <span className="badge bg-light text-dark border">
          Aktif dil: {locale || "varsayılan (backend fallback)"}
        </span>
      </div>
      <div className="card-body">
        <p className="text-muted small mb-3">
          Buraya genel SEO title/description alanları (ana sayfa, ürünler,
          kategoriler, blog, iletişim vb.) için form gelecek. Çoklu dil için
          her dilde ayrı kayıt yönetilebilir.
        </p>
        {/* TODO: SEO title / description alanlarını burada yöneteceğiz */}
      </div>
    </div>
  );
};
