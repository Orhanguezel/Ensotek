import React from "react";
import Banner from "@/components/layout/banner/Breadcrum";
import Offer from "@/components/containers/offer/Offer";
import ContactMap from "@/components/containers/contact/ContactMap";

const OfferPage = () => {
  return (
    <>
      <Banner title="Offer" />
      <Offer />
      <ContactMap />
    </>
  );
};

export default OfferPage;
