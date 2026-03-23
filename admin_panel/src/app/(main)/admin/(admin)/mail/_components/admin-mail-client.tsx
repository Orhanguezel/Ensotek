"use client";

// =============================================================
// FILE: src/app/(main)/admin/(admin)/mail/admin-mail-client.tsx
// FINAL — Admin Mail Test
// =============================================================

import * as React from "react";

import { Mail, Send } from "lucide-react";
import { toast } from "sonner";

import { useAdminT } from "@/app/(main)/admin/_components/common/useAdminT";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSendTestMailMutation } from "@/integrations/hooks";

export default function AdminMailClient() {
  const t = useAdminT();

  const [sendTestMail, { isLoading }] = useSendTestMailMutation();
  const [email, setEmail] = React.useState("");

  const handleSendTest = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error(t("mail.test.required"));
      return;
    }

    try {
      await sendTestMail({ to: email }).unwrap();
      toast.success(t("mail.test.success"));
      setEmail("");
    } catch (err: any) {
      const msg = err?.data?.message || err?.message || t("mail.test.error");
      toast.error(msg);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-3xl tracking-tight">{t("mail.title")}</h1>
          <p className="text-muted-foreground">{t("mail.description")}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            {t("mail.test.title")}
          </CardTitle>
          <CardDescription>{t("mail.test.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSendTest} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t("mail.test.label")}</Label>
              <Input
                id="email"
                type="email"
                placeholder={t("mail.test.placeholder")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>

            <Button type="submit" disabled={isLoading}>
              <Send className="mr-2 h-4 w-4" />
              {isLoading ? t("mail.test.sending") : t("mail.test.send")}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("mail.smtp.title")}</CardTitle>
          <CardDescription>{t("mail.smtp.description")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-muted-foreground text-sm">
          <p>{t("mail.smtp.info")}</p>
          <ul className="ml-2 list-inside list-disc space-y-1">
            <li>{t("mail.smtp.variables.host")} (SMTP_HOST)</li>
            <li>{t("mail.smtp.variables.port")} (SMTP_PORT)</li>
            <li>{t("mail.smtp.variables.user")} (SMTP_USER)</li>
            <li>{t("mail.smtp.variables.pass")} (SMTP_PASS)</li>
            <li>{t("mail.smtp.variables.from")} (MAIL_FROM)</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
