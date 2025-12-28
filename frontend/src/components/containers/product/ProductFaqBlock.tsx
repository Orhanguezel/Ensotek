// =============================================================
// FILE: src/components/containers/product/ProductFaqBlock.tsx
// Ensotek – Product FAQ Block (Sık Sorulan Sorular)
// - Theme accordion SCSS ile uyumlu (bd-faq__accordion)
// - Inline style YOK
// - İçerik yoksa ve loading değilse render YOK
// - Bootstrap JS gerekmez (React state ile)
// =============================================================

'use client';

import React, { useMemo, useState, useEffect, useId } from 'react';
import type { ProductFaqDto } from '@/integrations/types/product.types';

interface ProductFaqBlockProps {
  title: string;
  faqs: ProductFaqDto[];
  isLoading: boolean;
  emptyText: string; // API uyumu için duruyor (bu blokta gösterilmiyor)
}

function safeNum(v: unknown, fallback = 0) {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

function safeStr(v: unknown) {
  if (typeof v === 'string') return v.trim();
  if (v == null) return '';
  return String(v).trim();
}

const ProductFaqBlock: React.FC<ProductFaqBlockProps> = ({ title, faqs, isLoading }) => {
  const uid = useId();

  const hasFaqs = (faqs?.length ?? 0) > 0;

  // ✅ Hook her render’da çağrılır
  const sorted = useMemo(() => {
    const copy = (faqs ?? []).slice();
    copy.sort((a, b) => safeNum((a as any).display_order) - safeNum((b as any).display_order));
    return copy;
  }, [faqs]);

  // ✅ İlk açılacak item: 0 (faqs geldiyse), yoksa -1
  const [openIdx, setOpenIdx] = useState<number>(-1);

  // data geldikçe (ilk load) ilk item'i aç
  useEffect(() => {
    if (hasFaqs && openIdx === -1) setOpenIdx(0);
    if (!hasFaqs) setOpenIdx(-1);
    // openIdx intentionally included: davranış deterministik
  }, [hasFaqs, openIdx]);

  // ✅ İçerik yoksa ve loading değilse: render yok
  if (!isLoading && !hasFaqs) return null;

  return (
    <div className="product__detail-faq bd-faq__wrapper-2 h-100">
      <h3 className="product__detail-subtitle mb-10">{title}</h3>

      {isLoading && !hasFaqs ? <div className="skeleton-line" aria-hidden /> : null}

      {hasFaqs ? (
        <div className="bd-faq__accordion">
          <div className="accordion" id={`productFaqAccordion-${uid}`}>
            {sorted.map((f, idx) => {
              const q = safeStr((f as any).question);
              const a = safeStr((f as any).answer);

              const isOpen = idx === openIdx;

              const itemKey = safeStr((f as any).id) || `${uid}-${idx}`;
              const headingId = `productFaqHeading-${itemKey}`;
              const collapseId = `productFaqCollapse-${itemKey}`;

              return (
                <div className="accordion-item" key={itemKey}>
                  <h2 className="accordion-header" id={headingId}>
                    <button
                      type="button"
                      className={`accordion-button ${isOpen ? '' : 'collapsed'}`}
                      aria-expanded={isOpen ? 'true' : 'false'}
                      aria-controls={collapseId}
                      onClick={() => setOpenIdx((prev) => (prev === idx ? -1 : idx))}
                    >
                      {q}
                    </button>
                  </h2>

                  {/* Bootstrap JS YOK: sadece class ile show/hide */}
                  <div
                    id={collapseId}
                    className={`accordion-collapse collapse ${isOpen ? 'show' : ''}`}
                    aria-labelledby={headingId}
                  >
                    <div className="accordion-body">
                      <p>{a}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ProductFaqBlock;
