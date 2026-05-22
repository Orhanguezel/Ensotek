import type { RouteHandler } from "fastify";
import { and, asc, eq } from "drizzle-orm";
import { db } from "../../db/client";
import { footerSections, footerSectionsI18n } from "./schema";

export const listFooterSections: RouteHandler = async (req, reply) => {
  const q = (req.query || {}) as Record<string, string | undefined>;
  const locale = (q.locale || "tr").split("-")[0].toLowerCase();
  const siteId = q.site_id;

  const conds: any[] = [eq(footerSectionsI18n.locale, locale)];
  if (siteId) conds.push(eq(footerSections.site_id, siteId));
  if (q.is_active !== undefined) {
    conds.push(eq(footerSections.is_active, q.is_active === "1" || q.is_active === "true"));
  }

  const rows = await db
    .select({
      id:            footerSections.id,
      site_id:       footerSections.site_id,
      is_active:     footerSections.is_active,
      display_order: footerSections.display_order,
      locale:        footerSectionsI18n.locale,
      title:         footerSectionsI18n.title,
      slug:          footerSectionsI18n.slug,
      description:   footerSectionsI18n.description,
    })
    .from(footerSections)
    .innerJoin(footerSectionsI18n, eq(footerSections.id, footerSectionsI18n.section_id))
    .where(and(...conds))
    .orderBy(asc(footerSections.display_order));

  return reply.send(rows);
};
