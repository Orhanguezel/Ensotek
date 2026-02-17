"use client";

import { useEffect } from "react";
import { useRouter } from "@/i18n/routing";
import { useLogout } from "@/features/auth/auth.action";
import { useAuthStore } from "@/features/auth/auth.store";

interface Props {
  title: string;
  lead: string;
  errorText: string;
}

export function LogoutClient({ title, lead, errorText }: Props) {
  const router = useRouter();
  const logoutMutation = useLogout();
  const { clearAuth } = useAuthStore();

  useEffect(() => {
    let canceled = false;

    const run = async () => {
      try {
        await logoutMutation.mutateAsync();
      } catch {
        clearAuth();
      } finally {
        if (!canceled) {
          router.push("/login");
          router.refresh();
        }
      }
    };

    run();
    return () => {
      canceled = true;
    };
  }, [logoutMutation, router, clearAuth]);

  return (
    <section className="tp-logout-area pt-120 pb-120">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-6 col-md-8 text-center">
            <div className="p-4 p-md-5 shadow-sm bg-white rounded">
              <h3 className="mb-3">{title}</h3>
              <p className="text-muted small">{lead}</p>
              {logoutMutation.isError ? <p className="text-danger small mt-2">{errorText}</p> : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

