"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";



const benefits = [
  "Higher Search Engine Rankings",
  "More Leads & Conversions",
  "Stronger Brand Presence",
  "Clear, Data-Backed Insights",
  "A Partner in Your Growth",
];

const benefitsDescriptions = [
  "Unlock greater organic visibility and attract more qualified visitors with data-driven SEO improvements.",
  "Optimize your website&apos;s structure and content to turn traffic into paying customers effectively.",
  "Build credibility, increase awareness, and position your business as an authority in your industry.",
  "Get a detailed report with easy-to-understand recommendations, helping you make informed decisions.",
  "Our goal is your long-term success—our insights help you stay ahead in an ever-evolving digital landscape.",
];

const packages = [
  {
    id: "seo-audit",
    title: "SEO Audit",
    price: "$10",
    priceInr: 870,
    alternatePrice: "870 INR + GST",
    description:
      "Get a comprehensive analysis of your website&apos;s SEO performance.",
    isPopular: true,
  },
  {
    id: "website-maintenance",
    title: "Website Maintenance + SEO",
    price: "Custom",
    priceInr: null,
    description:
      "Already have a website? Get ongoing maintenance and SEO services.",
    isPopular: false,
  },
  {
    id: "website-creation",
    title: "Website Creation + SEO",
    price: "Custom",
    priceInr: null,
    description:
      "Need a new website? Get a professionally designed website with SEO built-in.",
    isPopular: false,
  },
  {
    id: "expert-seo",
    title: "Expert SEO Strategies",
    price: "Custom",
    priceInr: null,
    description:
      "Just need SEO? Get expert strategies tailored for your specific business needs.",
    isPopular: false,
  },
];

export function PricingSection() {
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handlePayment = async (packageId: string, amount: number | null) => {
    if (!amount) {
      document
        .getElementById("contact")
        ?.scrollIntoView({ behavior: "smooth" });
      alert("Please fill out the contact form below for custom pricing.");
      return;
    }

    // For fixed price packages, scroll to contact form
    document
      .getElementById("contact")
      ?.scrollIntoView({ behavior: "smooth" });
    alert("Please fill out the contact form below to proceed with payment.");
  };

  return (
    <section id="pricing" className="py-16 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="md:text-center mb-12">
          <h2 className="text-[28px] leading-[32px] md:text-3xl md:leading-[1.5] font-bold mb-4">
            Pricing &amp; Services
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Our audit service is designed for all types of website owners,
            whether you need just an SEO report or complete website
            optimization.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className={`bg-white p-6 rounded-lg shadow-md border ${
                pkg.isPopular ? "border-[#CADB3F]" : "border-gray-200"
              } transition-all duration-300 hover:-translate-y-1 hover:shadow-xl relative overflow-hidden flex flex-col h-full justify-between`}
            >
              {pkg.isPopular && (
                <div className="absolute top-0 right-0">
                  <div className="bg-[#CADB3F] text-[#0F3529] text-xs font-bold px-3 py-1 transform rotate-0 origin-top-right">
                    MOST POPULAR
                  </div>
                </div>
              )}
              <h3 className="text-xl font-bold mb-2">{pkg.title}</h3>
              <div className="mb-4">
                <span className="text-3xl font-bold">{pkg.price}</span>
                {pkg.alternatePrice && (
                  <span className="text-sm text-gray-500 block mt-1">
                    {pkg.alternatePrice}
                  </span>
                )}
              </div>
              <p className="text-gray-600 mb-6">{pkg.description}</p>
              <Button
                className={`w-full ${
                  pkg.isPopular
                    ? "bg-[#CADB3F] text-[#0F3529]"
                    : "bg-[#0F3529] text-white"
                } font-semibold hover:bg-[#0F3529] hover:text-[#CADB3F] hover:border hover:border-[#0F3529] transition-all`}
                onClick={() => handlePayment(pkg.id, pkg.priceInr)}
                disabled={isLoading === pkg.id}
              >
                {isLoading === pkg.id ? "Processing..." : "Get Started"}
              </Button>
            </div>
          ))}
        </div>

        <div className="py-16">
          <h2 className="text-[28px] leading-[32px] md:text-3xl md:leading-[1.5] font-bold mb-4 md:text-center">
            What You Can Expect When You Partner with Us
          </h2>
          <p className="text-gray-600 mb-12 md:text-center max-w-3xl mx-auto text-lg">
            We don&apos;t just analyze your website—we provide real, actionable
            insights that drive measurable growth. Here&apos;s what you get when
            you choose our AI-powered SEO audit service:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="flex flex-col items-start text-left group"
              >
                <div className="h-16 w-16 bg-[#E8F5E9] rounded-full flex items-center justify-center mb-6">
                  <Check className="h-8 w-8 text-[#0F3529]" />
                </div>
                <h4 className="font-bold text-xl mb-3 text-[#0F3529]">
                  {benefit}
                </h4>
                <p className="text-gray-600 leading-relaxed">
                  {benefitsDescriptions[index]}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <a
              href="#pricing"
              className="bg-[#CADB3F] text-[#0F3529] font-semibold px-6 py-3 h-auto border-[1px] border-[#CADB3F] hover:bg-[#0F3529] hover:text-[#CADB3F] hover:border hover:border-[#0F3529] transition-all transform px-4 py-2 rounded-md"
            >
              Start Your SEO Audit Now
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
