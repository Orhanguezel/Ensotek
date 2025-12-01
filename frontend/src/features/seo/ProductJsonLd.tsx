// src/features/seo/ProductJsonLd.tsx
import React from "react";
import type { SupportedLocale } from "@/types/common";
import { absoluteUrl, compact } from "@/features/seo/utils";

type OfferInput = {
  price?: number | string;
  priceCurrency?: string; // varsayılan ENV'den -> EUR
  availability?: "InStock" | "OutOfStock" | "PreOrder" | "Discontinued";
  url?: string; // canonical ürün URL'si
  priceValidUntil?: string; // ISO tarih
};

type AggregateRatingInput = {
  ratingValue: number;
  reviewCount: number;
};

type Props = {
  locale: SupportedLocale;
  url: string;                 // ürünün kanonik URL'si (relative da olabilir)
  name: string;
  description?: string;
  images?: string[];           // absolute/relative karışık olabilir
  brand?: string;
  category?: string;
  sku?: string;
  mpn?: string;
  gtin?: string;
  color?: string | string[];
  material?: string;
  weightKg?: number;
  size?: string;
  offers?: OfferInput;
  aggregateRating?: AggregateRatingInput;
  /** Ek teknik özellikleri schema.org'a "additionalProperty" ile basmak için */
  additionalProps?: Record<string, string | number | boolean | undefined>;
};

export default function ProductJsonLd(props: Props) {
  const {
    locale,
    url,
    name,
    description,
    images = [],
    brand,
    category,
    sku,
    mpn,
    gtin,
    color,
    material,
    weightKg,
    size,
    offers,
    aggregateRating,
    additionalProps,
  } = props;

  const imageAbs = images
    .map((src) => (src ? absoluteUrl(src) : ""))
    .filter(Boolean);

  const offer =
    offers && (offers.price || offers.url || offers.availability)
      ? compact({
          "@type": "Offer",
          url: offers.url ? absoluteUrl(offers.url) : absoluteUrl(url),
          price: typeof offers.price === "string" ? Number(offers.price) || undefined : offers.price,
          priceCurrency:
            (offers.priceCurrency || process.env.NEXT_PUBLIC_CURRENCY || "EUR").toUpperCase(),
          availability: offers.availability
            ? `https://schema.org/${offers.availability}`
            : undefined,
          priceValidUntil: offers.priceValidUntil,
        })
      : undefined;

  const addl =
    additionalProps && Object.keys(additionalProps).length
      ? Object.entries(additionalProps).map(([k, v]) =>
          compact({
            "@type": "PropertyValue",
            name: k,
            value: v === undefined ? undefined : String(v),
          })
        )
      : undefined;

  const data = compact({
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    sku,
    mpn,
    gtin,
    url: absoluteUrl(url),
    inLanguage: locale,
    image: imageAbs.length ? imageAbs : undefined,
    brand: brand ? { "@type": "Brand", name: brand } : undefined,
    category,
    color: Array.isArray(color) ? color.join(", ") : color,
    material,
    size,
    weight:
      typeof weightKg === "number"
        ? { "@type": "QuantitativeValue", value: weightKg, unitCode: "KGM" }
        : undefined,
    offers: offer,
    aggregateRating:
      aggregateRating && aggregateRating.ratingValue > 0
        ? compact({
            "@type": "AggregateRating",
            ratingValue: aggregateRating.ratingValue,
            reviewCount: aggregateRating.reviewCount,
          })
        : undefined,
    additionalProperty: addl,
  });

  return (
    <script
      type="application/ld+json"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
