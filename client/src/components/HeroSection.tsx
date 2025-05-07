import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import searchIntroImage from "../assets/search-intro-image.png";
import searchIntroImageWebp from "../assets/search-intro-image.webp";
import heroBgPattern from "../assets/hero-bg-pattern.png"; // Create or add this file


export function HeroSection() {
  return (
    <section className="bg-[#0F3529] text-white py-16 md:py-20"
    style={{
      backgroundImage: `url(${heroBgPattern})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    }}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="order-2 md:order-1">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 animate-fadeIn">
              Unlock Your Website's Potential with Our{" "}
              <span className="text-[#CADB3F]">AI-Powered</span> SEO Audit
            </h1>
            <p className="text-gray-300 mb-8 text-lg animate-slideUp">
              Get a comprehensive analysis of your website's SEO performance and
              actionable insights to improve your search engine rankings.
            </p>
          <div className="relative transform transition-all duration-700 mb-8 md:order-2 md:hidden">
            <AspectRatio
              ratio={35 / 30}
              className="bg-gray-800/20 rounded-lg overflow-hidden shadow-xl"
            >
              <picture className="w-full h-full">
                <source srcSet={searchIntroImageWebp} type="image/webp" />
                <img
                  src={searchIntroImage}
                  alt="SEO Analysis Dashboard"
                  className="w-full h-auto rounded-lg shadow-xl"
                  loading="eager"
                  fetchpriority="high"
                />
              </picture>
            </AspectRatio>
          </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="#pricing"
                className="bg-[#CADB3F] text-[#0F3529] font-semibold px-6 py-3 h-auto border-[1px] border-[#CADB3F] hover:bg-[#0F3529] hover:text-[#CADB3F] hover:border hover:border-[#0F3529] transition-all transform px-4 py-2 rounded-md text-center"
              >
                Start Your SEO Audit Now
              </a>
            </div>
          </div>
          <div className="relative transform transition-all duration-700 md:order-2 hidden md:inline-block">
            <AspectRatio
              ratio={35 / 30}
              className="bg-gray-800/20 rounded-lg overflow-hidden shadow-xl"
            >
              <picture className="w-full h-full">
                <source srcSet={searchIntroImageWebp} type="image/webp" />
                <img
                  src={searchIntroImage}
                  alt="SEO Analysis Dashboard"
                  className="w-full h-auto rounded-lg shadow-xl"
                  loading="eager"
                  fetchpriority="high"
                />
              </picture>
            </AspectRatio>
          </div>
        </div>
      </div>
    </section>
  );
}
