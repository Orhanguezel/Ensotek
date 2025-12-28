// =============================================================
// FILE: src/components/containers/product/ProductSpecsBlock.tsx
// Ensotek – Product Specs Block (Technical Specifications)
// - FAQ ile aynı wrapper/başlık/spacing (bd-faq__wrapper-2 + product__detail-subtitle)
// - Inline style YOK
// - İçerik yoksa ve loading değilse render YOK
// - Liste görünümü: FAQ accordion item'larının border/padding ritmine benzer
// =============================================================

'use client';

import React, { useMemo } from 'react';

export interface ProductSpecEntry {
  key: string;
  label: string;
  value: string;
}

interface ProductSpecsBlockProps {
  title: string;
  entries: ProductSpecEntry[];
  isLoading: boolean;
}

function safeStr(v: unknown): string {
  if (typeof v === 'string') return v.trim();
  if (v == null) return '';
  return String(v).trim();
}

const ProductSpecsBlock: React.FC<ProductSpecsBlockProps> = ({ title, entries, isLoading }) => {
  // ✅ Hook her render’da çağrılır (koşul yok)
  const list = useMemo(() => {
    const normalized = (entries ?? [])
      .map((e) => {
        const label = safeStr(e?.label);
        const value = safeStr(e?.value);
        const key = safeStr(e?.key) || `${label}-${value}`;
        return { key, label, value };
      })
      .filter((x) => x.key && (x.label || x.value));

    // label boş ama value doluysa label yerine key gösterme; boş label’ı gizleyeceğiz
    return normalized;
  }, [entries]);

  const hasEntries = list.length > 0;

  // ✅ İçerik yoksa ve loading değilse: render yok
  if (!isLoading && !hasEntries) return null;

  return (
    <div className="product__detail-specs bd-faq__wrapper-2 ens-specs h-100">
      <h3 className="product__detail-subtitle mb-10">{title}</h3>

      {isLoading && !hasEntries ? <div className="skeleton-line" aria-hidden /> : null}

      {hasEntries ? (
        <div className="ens-specs__list" role="list">
          {list.map((s, idx) => (
            <div
              key={s.key || idx}
              className={`ens-specs__row ${idx === list.length - 1 ? 'is-last' : ''}`}
              role="listitem"
            >
              <div className="ens-specs__label">{s.label || '—'}</div>
              <div className="ens-specs__value">{s.value || '—'}</div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default ProductSpecsBlock;
