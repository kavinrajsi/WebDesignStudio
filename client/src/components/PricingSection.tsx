import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const benefits = [
  "Higher Search Engine Rankings",
  "More Leads & Conversions",
  "Stronger Brand Presence",
  "Clear, Data-Backed Insights",
  "A Partner in Your Growth"
];

const benefitsDescriptions = [
  "Unlock greater organic visibility and attract more qualified visitors with data-driven SEO improvements.",
  "Optimize your website's structure and content to turn traffic into paying customers effectively.",
  "Build credibility, increase awareness, and position your business as an authority in your industry.",
  "Get a detailed report with easy-to-understand recommendations, helping you make informed decisions.",
  "Our goal is your long-term success—our insights help you stay ahead in an ever-evolving digital landscape."
];

const packages = [
  {
    title: "SEO Audit",
    price: "$10",
    alternatePrice: "870 INR + GST",
    description: "Get a comprehensive analysis of your website's SEO performance.",
    isPopular: true
  },
  {
    title: "Website Maintenance + SEO",
    price: "Custom",
    description: "Already have a website? Get ongoing maintenance and SEO services.",
    isPopular: false
  },
  {
    title: "Website Creation + SEO",
    price: "Custom",
    description: "Need a new website? Get a professionally designed website with SEO built-in.",
    isPopular: false
  },
  {
    title: "Expert SEO Strategies",
    price: "Custom",
    description: "Just need SEO? Get expert strategies tailored for your specific business needs.",
    isPopular: false
  }
];

export function PricingSection() {
  return (
    <section id="pricing" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Pricing & Services</h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Our audit service is designed for all types of website owners, whether you need just an SEO report or complete website optimization.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {packages.map((pkg, index) => (
            <div key={index} className={`bg-white p-6 rounded-lg shadow-md border ${pkg.isPopular ? 'border-[#B2F74D]' : 'border-gray-200'} transition-all duration-300 hover:-translate-y-1 hover:shadow-xl relative overflow-hidden`}>
              {pkg.isPopular && (
                <div className="absolute top-0 right-0">
                  <div className="bg-[#B2F74D] text-[#0F3529] text-xs font-bold px-3 py-1 transform rotate-0 origin-top-right">
                    MOST POPULAR
                  </div>
                </div>
              )}
              <h3 className="text-xl font-bold mb-2">{pkg.title}</h3>
              <div className="mb-4">
                <span className="text-3xl font-bold">{pkg.price}</span>
                {pkg.alternatePrice && (
                  <span className="text-sm text-gray-500 block mt-1">{pkg.alternatePrice}</span>
                )}
              </div>
              <p className="text-gray-600 mb-6">{pkg.description}</p>
              <Button className={`w-full ${pkg.isPopular ? 'bg-[#B2F74D] text-[#0F3529]' : 'bg-[#0F3529] text-white'} font-semibold hover:bg-opacity-90 transition-all`}>
                Get Started
              </Button>
            </div>
          ))}
        </div>

        <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-xl font-bold mb-6 text-center">What You Can Expect When You Partner with Us</h3>
          <p className="text-gray-600 mb-8 text-center max-w-3xl mx-auto">
            We don't just analyze your website—we provide real, actionable insights that drive measurable growth. Here's what you get when you choose our AI-powered SEO audit service:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex flex-col items-center text-center">
                <div className="h-12 w-12 bg-[#F3FAE9] rounded-full flex items-center justify-center mb-4">
                  <Check className="h-6 w-6 text-[#0F3529]" />
                </div>
                <h4 className="font-semibold mb-2">{benefit}</h4>
                <p className="text-sm text-gray-600">{benefitsDescriptions[index]}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-10 text-center">
            <Button className="bg-[#B2F74D] text-[#0F3529] font-semibold px-8 py-3 h-auto hover:bg-opacity-90 transition-all transform hover:-translate-y-0.5 hover:shadow-lg">
              Get Your SEO Audit Now
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}