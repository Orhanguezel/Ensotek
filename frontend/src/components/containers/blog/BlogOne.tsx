"use client";
import React from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { useCustomPages } from "@/features/custom-pages/customPages.action";
import type { CustomPage } from "@/features/custom-pages/customPages.type";

const BlogOne = () => {
  const t = useTranslations("ensotek.blog");
  const { data: blogData } = useCustomPages({ 
    module_key: 'blog', 
    limit: 3, 
    is_published: true 
  });

  const blogs = blogData?.data || [];

  return (
    <section className="blog__area grey-bg-3 pt-120 pb-90">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="section__title-wrapper text-center mb-70">
              <div className="section__subtitle-3">
                <span>{t("subtitle")}</span>
              </div>
              <h2 className="section__title-3 mb-20">{t("title")}</h2>
              <p>{t("description")}</p>
            </div>
          </div>
        </div>
        <div className="row" data-aos="fade-up" data-aos-delay="300">
          {blogs.map((blog: CustomPage) => (
            <div key={blog.id} className="col-xl-4 col-lg-6 col-md-6">
              <div className="blog__item-3 mb-30" style={{ borderRadius: '12px', overflow: 'hidden' }}>
                <div className="blog__thumb-3 w-img">
                  <Link href={`/blog/${blog.slug}`}>
                    <Image 
                      src={blog.image_url || blog.featured_image || "/img/blog/3/1.jpg"} 
                      alt={blog.title} 
                      width={400} 
                      height={250}
                      style={{ objectFit: 'cover', height: '250px' }}
                    />
                  </Link>
                </div>
                <div className="blog__content-3 p-4 bg-white">
                  {/* <div className="blog__meta mb-10">
                    <div className="blog__meta-author">
                      <span className="text-muted" style={{ fontSize: '13px' }}>
                        <i className="fal fa-calendar-alt mr-5"></i>
                        {new Date(blog.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div> */}
                  <h3 style={{ fontSize: '18px', fontWeight: 'bold' }}>
                    <Link href={`/blog/${blog.slug}`}>
                      {blog.title}
                    </Link>
                  </h3>
                </div>
              </div>
            </div>
          ))}
          {blogs.length === 0 && (
            <div className="col-12 text-center">
              <p>{t("empty")}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default BlogOne;
