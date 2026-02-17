import React from "react";
import Layout from "@/components/layout/Layout";
import HomeBannerOne from "@/components/layout/banner/HomeBannerOne";
import SponsorOne from "@/components/containers/sponsor/SponsorOne";
import ProjectOne from "@/components/containers/projects/ProjectOne";
import FeedbackOne from "@/components/containers/feedback/FeedbackOne";
import BlogOne from "@/components/containers/blog/BlogOne";
import SupportBotWidget from "@/components/containers/chat/SupportBotWidget";
import ServiceSection from "@/components/containers/service/ServiceSection";
import AboutCounter from "@/components/containers/counter/AboutCounter";
import Newsletter from "@/components/containers/newsletter/Newsletter";
import LibrarySection from "@/components/containers/library/LibrarySection";
import NewsSection from "@/components/containers/news/NewsSection";

const Home = () => {
  return (
    <Layout header={1} footer={1}>
      <HomeBannerOne />
      <ServiceSection />
      <AboutCounter />
      <Newsletter />
      <LibrarySection />
      <NewsSection />
      <SponsorOne />
      <ProjectOne />
      <FeedbackOne />
      <BlogOne /> 
      <SupportBotWidget />
    </Layout>
  );
};

export default Home;
