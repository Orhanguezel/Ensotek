import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import One from "public/img/development/development.png";

const SoftwareOne = () => {
  const t = useTranslations("ensotek.software");

  return (
    <div className="development__area pt-120 pb-60">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-xl-11">
            <div className="section__title-wrapper text-center mb-70">
              <div className="section__subtitle-3">
                <span>{t("subtitle")}</span>
              </div>
              <div className="section__title-3">
                {t("title")}
              </div>
            </div>
          </div>
        </div>
        <div
          className="row align-items-center "
          data-aos="fade-up"
          data-aos-delay="300"
        >
          <div className="col-xl-6 col-lg-6">
            <div className="development__thumb w-img mb-60">
              <Image src={One} alt="image not found" />
            </div>
          </div>
          <div className="col-xl-6 col-lg-6">
            <div className="development__content-wrapper mb-60">
              <p>
                {t("description")}
              </p>
              <div className="development__features-wrap">
                <div className="development__features-item">
                  <div className="development__features-icon">
                    <i className="fa-solid fa-circle-check"></i>
                  </div>
                  <div className="development__features-text">
                    {t("featureOne")}
                  </div>
                </div>
                <div className="development__features-item">
                  <div className="development__features-icon">
                    <i className="fa-solid fa-circle-check"></i>
                  </div>
                  <div className="development__features-text">
                    {t("featureTwo")}
                  </div>
                </div>
              </div>
              <div className="development__btn">
                <Link href="/">{t("cta")}</Link>
              </div>
              <div className="development__bottom-text">
                <p>{t("bottomText")}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SoftwareOne;
