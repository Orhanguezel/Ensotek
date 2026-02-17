"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { useLibraryItem, useLibraryFiles, useLibraryImages } from "@/features/library/library.action";
import { useTranslations } from "next-intl";
import LibraryPdfPreview from "./LibraryPdfPreview";

interface LibraryDetailProps {
  slug: string;
}

function resolveHtml(description?: string | null): string {
  if (!description) return "";
  const raw = description.trim();
  if (!raw) return "";

  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed.html === "string") return parsed.html;
  } catch {
    // plain html/text
  }

  return raw;
}

function isPdfUrl(input?: string | null): boolean {
  if (!input) return false;
  const val = input.toLowerCase();
  return val.includes("application/pdf") || /\.pdf(\?|#|$)/i.test(val);
}

const LibraryDetail = ({ slug }: LibraryDetailProps) => {
  const t = useTranslations("ensotek.library");

  const { data: item, isLoading, isError } = useLibraryItem(slug);
  const libraryId = item?.id || "";

  const { data: files } = useLibraryFiles(libraryId);
  const { data: images } = useLibraryImages(libraryId);

  const html = useMemo(() => resolveHtml(item?.description), [item?.description]);
  const mainImage = item?.featured_image || item?.image_url || "/img/blog/3/1.jpg";

  const fileItems = Array.isArray(files) ? files : [];
  const imageItems = Array.isArray(images) ? images : [];

  const pdfFile = fileItems.find((f) => isPdfUrl(f.file_url) || isPdfUrl(f.mime_type));

  if (isLoading) {
    return (
      <div className="container pt-120 pb-120 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">{t("loading")}</span>
        </div>
      </div>
    );
  }

  if (isError || !item) {
    return (
      <section className="pt-120 pb-120">
        <div className="container text-center">
          <h3>{t("notFound")}</h3>
          <Link href="/library" className="tp-btn mt-20">
            {t("backToList")}
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="technical__area pt-120 pb-120">
      <div className="container">
        <div className="row">
          <div className="col-xl-8 col-lg-8">
            <div className="technical__main-wrapper mb-60">
              <div className="mb-25">
                <Link href="/library" className="text-primary fw-bold">
                  <i className="fa-light fa-arrow-left-long mr-10"></i>
                  {t("backToList")}
                </Link>
              </div>

              <div className="technical__thumb w-img mb-35">
                <Image
                  src={mainImage}
                  alt={item.name}
                  width={1200}
                  height={700}
                  className="ens-media--fluid"
                />
              </div>

              {pdfFile?.file_url ? (
                <div className="mb-35">
                  <LibraryPdfPreview pdfUrl={pdfFile.file_url} title={item.name} height={620} />
                </div>
              ) : null}

              <div className="blog__content-wrapper library__content-wrap">
                <h1 className="postbox__title mb-20">{item.name}</h1>

                <div className="interaction-bar mb-30 pb-20 border-bottom d-flex align-items-center justify-content-between">
                  {/* <span className="text-muted">
                    <i className="fal fa-calendar-alt mr-5"></i>
                    {new Date(item.published_at || item.created_at).toLocaleDateString()}
                  </span> */}
                  <span className="text-muted">
                    <i className="fal fa-eye mr-5"></i>
                    {item.views || 0}
                  </span>
                </div>

                {html ? (
                  <div className="tp-postbox-details" dangerouslySetInnerHTML={{ __html: html }} />
                ) : (
                  <p>{t("emptyDetail")}</p>
                )}
              </div>
            </div>
          </div>

          <div className="col-xl-4 col-lg-4">
            <div className="sideber__widget">
              {fileItems.length > 0 ? (
                <div className="sideber__widget-item mb-40">
                  <div className="sidebar__contact-title mb-25">
                    <h3>{t("downloads")}</h3>
                  </div>
                  <ul className="sidebar__download-list">
                    {fileItems.map((file) => (
                      <li key={file.id}>
                        <a href={file.file_url || "#"} target="_blank" rel="noreferrer">
                          <i className="fal fa-file-arrow-down mr-8"></i>
                          {file.name || t("downloadFile")}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {imageItems.length > 0 ? (
                <div className="sideber__widget-item mb-40">
                  <div className="sidebar__contact-title mb-25">
                    <h3>{t("gallery")}</h3>
                  </div>
                  <div className="row g-2">
                    {imageItems.slice(0, 6).map((img) => (
                      <div key={img.id} className="col-4">
                        <a href={img.image_url || "#"} target="_blank" rel="noreferrer">
                          <Image
                            src={img.image_url || "/img/blog/3/1.jpg"}
                            alt={img.alt || item.name}
                            width={120}
                            height={90}
                            className="library__side-thumb"
                          />
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LibraryDetail;
