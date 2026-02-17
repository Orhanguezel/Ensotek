"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { useLibraryItem, useLibraryFiles, useLibraryImages } from "@/features/library/library.action";
import { useTranslations } from "next-intl";
import LibraryPdfPreview from "./LibraryPdfPreview";
import { resolveMediaUrl } from "@/lib/media";

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
  const [imageError, setImageError] = React.useState<boolean>(false);
  const [galleryErrors, setGalleryErrors] = React.useState<Record<string, boolean>>({});

  const { data: item, isLoading, isError } = useLibraryItem(slug);
  const libraryId = item?.id || "";

  const { data: files } = useLibraryFiles(libraryId);
  const { data: images } = useLibraryImages(libraryId);

  const html = useMemo(() => resolveHtml(item?.description), [item?.description]);
  
  const imageItems = Array.isArray(images) ? images : [];
  
  // Determine the main image to show. 
  // Priority: 1. featured_image, 2. image_url, 3. First record from gallery images.
  const mainImageRaw = useMemo(() => {
    if (item?.featured_image) return item.featured_image;
    if (item?.image_url) return item.image_url;
    if (imageItems.length > 0) return imageItems[0].image_url;
    return null;
  }, [item, imageItems]);

  const mainImage = useMemo(() => resolveMediaUrl(mainImageRaw), [mainImageRaw]);

  const fileItems = Array.isArray(files) ? files : [];
  const pdfFile = fileItems.find((f: any) => isPdfUrl(f.file_url) || isPdfUrl(f.mime_type));

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

              {mainImage && !imageError && (
                <div className="technical__thumb w-img mb-35">
                  <Image
                    src={mainImage}
                    alt={item.name}
                    width={1200}
                    height={700}
                    className="ens-media--fluid"
                    onError={() => setImageError(true)}
                    priority
                  />
                </div>
              )}

              {pdfFile?.file_url ? (
                <div className="mb-35">
                  <LibraryPdfPreview pdfUrl={pdfFile.file_url} title={item.name} height={620} />
                </div>
              ) : null}

              <div className="blog__content-wrapper library__content-wrap">
                <h1 className="postbox__title mb-20">{item.name}</h1>

                <div className="interaction-bar mb-30 pb-20 border-bottom d-flex align-items-center justify-content-between">
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
                        <a href={resolveMediaUrl(file.file_url) || "#"} target="_blank" rel="noreferrer">
                          <i className="fal fa-file-arrow-down mr-8"></i>
                          {file.name || t("downloadFile")}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {imageItems.length > 0 && imageItems.some(img => !galleryErrors[img.id]) ? (
                <div className="sideber__widget-item mb-40">
                  <div className="sidebar__contact-title mb-25">
                    <h3>{t("gallery")}</h3>
                  </div>
                  <div className="row g-2">
                    {imageItems.slice(0, 6).map((img) => {
                      const resolvedImgUrl = resolveMediaUrl(img.image_url);
                      if (!resolvedImgUrl || galleryErrors[img.id]) return null;
                      
                      return (
                        <div key={img.id} className="col-4">
                          <a href={resolvedImgUrl} target="_blank" rel="noreferrer">
                            <Image
                              src={resolvedImgUrl}
                              alt={img.alt || item.name}
                              width={120}
                              height={90}
                              className="library__side-thumb"
                              onError={() => setGalleryErrors(prev => ({ ...prev, [img.id]: true }))}
                            />
                          </a>
                        </div>
                      );
                    })}
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
