import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import searchHowItWorkStep1Submit from "../assets/search-how-it-work-step-1-submit.png";
import searchHowItWorkStep1SubmitWebp from "../assets/search-how-it-work-step-1-submit.webp";
import searchHowItWorkStep2AihumanAnalysis from "../assets/search-how-it-work-step-2-ai-human-analysis.png";
import searchHowItWorkStep2AihumanAnalysisWebp from "../assets/search-how-it-work-step-2-ai-human-analysis.webp";
import searchHowItWorkStep3AuditReport from "../assets/search-how-it-work-step-3-audit-report.webp";
import searchHowItWorkStep3AuditReportPng from "../assets/search-how-it-work-step-3-audit-report.png";

const steps = [
  {
    number: 1,
    title: "Submit Your Website",
    description: "Simply provide your website URL and tell us about your specific concerns or goals. Our system will start crawling your pages immediately.",
    image: searchHowItWorkStep1Submit,
    imageWebp: searchHowItWorkStep1SubmitWebp,
  },
  {
    number: 2,
    title: "AI-Powered + Human Analysis",
    description: "Our AI algorithms scan your website, and then our SEO experts review the data for context, insights, and strategic recommendations.",
    image: searchHowItWorkStep2AihumanAnalysis,
    imageWebp: searchHowItWorkStep2AihumanAnalysisWebp,
  },
  {
    number: 3,
    title: "Receive Your Audit Report",
    description: "A comprehensive, easy-to-understand report with prioritized recommendations, technical fixes, content suggestions, and competitive insights.",
    image: searchHowItWorkStep3AuditReport,
    imageWebp: searchHowItWorkStep3AuditReportPng,
  }
];

export function ProcessSection() {
  return (
    <section id="process" className="py-16 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">How It Works (3 Simple Steps)</h2>
        <p className="text-gray-600 mb-12 max-w-3xl mx-auto text-center">
          Our streamlined process ensures you get actionable insights quickly and efficiently. 
          Here's how we transform your website's performance in just three simple steps.
        </p>
        
        <div className="relative">
          {/* Timeline connector */}
          <div className="hidden md:block absolute top-0 bottom-0 left-1/2 w-0.5 bg-[#CADB3F] -translate-x-1/2 z-0"></div>
          
          <div className="space-y-16 md:space-y-32 relative">
            {steps.map((step, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center relative z-10">
                {index % 2 === 0 ? (
                  <>
                    <div className={`${index % 2 === 0 ? 'order-2 md:order-1' : ''}`}>
                      <div className="rounded-lg p-8 h-64 flex items-center justify-center">
                        <picture>
                          <source srcSet={step.imageWebp} type="image/webp" />
                          <img src={step.image} alt={`Step ${step.number} image`} className="h-auto w-auto max-w-full max-h-full" loading="lazy" />
                        </picture>
                      </div>
                    </div>
                    <div className={`${index % 2 === 0 ? 'order-1 md:order-2 md:text-right' : 'md:text-left'}`}>
                      <div className="inline-block bg-[#CADB3F] px-3 py-1 rounded-full text-[#0F3529] font-semibold mb-2">STEP {step.number}</div>
                      <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                      <p className="text-gray-600">{step.description}</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className={`${index % 2 !== 0 ? 'md:text-left' : 'md:text-right'}`}>
                      <div className="inline-block bg-[#CADB3F] px-3 py-1 rounded-full text-[#0F3529] font-semibold mb-2">STEP {step.number}</div>
                      <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                      <p className="text-gray-600">{step.description}</p>
                    </div>
                    <div>
                      <div className="rounded-lg p-8 h-64 flex items-center justify-center">
                        <picture>
                          <source srcSet={step.imageWebp} type="image/webp" />
                          <img src={step.image} alt={`Step ${step.number} image`} className="h-auto w-auto max-w-full max-h-full" loading="lazy" />
                        </picture>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-16 text-center">
          <a href="#pricing" className="bg-[#CADB3F] text-[#0F3529] font-semibold px-6 py-3 h-auto border-[1px] border-[#CADB3F] hover:bg-[#0F3529] hover:text-[#CADB3F] hover:border hover:border-[#0F3529] transition-all transform px-4 py-2 rounded-md">
            Start Your SEO Audit Now
          </a>
        </div>
      </div>
    </section>
  );
}
