import type { Metadata } from "next";
import { HomeClient } from "@/components/store/home/home-client";
import { AnnouncementBar } from "@/components/store/home/announcement-bar";
import { HeroSection } from "@/components/store/home/hero-section";
import { IntentionRail } from "@/components/store/home/intention-rail";
import { ManifestoSection } from "@/components/store/home/manifesto-section";
import { CategoriesSection } from "@/components/store/home/categories-section";
import { StorySection } from "@/components/store/home/story-section";
import { PerksSection } from "@/components/store/home/perks-section";
import { JournalSection } from "@/components/store/home/journal-section";
import { FaqSection } from "@/components/store/home/faq-section";
import { NewsletterSection } from "@/components/store/home/newsletter-section";
import { SiteFooter } from "@/components/store/home/site-footer";
import { IntelligentTraderShowcase } from "@/components/store/intelligent-trader-showcase";

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

export default function Home() {
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
      <AnnouncementBar />
      <HomeClient
        aboveFeatured={
          <>
            <HeroSection />
            <IntentionRail />
            <IntelligentTraderShowcase />
            <ManifestoSection />
          </>
        }
        belowFeatured={
          <>
            <CategoriesSection />
            <StorySection />
            <PerksSection />
            <JournalSection />
            <FaqSection />
            <NewsletterSection />
            <SiteFooter />
          </>
        }
      />
    </>
  );
}
