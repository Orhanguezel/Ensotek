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

type ContactInfoRaw = {
  company_name?: string;
  email?: string;
  email_2?: string;
  phone?: string;
  phone_2?: string;
  address?: string;
  address_label?: string;
  address_2?: string;
  address_2_label?: string;
  city?: string;
  city_2?: string;
  country?: string;
  country_2?: string;
  working_hours?: string;
  maps_lat?: string;
  maps_lng?: string;
  maps_lat_2?: string;
  maps_lng_2?: string;
  maps_embed_url?: string;
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

function buildMapEmbedUrl(lat?: string, lng?: string, address?: string): string {
  if (lat && lng) {
    return `https://maps.google.com/maps?q=${lat},${lng}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
  }
  if (address) {
    return `https://maps.google.com/maps?q=${encodeURIComponent(address)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
  }
  return "";
}

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

  const info = (settingsByKey.get("contact_info") || {}) as ContactInfoRaw;
  const socialLinks = (settingsByKey.get("socials") || {}) as SocialLinks;

  const map1Url = buildMapEmbedUrl(info.maps_lat, info.maps_lng, info.address);
  const map2Url = buildMapEmbedUrl(info.maps_lat_2, info.maps_lng_2, info.address_2);

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
        className="touch__area touch-bg include__bg pt-120 pb-0"
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

                {/* Company name */}
                <h4 className="text-white mb-20">
                  {info.company_name || "Ensotek"}
                </h4>

                {/* Contact details list */}
                <div className="touch__info-list">
                  {info.phone && (
                    <div className="mb-15">
                      <h6 className="text-uppercase text-white mb-5" style={{ letterSpacing: "1px", fontSize: "13px" }}>
                        <i className="fa-brands fa-whatsapp me-2" />
                        {t("auth.phone")} / WhatsApp
                      </h6>
                      <div className="d-flex align-items-center gap-2 mb-5">
                        <a href={`tel:${info.phone.replace(/\s/g, "")}`} className="text-white">
                          {info.phone}
                        </a>
                        <a
                          href={`https://wa.me/${info.phone.replace(/[\s\-\(\)]/g, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-white"
                          title="WhatsApp"
                        >
                          <i className="fa-brands fa-whatsapp" />
                        </a>
                      </div>
                      {info.phone_2 && (
                        <div className="d-flex align-items-center gap-2">
                          <a href={`tel:${info.phone_2.replace(/\s/g, "")}`} className="text-white">
                            {info.phone_2}
                          </a>
                          <a
                            href={`https://wa.me/${info.phone_2.replace(/[\s\-\(\)]/g, "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white"
                            title="WhatsApp"
                          >
                            <i className="fa-brands fa-whatsapp" />
                          </a>
                        </div>
                      )}
                    </div>
                  )}

                  {info.email && (
                    <div className="d-flex align-items-center gap-2 mb-10">
                      <i className="fa fa-envelope text-white" />
                      <a href={`mailto:${info.email}`} className="text-white">
                        {info.email}
                      </a>
                    </div>
                  )}
                  {info.email_2 && (
                    <div className="d-flex align-items-center gap-2 mb-10">
                      <i className="fa fa-envelope text-white" />
                      <a href={`mailto:${info.email_2}`} className="text-white">
                        {info.email_2}
                      </a>
                    </div>
                  )}

                  {/* Address 1 */}
                  {info.address && (
                    <div className="mt-25 mb-15">
                      <h6 className="text-uppercase text-white mb-5" style={{ letterSpacing: "1px", fontSize: "13px" }}>
                        <i className="fa fa-map-marker-alt me-2" />
                        {info.address_label || "Adresse"}
                      </h6>
                      <span className="text-white d-block">
                        {info.address}
                      </span>
                    </div>
                  )}

                  {/* Address 2 */}
                  {info.address_2 && (
                    <div className="mb-15">
                      <h6 className="text-uppercase text-white mb-5" style={{ letterSpacing: "1px", fontSize: "13px" }}>
                        <i className="fa fa-industry me-2" />
                        {info.address_2_label || "Werk"}
                      </h6>
                      <span className="text-white d-block">
                        {info.address_2}
                      </span>
                    </div>
                  )}

                  {/* Working hours */}
                  {info.working_hours && (
                    <div className="d-flex align-items-center gap-2 mb-10">
                      <i className="fa fa-clock text-white" />
                      <span className="text-white">{info.working_hours}</span>
                    </div>
                  )}
                </div>

                <div className="touch__social mt-25">
                  {socialLinks.facebook && (
                    <Link href={socialLinks.facebook} target="_blank" rel="nofollow noreferrer">
                      <i className="fa-brands fa-facebook-f"></i>
                    </Link>
                  )}
                  {socialLinks.x && (
                    <Link href={socialLinks.x} target="_blank" rel="nofollow noreferrer">
                      <i className="fa-brands fa-twitter"></i>
                    </Link>
                  )}
                  {socialLinks.youtube && (
                    <Link href={socialLinks.youtube} target="_blank" rel="nofollow noreferrer">
                      <i className="fa-brands fa-youtube"></i>
                    </Link>
                  )}
                  {socialLinks.linkedin && (
                    <Link href={socialLinks.linkedin} target="_blank" rel="nofollow noreferrer">
                      <i className="fa-brands fa-linkedin"></i>
                    </Link>
                  )}
                  {socialLinks.instagram && (
                    <Link href={socialLinks.instagram} target="_blank" rel="nofollow noreferrer">
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
                      className="d-none"
                    />

                    <div className="col-12">
                      {error && <p className="text-danger mb-10">{error}</p>}
                      {success && <p className="text-success mb-10">{success}</p>}

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

      {/* Maps */}
      {(map1Url || map2Url) && (
        <section className="google__map-area pt-0">
          <div className="container-fluid p-0">
            <div className="row g-0">
              {map1Url && (
                <div className={map2Url ? "col-lg-6" : "col-12"}>
                  <iframe
                    src={map1Url}
                    title={`${info.address_label || "Office"} - ${info.company_name || "Ensotek"}`}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    allowFullScreen
                    style={{ border: 0 }}
                  />
                </div>
              )}
              {map2Url && (
                <div className={map1Url ? "col-lg-6" : "col-12"}>
                  <iframe
                    src={map2Url}
                    title={`${info.address_2_label || "Factory"} - ${info.company_name || "Ensotek"}`}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    allowFullScreen
                    style={{ border: 0 }}
                  />
                </div>
              )}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
