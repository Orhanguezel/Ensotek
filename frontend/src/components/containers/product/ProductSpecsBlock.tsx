// =============================================================
// FILE: src/components/containers/product/ProductSpecsBlock.tsx
// Ensotek – Product Specs Block (Teknik Özellikler)
//   - İçerik yoksa ve loading değilse hiç render edilmez
// =============================================================

"use client";

import React from "react";

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

const ProductSpecsBlock: React.FC<ProductSpecsBlockProps> = ({
    title,
    entries,
    isLoading,
}) => {
    const hasEntries = entries.length > 0;

    // Ne yükleniyor ne de spesifikasyon var → hiç render etme
    if (!isLoading && !hasEntries) {
        return null;
    }

    return (
        <div
            className="product__detail-specs card p-3 h-100"
            style={{ overflow: "hidden" }}
        >
            <h3 className="product__detail-subtitle mb-10">{title}</h3>

            {isLoading && !hasEntries && (
                <div className="skeleton-line" aria-hidden />
            )}

            {hasEntries && (
                <ul
                    className="product__spec-list"
                    style={{
                        paddingLeft: "1.2rem",
                        marginBottom: 0,
                        overflowWrap: "break-word",
                    }}
                >
                    {entries.map((s) => (
                        <li key={s.key}>
                            <strong>{s.label}:</strong> {s.value}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ProductSpecsBlock;
