// =============================================================
// FILE: src/components/containers/contact/Contact.tsx
// Ensotek – Contact Section (Public) + socials + createContact
//   - i18n: site_settings.ui_contact
//   - socials: site_settings.socials (JSON or JSON-string)
//   - POST: /contacts (public)
//   - ✅ Accessibility: label added for inputs/select (Lighthouse fix)
//   - NO styled-jsx / NO inline styles
// =============================================================

'use client';

import React, { useMemo, useRef, useState } from 'react';
import Link from 'next/link';

// i18n
import { useLocaleShort } from '@/i18n/useLocaleShort';
import { useUiSection } from '@/i18n/uiDb';

// site settings + api
import {
  useGetSiteSettingByKeyQuery,
  useCreateContactPublicMutation,
} from '@/integrations/rtk/hooks';

// icons
import { FiFacebook, FiTwitter, FiYoutube, FiLinkedin, FiInstagram } from 'react-icons/fi';

type StatusState = { ok: boolean; msg: string } | null;
type SocialsValue = Record<string, string>;

function safeStr(v: unknown): string {
  if (typeof v === 'string') return v.trim();
  if (v == null) return '';
  return String(v).trim();
}

function tryParseJson<T>(v: unknown): T | null {
  try {
    if (v == null) return null;
    if (typeof v === 'object') return v as T;
    const s = safeStr(v);
    if (!s) return null;
    return JSON.parse(s) as T;
  } catch {
    return null;
  }
}

/**
 * localizePath kullanmadan locale prefix uygula:
 * - locale varsa: "/de/terms"
 * - locale yoksa: "/terms"
 */
function withLocale(locale: string, path: string): string {
  const loc = safeStr(locale);
  const p = path.startsWith('/') ? path : `/${path}`;
  if (!loc) return p;
  if (p === `/${loc}` || p.startsWith(`/${loc}/`)) return p;
  return `/${loc}${p}`;
}

function normalizeUrl(u?: string): string {
  const s = safeStr(u);
  if (!s) return '';
  return /^https?:\/\//i.test(s) ? s : `https://${s}`;
}

const Contact: React.FC = () => {
  const locale = useLocaleShort();
  const { ui } = useUiSection('ui_contact', locale as any);

  // Sol mini e-posta -> ana forma aktar
  const [quickEmail, setQuickEmail] = useState('');

  // Ana form alanları
  const [first, setFirst] = useState('');
  const [last, setLast] = useState('');
  const [company, setCompany] = useState('');
  const [website, setWebsite] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [service, setService] = useState('');
  const [accepted, setAccepted] = useState(false);
  const [status, setStatus] = useState<StatusState>(null);

  const emailInputRef = useRef<HTMLInputElement>(null);

  const [createContact, { isLoading }] = useCreateContactPublicMutation();

  // socials (site_settings.socials)
  const { data: socialsSetting } = useGetSiteSettingByKeyQuery({ key: 'socials', locale } as any);

  const socialLinks = useMemo(() => {
    const raw = (socialsSetting as any)?.value ?? socialsSetting ?? {};
    const parsed = (tryParseJson<SocialsValue>(raw) ?? raw) as SocialsValue;

    const s: SocialsValue = parsed && typeof parsed === 'object' ? parsed : {};

    const links = [
      { key: 'facebook', Icon: FiFacebook, url: normalizeUrl(s.facebook || s.fb) },
      { key: 'twitter', Icon: FiTwitter, url: normalizeUrl(s.twitter || s.x) },
      { key: 'youtube', Icon: FiYoutube, url: normalizeUrl(s.youtube || s.yt) },
      { key: 'linkedin', Icon: FiLinkedin, url: normalizeUrl(s.linkedin || s.li) },
      { key: 'instagram', Icon: FiInstagram, url: normalizeUrl(s.instagram || s.ig) },
    ];

    return links.filter((x) => !!x.url);
  }, [socialsSetting]);

  const onQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const v = safeStr(quickEmail);
    if (!v) return;

    setEmail(v);
    setTimeout(() => emailInputRef.current?.focus(), 50);
  };

  const isEmailValid = useMemo(() => {
    const v = safeStr(email);
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  }, [email]);

  const canSubmit =
    !!safeStr(first) &&
    !!safeStr(email) &&
    !!safeStr(phone) && // backend required
    accepted &&
    isEmailValid &&
    !isLoading;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus(null);
    if (!canSubmit) return;

    const name = `${safeStr(first)} ${safeStr(last)}`.trim();

    const subjectBase =
      safeStr(ui('ui_contact_subject_base', 'Consultation Request')) || 'Consultation Request';
    const subject =
      subjectBase +
      (safeStr(service) ? ` – ${safeStr(service)}` : '') +
      (safeStr(company) ? ` (${safeStr(company)})` : '');

    const messageLines = [
      `Company: ${safeStr(company) || '-'}`,
      `Website: ${safeStr(website) || '-'}`,
      `Phone: ${safeStr(phone) || '-'}`,
      `Service: ${safeStr(service) || '-'}`,
      `Email: ${safeStr(email)}`,
      '',
      safeStr(ui('ui_contact_message_footer', 'Sent from contact form.')) ||
        'Sent from contact form.',
    ];

    const payload = {
      name,
      email: safeStr(email),
      phone: safeStr(phone),
      subject,
      message: messageLines.join('\n'),
      website: safeStr(website) || undefined,
    };

    try {
      await createContact(payload as any).unwrap();

      setStatus({
        ok: true,
        msg:
          safeStr(ui('ui_contact_success', 'Thanks! Your message has been sent.')) ||
          'Thanks! Your message has been sent.',
      });

      setFirst('');
      setLast('');
      setCompany('');
      setWebsite('');
      setPhone('');
      setService('');
      setQuickEmail('');
      setEmail('');
      setAccepted(false);
    } catch (err: any) {
      const fallbackError =
        safeStr(ui('ui_contact_error_generic', 'Failed to send. Please try again.')) ||
        'Failed to send. Please try again.';
      const msg = safeStr(err?.data?.message || err?.error || fallbackError) || fallbackError;
      setStatus({ ok: false, msg });
    }
  }

  const termsHref = withLocale(locale, '/terms');
  const privacyHref = withLocale(locale, '/privacy-notice');

  const leftTitleRaw = safeStr(ui('ui_contact_title_left', "Let's Talk")) || "Let's Talk";
  const leftTitleParts = leftTitleRaw.split(' ').filter(Boolean);
  const leftTitleFirst = leftTitleParts[0] ?? '';
  const leftTitleRest = leftTitleParts.slice(1).join(' ');

  // ✅ IDs for a11y labels (Lighthouse)
  const ids = {
    quickEmail: 'contact-quick-email',
    first: 'contact-first-name',
    last: 'contact-last-name',
    company: 'contact-company',
    website: 'contact-website',
    phone: 'contact-phone',
    email: 'contact-email',
    service: 'contact-service',
    accept: 'accept-terms',
  } as const;

  return (
    <section
      className="touch__arae touch-bg include__bg pt-120 contact-contrast"
      data-background="assets/img/shape/touch-shape.png"
    >
      <div className="container">
        <div className="row">
          {/* LEFT */}
          <div className="col-xl-4 col-lg-4">
            <div className="touch__left mb-60">
              <div className="section__title-wrapper">
                <span className="section__subtitle s-2">
                  {safeStr(ui('ui_contact_subprefix', '')) ? (
                    <span>{safeStr(ui('ui_contact_subprefix', ''))} </span>
                  ) : null}
                  {safeStr(ui('ui_contact_sublabel', ''))}
                </span>

                <h2 className="section__title s-2 mb-30">
                  <span className="down__mark-line">{leftTitleFirst}</span> {leftTitleRest}
                </h2>
              </div>

              {safeStr(ui('ui_contact_tagline', '')) ? (
                <p>{safeStr(ui('ui_contact_tagline', ''))}</p>
              ) : null}

              {/* QUICK EMAIL */}
              <div className="touch__search">
                <form onSubmit={onQuickSubmit}>
                  {/* ✅ Label for accessibility */}
                  <label className="visually-hidden" htmlFor={ids.quickEmail}>
                    {safeStr(ui('ui_contact_quick_email_label', 'Email')) || 'Email'}
                  </label>

                  <input
                    id={ids.quickEmail}
                    type="email"
                    placeholder={
                      safeStr(ui('ui_contact_quick_email_placeholder', 'Enter Mail')) ||
                      'Enter Mail'
                    }
                    value={quickEmail}
                    onChange={(e) => setQuickEmail(e.target.value)}
                    autoComplete="email"
                  />

                  <button
                    type="submit"
                    aria-label={
                      safeStr(ui('ui_contact_quick_email_aria', 'Fill email')) || 'Fill email'
                    }
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="11.83"
                      height="20.026"
                      viewBox="0 0 11.83 20.026"
                    >
                      <path
                        d="M-3925.578,5558.542l7.623,8.242-7.623,7.543"
                        transform="translate(3927.699 -5556.422)"
                        fill="none"
                        stroke="#fff"
                        strokeLinecap="round"
                        strokeWidth="3"
                      />
                    </svg>
                  </button>
                </form>
              </div>

              {/* SOCIALS */}
              {socialLinks.length > 0 && (
                <div className="touch__social">
                  {socialLinks.map(({ key, Icon, url }) => (
                    <a
                      key={key}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={key}
                      className={`social-icon is-${key}`}
                      title={key}
                    >
                      <Icon size={20} />
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT */}
          <div className="col-xl-8 col-lg-8">
            <div className="touch__contact p-relative">
              <div className="touch__carcle" />
              <div className="touch__content-title">
                <h3>
                  {safeStr(ui('ui_contact_form_title', 'Schedule a Consultation')) ||
                    'Schedule a Consultation'}
                </h3>
              </div>

              <form onSubmit={onSubmit}>
                <div className="row">
                  <div className="col-lg-6">
                    <div className="touch__input">
                      <label className="visually-hidden" htmlFor={ids.first}>
                        {safeStr(ui('ui_contact_first_name', 'First Name*')) || 'First Name*'}
                      </label>
                      <input
                        id={ids.first}
                        type="text"
                        placeholder={
                          safeStr(ui('ui_contact_first_name', 'First Name*')) || 'First Name*'
                        }
                        value={first}
                        onChange={(e) => setFirst(e.target.value)}
                        required
                        autoComplete="given-name"
                      />
                    </div>
                  </div>

                  <div className="col-lg-6">
                    <div className="touch__input">
                      <label className="visually-hidden" htmlFor={ids.last}>
                        {safeStr(ui('ui_contact_last_name', 'Last Name')) || 'Last Name'}
                      </label>
                      <input
                        id={ids.last}
                        type="text"
                        placeholder={
                          safeStr(ui('ui_contact_last_name', 'Last Name')) || 'Last Name'
                        }
                        value={last}
                        onChange={(e) => setLast(e.target.value)}
                        autoComplete="family-name"
                      />
                    </div>
                  </div>

                  <div className="col-lg-6">
                    <div className="touch__input">
                      <label className="visually-hidden" htmlFor={ids.company}>
                        {safeStr(ui('ui_contact_company', 'Company Name')) || 'Company Name'}
                      </label>
                      <input
                        id={ids.company}
                        type="text"
                        placeholder={
                          safeStr(ui('ui_contact_company', 'Company Name')) || 'Company Name'
                        }
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        autoComplete="organization"
                      />
                    </div>
                  </div>

                  <div className="col-lg-6">
                    <div className="touch__input">
                      <label className="visually-hidden" htmlFor={ids.website}>
                        {safeStr(ui('ui_contact_website', 'Website')) || 'Website'}
                      </label>
                      <input
                        id={ids.website}
                        type="url"
                        placeholder={safeStr(ui('ui_contact_website', 'Website')) || 'Website'}
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        autoComplete="url"
                      />
                    </div>
                  </div>

                  <div className="col-lg-6">
                    <div className="touch__input">
                      <label className="visually-hidden" htmlFor={ids.phone}>
                        {safeStr(ui('ui_contact_phone', 'Phone Number*')) || 'Phone Number*'}
                      </label>
                      <input
                        id={ids.phone}
                        type="tel"
                        placeholder={
                          safeStr(ui('ui_contact_phone', 'Phone Number*')) || 'Phone Number*'
                        }
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        autoComplete="tel"
                      />
                    </div>
                  </div>

                  <div className="col-lg-6">
                    <div className="touch__input">
                      <label className="visually-hidden" htmlFor={ids.email}>
                        {safeStr(ui('ui_contact_email', 'Email*')) || 'Email*'}
                      </label>
                      <input
                        id={ids.email}
                        ref={emailInputRef}
                        type="email"
                        placeholder={safeStr(ui('ui_contact_email', 'Email*')) || 'Email*'}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        autoComplete="email"
                      />
                    </div>
                  </div>

                  {/* ✅ SELECT FIX: add label + id */}
                  <div className="col-lg-6">
                    <div className="contact__select mb-20">
                      <label className="visually-hidden" htmlFor={ids.service}>
                        {safeStr(ui('ui_contact_select_label', 'Select the services')) ||
                          'Select the services'}
                      </label>

                      <select
                        id={ids.service}
                        value={service}
                        onChange={(e) => setService(e.target.value)}
                        aria-label={
                          safeStr(ui('ui_contact_select_label', 'Select the services')) ||
                          'Select the services'
                        }
                      >
                        <option value="">
                          {safeStr(ui('ui_contact_select_label', 'Select the services')) ||
                            'Select the services'}
                        </option>
                        <option value="Cooling Towers">
                          {safeStr(ui('ui_contact_service_cooling_towers', 'Cooling Towers')) ||
                            'Cooling Towers'}
                        </option>
                        <option value="Maintenance">
                          {safeStr(ui('ui_contact_service_maintenance', 'Maintenance')) ||
                            'Maintenance'}
                        </option>
                        <option value="Modernization">
                          {safeStr(ui('ui_contact_service_modernization', 'Modernization')) ||
                            'Modernization'}
                        </option>
                        <option value="Other">
                          {safeStr(ui('ui_contact_service_other', 'Other')) || 'Other'}
                        </option>
                      </select>
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="touch__submit">
                      <div className="sign__action">
                        <input
                          className="e-check-input"
                          type="checkbox"
                          id={ids.accept}
                          checked={accepted}
                          onChange={(e) => setAccepted(e.target.checked)}
                          required
                        />
                        <label className="sign__check" htmlFor={ids.accept}>
                          {safeStr(ui('ui_contact_terms_prefix', 'Accept Our')) || 'Accept Our'}{' '}
                          <span>
                            <Link href={termsHref}>
                              {safeStr(ui('ui_contact_terms', 'Terms')) || 'Terms'}
                            </Link>{' '}
                            &{' '}
                            <Link href={privacyHref}>
                              {safeStr(ui('ui_contact_conditions', 'Conditions')) || 'Conditions'}
                            </Link>
                          </span>
                        </label>
                      </div>

                      <div className="touch__btn">
                        <button
                          className={`border__btn ${canSubmit ? '' : 'is-disabled'} ${
                            isLoading ? 'is-loading' : ''
                          }`}
                          type="submit"
                          disabled={!canSubmit}
                        >
                          {isLoading
                            ? safeStr(ui('ui_contact_sending', 'Sending...')) || 'Sending...'
                            : safeStr(ui('ui_contact_submit', 'Submit Query')) || 'Submit Query'}
                        </button>
                      </div>
                    </div>

                    {status && (
                      <p
                        role="status"
                        className={`ens-contact__status ${status.ok ? 'is-ok' : 'is-err'}`}
                      >
                        {status.msg}
                      </p>
                    )}
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
