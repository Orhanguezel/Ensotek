import { and, eq, like, or } from "drizzle-orm";
import { db } from "@/db/client";
import { products, productI18n } from "@/modules/products/schema";
import { services, servicesI18n } from "@/modules/services/schema";
import { customPages, customPagesI18n } from "@/modules/customPages/schema";
import { chat_ai_knowledge } from "@/modules/chat/schema";

export type DashboardKnowledgeContext = {
  text: string;
  sourcesCount: number;
};

const STOP_WORDS = new Set([
  "ve", "veya", "ile", "icin", "için", "ama", "fakat", "bu", "su", "şu",
  "bir", "iki", "the", "and", "for", "about", "how", "what", "why", "hangi",
  "nedir", "nasil", "nasıl", "bilgi", "istiyorum", "lütfen", "please",
]);

const QUERY_EXPANSIONS: Record<string, string[]> = {
  "sogutma": ["cooling"],
  "soğutma": ["cooling"],
  "kule": ["tower"],
  "kulesi": ["tower"],
  "hucre": ["cell"],
  "hücre": ["cell"],
  "iki": ["double", "2"],
  "cift": ["double"],
  "çift": ["double"],
  "yedek": ["sparepart", "spare"],
  "parca": ["part"],
  "parça": ["part"],
  "fiyat": ["price", "cost"],
  "fiyatlandirma": ["price", "pricing"],
  "fiyatlandırma": ["price", "pricing"],
  "hizmet": ["service"],
  "hizmetler": ["services"],
  "politik": ["policy"],
  "kvkk": ["privacy"],
  "gizlilik": ["privacy"],
};

function tokenize(input: string): string[] {
  const raw = (input || "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]+/gu, " ")
    .split(/[\s-]+/)
    .map((t) => t.trim())
    .filter(Boolean);

  const out = new Set<string>();
  for (const tok of raw) {
    if (tok.length < 3) continue;
    if (STOP_WORDS.has(tok)) continue;
    out.add(tok);
    const expansions = QUERY_EXPANSIONS[tok] ?? [];
    for (const e of expansions) out.add(e);
  }

  return [...out].slice(0, 10);
}

function truncate(v: unknown, n: number): string {
  const s = String(v ?? "").trim().replace(/\s+/g, " ");
  if (s.length <= n) return s;
  return `${s.slice(0, n - 1)}...`;
}

function formatPriceForChat(v: unknown): string {
  if (v == null) return "not_public";
  const raw = String(v).trim();
  if (!raw) return "not_public";

  const normalized = raw.replace(",", ".");
  const asNum = Number(normalized);
  if (Number.isFinite(asNum) && asNum <= 0) return "not_public";

  return "not_public";
}

function stripHtml(v: string): string {
  return v.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function extractCustomPageText(content: unknown): string {
  const raw = String(content ?? "").trim();
  if (!raw) return "";

  try {
    const parsed = JSON.parse(raw) as any;
    if (parsed && typeof parsed === "object") {
      const html = typeof parsed.html === "string" ? parsed.html : "";
      if (html) return stripHtml(html);
    }
  } catch {
    // fallback below
  }

  return stripHtml(raw);
}

export async function buildDashboardKnowledgeContext(
  userText: string,
  locale = "tr",
): Promise<DashboardKnowledgeContext> {
  const tokens = tokenize(userText);
  if (!tokens.length) return { text: "", sourcesCount: 0 };

  const productConds = tokens.flatMap((t) => [
    like(productI18n.title, `%${t}%`),
    like(productI18n.slug, `%${t}%`),
    like(productI18n.description, `%${t}%`),
  ]);

  const serviceConds = tokens.flatMap((t) => [
    like(servicesI18n.name, `%${t}%`),
    like(servicesI18n.slug, `%${t}%`),
    like(servicesI18n.description, `%${t}%`),
  ]);

  const policyConds = tokens.flatMap((t) => [
    like(customPagesI18n.title, `%${t}%`),
    like(customPagesI18n.slug, `%${t}%`),
    like(customPagesI18n.summary, `%${t}%`),
  ]);

  const knowledgeConds = tokens.flatMap((t) => [
    like(chat_ai_knowledge.title, `%${t}%`),
    like(chat_ai_knowledge.content, `%${t}%`),
    like(chat_ai_knowledge.tags, `%${t}%`),
  ]);

  const [productRows, serviceRows, policyRows, knowledgeRows] = await Promise.all([
    db
      .select({
        id: products.id,
        item_type: products.item_type,
        is_active: products.is_active,
        price: products.price,
        locale: productI18n.locale,
        title: productI18n.title,
        slug: productI18n.slug,
        description: productI18n.description,
      })
      .from(products)
      .innerJoin(productI18n, eq(productI18n.product_id, products.id))
      .where(and(eq(products.is_active, true as any), or(...productConds)))
      .limit(8),

    db
      .select({
        id: services.id,
        is_active: services.is_active,
        type: services.type,
        locale: servicesI18n.locale,
        name: servicesI18n.name,
        slug: servicesI18n.slug,
        description: servicesI18n.description,
        material: servicesI18n.material,
        price: servicesI18n.price,
        includes: servicesI18n.includes,
        warranty: servicesI18n.warranty,
      })
      .from(services)
      .innerJoin(servicesI18n, eq(servicesI18n.service_id, services.id))
      .where(and(eq(services.is_active, 1 as any), or(...serviceConds)))
      .limit(8),

    db
      .select({
        id: customPages.id,
        is_published: customPages.is_published,
        module_key: customPages.module_key,
        locale: customPagesI18n.locale,
        title: customPagesI18n.title,
        slug: customPagesI18n.slug,
        summary: customPagesI18n.summary,
        content: customPagesI18n.content,
      })
      .from(customPages)
      .innerJoin(customPagesI18n, eq(customPagesI18n.page_id, customPages.id))
      .where(and(eq(customPages.is_published, 1 as any), or(...policyConds)))
      .limit(5),
    db
      .select({
        id: chat_ai_knowledge.id,
        locale: chat_ai_knowledge.locale,
        title: chat_ai_knowledge.title,
        content: chat_ai_knowledge.content,
        tags: chat_ai_knowledge.tags,
        priority: chat_ai_knowledge.priority,
      })
      .from(chat_ai_knowledge)
      .where(
        and(
          eq(chat_ai_knowledge.is_active, 1 as any),
          eq(chat_ai_knowledge.locale, locale.toLowerCase()),
          or(...knowledgeConds),
        ),
      )
      .limit(10),
  ]);

  const lines: string[] = [];

  if (productRows.length) {
    lines.push("[PRODUCTS]");
    for (const p of productRows) {
      const price = formatPriceForChat(p.price);
      lines.push(
        `- ${truncate(p.title, 90)} | type=${p.item_type} | price_policy=${price} | locale=${p.locale} | slug=${p.slug}`,
      );
      if (p.description) lines.push(`  desc: ${truncate(p.description, 220)}`);
    }
  }

  if (serviceRows.length) {
    lines.push("[SERVICES]");
    for (const s of serviceRows) {
      const price = formatPriceForChat(s.price);
      lines.push(
        `- ${truncate(s.name, 90)} | type=${s.type} | price_policy=${price} | locale=${s.locale} | slug=${s.slug}`,
      );
      if (s.includes) lines.push(`  includes: ${truncate(s.includes, 180)}`);
      if (s.warranty) lines.push(`  warranty: ${truncate(s.warranty, 180)}`);
      if (s.description) lines.push(`  desc: ${truncate(s.description, 220)}`);
    }
  }

  if (policyRows.length) {
    lines.push("[POLICIES/PAGES]");
    for (const p of policyRows) {
      const summary = p.summary || extractCustomPageText(p.content);
      lines.push(
        `- ${truncate(p.title, 90)} | module=${p.module_key} | locale=${p.locale} | slug=${p.slug}`,
      );
      if (summary) lines.push(`  summary: ${truncate(summary, 240)}`);
    }
  }

  if (knowledgeRows.length) {
    lines.push("[ADMIN_KNOWLEDGE]");
    for (const k of knowledgeRows) {
      lines.push(
        `- ${truncate(k.title, 120)} | locale=${k.locale} | priority=${k.priority}`,
      );
      lines.push(`  note: ${truncate(stripHtml(String(k.content ?? "")), 280)}`);
      if (k.tags) lines.push(`  tags: ${truncate(k.tags, 140)}`);
    }
  }

  return {
    text: lines.join("\n"),
    sourcesCount: productRows.length + serviceRows.length + policyRows.length + knowledgeRows.length,
  };
}
