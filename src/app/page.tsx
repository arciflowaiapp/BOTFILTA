import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import {
  FeaturesSection,
  AIDemoSection,
  AnalyticsPreview,
  TestimonialsSection,
  PricingSection,
  FAQSection,
  CTASection,
  Footer,
} from "@/components/landing/sections";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <FeaturesSection />
      <AIDemoSection />
      <AnalyticsPreview />
      <TestimonialsSection />
      <PricingSection />
      <FAQSection />
      <CTASection />
      <Footer />
    </main>
  );
}
