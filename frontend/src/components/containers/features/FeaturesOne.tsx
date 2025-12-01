import React from "react";
import Image from "next/image";
import Link from "next/link";

import One from "public/img/features/icon-1.png";
import Two from "public/img/features/icon-2.png";
import Three from "public/img/features/icon-3.png";
import Four from "public/img/features/icon-4.png";

const FeaturesOne = () => {
  return (
    <section className="features__area grey-bg-3 pt-120 pb-60">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-xl-6">
            <div className="section__title-wrapper text-center mb-70">
              <div className="section__subtitle-3">
                <span>OUR FEATURE SERVICES</span>
              </div>
              <div className="section__title-3">
                We specialize in the features services
              </div>
            </div>
          </div>
        </div>
        <div className="row " data-aos="fade-up" data-aos-delay="300">
          <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6">
            <div className="features__items mb-60">
              <div className="features__items-icon">
                <Image src={One} alt="image not found" />
              </div>
              <div className="features__items-content">
                <h3>
                  <Link href="/service">IT Management</Link>
                </h3>
                <p>
                  We rank among the best in the US, Argentina, and Ukraine. Our
                  apps get
                </p>
              </div>
              <Link className="features__btn" href="/service">
                VIEW DETAILS
              </Link>
            </div>
          </div>
          <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6">
            <div className="features__items mb-60">
              <div className="features__items-icon">
                <Image src={Two} alt="image not found" />
              </div>
              <div className="features__items-content">
                <h3>
                  <Link href="/service">Data Security</Link>
                </h3>
                <p>
                  We rank among the best in the US, Argentina, and Ukraine. Our
                  apps get
                </p>
              </div>
              <Link className="features__btn" href="/service">
                VIEW DETAILS
              </Link>
            </div>
          </div>
          <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6">
            <div className="features__items mb-60">
              <div className="features__items-icon">
                <Image src={Three} alt="image not found" />
              </div>
              <div className="features__items-content">
                <h3>
                  <Link href="/service">Business Consulting</Link>
                </h3>
                <p>
                  We rank among the best in the US, Argentina, and Ukraine. Our
                  apps get
                </p>
              </div>
              <Link className="features__btn" href="/service">
                VIEW DETAILS
              </Link>
            </div>
          </div>
          <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6">
            <div className="features__items mb-60">
              <div className="features__items-icon">
                <Image src={Four} alt="image not found" />
              </div>
              <div className="features__items-content">
                <h3>
                  <Link href="/service">QA & Testing</Link>
                </h3>
                <p>
                  We rank among the best in the US, Argentina, and Ukraine. Our
                  apps get
                </p>
              </div>
              <Link className="features__btn" href="/service">
                VIEW DETAILS
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesOne;
