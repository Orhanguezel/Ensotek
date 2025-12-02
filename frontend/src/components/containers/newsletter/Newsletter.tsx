"use client";

import React, { useMemo, useRef, useState } from "react";

// RTK – PUBLIC newsletter
import { useSubscribeNewsletterMutation } from "@/integrations/rtk/endpoints/newsletter_public.endpoints";

// Yeni i18n helper’lar
import { useResolvedLocale } from "@/i18n/locale";
import { useUiSection } from "@/i18n/uiDb";


const Newsletter: React.FC = () => {
  const locale = useResolvedLocale();
  const { ui } = useUiSection("ui_newsletter");

  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(
    null,
  );

  const [subscribe, { isLoading }] = useSubscribeNewsletterMutation();

  // anti-spam (honeypot + time-to-submit)
  const hpRef = useRef<HTMLInputElement>(null);
  const startRef = useRef<number>(Date.now());

  const canSubmit = useMemo(() => {
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    return ok && !isLoading;
  }, [email, isLoading]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    if (!canSubmit) return;

    const hpVal = hpRef.current?.value || "";
    const tts = Date.now() - startRef.current;

    try {
      await subscribe({
        email: email.trim(),
        locale,
        meta: {
          hp: hpVal,
          tts,
        },
      }).unwrap();

      setMsg({
        type: "ok",
        text: ui(
          "ui_newsletter_ok",
          "You have been subscribed. Thank you!",
        ),
      });
      setEmail("");
      startRef.current = Date.now();
    } catch (err: any) {
      const fallback = ui(
        "ui_newsletter_fail",
        "Subscription failed. Please try again later.",
      );
      const text =
        (err && (err.data?.message || err.error || String(err))) || fallback;

      setMsg({ type: "err", text });
    }
  }

  return (
    <section
      className="project__cta-area"
      aria-label={ui(
        "ui_newsletter_section_aria",
        "Newsletter subscription section",
      )}
      style={{
        background: "linear-gradient(0deg, #f6f8ff, #f6f8ff)",
        padding: "48px 0",
      }}
    >
      <div className="container">
        <div
          style={{
            background: "var(--ui-surface, #fff)",
            border: "1px solid var(--ui-border, rgba(0,0,0,.06))",
            borderRadius: 16,
            padding: "22px 20px",
            boxShadow: "0 6px 20px rgba(0,0,0,.04)",
          }}
        >
          <div className="row align-items-center g-3">
            {/* Başlık */}
            <div className="col-xl-4 col-lg-5">
              <div className="project__title">
                <h3 style={{ margin: 0 }}>
                  {ui("ui_newsletter_title", "Stay updated")}
                </h3>
              </div>
            </div>

            {/* Açıklama */}
            <div className="col-xl-5 col-lg-4">
              <div className="project__paragraph">
                <p style={{ margin: 0, opacity: 0.85 }}>
                  {ui(
                    "ui_newsletter_desc",
                    "Subscribe to receive news about our products and projects.",
                  )}
                </p>
              </div>
            </div>

            {/* Form */}
            <div className="col-xl-3 col-lg-3">
              <div className="project__view text-lg-end">
                <form
                  onSubmit={onSubmit}
                  className="touch__search"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    width: "100%",
                    maxWidth: 420,
                    justifyContent: "flex-end",
                  }}
                >
                  {/* Honeypot */}
                  <input
                    ref={hpRef}
                    type="text"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    style={{
                      position: "absolute",
                      left: -9999,
                      width: 1,
                      height: 1,
                      opacity: 0,
                    }}
                  />

                  <input
                    type="email"
                    inputMode="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={ui(
                      "ui_newsletter_placeholder",
                      "Your email address",
                    )}
                    required
                    aria-label={ui(
                      "ui_newsletter_email_aria",
                      "Your email address",
                    )}
                    style={{
                      flex: 1,
                      height: 44,
                      padding: "0 12px",
                      borderRadius: 10,
                      border:
                        "1px solid var(--ui-border, rgba(0,0,0,.15))",
                      background: "#fff",
                      minWidth: 180,
                    }}
                  />
                  <button
                    type="submit"
                    disabled={!canSubmit}
                    aria-label={ui(
                      "ui_newsletter_cta",
                      "Subscribe to newsletter",
                    )}
                    style={{
                      height: 44,
                      width: 56,
                      borderRadius: 10,
                      border: "none",
                      background: "var(--tp-theme-1, #5a57ff)",
                      display: "grid",
                      placeItems: "center",
                      opacity: canSubmit ? 1 : 0.65,
                      cursor: canSubmit ? "pointer" : "not-allowed",
                    }}
                  >
                    {isLoading ? (
                      <span
                        className="sr-only"
                        aria-live="polite"
                        style={{ color: "#fff", fontSize: 12 }}
                      >
                        …
                      </span>
                    ) : (
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
                    )}
                  </button>
                </form>

                {/* Geri bildirim */}
                {msg && (
                  <p
                    role="status"
                    style={{
                      marginTop: 10,
                      fontSize: 13,
                      color:
                        msg.type === "ok"
                          ? "var(--tp-success, #14a44d)"
                          : "var(--tp-danger, #dc3545)",
                    }}
                  >
                    {msg.text}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
