import { Icon } from "@/components/ui/icon";

const features = [
  {
    icon: "chart-line",
    title: "Detailed Technical Analysis",
    description: "Identify and fix critical SEO issues that are holding back your site's performance."
  },
  {
    icon: "lightbulb",
    title: "Actionable Recommendations",
    description: "Get specific steps that you can implement immediately to improve your rankings."
  },
  {
    icon: "robot",
    title: "AI Analysis + Human Expertise",
    description: "Our AI identifies patterns while our SEO experts provide contextual insights."
  },
  {
    icon: "gauge",
    title: "Faster & Smarter Optimization",
    description: "Save time with prioritized recommendations that focus on high-impact improvements."
  },
  {
    icon: "clock",
    title: "Delivered Within 48 Hours",
    description: "Quick turnaround so you can start implementing improvements without delay."
  },
  {
    icon: "search-dollar",
    title: "Competitor Analysis",
    description: "Understand how you stack up against competitors and identify opportunities."
  }
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-16 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">Why Choose Our SEO Audit?</h2>
        <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
          Our AI-driven approach combined with human expertise delivers a superior experience. Here's what our comprehensive approach ensures you get:
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white p-6 rounded-lg shadow-md border border-gray-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="flex items-center mb-4">
                <div className="bg-[#1A5A46] p-3 rounded-full mr-4">
                  <Icon name={feature.icon} className="text-[#B2F74D]" />
                </div>
                <h3 className="font-semibold text-xl">{feature.title}</h3>
              </div>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
