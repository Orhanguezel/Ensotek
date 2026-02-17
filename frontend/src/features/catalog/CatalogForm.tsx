"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations, useLocale } from "next-intl";
import { catalogRequestSchema, type CatalogRequestFormData } from "./catalog.schema";
import { useRequestCatalog } from "./catalog.action";
import { Loader2 } from "lucide-react";

interface CatalogFormProps {
  onSuccess?: () => void;
}

export const CatalogForm: React.FC<CatalogFormProps> = ({ onSuccess }) => {
  const t = useTranslations();
  const locale = useLocale();
  const { mutate: submitRequest, isPending } = useRequestCatalog();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CatalogRequestFormData>({
    resolver: zodResolver(catalogRequestSchema),
    defaultValues: {
      consent_terms: false,
      consent_marketing: false,
    },
  });

  const onSubmit = (data: CatalogRequestFormData) => {
    submitRequest(
      {
        ...data,
        locale,
      },
      {
        onSuccess: () => {
          reset();
          onSuccess?.();
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="ens-form">
      <div className="row">
        <div className="col-12 mb-20">
          <div className="ens-form__group">
            <label className="ens-form__label">{t("auth.name")}</label>
            <input
              {...register("customer_name")}
              type="text"
              className={`ens-form__input ${errors.customer_name ? "is-invalid" : ""}`}
              placeholder={t("auth.name")}
            />
            {errors.customer_name && (
              <span className="ens-form__error">{errors.customer_name.message}</span>
            )}
          </div>
        </div>

        <div className="col-md-6 mb-20">
          <div className="ens-form__group">
            <label className="ens-form__label">{t("auth.email")}</label>
            <input
              {...register("email")}
              type="email"
              className={`ens-form__input ${errors.email ? "is-invalid" : ""}`}
              placeholder={t("auth.email")}
            />
            {errors.email && <span className="ens-form__error">{errors.email.message}</span>}
          </div>
        </div>

        <div className="col-md-6 mb-20">
          <div className="ens-form__group">
            <label className="ens-form__label">{t("auth.phone")}</label>
            <input
              {...register("phone")}
              type="tel"
              className={`ens-form__input ${errors.phone ? "is-invalid" : ""}`}
              placeholder={t("auth.phone")}
            />
            {errors.phone && <span className="ens-form__error">{errors.phone.message}</span>}
          </div>
        </div>

        <div className="col-12 mb-20">
          <div className="ens-form__group">
            <label className="ens-form__label">{t("ensotek.offer.company")}</label>
            <input
              {...register("company_name")}
              type="text"
              className={`ens-form__input ${errors.company_name ? "is-invalid" : ""}`}
              placeholder={t("ensotek.offer.company")}
            />
          </div>
        </div>

        <div className="col-12 mb-20">
          <div className="ens-form__group">
            <label className="ens-form__label">{t("pages.form_message")}</label>
            <textarea
              {...register("message")}
              className={`ens-form__input ens-form__textarea ${errors.message ? "is-invalid" : ""}`}
              placeholder={t("pages.form_message")}
              rows={3}
            />
          </div>
        </div>

        <div className="col-12 mb-10">
          <div className="ens-form__check">
            <input
              {...register("consent_terms")}
              type="checkbox"
              id="cat-consent-terms"
              className="ens-form__checkbox"
            />
            <label htmlFor="cat-consent-terms" className="ens-form__check-label">
              {t("ensotek.offer.consentTerms")}
            </label>
            {errors.consent_terms && (
              <div className="ens-form__error">{errors.consent_terms.message}</div>
            )}
          </div>
        </div>

        <div className="col-12 mb-30">
          <div className="ens-form__check">
            <input
              {...register("consent_marketing")}
              type="checkbox"
              id="cat-consent-marketing"
              className="ens-form__checkbox"
            />
            <label htmlFor="cat-consent-marketing" className="ens-form__check-label">
              {t("ensotek.offer.consentMarketing")}
            </label>
          </div>
        </div>

        <div className="col-12">
          <button type="submit" className="ens-btn ens-btn--primary w-100" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("common.loading")}
              </>
            ) : (
              t("common.submit")
            )}
          </button>
        </div>
      </div>
    </form>
  );
};
