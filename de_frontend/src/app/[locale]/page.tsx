import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Layout from "@/components/layout/Layout";
import HomeBannerOne from "@/components/layout/banner/HomeBannerOne";
import SponsorOne from "@/components/containers/sponsor/SponsorOne";
import ProjectOne from "@/components/containers/projects/ProjectOne";
import FeedbackOne from "@/components/containers/feedback/FeedbackOne";
import BlogOne from "@/components/containers/blog/BlogOne";
// import SupportBotWidget from "@/components/containers/chat/SupportBotWidget";
import ServiceSection from "@/components/containers/service/ServiceSection";
import AboutCounter from "@/components/containers/counter/AboutCounter";
import Newsletter from "@/components/containers/newsletter/Newsletter";
import LibrarySection from "@/components/containers/library/LibrarySection";
import NewsSection from "@/components/containers/news/NewsSection";
import { fetchSliders, fetchPageSeo } from "@/i18n/server";
import { resolveMediaUrl } from "@/lib/media";

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const [pageSeo, t] = await Promise.all([
    fetchPageSeo("home", locale),
    getTranslations({ locale, namespace: "seo" }),
  ]);
  return {
    title: pageSeo?.title || t("home_title"),
    description: pageSeo?.description || t("home_description"),
    ...(pageSeo?.og_image ? { openGraph: { images: [pageSeo.og_image] } } : {}),
    ...(pageSeo?.no_index ? { robots: { index: false, follow: true } } : {}),
  };
}

const Home = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const { locale } = await params;
  const initialSliders = await fetchSliders(locale);
  const firstSliderImage =
    typeof initialSliders[0]?.image === "string" ? resolveMediaUrl(initialSliders[0].image) || null : null;

  return (
    <>
      {firstSliderImage && (
        <link rel="preload" as="image" href={firstSliderImage} fetchPriority="high" />
      )}
      <Layout header={1} footer={1}>
        <HomeBannerOne initialSliders={initialSliders} />
        <ServiceSection />
        <AboutCounter />
        <Newsletter />
        <LibrarySection />
        <NewsSection />
        <SponsorOne />
        <ProjectOne />
        <FeedbackOne />
        <BlogOne />
        {/* <SupportBotWidget /> */}
      </Layout>
    </>
  );
};

export default Home;
