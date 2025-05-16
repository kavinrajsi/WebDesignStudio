import {
  ShoppingCart,
  Building,
  Gavel,
  HeartPulse,
  GraduationCap,
  IndianRupee,
  Plane,
  Wrench,
  Briefcase,
  Factory,
} from "lucide-react";

// Define the iconMap with explicit types
const iconMap = {
  "shopping-cart": ShoppingCart,
  "building": Building,
  "gavel": Gavel,
  "heart-pulse": HeartPulse,
  "graduation-cap": GraduationCap,
  "indian-rupee": IndianRupee,
  "plane": Plane,
  "wrench": Wrench,
  "briefcase": Briefcase,
  "factory": Factory,
} as const; // Add `as const` to infer the types of the keys

// Define the industries with explicit typing for `icon`
const industries = [
  { icon: "shopping-cart", title: "E-commerce & Retail" },
  { icon: "building", title: "Real Estate & Properties" },
  { icon: "gavel", title: "Legal Businesses & Services" },
  { icon: "heart-pulse", title: "Healthcare & Wellness" },
  { icon: "graduation-cap", title: "Education & Learning" },
  { icon: "indian-rupee", title: "Finance & FinTech" },
  { icon: "plane", title: "Travel & Hospitality" },
  { icon: "wrench", title: "Home & Tech Services" },
  { icon: "briefcase", title: "Professional & B2B Services" },
  { icon: "factory", title: "Automotive & Manufacturing" },
] as const; // Add `as const` to ensure that `icon` is recognized as a key of `iconMap`

export function IndustriesSection() {
  return (
    <section id="industries" className="pb-16 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-[28px] leading-[32px] md:text-3xl md:leading-[1.5] font-bold mb-2 md:text-center">
          Proven Results Across Diverse Industries
        </h2>
        <p className="text-gray-600 mb-12 max-w-3xl mx-auto md:text-center">
          We help your business stand out in search results, driving organic
          traffic to your website, boosting conversions, improving search
          rankings, social engagement, traffic, and other opportunities.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          {industries.map((industry, index) => {
            const IconComponent = iconMap[industry.icon];
            return (
              <div
                key={index}
                className="bg-[white] p-4 rounded-lg shadow-sm md:text-center hover:shadow-md transition-all flex justify-center items-center"
              >
                <div className="flex flex-col md:justify-center items-start md:items-center">
                  <div className="bg-[#1A5A46] p-3 rounded-full mb-4 ">
                    {IconComponent && (
                      <IconComponent className="text-[#CADB3F]" size={32} />
                    )}
                  </div>
                  <h3 className="font-semibold text-xl">{industry.title}</h3>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
