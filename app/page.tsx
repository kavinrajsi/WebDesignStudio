import { HeroSection } from "@/components/HeroSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { IndustriesSection } from "@/components/IndustriesSection";
import { ProcessSection } from "@/components/ProcessSection";
import { PricingSection } from "@/components/PricingSection";
import { FAQSection } from "@/components/FAQSection";
import { ContactSection } from "@/components/ContactSection";
import { CTASection } from "@/components/CTASection";

export default function Home() {

  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <IndustriesSection />
      <ProcessSection />
      <PricingSection />
      <FAQSection />
      <ContactSection />
      <CTASection />
    </>
  );
}
