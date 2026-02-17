"use client";

import { FormEvent, useMemo, useState } from "react";
import { Link } from "@/i18n/routing";
import { useRouter } from "@/i18n/routing";
import { ROUTES } from "@/config/routes";
import { useGoogleStart, useLogin } from "@/features/auth/auth.action";

interface Props {
  translations: {
    login_title: string;
    email: string;
    password: string;
    forgot_password: string;
    dont_have_account: string;
    register: string;
    login: string;
    remember_me: string;
    login_error: string;
    loading: string;
    or: string;
    google: string;
    facebook: string;
    social_error: string;
  };
}

export function LoginClient({ translations: t }: Props) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const loginMutation = useLogin();
  const googleMutation = useGoogleStart();

  const isLoading = loginMutation.isPending || googleMutation.isPending;

  const apiErrorMessage = useMemo(() => {
    if (!loginMutation.error) return null;
    return (loginMutation.error as any)?.message || t.login_error;
  }, [loginMutation.error, t.login_error]);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!email.trim() || !password) {
      setFormError(t.login_error);
      return;
    }

    loginMutation.mutate(
      { email: email.trim(), password },
      {
        onSuccess: () => {
          router.push("/");
          router.refresh();
        },
      },
    );
  };

  const handleGoogleLogin = async () => {
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
    <section className="tp-login-area pt-120 pb-120">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-6 col-md-8">
            <div className="tp-login-wrapper p-4 p-md-5 shadow-sm bg-white rounded">
              <h3 className="mb-3 text-center">{t.login_title}</h3>
              <p className="text-center mb-4">
                {t.dont_have_account}{" "}
                <Link href={ROUTES.AUTH.REGISTER} className="text-primary">
                  {t.register}
                </Link>
                .
              </p>

              {errorToShow ? <div className="alert alert-danger py-2 small mb-3">{errorToShow}</div> : null}

              <form onSubmit={onSubmit} className="tp-login-form">
                <div className="mb-3">
                  <label htmlFor="login-email" className="form-label">
                    {t.email}
                  </label>
                  <input
                    id="login-email"
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
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <label htmlFor="login-password" className="form-label m-0">
                      {t.password}
                    </label>
                    <Link href={ROUTES.AUTH.FORGOT_PASSWORD} className="small text-primary">
                      {t.forgot_password}
                    </Link>
                  </div>
                  <input
                    id="login-password"
                    type="password"
                    className="form-control"
                    placeholder={t.password}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    required
                  />
                </div>

                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div className="form-check">
                    <input id="remember-me" className="form-check-input" type="checkbox" disabled={isLoading} />
                    <label className="form-check-label small" htmlFor="remember-me">
                      {t.remember_me}
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-100 mb-3 solid__btn d-inline-flex justify-content-center align-items-center gap-2"
                  disabled={isLoading}
                >
                  {loginMutation.isPending ? t.loading : t.login}
                </button>
              </form>

              <div className="text-center mb-3">
                <span className="d-inline-block position-relative">
                  <span className="px-2 bg-white position-relative z-1">{t.or}</span>
                  <span className="login-divider" />
                </span>
              </div>

              <button
                type="button"
                className="w-100 border__btn d-inline-flex justify-content-center align-items-center gap-2"
                onClick={handleGoogleLogin}
                disabled={isLoading}
              >
                {googleMutation.isPending ? (
                  <>{t.loading}</>
                ) : (
                  <>
                    <span className="login-google-icon">G</span>
                    <span>{t.google}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .login-divider {
          position: absolute;
          left: 0;
          right: 0;
          top: 50%;
          border-bottom: 1px solid #e5e5e5;
          transform: translateY(-50%);
          z-index: 0;
        }
        .login-google-icon {
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
