import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="bg-[#0F3529] text-white py-16 md:py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Unlock Your Website's Potential with Our <span className="text-[#B2F74D]">AI-Powered</span> SEO Audit
            </h1>
            <p className="text-gray-300 mb-8 text-lg">
              Get a comprehensive analysis of your website's SEO performance and actionable insights to improve your search engine rankings.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="bg-[#B2F74D] text-[#0F3529] font-semibold px-6 py-3 h-auto hover:bg-[#0F3529] hover:text-[#B2F74D] hover:border hover:border-[#B2F74D] transition-all">
                Get Your SEO Audit Now
              </Button>
              <Button variant="outline" className="border border-white text-white px-6 py-3 h-auto hover:bg-white hover:text-[#0F3529] transition-all">
                Learn More
              </Button>
            </div>
          </div>
          <div className="relative">
            <div className="bg-white rounded-lg p-4 shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-[#0F3529]">SEO Score</h3>
                <div className="w-16 h-16 rounded-full flex items-center justify-center bg-[#D7FDAF]">
                  <span className="text-[#0F3529] font-bold text-xl">72%</span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-gray-100 p-4 rounded">
                  <div className="h-32 relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg className="w-full h-full" viewBox="0 0 400 200">
                        <rect x="10" y="10" width="380" height="20" rx="5" fill="#f3f4f6" />
                        <rect x="10" y="10" width="280" height="20" rx="5" fill="#B2F74D" />
                        
                        <rect x="10" y="40" width="380" height="20" rx="5" fill="#f3f4f6" />
                        <rect x="10" y="40" width="210" height="20" rx="5" fill="#B2F74D" />
                        
                        <rect x="10" y="70" width="380" height="20" rx="5" fill="#f3f4f6" />
                        <rect x="10" y="70" width="320" height="20" rx="5" fill="#B2F74D" />
                        
                        <rect x="10" y="100" width="380" height="20" rx="5" fill="#f3f4f6" />
                        <rect x="10" y="100" width="180" height="20" rx="5" fill="#B2F74D" />
                        
                        <rect x="10" y="130" width="380" height="20" rx="5" fill="#f3f4f6" />
                        <rect x="10" y="130" width="250" height="20" rx="5" fill="#B2F74D" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
