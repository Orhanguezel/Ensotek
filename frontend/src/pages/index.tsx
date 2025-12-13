// src/pages/index.tsx
import type { NextPage } from "next";
import React from "react";

import Hero from "@/components/layout/banner/Hero";
import About from "@/components/containers/about/About";
import Product from "@/components/containers/product/Product";
import Service from "@/components/containers/service/Service";
import Newsletter from "@/components/containers/newsletter/Newsletter";
import LibrarySection from "@/components/containers/library/LibrarySection";
import Feedback from "@/components/containers/feedback/Feedback";
import References from "@/components/containers/references/References";
import News from "@/components/containers/news/News";

import Contact from "@/components/containers/contact/Contact";

const Home: NextPage = () => {
  return (
    <>
      <Hero />
      <Service />
      <About />
      <Product />
      <Newsletter />
      <LibrarySection />
      <Feedback />
      <References />
      <News />
      <Contact />
    </>
  );
};

export default Home;
