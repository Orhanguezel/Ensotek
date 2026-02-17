"use client";

import { FormEvent, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-client";
import { siteSettingsService } from "@/features/site-settings/siteSettings.service";
import { useSubmitContact } from "@/features/contact/contact.action";
import { contactFormSchema } from "@/features/contact/contact.schema";
import Banner from "@/components/layout/banner/Banner";

type ContactInfo = {
  companyName?: string;
  email?: string;
  phones?: string[];
  address?: string;
  addressSecondary?: string;
  website?: string;
};

type ContactMap = {
  title?: string;
  height?: number;
  query?: string;
  embed_url?: string;
};

type SocialLinks = {
  facebook?: string;
  x?: string;
  youtube?: string;
  linkedin?: string;
  instagram?: string;
};

type FormState = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  website: string;
};

const initialForm: FormState = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
  website: "",
};

export default function ContactPage() {
  const t = useTranslations();
  const submitContact = useSubmitContact();
  const [form, setForm] = useState<FormState>(initialForm);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const { data: siteSettings } = useQuery({
    queryKey: queryKeys.siteSettings.list(),
    queryFn: siteSettingsService.getAll,
    staleTime: 60 * 1000,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  const settingsByKey = useMemo(() => {
    const map = new Map<string, unknown>();
    (siteSettings || []).forEach((item: any) => {
      map.set(item.key, item.value);
    });
    return map;
  }, [siteSettings]);

  const companyBrand = (settingsByKey.get("company_brand") || {}) as {
    shortName?: string;
  };
  const contactInfo = (settingsByKey.get("contact_info") || {}) as ContactInfo;
  const contactMap = (settingsByKey.get("contact_map") || {}) as ContactMap;
  const socialLinks = (settingsByKey.get("socials") || {}) as SocialLinks;

  const phones = Array.isArray(contactInfo.phones) ? contactInfo.phones : [];
  const mapHeight = Number(contactMap.height || 420);
  const mapEmbedUrl =
    contactMap.embed_url ||
    (contactMap.query
      ? `https://www.google.com/maps?q=${encodeURIComponent(
          contactMap.query,
        )}&output=embed`
      : "");

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const parsed = contactFormSchema.safeParse(form);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message || t("pages.form_error"));
      return;
    }

    try {
      await submitContact.mutateAsync(parsed.data);
      setSuccess(t("pages.form_success"));
      setForm(initialForm);
    } catch {
      setError(t("pages.form_error"));
    }
  };

  return (
    <>
      <Banner title={t("pages.contact")} />

      <section
        className="touch__arae touch-bg include__bg pt-120 pb-120"
        data-background="assets/img/shape/touch-shape.png"
      >
        <div className="container">
          <div className="row">
            <div className="col-xl-4 col-lg-5">
              <div className="touch__left mb-60">
                <div className="section__title-wrapper">
                  <span className="section__subtitle s-2">
                    <span>{t("pages.contact_subtitle")}</span>
                  </span>
                  <h2 className="section__title s-2 mb-30">
                    <span className="down__mark-line">{t("pages.contact")}</span>
                  </h2>
                </div>

                <p>{contactInfo.companyName || companyBrand.shortName || "Ensotek"}</p>
                {contactInfo.address && <p>{contactInfo.address}</p>}
                {contactInfo.email && <p>{contactInfo.email}</p>}
                {phones[0] && <p>{phones[0]}</p>}
                {contactInfo.website && <p>{contactInfo.website}</p>}

                <div className="touch__social">
                  {socialLinks.facebook && (
                    <Link href={socialLinks.facebook} target="_blank" rel="noreferrer">
                      <i className="fa-brands fa-facebook-f"></i>
                    </Link>
                  )}
                  {socialLinks.x && (
                    <Link href={socialLinks.x} target="_blank" rel="noreferrer">
                      <i className="fa-brands fa-twitter"></i>
                    </Link>
                  )}
                  {socialLinks.youtube && (
                    <Link href={socialLinks.youtube} target="_blank" rel="noreferrer">
                      <i className="fa-brands fa-youtube"></i>
                    </Link>
                  )}
                  {socialLinks.linkedin && (
                    <Link href={socialLinks.linkedin} target="_blank" rel="noreferrer">
                      <i className="fa-brands fa-linkedin"></i>
                    </Link>
                  )}
                  {socialLinks.instagram && (
                    <Link href={socialLinks.instagram} target="_blank" rel="noreferrer">
                      <i className="fa-brands fa-instagram"></i>
                    </Link>
                  )}
                </div>
              </div>
            </div>

            <div className="col-xl-8 col-lg-8">
              <div className="touch__contact p-relative">
                <div className="touch__carcle"></div>
                <div className="touch__content-title">
                  <h3>{t("pages.contact_subtitle")}</h3>
                </div>
                <form onSubmit={onSubmit}>
                  <div className="row">
                    <div className="col-lg-6">
                      <div className="touch__input">
                        <input
                          type="text"
                          placeholder={t("pages.form_name")}
                          value={form.name}
                          onChange={(e) =>
                            setForm((prev) => ({ ...prev, name: e.target.value }))
                          }
                          required
                        />
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="touch__input">
                        <input
                          type="email"
                          placeholder={t("pages.form_email")}
                          value={form.email}
                          onChange={(e) =>
                            setForm((prev) => ({ ...prev, email: e.target.value }))
                          }
                          required
                        />
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="touch__input">
                        <input
                          type="text"
                          placeholder={t("pages.form_phone")}
                          value={form.phone}
                          onChange={(e) =>
                            setForm((prev) => ({ ...prev, phone: e.target.value }))
                          }
                          required
                        />
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="touch__input">
                        <input
                          type="text"
                          placeholder={t("pages.form_subject")}
                          value={form.subject}
                          onChange={(e) =>
                            setForm((prev) => ({ ...prev, subject: e.target.value }))
                          }
                          required
                        />
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="touch__input">
                        <textarea
                          className="touch__textarea"
                          placeholder={t("pages.form_message")}
                          value={form.message}
                          onChange={(e) =>
                            setForm((prev) => ({ ...prev, message: e.target.value }))
                          }
                          rows={5}
                          required
                        />
                      </div>
                    </div>

                    <input
                      type="text"
                      value={form.website}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, website: e.target.value }))
                      }
                      autoComplete="off"
                      tabIndex={-1}
                      style={{ display: "none" }}
                    />

                    <div className="col-12">
                      {error && <p style={{ color: "#d9534f", marginBottom: "10px" }}>{error}</p>}
                      {success && <p style={{ color: "#198754", marginBottom: "10px" }}>{success}</p>}

                      <div className="touch__submit">
                        <button className="border__btn" type="submit" disabled={submitContact.isPending}>
                          {submitContact.isPending ? t("common.loading") : t("pages.form_send")}
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {mapEmbedUrl && (
        <section className="google__map-area pt-120">
          <iframe
            src={mapEmbedUrl}
            title={contactMap.title || `${companyBrand.shortName || "Ensotek"} Map`}
            style={{ width: "100%", height: `${mapHeight}px`, border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </section>
      )}
    </>
  );
}
