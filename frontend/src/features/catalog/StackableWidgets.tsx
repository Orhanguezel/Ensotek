"use client";

import React, { useState, useEffect } from "react";
import { FileText, MessageSquare } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { CatalogModal } from "./CatalogModal";

export const StackableWidgets: React.FC = () => {
  const t = useTranslations("ensotek.widgets");
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    if (!expandedId) return;
    const timer = setTimeout(() => setExpandedId(null), 2000);
    return () => clearTimeout(timer);
  }, [expandedId]);

  const handleCatalogClick = () => {
    setExpandedId("catalog");
    setIsCatalogOpen(true);
  };

  return (
    <>
      <div className="ens-sticky-widgets">
        <button
          className={`ens-sticky-widgets__item${expandedId === "catalog" ? " is-expanded" : ""}`}
          onClick={handleCatalogClick}
          title={t("catalog_request")}
        >
          <span className="ens-sticky-widgets__icon">
            <FileText size={18} />
          </span>
          <span className="ens-sticky-widgets__label">{t("catalog_request")}</span>
        </button>

        <Link
          href="/offer"
          className={`ens-sticky-widgets__item ens-sticky-widgets__item--offer${expandedId === "offer" ? " is-expanded" : ""}`}
          title={t("offer_request")}
          onClick={() => setExpandedId("offer")}
        >
          <span className="ens-sticky-widgets__icon">
            <MessageSquare size={18} />
          </span>
          <span className="ens-sticky-widgets__label">{t("offer_request")}</span>
        </Link>
      </div>

      <CatalogModal open={isCatalogOpen} onOpenChange={setIsCatalogOpen} />
    </>
  );
};
