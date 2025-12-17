// src/seo/meta.ts
"use client";

export type MetaInput = {
  title?: string;
  description?: string;
  url?: string;
  image?: string;
  locale?: string; // e.g., "tr_TR"
  siteName?: string;
  canonical?: string;
  noindex?: boolean;

  twitterCard?: string; // "summary_large_image"
  twitterSite?: string; // "@site"
  twitterCreator?: string; // "@creator"
};

type TagSpec =
  | { kind: "meta-name"; key: string; value: string }
  | { kind: "meta-prop"; key: string; value: string }
  | { kind: "link"; rel: string; href: string };

export function buildMeta(meta: MetaInput): TagSpec[] {
  const out: TagSpec[] = [];

  if (meta.canonical) out.push({ kind: "link", rel: "canonical", href: meta.canonical });

  if (meta.description) out.push({ kind: "meta-name", key: "description", value: meta.description });

  if (meta.noindex) out.push({ kind: "meta-name", key: "robots", value: "noindex, nofollow" });

  // OpenGraph (property)
  if (meta.title) out.push({ kind: "meta-prop", key: "og:title", value: meta.title });
  if (meta.description) out.push({ kind: "meta-prop", key: "og:description", value: meta.description });
  if (meta.url) out.push({ kind: "meta-prop", key: "og:url", value: meta.url });
  if (meta.image) out.push({ kind: "meta-prop", key: "og:image", value: meta.image });

  out.push({ kind: "meta-prop", key: "og:type", value: "website" });

  if (meta.siteName) out.push({ kind: "meta-prop", key: "og:site_name", value: meta.siteName });
  if (meta.locale) out.push({ kind: "meta-prop", key: "og:locale", value: meta.locale });

  // Twitter (name)
  out.push({ kind: "meta-name", key: "twitter:card", value: meta.twitterCard || "summary_large_image" });
  if (meta.twitterSite) out.push({ kind: "meta-name", key: "twitter:site", value: meta.twitterSite });
  if (meta.twitterCreator) out.push({ kind: "meta-name", key: "twitter:creator", value: meta.twitterCreator });
  if (meta.title) out.push({ kind: "meta-name", key: "twitter:title", value: meta.title });
  if (meta.description) out.push({ kind: "meta-name", key: "twitter:description", value: meta.description });
  if (meta.image) out.push({ kind: "meta-name", key: "twitter:image", value: meta.image });

  return out;
}

export function applyMeta(meta: MetaInput): void {
  const specs = buildMeta(meta);
  const head = document.head;

  for (const spec of specs) {
    if (spec.kind === "link") {
      let link = head.querySelector<HTMLLinkElement>(`link[rel="${spec.rel}"]`);
      if (!link) {
        link = document.createElement("link");
        link.rel = spec.rel;
        head.appendChild(link);
      }
      link.href = spec.href;
      continue;
    }

    if (spec.kind === "meta-name") {
      let tag = head.querySelector<HTMLMetaElement>(`meta[name="${spec.key}"]`);
      if (!tag) {
        tag = document.createElement("meta");
        tag.name = spec.key;
        head.appendChild(tag);
      }
      tag.content = spec.value;
      continue;
    }

    // meta-prop
    let tag = head.querySelector<HTMLMetaElement>(`meta[property="${spec.key}"]`);
    if (!tag) {
      tag = document.createElement("meta");
      tag.setAttribute("property", spec.key);
      head.appendChild(tag);
    }
    tag.setAttribute("content", spec.value);
  }
}
