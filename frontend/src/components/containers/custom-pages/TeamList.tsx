"use client";
import React from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { useCustomPages } from "@/features/custom-pages/customPages.action";
import type { CustomPage } from "@/features/custom-pages/customPages.type";

const TeamList = () => {
  const { data, isLoading } = useCustomPages({ module_key: 'team', is_published: true });

  if (isLoading) {
    return (
      <div className="container pt-120 pb-120 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  const items = data?.data || [];

  return (
    <section className="team__area pt-120 pb-90 bg-light">
      <div className="container">
        <div className="section__title-wrapper mb-60 text-center">
          <h2 className="section__title-3">Our Team</h2>
          <p className="mt-20">Meet the experts behind Ensotek's industrial cooling technologies.</p>
        </div>
        <div className="row">
          {items.map((item: CustomPage) => (
            <div key={item.id} className="col-xl-4 col-lg-6 col-md-6 text-center">
              <div className="team__item mb-40 bg-white" style={{ borderRadius: '20px', padding: '30px', transition: 'all 0.3s ease-in-out', border: '1px solid rgba(0,0,0,0.05)' }}>
                <div className="team__thumb mb-25 mx-auto" style={{ width: '200px', height: '200px', borderRadius: '50%', overflow: 'hidden' }}>
                  <Image 
                    src={item.image_url || item.featured_image || "/img/team/team-1.jpg"} 
                    alt={item.title} 
                    width={200} 
                    height={200}
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <div className="team__content">
                  <h3 style={{ fontSize: '22px', marginBottom: '8px' }}>
                    <Link href={`/team/${item.slug}`}>{item.title}</Link>
                  </h3>
                  <p className="text-primary" style={{ fontWeight: '500', fontSize: '16px', marginBottom: '15px' }}>{item.summary}</p>
                  
                  <Link href={`/team/${item.slug}`} className="btn btn-link p-0" style={{ textDecoration: 'none', color: '#666' }}>
                    View Profile <i className="fal fa-arrow-right ml-5" style={{ fontSize: '12px' }}></i>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamList;
