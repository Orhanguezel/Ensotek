"use client";

import { useAdminT } from "@/app/(main)/admin/_components/common/useAdminT";

import { PasswordForm } from "./_components/PasswordForm";
import { ProfileForm } from "./_components/ProfileForm";

export default function ProfilePage() {
  const t = useAdminT();

  return (
    <div className="flex-1 space-y-6 pb-10">
      <div className="flex flex-col gap-1">
        <h1 className="font-bold text-2xl tracking-tight">{t("admin.sidebar.user.account")}</h1>
        <p className="text-muted-foreground">
          {t("admin.profile.subtitle") || "Profil bilgilerinizi ve şifrenizi buradan güncelleyebilirsiniz."}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ProfileForm />
        <PasswordForm />
      </div>
    </div>
  );
}
