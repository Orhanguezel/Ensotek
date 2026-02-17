"use client";

import React, { useState } from "react";
import { FileText, MessageSquare } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { CatalogModal } from "./CatalogModal";

export const StackableWidgets: React.FC = () => {
  const t = useTranslations("ensotek.widgets");
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);

  return (
    <>
      <div className="ens-sticky-widgets">
        <button
          className="ens-sticky-widgets__item"
          onClick={() => setIsCatalogOpen(true)}
          title={t("catalog_request")}
        >
          <span className="ens-sticky-widgets__icon">
            <FileText size={18} />
          </span>
          {t("catalog_request")}
        </button>

        <Link
          href="/offer"
          className="ens-sticky-widgets__item ens-sticky-widgets__item--offer"
          title={t("offer_request")}
        >
          <span className="ens-sticky-widgets__icon">
            <MessageSquare size={18} />
          </span>
          {t("offer_request")}
        </Link>
      </div>

      <CatalogModal open={isCatalogOpen} onOpenChange={setIsCatalogOpen} />
    </>
  );
};
