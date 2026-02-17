import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import One from "public/img/about/about-thumb-2.png";
import Two from "public/img/shape/about-thumb-shape.png";

const AboutOne = () => {
  const t = useTranslations("ensotek.about");

  return (
    <div className="about__area p-relative pt-120 pb-60">
      <div className="container">
        <div
          className="row align-items-center "
          data-aos="fade-up"
          data-aos-delay="300"
        >
          <div className="col-xl-6 col-lg-6">
            <div className="about__thumb-wrapper-3 mb-60">
              <div className="about__thumb-3">
                <Image src={One} alt="image not found" />
              </div>
              <div className="about__thumb-shape">
                <Image src={Two} alt="image not found" />
              </div>
            </div>
          </div>
          <div className="col-xl-6 col-lg-6">
            <div className="about__content-wapper mb-60">
              <div className="section__title-wrapper mb-40">
                <div className="section__subtitle-3">
                  <span>{t("subtitle")}</span>
                </div>
                <div className="section__title-3">{t("title")}</div>
              </div>
              <p>{t("description")}</p>
              <div className="about__progress">
                <div className="about__progress-item">
                  <div className="about__progress-content">
                    <span>75.25%</span>
                    <p>{t("progressLabelOne")}</p>
                  </div>
                </div>
                <div className="about__progress-item">
                  <div className="about__progress-content">
                    <span className="s-2">72%</span>
                    <p>{t("progressLabelTwo")}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutOne;
