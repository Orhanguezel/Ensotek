// =============================================================
// FILE: src/components/containers/product/ProductFaqBlock.tsx
// Ensotek – Product FAQ Block (Sık Sorulan Sorular)
//   - İçerik yoksa ve loading değilse hiç render edilmez
// =============================================================

"use client";

import React from "react";
import type { ProductFaqDto } from "@/integrations/types/product.types";

interface ProductFaqBlockProps {
    title: string;
    faqs: ProductFaqDto[];
    isLoading: boolean;
    emptyText: string; // Şu an kullanılmıyor ama API uyumu için duruyor
}

const ProductFaqBlock: React.FC<ProductFaqBlockProps> = ({
    title,
    faqs,
    isLoading,
}) => {
    const hasFaqs = faqs.length > 0;

    // Ne yükleniyor ne de data var → hiç render etme
    if (!isLoading && !hasFaqs) {
        return null;
    }

    return (
        <div className="product__detail-faq card p-3 h-100">
            <h3 className="product__detail-subtitle mb-10">{title}</h3>

            {isLoading && !hasFaqs && (
                <div className="skeleton-line" aria-hidden />
            )}

            {hasFaqs && (
                <div className="accordion" id="productFaq">
                    {faqs
                        .slice()
                        .sort((a, b) => a.display_order - b.display_order)
                        .map((f) => (
                            <details key={f.id} className="mb-2">
                                <summary
                                    style={{
                                        cursor: "pointer",
                                        fontWeight: 600,
                                    }}
                                >
                                    {f.question}
                                </summary>
                                <div
                                    style={{
                                        marginTop: 4,
                                        fontSize: 14,
                                    }}
                                >
                                    {f.answer}
                                </div>
                            </details>
                        ))}
                </div>
            )}
        </div>
    );
};

export default ProductFaqBlock;
