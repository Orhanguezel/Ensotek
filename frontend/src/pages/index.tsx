// src/pages/index.tsx

import React from "react";
import Hero from "@/components/layout/banner/Hero";
import About from "@/components/containers/about/About";
import Service from "@/components/containers/service/Service";
import Newsletter from "@/components/containers/newsletter/Newsletter";
import Library from "@/components/containers/library/Library";
import Feedback from "@/components/containers/feedback/Feedback";
import References from "@/components/containers/references/References";
import News from "@/components/containers/news/News";
import Contact from "@/components/containers/contact/Contact";

const Home = () => {
  return (
    <>
      <Hero />
      <Service />
      <About />
      <Newsletter />
      <Library />
      <Feedback />
      <References />
      <News />
      <Contact />
    </>
  );
};

export default Home;
