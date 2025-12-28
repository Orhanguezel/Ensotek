// =============================================================
// FILE: src/components/containers/blog/BlogDetailsArea.tsx
// UPDATED — SCSS-driven, accordion dynamic, no inline style
// - Categories => "Other blogs" (DB list, fallback to previous sidebarItems)
// - Reviews => moved into SIDEBAR (under Other blogs, above Contact Info)
// - Contact Info => from site_settings.contact_info (JSON) via useGetSiteSettingByKeyQuery
// - No hardcoded paths for other blog links (router.pathname + slug)
// =============================================================

'use client';

import React, { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

// RTK – Custom Pages (public)
import {
  useGetCustomPageBySlugPublicQuery,
  useGetSiteSettingByKeyQuery,
  useListCustomPagesPublicQuery,
} from '@/integrations/rtk/hooks';
import type { CustomPageDto } from '@/integrations/types/custom_pages.types';

// Helpers
import { toCdnSrc } from '@/shared/media';
import { excerpt } from '@/shared/text';

// i18n
import { useLocaleShort } from '@/i18n/useLocaleShort';
import { useUiSection } from '@/i18n/uiDb';

// Reviews
import ReviewList from '@/components/common/public/ReviewList';
import ReviewForm from '@/components/common/public/ReviewForm';
import SocialShare from '@/components/common/public/SocialShare';

// Assets (sidebar icons/images) – TechnicalArea pattern
import PhoneIcon from 'public/img/svg/call.svg';
import MailIcon from 'public/img/svg/mail.svg';
import LocationIcon from 'public/img/svg/location.svg';
import SidebarImage from 'public/img/others/sidebar.jpg';

// Fallback hero
import FallbackCover from 'public/img/blog/3/1.jpg';

const HERO_W = 1200;
const HERO_H = 700;

type AccordionItem = { title: string; body: string };

// site_settings.contact_info JSON shape (loosely typed)
type ContactInfo = {
  companyName?: string;
  phones?: string[];
  email?: string;
  address?: string;
  addressSecondary?: string;
  whatsappNumber?: string;
  website?: string;
};

function readSlug(q: unknown): string {
  if (typeof q === 'string') return q.trim();
  if (Array.isArray(q)) return String(q[0] ?? '').trim();
  return '';
}

function safeStr(v: unknown): string {
  if (typeof v === 'string') return v.trim();
  if (v == null) return '';
  return String(v).trim();
}

function asStringArray(v: unknown): string[] {
  if (Array.isArray(v)) return v.map((x) => safeStr(x)).filter(Boolean);
  const s = safeStr(v);
  if (!s) return [];
  return s
    .split(',')
    .map((x) => x.trim())
    .filter(Boolean);
}

/** UI DB value parse helpers (site_settings value may be stringified JSON) */
function tryParseJson<T>(v: unknown): T | null {
  try {
    if (v == null) return null;
    if (typeof v === 'object') return v as T;
    const s = safeStr(v);
    if (!s) return null;
    return JSON.parse(s) as T;
  } catch {
    return null;
  }
}

/**
 * Tailwind kesinlikle uygulanmasın:
 * - class="..." ve style="..." attribute'larını kaldırır
 * - ilk h1'i düşürür (sayfa başlığını component basıyor)
 */
function stripPresentationAttrs(html: string): string {
  const src = safeStr(html);
  if (!src) return '';

  const noClass = src.replace(/\sclass="[^"]*"/gi, '');
  const noStyle = noClass.replace(/\sstyle="[^"]*"/gi, '');
  const dropFirstH1 = noStyle.replace(/<h1\b[^>]*>[\s\S]*?<\/h1>/i, '');

  return dropFirstH1.trim();
}

const BlogDetailsArea: React.FC = () => {
  const router = useRouter();
  const locale = useLocaleShort();

  const { ui } = useUiSection('ui_blog', locale as any);

  // Accordion open state (none open by default)
  const [openIdx, setOpenIdx] = useState<number>(-1);

  const t = useMemo(
    () => ({
      backToList: ui('ui_blog_back_to_list', 'Back to all blog posts'),

      // Categories başlığı artık "Other blogs"
      categoriesTitle: ui('ui_blog_other_blogs_title', 'Other blogs'),

      contactTitle: ui('ui_blog_sidebar_contact_title', 'Contact Info'),
      loading: ui('ui_blog_loading', 'Loading blog...'),
      notFound: ui('ui_blog_not_found', 'Blog post not found.'),
      writeReview: ui('ui_blog_write_comment', 'Write a review'),
      tagsLabel: ui('ui_blog_tags', 'Tags'),

      // sidebar fallbacks (only if blog list cannot be fetched)
      sb1: ui('ui_blog_sidebar_item_1', ''),
      sb2: ui('ui_blog_sidebar_item_2', ''),
      sb3: ui('ui_blog_sidebar_item_3', ''),
    }),
    [ui],
  );

  const slug = useMemo(() => readSlug(router.query.slug), [router.query.slug]);
  const isSlugReady = !!slug;

  const { data, isLoading, isError } = useGetCustomPageBySlugPublicQuery(
    { slug, locale },
    { skip: !isSlugReady },
  );

  const post = data as CustomPageDto | undefined;

  const postId = useMemo(() => safeStr((post as any)?.id), [post]);
  const hasPost = !!post && !!postId && !isError;

  const title = useMemo(() => safeStr((post as any)?.title), [post]);

  const heroSrc = useMemo(() => {
    const raw = safeStr((post as any)?.featured_image);
    if (!raw) return '';
    return toCdnSrc(raw, HERO_W, HERO_H, 'fill') || raw;
  }, [post]);

  // Content: content_html -> content.html -> summary -> content_text excerpt
  const rawHtml = useMemo(() => {
    const html = safeStr((post as any)?.content_html);
    if (html) return html;

    const c = (post as any)?.content;
    if (
      c &&
      typeof c === 'object' &&
      typeof (c as any).html === 'string' &&
      safeStr((c as any).html)
    ) {
      return safeStr((c as any).html);
    }

    const summary = safeStr((post as any)?.summary);
    if (summary) return `<p>${summary}</p>`;

    const txt = excerpt(safeStr((post as any)?.content_text), 1000).trim();
    return txt ? `<p>${txt}</p>` : '';
  }, [post]);

  const contentHtml = useMemo(() => stripPresentationAttrs(rawHtml), [rawHtml]);

  const tags = useMemo(() => {
    const raw = (post as any)?.tags ?? (post as any)?.tag_list ?? (post as any)?.tags_csv ?? '';
    return asStringArray(raw);
  }, [post]);

  // ✅ Sidebar items fallback: tags -> ui_blog_sidebar_items (JSON) -> sb1..sb3
  const sidebarItems = useMemo(() => {
    if (tags.length) return tags.slice(0, 8);

    const json = tryParseJson<string[] | { items?: string[] }>(ui('ui_blog_sidebar_items', ''));
    const fromJson = Array.isArray(json)
      ? json
      : json && typeof json === 'object' && Array.isArray((json as any).items)
      ? ((json as any).items as string[])
      : [];

    const legacy = [t.sb1, t.sb2, t.sb3].map(safeStr).filter(Boolean);

    const normalized = fromJson.map(safeStr).filter(Boolean).slice(0, 8);
    return normalized.length ? normalized : legacy.slice(0, 8);
  }, [tags, ui, t.sb1, t.sb2, t.sb3]);

  // ✅ Accordion items: only ui_blog_accordion_items JSON
  const accordionItems = useMemo<AccordionItem[]>(() => {
    const json = tryParseJson<AccordionItem[] | { items?: AccordionItem[] } | null>(
      ui('ui_blog_accordion_items', ''),
    );

    const fromJson = Array.isArray(json)
      ? json
      : json && typeof json === 'object' && Array.isArray((json as any).items)
      ? ((json as any).items as AccordionItem[])
      : [];

    return fromJson
      .map((x) => ({ title: safeStr(x?.title), body: safeStr(x?.body) }))
      .filter((x) => x.title && x.body)
      .slice(0, 10);
  }, [ui]);

  // -----------------------------------------
  // OTHER BLOGS LIST (DB) for "Other blogs"
  // -----------------------------------------
  const { data: otherBlogsData } = useListCustomPagesPublicQuery(
    {
      module_key: 'blog',
      locale,
      limit: 10,
      offset: 0,
      sort: 'created_at',
      order: 'desc',
      is_published: 1,
    } as any,
    { skip: !isSlugReady },
  );

  const otherBlogs = useMemo(() => {
    const raw =
      (otherBlogsData as any)?.items ??
      (otherBlogsData as any)?.data ??
      (otherBlogsData as any)?.rows ??
      otherBlogsData ??
      [];

    const arr = Array.isArray(raw) ? raw : [];

    return arr
      .map((x: any) => ({
        id: safeStr(x?.id),
        slug: safeStr(x?.slug),
        title: safeStr(x?.title),
      }))
      .filter((x) => x.slug && x.title)
      .filter((x) => x.slug !== slug && x.id !== postId)
      .slice(0, 8);
  }, [otherBlogsData, slug, postId]);

  // No hardcoded "/blog": use current route template
  const makeOtherHref = (s: string) => ({
    pathname: router.pathname,
    query: { ...router.query, slug: s },
  });

  const sidebarOtherBlogTitles = useMemo(() => {
    if (otherBlogs.length) return { mode: 'links' as const, items: otherBlogs };
    return { mode: 'text' as const, items: sidebarItems };
  }, [otherBlogs, sidebarItems]);

  // -----------------------------------------
  // CONTACT INFO (site_settings.contact_info)
  // - localized by locale
  // - fallback to English only
  // -----------------------------------------
  const { data: contactTrg } = useGetSiteSettingByKeyQuery({ key: 'contact_info', locale } as any, {
    skip: !locale,
  });

  const { data: contactEn } = useGetSiteSettingByKeyQuery(
    { key: 'contact_info', locale: 'en' } as any,
    { skip: !locale || locale === 'en' },
  );

  const contactInfo = useMemo<ContactInfo>(() => {
    const primary = tryParseJson<ContactInfo>((contactTrg as any)?.value ?? contactTrg);
    const fallback = tryParseJson<ContactInfo>((contactEn as any)?.value ?? contactEn);

    const c =
      primary && (primary.email || (primary.phones && primary.phones.length) || primary.address)
        ? primary
        : fallback;

    return (c ?? {}) as ContactInfo;
  }, [contactTrg, contactEn]);

  const contactPhone = useMemo(() => {
    const arr = Array.isArray(contactInfo?.phones) ? contactInfo.phones : [];
    return safeStr(arr[0] ?? '');
  }, [contactInfo]);

  const contactEmail = useMemo(() => safeStr(contactInfo?.email ?? ''), [contactInfo]);
  const contactAddress = useMemo(() => safeStr(contactInfo?.address ?? ''), [contactInfo]);

  const hasContact = !!(contactPhone || contactEmail || contactAddress);

  // ----------------------------
  // RENDER STATES
  // ----------------------------
  if (!isSlugReady) {
    return (
      <section className="technical__area pt-120 pb-60 cus-faq">
        <div className="container">
          <div className="row" data-aos="fade-up" data-aos-delay="300">
            <div className="col-12">
              <p>{t.loading}</p>
              <div className="ens-skel ens-skel--md mt-10" />
              <div className="ens-skel ens-skel--md ens-skel--w80 mt-10" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (isLoading) {
    return (
      <section className="technical__area pt-120 pb-60 cus-faq">
        <div className="container">
          <div className="row" data-aos="fade-up" data-aos-delay="300">
            <div className="col-12">
              <p>{t.loading}</p>
              <div className="ens-skel ens-skel--md mt-10" />
              <div className="ens-skel ens-skel--md ens-skel--w80 mt-10" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!hasPost) {
    return (
      <section className="technical__area pt-120 pb-60 cus-faq">
        <div className="container">
          <div className="row" data-aos="fade-up" data-aos-delay="300">
            <div className="col-12">
              <p>{t.notFound}</p>
              <div className="ens-blog__back mt-10">
                <Link href="/blog" locale={locale} className="link-more" aria-label={t.backToList}>
                  ← {t.backToList}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // ----------------------------
  // MAIN RENDER
  // ----------------------------
  return (
    <section className="technical__area pt-120 pb-60 cus-faq">
      <div className="container">
        <div className="row" data-aos="fade-up" data-aos-delay="300">
          {/* MAIN */}
          <div className="col-xl-8 col-lg-12">
            <div className="technical__main-wrapper mb-60">
              {/* Back */}
              <div className="ens-blog__back mb-35">
                <Link href="/blog" locale={locale} className="link-more" aria-label={t.backToList}>
                  ← {t.backToList}
                </Link>
              </div>

              {/* HERO */}
              <div className="technical__thumb mb-45 ens-blog__hero">
                <Image
                  src={(heroSrc as any) || (FallbackCover as any)}
                  alt={safeStr((post as any)?.featured_image_alt) || title || 'blog image'}
                  width={HERO_W}
                  height={HERO_H}
                  priority
                />
              </div>
              {/* SHARE (reusable) */}
              <div className="sideber__widget-item mb-40">
                <div className="sidebar__category">
                  <div className="sidebar__contact-title mb-35">
                    <h3>{ui('ui_blog_share_title', 'Share')}</h3>
                  </div>

                  <SocialShare
                    title={title}
                    text={safeStr((post as any)?.summary) || title}
                    showLabel={false}
                    // İstersen firma sosyal profillerini de aç:
                    showCompanySocials={true}
                  />
                </div>
              </div>

              {/* CONTENT WRAPPER (uses your BLOG SCSS) */}
              <div className="blog__content-wrapper">
                {/* TITLE + SUMMARY */}
                <div className="blog__content-item">
                  <div className="technical__content mb-25">
                    <div className="technical__title">
                      <h3 className="postbox__title">{title || t.notFound}</h3>
                    </div>
                    {safeStr((post as any)?.summary) && (
                      <p className="postbox__text">{safeStr((post as any)?.summary)}</p>
                    )}
                  </div>

                  {/* BODY */}
                  {!!contentHtml && (
                    <div className="technical__content">
                      <div
                        className="tp-postbox-details postbox__text"
                        dangerouslySetInnerHTML={{ __html: contentHtml }}
                      />
                    </div>
                  )}

                  {/* TAGS */}
                  {tags.length > 0 && (
                    <div className="postbox__tag-wrapper">
                      <div className="postbox__tag-title">{t.tagsLabel}:</div>
                      <div className="postbox__tag">
                        {tags.map((tag) => (
                          <Link key={tag} href="/blog" locale={locale} aria-label={`tag: ${tag}`}>
                            {tag}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Accordion (only if items exist) */}
                {accordionItems.length > 0 && (
                  <div className="bd-faq__wrapper-2 mb-45 mt-40">
                    <div className="bd-faq__accordion style-2">
                      <div className="accordion" id="blogAccordion">
                        {accordionItems.map((it, idx) => (
                          <div className="accordion-item" key={`${it.title}-${idx}`}>
                            <h2 className="accordion-header" id={`blogHeading${idx}`}>
                              <button
                                type="button"
                                className={
                                  (openIdx === idx ? '' : ' collapsed') + ' accordion-button'
                                }
                                onClick={() => setOpenIdx(openIdx === idx ? -1 : idx)}
                                aria-expanded={openIdx === idx}
                                aria-controls={`blogCollapse${idx}`}
                              >
                                {it.title}
                              </button>
                            </h2>

                            <div
                              id={`blogCollapse${idx}`}
                              className={`accordion-collapse collapse${
                                openIdx === idx ? ' show' : ''
                              }`}
                              aria-labelledby={`blogHeading${idx}`}
                            >
                              <div className="accordion-body">
                                <p>{it.body}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* SIDEBAR */}
          <div className="col-xl-4 col-lg-6">
            <div className="sideber__widget">
              {/* Other blogs */}
              <div className="sideber__widget-item mb-40">
                <div className="sidebar__category">
                  <div className="sidebar__contact-title mb-35">
                    <h3>{t.categoriesTitle}</h3>
                  </div>

                  <ul>
                    {sidebarOtherBlogTitles.mode === 'links'
                      ? sidebarOtherBlogTitles.items.map((b) => (
                          <li key={b.slug}>
                            <Link href={makeOtherHref(b.slug)} locale={locale} aria-label={b.title}>
                              {b.title}
                            </Link>
                          </li>
                        ))
                      : sidebarOtherBlogTitles.items.map((name) => (
                          <li key={name}>
                            {/* fallback: title list only */}
                            <span>{name}</span>
                          </li>
                        ))}
                  </ul>
                </div>
              </div>

              {/* REVIEWS (moved here): under Other blogs, above Contact Info */}
              {!!postId && (
                <div className="sideber__widget-item mb-40">
                  <div className="sidebar__contact">
                    <div className="sidebar__contact-title mb-35">
                      <h3>{t.writeReview}</h3>
                    </div>

                    <div className="sidebar__contact-inner">
                      <div className="mb-25">
                        <ReviewList
                          targetType="blog"
                          targetId={postId}
                          locale={locale}
                          showHeader={false}
                          className="blog__detail-reviews"
                        />
                      </div>

                      <ReviewForm
                        targetType="blog"
                        targetId={postId}
                        locale={locale}
                        className="blog__detail-review-form"
                        toggleLabel={t.writeReview}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Contact Info (from contact_info JSON) */}
              {hasContact && (
                <div className="sideber__widget-item mb-40">
                  <div className="sidebar__contact">
                    <div className="sidebar__contact-title mb-35">
                      <h3>{t.contactTitle}</h3>
                    </div>

                    <div className="sidebar__contact-inner">
                      {contactPhone && (
                        <div className="sidebar__contact-item">
                          <div className="sideber__contact-icon">
                            <Image src={PhoneIcon} alt="Phone" />
                          </div>
                          <div className="sideber__contact-text">
                            <span>
                              <a href={`tel:${safeStr(contactPhone).replace(/\s+/g, '')}`}>
                                {contactPhone}
                              </a>
                            </span>
                          </div>
                        </div>
                      )}

                      {contactEmail && (
                        <div className="sidebar__contact-item">
                          <div className="sideber__contact-icon">
                            <Image src={MailIcon} alt="Email" />
                          </div>
                          <div className="sideber__contact-text">
                            <span>
                              <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
                            </span>
                          </div>
                        </div>
                      )}

                      {contactAddress && (
                        <div className="sidebar__contact-item">
                          <div className="sideber__contact-icon">
                            <Image src={LocationIcon} alt="Location" />
                          </div>
                          <div className="sideber__contact-text">
                            <span>{contactAddress}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Sidebar image */}
              <div className="sideber__widget-item">
                <div className="slideber__thumb w-img">
                  <Image src={SidebarImage} alt="Sidebar" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogDetailsArea;
