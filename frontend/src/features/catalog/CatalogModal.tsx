"use client";

import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { CatalogForm } from "./CatalogForm";
import { useTranslations } from "next-intl";

interface CatalogModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CatalogModal: React.FC<CatalogModalProps> = ({ open, onOpenChange }) => {
  const t = useTranslations();

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="ens-modal-overlay" />
        <Dialog.Content className="ens-modal-content">
          <div className="ens-modal-header">
            <Dialog.Title className="ens-modal-title">
              {t("ensotek.widgets.catalog_request")}
            </Dialog.Title>
            <Dialog.Close asChild>
              <button className="ens-modal-close" aria-label="Close">
                <X size={20} />
              </button>
            </Dialog.Close>
          </div>
          <div className="ens-modal-body">
            <CatalogForm onSuccess={() => onOpenChange(false)} />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
