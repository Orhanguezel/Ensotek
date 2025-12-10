// =============================================================
// FILE: src/components/common/RichContentEditor.tsx
// Ensotek – Zengin HTML Editörü + Canlı Önizleme (depsiz)
//  - contentEditable tabanlı WYSIWYG
//  - Tablo ve Resim ekleme butonları
//  - Kaynak (HTML) sekmesi + Görsel sekmesi
//  - Önizleme anlık olarak güncellenir
//  - Eski {"html":"..."} kayıtlarını otomatik düz HTML'e çevirir
// =============================================================

"use client";

import React, { useEffect, useRef, useState } from "react";

export type RichContentEditorProps = {
    label?: string;
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
    height?: string;
    /**
     * Opsiyonel image upload hook'u.
     * Storage modülüne upload edip public URL döndürmek için kullanabilirsin.
     */
    onUploadImage?: (file: File) => Promise<string>;
};

type ActiveTab = "visual" | "source";

const DEFAULT_HEIGHT = "260px";

/**
 * Eski içerik formatını normalize et:
 *  - Düz HTML ise: aynen döner
 *  - {"html":"<p>...</p>"} JSON-string ise: içindeki html'i döner
 */
function normalizeLegacyHtmlValue(
    raw: string | undefined | null,
): string {
    if (!raw) return "";
    const trimmed = raw.trim();

    if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
        try {
            const parsed = JSON.parse(trimmed) as any;
            if (parsed && typeof parsed.html === "string") {
                return parsed.html;
            }
        } catch {
            // parse edilemezse olduğu gibi bırak
        }
    }

    return raw;
}

/**
 * Caret konumuna raw HTML enjekte etmek için helper
 */
function insertHtmlAtCursor(html: string) {
    if (typeof window === "undefined") return;

    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;

    const range = sel.getRangeAt(0);
    range.deleteContents();

    const temp = document.createElement("div");
    temp.innerHTML = html;

    const frag = document.createDocumentFragment();
    let node: ChildNode | null;
    // eslint-disable-next-line no-cond-assign
    while ((node = temp.firstChild)) {
        frag.appendChild(node);
    }

    range.insertNode(frag);

    // Caret'i eklenen içeriğin sonrasına at
    range.collapse(false);
    sel.removeAllRanges();
    sel.addRange(range);
}

const RichContentEditor: React.FC<RichContentEditorProps> = ({
    label = "İçerik",
    value,
    onChange,
    disabled = false,
    height = DEFAULT_HEIGHT,
    onUploadImage,
}) => {
    const editorRef = useRef<HTMLDivElement | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    // 🔹 Varsayılan olarak GÖRSEL editör açık olsun (kullanıcı dostu)
    const [activeTab, setActiveTab] = useState<ActiveTab>("visual");

    // Parent'tan gelen değeri normalize ederek local HTML'e çevir
    const [html, setHtml] = useState<string>(
        normalizeLegacyHtmlValue(value),
    );

    // Dışarıdan (örneğin locale switch, JSON → form) value değişirse sync et
    useEffect(() => {
        const normalized = normalizeLegacyHtmlValue(value);
        setHtml(normalized);

        // Eğer görsel moddaysak DOM'u da update et
        if (editorRef.current && activeTab === "visual") {
            if (editorRef.current.innerHTML !== normalized) {
                editorRef.current.innerHTML = normalized || "";
            }
        }

        // Eğer gelen değer JSON-wrapper ise ve normalize edilmiş hali farklıysa,
        // parent state'i de otomatik düz HTML'e çevir ({"html": ...} → <p>...</p>)
        if (
            typeof value === "string" &&
            value.trim().startsWith("{") &&
            value.trim().endsWith("}") &&
            normalized !== value
        ) {
            onChange(normalized);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    // Tab değiştiğinde görsel editörü güncel HTML ile doldur
    useEffect(() => {
        if (activeTab === "visual" && editorRef.current) {
            if (editorRef.current.innerHTML !== html) {
                editorRef.current.innerHTML = html || "";
            }
        }
    }, [activeTab, html]);

    const propagateChange = (next: string) => {
        setHtml(next);
        onChange(next);
    };

    const handleVisualInput = (
        e: React.FormEvent<HTMLDivElement>,
    ) => {
        if (disabled) return;
        const next = e.currentTarget.innerHTML;
        propagateChange(next);
    };

    const focusEditor = () => {
        if (editorRef.current) {
            editorRef.current.focus();
        }
    };

    const exec = (command: string, valueArg?: string) => {
        if (disabled) return;
        if (typeof document === "undefined") return;
        focusEditor();
        try {
            // execCommand modern değil ama admin panelde iş görüyor
            document.execCommand(command, false, valueArg);
            if (editorRef.current) {
                const next = editorRef.current.innerHTML;
                propagateChange(next);
            }
        } catch {
            // sessiz geç
        }
    };

    const handleToolbarMouseDown = (
        e: React.MouseEvent<HTMLButtonElement>,
        command: string,
        valueArg?: string,
    ) => {
        e.preventDefault(); // butonun focus almasını engelle

        if (command === "insertTable") {
            if (disabled) return;
            focusEditor();
            const tableHtml =
                '<table class="table table-bordered"><thead><tr><th>Başlık 1</th><th>Başlık 2</th></tr></thead><tbody><tr><td>Hücre 1</td><td>Hücre 2</td></tr></tbody></table><p></p>';
            insertHtmlAtCursor(tableHtml);
            if (editorRef.current) {
                const next = editorRef.current.innerHTML;
                propagateChange(next);
            }
            return;
        }

        if (command === "insertImage") {
            if (disabled) return;

            // onUploadImage varsa: file input ile upload akışı
            if (onUploadImage && fileInputRef.current) {
                fileInputRef.current.click();
                return;
            }

            // onUploadImage yoksa: URL prompt
            if (typeof window !== "undefined") {
                const url = window.prompt("Resim URL'si girin:");
                if (url && url.trim().length > 0) {
                    const safeUrl = url.trim();
                    const imgHtml = `<img src="${safeUrl}" alt="" class="img-fluid" style="max-width: 100%; height: auto;" />`;
                    focusEditor();
                    insertHtmlAtCursor(imgHtml);
                    if (editorRef.current) {
                        const next = editorRef.current.innerHTML;
                        propagateChange(next);
                    }
                }
            }
            return;
        }

        if (command === "formatBlock") {
            exec(command, valueArg);
            return;
        }

        exec(command, valueArg);
    };

    const handleFileInputChange = async (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        if (!onUploadImage) return;
        const file = e.target.files?.[0];
        // input'u resetle (aynı dosyayı tekrar seçebilmek için)
        e.target.value = "";
        if (!file) return;

        try {
            const url = await onUploadImage(file);
            if (!url) return;

            const safeUrl = url;
            const safeAlt = file.name.replace(/"/g, "&quot;");
            const imgHtml = `<img src="${safeUrl}" alt="${safeAlt}" class="img-fluid" style="max-width: 100%; height: auto;" />`;

            focusEditor();
            insertHtmlAtCursor(imgHtml);
            if (editorRef.current) {
                const next = editorRef.current.innerHTML;
                propagateChange(next);
            }
        } catch (err) {
            // Upload hatası durumda şimdilik sessiz geçiyoruz
            // İstersen burada toast da tetikleyebilirsin
            console.error("Image upload failed", err);
        }
    };

    return (
        <div className="mt-3">
            {label && (
                <label className="form-label small d-block mb-1">
                    {label}
                </label>
            )}

            {/* Sekmeler: Görsel / Kaynak */}
            <div className="d-flex border-bottom mb-1 small">
                <button
                    type="button"
                    className={`btn btn-sm border-0 rounded-0 ${activeTab === "visual"
                            ? "btn-light fw-semibold"
                            : "btn-link text-decoration-none text-muted"
                        }`}
                    onClick={() => setActiveTab("visual")}
                >
                    Görsel editör
                </button>
                <button
                    type="button"
                    className={`btn btn-sm border-0 rounded-0 ${activeTab === "source"
                            ? "btn-light fw-semibold"
                            : "btn-link text-decoration-none text-muted"
                        }`}
                    onClick={() => setActiveTab("source")}
                >
                    Kaynak (HTML)
                </button>
            </div>

            {/* Editör + Toolbar */}
            <div className="border rounded position-relative">
                {/* Toolbar – sadece görsel modda aktif */}
                <div className="border-bottom bg-light px-2 py-1 d-flex flex-wrap gap-1 small">
                    <button
                        type="button"
                        className="btn btn-sm btn-outline-secondary"
                        onMouseDown={(e) =>
                            handleToolbarMouseDown(e, "bold")
                        }
                        disabled={disabled || activeTab !== "visual"}
                        title="Kalın"
                    >
                        <strong>B</strong>
                    </button>
                    <button
                        type="button"
                        className="btn btn-sm btn-outline-secondary"
                        onMouseDown={(e) =>
                            handleToolbarMouseDown(e, "italic")
                        }
                        disabled={disabled || activeTab !== "visual"}
                        title="İtalik"
                    >
                        <em>I</em>
                    </button>
                    <button
                        type="button"
                        className="btn btn-sm btn-outline-secondary"
                        onMouseDown={(e) =>
                            handleToolbarMouseDown(e, "underline")
                        }
                        disabled={disabled || activeTab !== "visual"}
                        title="Altı çizili"
                    >
                        <span style={{ textDecoration: "underline" }}>U</span>
                    </button>

                    <span className="vr mx-1" />

                    <button
                        type="button"
                        className="btn btn-sm btn-outline-secondary"
                        onMouseDown={(e) =>
                            handleToolbarMouseDown(e, "formatBlock", "p")
                        }
                        disabled={disabled || activeTab !== "visual"}
                        title="Paragraf"
                    >
                        P
                    </button>
                    <button
                        type="button"
                        className="btn btn-sm btn-outline-secondary"
                        onMouseDown={(e) =>
                            handleToolbarMouseDown(e, "formatBlock", "h2")
                        }
                        disabled={disabled || activeTab !== "visual"}
                        title="Başlık 1"
                    >
                        H1
                    </button>
                    <button
                        type="button"
                        className="btn btn-sm btn-outline-secondary"
                        onMouseDown={(e) =>
                            handleToolbarMouseDown(e, "formatBlock", "h3")
                        }
                        disabled={disabled || activeTab !== "visual"}
                        title="Başlık 2"
                    >
                        H2
                    </button>

                    <span className="vr mx-1" />

                    <button
                        type="button"
                        className="btn btn-sm btn-outline-secondary"
                        onMouseDown={(e) =>
                            handleToolbarMouseDown(e, "insertUnorderedList")
                        }
                        disabled={disabled || activeTab !== "visual"}
                        title="Madde işaretli liste"
                    >
                        ••
                    </button>
                    <button
                        type="button"
                        className="btn btn-sm btn-outline-secondary"
                        onMouseDown={(e) =>
                            handleToolbarMouseDown(e, "insertOrderedList")
                        }
                        disabled={disabled || activeTab !== "visual"}
                        title="Numaralı liste"
                    >
                        1.
                    </button>

                    <span className="vr mx-1" />

                    <button
                        type="button"
                        className="btn btn-sm btn-outline-secondary"
                        onMouseDown={(e) =>
                            handleToolbarMouseDown(e, "insertTable")
                        }
                        disabled={disabled || activeTab !== "visual"}
                        title="Tablo ekle"
                    >
                        Tbl
                    </button>

                    <button
                        type="button"
                        className="btn btn-sm btn-outline-secondary"
                        onMouseDown={(e) =>
                            handleToolbarMouseDown(e, "insertImage")
                        }
                        disabled={disabled || activeTab !== "visual"}
                        title={
                            onUploadImage
                                ? "Resim yükle ve ekle"
                                : "Resim URL'si ile ekle"
                        }
                    >
                        Resim
                    </button>

                    <span className="vr mx-1" />

                    <button
                        type="button"
                        className="btn btn-sm btn-outline-secondary"
                        onMouseDown={(e) =>
                            handleToolbarMouseDown(e, "removeFormat")
                        }
                        disabled={disabled || activeTab !== "visual"}
                        title="Biçimlendirmeyi temizle"
                    >
                        Temizle
                    </button>

                    {/* Gizli file input – sadece onUploadImage varsa anlamlı */}
                    {onUploadImage && (
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="d-none"
                            onChange={handleFileInputChange}
                        />
                    )}
                </div>

                {/* Editör alanı */}
                {activeTab === "visual" ? (
                    <div
                        ref={editorRef}
                        className="px-2 py-2"
                        style={{
                            minHeight: height,
                            maxHeight: "600px",
                            overflowY: "auto",
                            backgroundColor: disabled ? "#f8f9fa" : "#ffffff",
                            cursor: disabled ? "not-allowed" : "text",
                        }}
                        contentEditable={!disabled}
                        onInput={handleVisualInput}
                        suppressContentEditableWarning
                    />
                ) : (
                    <textarea
                        className="form-control form-control-sm border-0 font-monospace"
                        style={{
                            height,
                            maxHeight: "600px",
                            resize: "vertical",
                        }}
                        value={html}
                        onChange={(e) => {
                            const next = e.target.value;
                            propagateChange(next);
                        }}
                        disabled={disabled}
                        placeholder="<p>HTML içeriği buraya yaz...</p>"
                    />
                )}

                {/* disabled ise overlay */}
                {disabled && (
                    <div
                        className="position-absolute top-0 start-0 w-100 h-100"
                        style={{
                            background: "rgba(255, 255, 255, 0.4)",
                            cursor: "not-allowed",
                            zIndex: 10,
                        }}
                    />
                )}
            </div>

            {/* Açıklama */}
            <div className="form-text small">
                <ul className="mb-0 ps-3">
                    <li>
                        <strong>Görsel editör</strong> sekmesinde tablo, başlık, liste
                        vb. zengin içeriği normal metin gibi düzenleyebilirsin.
                    </li>
                    <li>
                        <strong>Kaynak (HTML)</strong> sekmesinde aynı içeriğin ham
                        HTML kodunu görüp düzenleyebilirsin.
                    </li>
                    <li>
                        Tablo eklemek için toolbar&apos;daki <strong>Tbl</strong>{" "}
                        butonuna basman yeterli; varsayılan 2x2 tablo ekler.
                    </li>
                    <li>
                        <strong>Resim</strong> butonu:
                        {onUploadImage
                            ? " dosya seçip storage'a upload eder ve URL ile ekler."
                            : " doğrudan bir resim URL'si girmeni ister ve o URL'yi ekler."}
                    </li>
                </ul>
            </div>

            {/* CANLI ÖNİZLEME */}
            <div className="mt-3">
                <div className="small text-muted mb-1">Önizleme</div>
                <div
                    className="border rounded p-2 bg-light"
                    style={{
                        minHeight: "120px",
                        maxHeight: "400px",
                        overflowY: "auto",
                        backgroundColor: "#ffffff",
                    }}
                >
                    {html && html.trim().length > 0 ? (
                        <div
                            // Admin paneli, içerik senin kontrolünde → HTML render normal
                            dangerouslySetInnerHTML={{ __html: html }}
                        />
                    ) : (
                        <p className="text-muted small mb-0">
                            Henüz içerik yok. Görsel editörde ya da HTML sekmesinde
                            yazdıkça burada anlık olarak gözükecek.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RichContentEditor;
