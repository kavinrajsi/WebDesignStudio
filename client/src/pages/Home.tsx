import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { IndustriesSection } from "@/components/IndustriesSection";
import { ProcessSection } from "@/components/ProcessSection";
import { CTASection } from "@/components/CTASection";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <IndustriesSection />
        <ProcessSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
