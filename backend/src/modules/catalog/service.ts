// =============================================================
// FILE: src/modules/catalog/service.ts
// Ensotek – Catalog Request Module Service
//   - customer mail: catalog_sent_customer (PDF attachment)
//   - admin mail: catalog_request_received_admin
//   - admin notification: catalog_request_created
//   - site_settings:
//       catalog_pdf_url, catalog_pdf_filename?,
//       catalog_admin_email, site_title
//
// IMPORTANT FIXES:
//  1) Notifications: admin user ids artık site_settings'ten değil,
//     userRoles tablosundan role=admin ile bulunur.
//     -> Yeni admin eklenince otomatik bildirim alır.
//  2) parseToStringArray: site_settings value JSON array string ise parse edilir.
//  3) notifications insert: is_read + created_at alanları set edilir.
// =============================================================

import { randomUUID } from "crypto";
import { eq } from "drizzle-orm";

import { db } from "@/db/client";
import { siteSettings } from "@/modules/siteSettings/schema";
import { notifications, type NotificationType } from "@/modules/notifications/schema";
import { userRoles } from "@/modules/userRoles/schema"; // ✅ role bazlı admin bulma
import { renderEmailTemplateByKey } from "@/modules/email-templates/service";
import { sendMail } from "@/modules/mail/service";
import { telegramNotify } from "@/modules/telegram/telegram.notifier";

import { updateCatalogRequest } from "./repository";

type CatalogRequestContext = {
    id?: string;
    locale?: string | null;
    country_code?: string | null;
    customer_name: string;
    company_name?: string | null;
    email: string;
    phone?: string | null;
    message?: string | null;
};

async function getSiteSettingValue(key: string): Promise<unknown | null> {
    const rows = await db
        .select({ value: siteSettings.value })
        .from(siteSettings)
        .where(eq(siteSettings.key, key))
        .limit(1);

    if (!rows.length) return null;
    return rows[0].value ?? null;
}

/**
 * site_settings.value bazen:
 * - JSON_ARRAY(...) olarak kaydedilmiş olabilir (DB’den string gelebilir)
 * - "a@b.com,c@d.com" gibi CSV olabilir
 * - gerçek array olabilir
 */
function parseToStringArray(value: unknown): string[] {
    if (value == null) return [];

    if (Array.isArray(value)) {
        return value.map((v) => String(v).trim()).filter(Boolean);
    }

    if (typeof value === "string") {
        const s = value.trim();
        if (!s) return [];

        // JSON array string olabilir: '["a@b.com","c@d.com"]'
        if (s.startsWith("[") && s.endsWith("]")) {
            try {
                const parsed = JSON.parse(s);
                if (Array.isArray(parsed)) {
                    return parsed.map((v) => String(v).trim()).filter(Boolean);
                }
            } catch {
                // CSV fallback aşağıda
            }
        }

        // CSV fallback
        return s.split(/[;,]+/).map((v) => v.trim()).filter(Boolean);
    }

    return [String(value)].map((v) => v.trim()).filter(Boolean);
}

async function getCatalogAdminEmails(): Promise<string[]> {
    const raw =
        (await getSiteSettingValue("catalog_admin_email")) ??
        (await getSiteSettingValue("offers_admin_email"));
    return parseToStringArray(raw);
}

/**
 * ✅ Admin user ids artık role bazlı.
 * user_roles tablosunda role='admin' olan tüm kullanıcılar hedef.
 */
async function getAdminUserIdsByRole(): Promise<string[]> {
    const rows = await db
        .select({ user_id: userRoles.user_id })
        .from(userRoles)
        .where(eq(userRoles.role, "admin" as any));

    // distinct
    return Array.from(new Set(rows.map((r) => String(r.user_id)).filter(Boolean)));
}

async function getCatalogUrl(): Promise<string | null> {
    const raw = await getSiteSettingValue("catalog_pdf_url");
    if (typeof raw === "string" && raw.trim()) return raw.trim();
    return null;
}

async function getCatalogFilename(): Promise<string> {
    const raw = await getSiteSettingValue("catalog_pdf_filename");
    if (typeof raw === "string" && raw.trim()) return raw.trim();
    return "ensotek-catalog.pdf";
}

async function getSiteTitle(): Promise<string> {
    const raw = await getSiteSettingValue("site_title");
    if (typeof raw === "string" && raw.trim()) return raw.trim();
    return "Ensotek";
}

/* -------------------------------------------------------------
 * Notifications helper (role=admin)
 * ------------------------------------------------------------- */

async function createNotificationForAdmins(opts: {
    title: string;
    message: string;
    type: NotificationType;
}) {
    const adminUserIds = await getAdminUserIdsByRole();
    if (!adminUserIds.length) return;

    const rows = adminUserIds.map((uid) => ({
        id: randomUUID(),
        user_id: uid,
        title: opts.title,
        message: opts.message,
        type: opts.type,
        is_read: false as any,
        created_at: new Date() as any,
    }));

    await db.insert(notifications).values(rows as any);
}

/* -------------------------------------------------------------
 * Admin notify + admin mail
 * ------------------------------------------------------------- */

export async function triggerNewCatalogRequestNotifications(ctx: CatalogRequestContext) {
    const title = "Yeni Katalog Talebi";
    const message = `Yeni katalog talebi oluşturuldu.
Müşteri: ${ctx.customer_name}
Firma: ${ctx.company_name ?? "-"}
E-posta: ${ctx.email}
Telefon: ${ctx.phone ?? "-"}`;

    // ✅ DB notification (tüm admin’lere)
    try {
        await createNotificationForAdmins({
            title,
            message,
            type: "catalog_request_created",
        });
    } catch (err) {
        console.error("catalog_request_admin_notification_failed", err);
    }

    try {
        await telegramNotify({
            event: "new_catalog_request",
            data: {
                customer_name: ctx.customer_name,
                customer_email: ctx.email,
                customer_phone: ctx.phone ?? "",
                company_name: ctx.company_name ?? "",
                message: ctx.message ?? "",
                created_at: new Date().toISOString(),
            },
        });
    } catch (err) {
        console.error("catalog_request_telegram_failed", err);
    }

    // ✅ Admin mail (site_settings üzerinden)
    try {
        const adminEmails = await getCatalogAdminEmails();
        if (!adminEmails.length) return;

        const site_title = await getSiteTitle();
        const catalog_url = await getCatalogUrl();

        const params: Record<string, unknown> = {
            site_title,
            site_name: site_title,
            customer_name: ctx.customer_name,
            company_name: ctx.company_name ?? null,
            email: ctx.email,
            phone: ctx.phone ?? null,
            message: ctx.message ?? null,
            locale: ctx.locale ?? "en",
            country_code: ctx.country_code ?? null,
            catalog_url,
            catalog_request_id: ctx.id ?? null,
        };

        const rendered = await renderEmailTemplateByKey(
            "catalog_request_received_admin",
            params,
            ctx.locale ?? "en",
        );

        // missing varsa sessizce geçme yerine logla (debug kolaylaşır)
        if (!rendered) {
            console.error("catalog_request_admin_mail_template_not_found");
            return;
        }
        if (rendered.missing_variables.length > 0) {
            console.error("catalog_request_admin_mail_missing_variables", rendered.missing_variables);
            return;
        }

        for (const to of adminEmails) {
            await sendMail({ to, subject: rendered.subject, html: rendered.html });
        }
    } catch (err) {
        console.error("catalog_request_admin_mail_failed", err);
    }
}

/* -------------------------------------------------------------
 * Customer catalog mail (PDF attachment) + DB status update
 *  - This should be called ONLY by admin action (resend/send endpoint)
 * ------------------------------------------------------------- */

export async function sendCatalogToCustomer(ctx: CatalogRequestContext): Promise<boolean> {
    const catalog_url = await getCatalogUrl();

    if (!catalog_url) {
        if (ctx.id) {
            await updateCatalogRequest(ctx.id, {
                status: "failed" as any,
                admin_notes: "catalog_pdf_url is missing in site_settings" as any,
            } as any);
        }
        return false;
    }

    const site_title = await getSiteTitle();
    const catalog_filename = await getCatalogFilename();

    const params: Record<string, unknown> = {
        site_title,
        site_name: site_title,
        customer_name: ctx.customer_name,
        company_name: ctx.company_name ?? null,
        email: ctx.email,
        phone: ctx.phone ?? null,
        catalog_url, // yedek link
        catalog_filename,
    };

    const locale = ctx.locale ?? "en";
    const rendered = await renderEmailTemplateByKey("catalog_sent_customer", params, locale);

    if (!rendered) {
        if (ctx.id) {
            await updateCatalogRequest(ctx.id, {
                status: "failed" as any,
                admin_notes: "email template catalog_sent_customer not found" as any,
            } as any);
        }
        return false;
    }

    if (rendered.missing_variables.length > 0) {
        if (ctx.id) {
            await updateCatalogRequest(ctx.id, {
                status: "failed" as any,
                admin_notes: `missing variables: ${rendered.missing_variables.join(", ")}` as any,
            } as any);
        }
        return false;
    }

    try {
        await sendMail({
            to: ctx.email,
            subject: rendered.subject,
            html: rendered.html,
            attachments: [
                {
                    filename: catalog_filename,
                    path: catalog_url, // URL veya local path
                    contentType: "application/pdf",
                },
            ],
        });

        if (ctx.id) {
            await updateCatalogRequest(ctx.id, {
                status: "sent" as any,
                email_sent_at: new Date() as any,
                admin_notes: null as any,
            } as any);
        }

        try {
            await telegramNotify({
                title: "Katalog Gönderildi",
                message: [
                    `Talep ID: ${ctx.id ?? "-"}`,
                    `Müşteri: ${ctx.customer_name}`,
                    `E-posta: ${ctx.email}`,
                    `Durum: sent`,
                ].join("\n"),
                type: "catalog_sent",
            });
        } catch (err) {
            console.error("catalog_sent_telegram_failed", err);
        }

        return true;
    } catch (err: any) {
        console.error("catalog_customer_mail_failed", err);

        if (ctx.id) {
            await updateCatalogRequest(ctx.id, {
                status: "failed" as any,
                admin_notes: err?.message ? String(err.message) : ("SMTP/PDF attach error" as any),
            } as any);
        }

        return false;
    }
}
