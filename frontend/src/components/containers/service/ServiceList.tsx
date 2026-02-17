"use client";
import React from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { useServices } from "@/features/services/services.action";
import { useTranslations } from "next-intl";

const ServiceList = () => {
  const { data: items, isLoading } = useServices();
  const t = useTranslations("common");

  if (isLoading) {
    return (
      <div className="container pt-120 pb-120 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <section className="service__list-area pt-120 pb-90">
      <div className="container">
        <div className="section__title-wrapper mb-60 text-center">
          <h2 className="section__title-3">Our Services</h2>
        </div>
        <div className="row">
          {(items || []).map((item: any) => (
            <div key={item.id} className="col-xl-4 col-lg-4 col-md-6">
              <div className="blog__item-3 mb-30 p-relative fix" style={{ borderRadius: '12px', overflow: 'hidden', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}>
                <div className="blog__thumb-3 w-img">
                  <Link href={`/service/${item.slug}`}>
                    <Image 
                      src={item.image_url || item.featured_image || "/img/blog/blog-1.jpg"} 
                      alt={item.name} 
                      width={400} 
                      height={250}
                      style={{ objectFit: 'cover', height: '250px' }}
                    />
                  </Link>
                </div>
                <div className="blog__content-3 p-4 bg-white">
                  <h3 className="blog__title-3" style={{ fontSize: '20px', lineHeight: '1.4', marginBottom: '15px' }}>
                    <Link href={`/service/${item.slug}`}>{item.name}</Link>
                  </h3>
                  <p className="text-muted" style={{ fontSize: '14px', marginBottom: '20px', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {item.summary || item.description?.replace(/<[^>]*>/g, '').substring(0, 150)}
                  </p>
                  <Link href={`/service/${item.slug}`} className="read-more-btn" style={{ color: '#0056b3', fontWeight: '600' }}>
                    Read More <i className="fal fa-arrow-right ml-5"></i>
                  </Link>
                </div>
              </div>
            </div>
          ))}
          {!items?.length && (
            <div className="col-12 text-center py-5">
              <p>No services found.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ServiceList;
