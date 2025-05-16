import {
  ChartLine,
  Lightbulb,
  Bot,
  Gauge,
  Clock,
  ChartScatter
} from "lucide-react";

const iconMap = {
  "chart-line": ChartLine,
  lightbulb: Lightbulb,
  Bot: Bot,
  gauge: Gauge,
  clock: Clock,
  "chart-scatter": ChartScatter,
};

function Icon({ name, className }: { name: keyof typeof iconMap; className?: string }) {
  const LucideIcon = iconMap[name];
  if (!LucideIcon) return null;
  return <LucideIcon className={className} />;
}

// Explicitly type `icon` to match keys of `iconMap`
const features = [
  {
    icon: "chart-line" as const,
    title: "Detailed Technical Analysis",
    description: "Identify and fix critical SEO issues that are holding back your site's performance.",
  },
  {
    icon: "lightbulb" as const,
    title: "Actionable Recommendations",
    description: "Get specific steps that you can implement immediately to improve your rankings.",
  },
  {
    icon: "Bot" as const,
    title: "AI Analysis + Human Expertise",
    description: "Our AI identifies patterns while our SEO experts provide contextual insights.",
  },
  {
    icon: "gauge" as const,
    title: "Faster & Smarter Optimization",
    description: "Save time with prioritized recommendations that focus on high-impact improvements.",
  },
  {
    icon: "clock" as const,
    title: "Delivered Within 48 Hours",
    description: "Quick turnaround so you can start implementing improvements without delay.",
  },
  {
    icon: "chart-scatter" as const,
    title: "Competitor Analysis",
    description: "Understand how you stack up against competitors and identify opportunities.",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-[28px] leading-[32px] md:text-3xl md:leading-[1.5] font-bold md:text-center mb-4">
          Why Choose Our SEO Audit?
        </h2>
        <p className="md:text-center text-gray-600 mb-12 max-w-3xl mx-auto">
          Our AI-driven approach combined with human expertise delivers a superior experience. Here&apos;s what
          our comprehensive approach ensures you get:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-[#F1F3DE] p-6 rounded-lg border border-gray-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex items-center mb-4">
                <div className="bg-[#1A5A46] p-3 rounded-full mr-4">
                  <Icon name={feature.icon} className="text-[#CADB3F]" />
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
