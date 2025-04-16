import { Button } from "@/components/ui/button";
import searchIntroImage from "../assets/search-intro-image.svg";

export function HeroSection() {
  return (
    <section className="bg-[#0F3529] text-white py-16 md:py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 animate-fadeIn">
              Unlock Your Website's Potential with Our <span className="text-[#B2F74D]">AI-Powered</span> SEO Audit
            </h1>
            <p className="text-gray-300 mb-8 text-lg animate-slideUp">
              Get a comprehensive analysis of your website's SEO performance and actionable insights to improve your search engine rankings.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="bg-[#B2F74D] text-[#0F3529] font-semibold px-6 py-3 h-auto hover:bg-[#0F3529] hover:text-[#B2F74D] hover:border hover:border-[#B2F74D] transition-all transform hover:scale-105 animate-bounce-slow">
                Get Your SEO Audit Now
              </Button>
            </div>
          </div>
          <div className="relative transform transition-all duration-700 hover:scale-105 animate-float">
            <img 
              src={searchIntroImage} 
              alt="SEO Analysis Dashboard" 
              className="w-full h-auto rounded-lg shadow-xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
