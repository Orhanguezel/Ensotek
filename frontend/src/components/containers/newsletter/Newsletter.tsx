"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { useSubscribe } from "@/features/newsletter/newsletter.action";
import axios from "axios";

const Newsletter: React.FC = () => {
  const t = useTranslations("newsletter");
  const te = useTranslations("ensotek.newsletterHome");

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");

  const subscribeMutation = useSubscribe();
  const canSubmit = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");

    const val = email.trim();
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
    if (!valid) {
      setError(t("invalid_email"));
      return;
    }

    try {
      await subscribeMutation.mutateAsync(val);
      setMessage(t("success"));
      setEmail("");
    } catch (err) {
      // Some backends can return 409 for already subscribed
      if (axios.isAxiosError(err) && err.response?.status === 409) {
        setMessage(t("success"));
        return;
      }
      setError(t("error"));
    }
  };

  return (
    <section className="project__cta-area ens-newsletter-home pt-60 pb-60">
      <div className="container">
        <div className="ens-newsletter-home__card">
          <div className="row align-items-center">
            <div className="col-xl-4 col-lg-4">
              <div className="project__title mb-20 mb-lg-0">
                <h3>{te("title")}</h3>
              </div>
            </div>

            <div className="col-xl-4 col-lg-4">
              <div className="project__paragraph mb-20 mb-lg-0">
                <p>{te("description")}</p>
              </div>
            </div>

            <div className="col-xl-4 col-lg-4">
              <div className="project__view text-lg-end">
                <form onSubmit={onSubmit} className="touch__search ens-newsletter-home__form">
                  <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t("email_placeholder")}
                    aria-label={t("email_placeholder")}
                  />
                  <button
                    type="submit"
                    disabled={subscribeMutation.isPending || !canSubmit}
                    aria-label={t("subscribe")}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="11.83" height="20.026" viewBox="0 0 11.83 20.026">
                      <path d="M-3925.578,5558.542l7.623,8.242-7.623,7.543" transform="translate(3927.699 -5556.422)" fill="none" stroke="#fff" strokeLinecap="round" strokeWidth="3" />
                    </svg>
                  </button>
                </form>

                {message ? <p className="ens-newsletter-home__status is-success">{message}</p> : null}
                {error ? <p className="ens-newsletter-home__status is-error">{error}</p> : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
