import { HeroSection } from "@/components/landing-page/hero-section";
import { StatsSection } from "@/components/landing-page/stats-section";
import { FeaturesSection } from "@/components/landing-page/features-section";
import { AnalyticsShowcase } from "@/components/landing-page/analytics-showcase";
import { DashboardPreview } from "@/components/landing-page/dashboard-preview";
import { AboutSection } from "@/components/landing-page/about-section";
import { ContactSection } from "@/components/landing-page/contact-section";
import { EnterprisePartnership } from "@/components/landing-page/enterprise-partnership";

export default function MarketingPage() {
  return (
    <div className="min-h-screen" style={{ background: "oklch(0.08 0.015 265)" }}>
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <AnalyticsShowcase />
      <DashboardPreview />
      <AboutSection />
      <ContactSection />
      <EnterprisePartnership />
    </div>
  );
}
