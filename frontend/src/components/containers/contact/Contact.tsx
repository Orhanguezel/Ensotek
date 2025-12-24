// =============================================================
// FILE: src/components/containers/contact/Contact.tsx
// Ensotek – Contact Section (Public) + socials + createContact
//   - i18n: site_settings.ui_contact
//   - socials: site_settings.socials
//   - POST: /contacts (public)
// =============================================================
'use client';

import React, { useMemo, useRef, useState } from 'react';
import Link from 'next/link';

// i18n helper’lar
import { useResolvedLocale } from '@/i18n/locale';
import { useUiSection } from '@/i18n/uiDb';
import { localizePath } from '@/i18n/url';

// Site settings (social links)
import {
  useGetSiteSettingByKeyQuery,
  useCreateContactPublicMutation,
} from '@/integrations/rtk/hooks';

// React Icons – sosyal
import { FiFacebook, FiTwitter, FiYoutube, FiLinkedin, FiInstagram } from 'react-icons/fi';

const toLocaleShort = (l: any) =>
  String(l || 'tr')
    .trim()
    .toLowerCase()
    .replace('_', '-')
    .split('-')[0] || 'tr';

const Contact: React.FC = () => {
  const resolved = useResolvedLocale();
  const locale = useMemo(() => toLocaleShort(resolved), [resolved]);

  // UI: ui_contact JSON + i18n fallback zinciri
  const { ui } = useUiSection('ui_contact', locale);

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
  const [status, setStatus] = useState<{ ok: boolean; msg: string } | null>(null);

  const emailInputRef = useRef<HTMLInputElement>(null);

  // RTK mutation → POST /contacts
  const [createContact, { isLoading }] = useCreateContactPublicMutation();

  // Sosyal linkleri site_settings.socials üzerinden oku
  const { data: socialsSetting } = useGetSiteSettingByKeyQuery({
    key: 'socials',
    locale,
  });

  const socialLinks = useMemo(() => {
    const s = (socialsSetting?.value ?? {}) as Record<string, string>;
    const normalize = (u?: string) => (!u ? '' : /^https?:\/\//i.test(u) ? u : `https://${u}`);

    return [
      { key: 'facebook', Icon: FiFacebook, url: normalize(s.facebook || s.fb) },
      { key: 'twitter', Icon: FiTwitter, url: normalize(s.twitter || s.x) },
      { key: 'youtube', Icon: FiYoutube, url: normalize(s.youtube || s.yt) },
      { key: 'linkedin', Icon: FiLinkedin, url: normalize(s.linkedin || s.li) },
      { key: 'instagram', Icon: FiInstagram, url: normalize(s.instagram || s.ig) },
    ].filter((x) => x.url);
  }, [socialsSetting?.value]);

  const onQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickEmail.trim()) {
      setEmail(quickEmail.trim());
      setTimeout(() => emailInputRef.current?.focus(), 50);
    }
  };

  const canSubmit =
    !!first.trim() &&
    !!email.trim() &&
    !!phone.trim() && // phone BE tarafında zorunlu
    accepted &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) &&
    !isLoading;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus(null);
    if (!canSubmit) return;

    const name = `${first} ${last}`.trim();

    const subjectBase = 'Consultation Request';
    const subject =
      subjectBase + (service ? ` – ${service}` : '') + (company ? ` (${company})` : '');

    const message = `Company: ${company || '-'}
Website: ${website || '-'}
Phone: ${phone || '-'}
Service: ${service || '-'}
Email: ${email}

Sent from contact form.`;

    try {
      await createContact({
        name,
        email,
        phone,
        subject,
        message,
        website: website || undefined,
      }).unwrap();

      setStatus({
        ok: true,
        msg: ui('ui_contact_success', 'Thanks! Your message has been sent.'),
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
      const fallbackError = ui('ui_contact_error_generic', 'Failed to send. Please try again.');
      const msg = err?.data?.message || err?.error || fallbackError;
      setStatus({ ok: false, msg });
    }
  }

  const termsHref = localizePath(locale, '/terms');
  const privacyHref = localizePath(locale, '/privacy');

  return (
    <section
      className="touch__arae touch-bg include__bg pt-120 contact-contrast"
      data-background="assets/img/shape/touch-shape.png"
    >
      <div className="container">
        <div className="row">
          {/* Sol taraf */}
          <div className="col-xl-4 col-lg-4">
            <div className="touch__left mb-60">
              <div className="section__title-wrapper">
                <span className="section__subtitle s-2">
                  {ui('ui_contact_subprefix', '') ? (
                    <span>{ui('ui_contact_subprefix', '')} </span>
                  ) : null}
                  {ui('ui_contact_sublabel', '')}
                </span>
                <h2 className="section__title s-2 mb-30">
                  {(() => {
                    const raw = ui('ui_contact_title_left', "Let's Talk");
                    const parts = raw.split(' ');
                    return (
                      <>
                        <span className="down__mark-line">{parts[0] || ''}</span>{' '}
                        {parts.slice(1).join(' ')}
                      </>
                    );
                  })()}
                </h2>
              </div>

              <p>{ui('ui_contact_tagline', '')}</p>

              {/* mini email -> ana formdaki email’e aktar */}
              <div className="touch__search">
                <form onSubmit={onQuickSubmit}>
                  <input
                    type="email"
                    placeholder={ui('ui_contact_quick_email_placeholder', 'Enter Mail')}
                    value={quickEmail}
                    onChange={(e) => setQuickEmail(e.target.value)}
                  />
                  <button type="submit" aria-label="Fill email">
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

              {/* Sosyal ikonlar */}
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
            </div>
          </div>

          {/* Sağ taraf – Form */}
          <div className="col-xl-8 col-lg-8">
            <div className="touch__contact p-relative">
              <div className="touch__carcle"></div>
              <div className="touch__content-title">
                <h3>{ui('ui_contact_form_title', 'Schedule a Consultation')}</h3>
              </div>

              <form onSubmit={onSubmit}>
                <div className="row">
                  <div className="col-lg-6">
                    <div className="touch__input">
                      <input
                        type="text"
                        placeholder={ui('ui_contact_first_name', 'First Name*')}
                        value={first}
                        onChange={(e) => setFirst(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="col-lg-6">
                    <div className="touch__input">
                      <input
                        type="text"
                        placeholder={ui('ui_contact_last_name', 'Last Name')}
                        value={last}
                        onChange={(e) => setLast(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="col-lg-6">
                    <div className="touch__input">
                      <input
                        type="text"
                        placeholder={ui('ui_contact_company', 'Company Name')}
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="col-lg-6">
                    <div className="touch__input">
                      <input
                        type="url"
                        placeholder={ui('ui_contact_website', 'Website')}
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="col-lg-6">
                    <div className="touch__input">
                      <input
                        type="tel"
                        placeholder={ui('ui_contact_phone', 'Phone Number')}
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="col-lg-6">
                    <div className="touch__input">
                      <input
                        ref={emailInputRef}
                        type="email"
                        placeholder={ui('ui_contact_email', 'Email*')}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="col-lg-6">
                    <div className="contact__select mb-20">
                      <select value={service} onChange={(e) => setService(e.target.value)}>
                        <option value="">
                          {ui('ui_contact_select_label', 'Select the services')}
                        </option>
                        <option value="Cooling Towers">
                          {ui('ui_contact_service_cooling_towers', 'Cooling Towers')}
                        </option>
                        <option value="Maintenance">
                          {ui('ui_contact_service_maintenance', 'Maintenance')}
                        </option>
                        <option value="Modernization">
                          {ui('ui_contact_service_modernization', 'Modernization')}
                        </option>
                        <option value="Other">{ui('ui_contact_service_other', 'Other')}</option>
                      </select>
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="touch__submit">
                      <div className="sign__action">
                        <input
                          className="e-check-input"
                          type="checkbox"
                          id="accept-terms"
                          checked={accepted}
                          onChange={(e) => setAccepted(e.target.checked)}
                          required
                        />
                        <label className="sign__check" htmlFor="accept-terms">
                          {ui('ui_contact_terms_prefix', 'Accept Our')}{' '}
                          <span>
                            <Link href={termsHref}>{ui('ui_contact_terms', 'Terms')}</Link> &{' '}
                            <Link href={privacyHref}>
                              {ui('ui_contact_conditions', 'Conditions')}
                            </Link>
                          </span>
                        </label>
                      </div>

                      <div className="touch__btn">
                        <button type="button" aria-hidden="true"></button>
                        <button
                          className="border__btn"
                          type="submit"
                          disabled={!canSubmit}
                          style={{
                            opacity: canSubmit ? 1 : 0.7,
                            cursor: canSubmit ? 'pointer' : 'not-allowed',
                          }}
                        >
                          {isLoading
                            ? ui('ui_contact_sending', 'Sending...')
                            : ui('ui_contact_submit', 'Submit Query')}
                        </button>
                      </div>
                    </div>

                    {status && (
                      <p
                        role="status"
                        style={{
                          marginTop: 12,
                          fontSize: 13,
                          color: status.ok
                            ? 'var(--tp-success, #14a44d)'
                            : 'var(--tp-danger, #dc3545)',
                        }}
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

      {/* Stil — dokunulmadı */}
      <style jsx>{`
        .contact-contrast input,
        .contact-contrast select,
        .contact-contrast textarea {
          background: #fff;
          border: 1px solid rgba(0, 0, 0, 0.28);
          color: #111;
        }
        .contact-contrast input::placeholder,
        .contact-contrast textarea::placeholder {
          color: rgba(0, 0, 0, 0.55);
        }
        .contact-contrast .touch__search input {
          background: #fff;
          border: 1px solid rgba(0, 0, 0, 0.28);
          color: #111;
        }
        .contact-contrast .touch__search button {
          background: var(--tp-theme-1, #5a57ff);
        }
        .contact-contrast input:focus,
        .contact-contrast select:focus,
        .contact-contrast textarea:focus {
          outline: none;
          border-color: var(--tp-theme-1, #5a57ff);
          box-shadow: 0 0 0 3px rgba(90, 87, 255, 0.18);
        }
        .contact-contrast .border__btn {
          background: var(--tp-theme-1, #5a57ff);
          color: #fff;
          border-color: transparent;
        }
        .touch__social {
          display: flex;
          gap: 10px;
          margin-top: 18px;
        }
        .social-icon {
          --ring: rgba(255, 255, 255, 0.18);
          --bg: rgba(255, 255, 255, 0.06);
          --fg: rgba(255, 255, 255, 0.92);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 42px;
          height: 42px;
          border-radius: 12px;
          border: 1px solid var(--ring);
          background: linear-gradient(180deg, var(--bg), rgba(255, 255, 255, 0.02));
          color: var(--fg);
          transition: transform 0.18s ease, box-shadow 0.18s ease, background 0.18s ease,
            color 0.18s ease, border-color 0.18s ease;
          backdrop-filter: saturate(120%) blur(2px);
        }
        .social-icon svg {
          transform: translateZ(0);
          transition: transform 0.18s ease;
        }
        .social-icon:hover {
          transform: translateY(-2px);
          border-color: transparent;
          box-shadow: 0 8px 18px rgba(0, 0, 0, 0.18);
          color: #fff;
        }
        .social-icon:hover svg {
          transform: scale(1.06);
        }
        .social-icon:focus-visible {
          outline: 0;
          box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.28);
        }
        .social-icon.is-facebook:hover {
          background: #1877f2;
        }
        .social-icon.is-twitter:hover {
          background: #1da1f2;
        }
        .social-icon.is-youtube:hover {
          background: #ff0000;
        }
        .social-icon.is-linkedin:hover {
          background: #0a66c2;
        }
        .social-icon.is-instagram:hover {
          background: radial-gradient(110% 110% at 30% 20%, #f9ce34 0%, #ee2a7b 55%, #6228d7 100%);
        }
        :global(.touch__left) .social-icon {
          border-color: rgba(255, 255, 255, 0.16);
          color: rgba(255, 255, 255, 0.92);
        }
        @media (max-width: 575px) {
          .social-icon {
            width: 38px;
            height: 38px;
            border-radius: 10px;
          }
        }
      `}</style>
    </section>
  );
};

export default Contact;
