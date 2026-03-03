"use client";

import { FormEvent, useMemo, useState } from "react";
import { Link } from "@/i18n/routing";
import { useRouter } from "@/i18n/routing";
import { ROUTES } from "@/config/routes";
import { useGoogleStart, useSignup } from "@/features/auth/auth.action";

interface Props {
  translations: {
    register_title: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    password: string;
    confirm_password: string;
    already_have_account: string;
    login: string;
    register: string;
    register_error: string;
    loading: string;
    or: string;
    google: string;
    facebook: string;
    social_error: string;
  };
}

export function RegisterClient({ translations: t }: Props) {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordAgain, setPasswordAgain] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const registerMutation = useSignup();
  const googleMutation = useGoogleStart();

  const isLoading = registerMutation.isPending || googleMutation.isPending;

  const apiErrorMessage = useMemo(() => {
    if (!registerMutation.error) return null;
    return (registerMutation.error as any)?.message || t.register_error;
  }, [registerMutation.error, t.register_error]);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!email.trim() || !password) {
      setFormError(t.register_error);
      return;
    }
    if (password.length < 6) {
      setFormError(t.register_error);
      return;
    }
    if (password !== passwordAgain) {
      setFormError(t.confirm_password);
      return;
    }

    registerMutation.mutate(
      {
        email: email.trim(),
        password,
        full_name: fullName.trim() || undefined,
        phone: phone.trim() || undefined,
      },
      {
        onSuccess: () => {
          router.push("/");
          router.refresh();
        },
      },
    );
  };

  const handleGoogleRegister = async () => {
    setFormError(null);
    try {
      const resp = await googleMutation.mutateAsync();
      if (typeof window !== "undefined" && resp?.url) {
        window.location.href = resp.url;
      }
    } catch {
      setFormError(t.social_error);
    }
  };

  const errorToShow = formError || apiErrorMessage;

  return (
    <section className="tp-register-area pt-120 pb-120">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-6 col-md-8">
            <div className="tp-register-wrapper p-4 p-md-5 shadow-sm bg-white rounded">
              <h3 className="mb-3 text-center">{t.register_title}</h3>
              <p className="text-center mb-4">
                {t.already_have_account}{" "}
                <Link href={ROUTES.AUTH.LOGIN} className="text-primary">
                  {t.login}
                </Link>
                .
              </p>

              {errorToShow ? <div className="alert alert-danger py-2 small mb-3">{errorToShow}</div> : null}

              <form onSubmit={onSubmit} className="tp-register-form">
                <div className="mb-3">
                  <label htmlFor="reg-fullname" className="form-label">
                    {t.first_name} {t.last_name}
                  </label>
                  <input
                    id="reg-fullname"
                    type="text"
                    className="form-control"
                    placeholder={`${t.first_name} ${t.last_name}`}
                    autoComplete="name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    disabled={isLoading}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="reg-phone" className="form-label">
                    {t.phone}
                  </label>
                  <input
                    id="reg-phone"
                    type="tel"
                    className="form-control"
                    placeholder="+90 5xx xxx xx xx"
                    autoComplete="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    disabled={isLoading}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="reg-email" className="form-label">
                    {t.email}
                  </label>
                  <input
                    id="reg-email"
                    type="email"
                    className="form-control"
                    placeholder="example@ensotek.com"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="reg-password" className="form-label">
                    {t.password}
                  </label>
                  <input
                    id="reg-password"
                    type="password"
                    className="form-control"
                    placeholder={t.password}
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="reg-password-again" className="form-label">
                    {t.confirm_password}
                  </label>
                  <input
                    id="reg-password-again"
                    type="password"
                    className="form-control"
                    placeholder={t.confirm_password}
                    autoComplete="new-password"
                    value={passwordAgain}
                    onChange={(e) => setPasswordAgain(e.target.value)}
                    disabled={isLoading}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-100 mb-3 solid__btn d-inline-flex justify-content-center align-items-center gap-2"
                  disabled={isLoading}
                >
                  {registerMutation.isPending ? t.loading : t.register}
                </button>
              </form>

              <div className="text-center mb-3">
                <span className="d-inline-block position-relative">
                  <span className="px-2 bg-white position-relative z-1">{t.or}</span>
                  <span className="register-divider" />
                </span>
              </div>

              <button
                type="button"
                className="w-100 border__btn d-inline-flex justify-content-center align-items-center gap-2"
                onClick={handleGoogleRegister}
                disabled={isLoading}
              >
                {googleMutation.isPending ? (
                  <>{t.loading}</>
                ) : (
                  <>
                    <span className="register-google-icon">G</span>
                    <span>{t.google}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .register-divider {
          position: absolute;
          left: 0;
          right: 0;
          top: 50%;
          border-bottom: 1px solid #e5e5e5;
          transform: translateY(-50%);
          z-index: 0;
        }
        .register-google-icon {
          display: inline-flex;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 600;
          background: #fff;
        }
      `}</style>
    </section>
  );
}
