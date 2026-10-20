import { Suspense } from "react";
import type { Metadata } from "next";
import { HomeClient } from "@/components/store/home/home-client";
import { AnnouncementBar } from "@/components/store/home/announcement-bar";
import { HeroSection } from "@/components/store/home/hero-section";
import { IntentionRail } from "@/components/store/home/intention-rail";
import { LuxuryMarquee } from "@/components/store/home/luxury-marquee";
import { ManifestoSection } from "@/components/store/home/manifesto-section";
import { CategoriesSection } from "@/components/store/home/categories-section";
import { StorySection } from "@/components/store/home/story-section";
import { JournalSection } from "@/components/store/home/journal-section";
import { FaqSection } from "@/components/store/home/faq-section";
import { SiteFooter } from "@/components/store/home/site-footer";
import { IntelligentTraderShowcase } from "@/components/store/intelligent-trader-showcase";
import { getCatalogProducts } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Journals, Planners & Tools to Build with Purpose",
  description: "Journals, planners and thoughtful tools to help you build with purpose.",
};

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

const websiteStructuredData = siteUrl
  ? {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "Right Intent",
      alternateName: "RI",
      url: siteUrl,
    }
  : null;

export default async function Home() {
  const featuredProducts = await getCatalogProducts();
  return (
    <>
      {websiteStructuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteStructuredData).replace(/</g, "\\u003c"),
          }}
        />
      )}
      <Suspense fallback={null}>
        <AnnouncementBar />
      </Suspense>
      <HomeClient
        featuredProducts={featuredProducts}
        aboveFeatured={
          <>
            <HeroSection />
            <IntentionRail />
            <LuxuryMarquee />
            <IntelligentTraderShowcase />
            <ManifestoSection />
          </>
        }
        belowFeatured={
          <>
            <CategoriesSection />
            <StorySection />
            <JournalSection />
            <FaqSection />
            <SiteFooter />
          </>
        }
      />
    </>
  );
}
