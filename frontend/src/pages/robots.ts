// src/pages/robots.txt.ts
import type { GetServerSideProps, NextPage } from "next";

const RobotsTxt: NextPage = () => null;

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || "https://ensotek.de").replace(/\/+$/, "");

  const lines = [
    "User-agent: *",
    "Allow: /",
    "Disallow: /_next/",
    "Disallow: /api/",
    "Disallow: /admin/",
    "Disallow: /*/admin/",
    "Disallow: /login/",
    "Disallow: /*/login/",
    "Disallow: /dashboard/",
    "Disallow: /*/dashboard/",
    "",
    `Sitemap: ${base}/api/seo/sitemap-index.xml`,
    `Host: ${base}`,
    ""
  ].join("\n");

  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.write(lines);
  res.end();

  return { props: {} };
};

export default RobotsTxt;
