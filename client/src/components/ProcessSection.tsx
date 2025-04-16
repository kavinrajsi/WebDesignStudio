import { Button } from "@/components/ui/button";

const steps = [
  {
    number: 1,
    title: "Submit Your Website",
    description: "Simply provide your website URL and tell us about your specific concerns or goals. Our system will start crawling your pages immediately.",
    icon: "globe"
  },
  {
    number: 2,
    title: "AI-Powered + Human Analysis",
    description: "Our AI algorithms scan your website, and then our SEO experts review the data for context, insights, and strategic recommendations.",
    icon: "brain"
  },
  {
    number: 3,
    title: "Receive Your Audit Report",
    description: "A comprehensive, easy-to-understand report with prioritized recommendations, technical fixes, content suggestions, and competitive insights.",
    icon: "file-text"
  }
];

export function ProcessSection() {
  return (
    <section id="process" className="py-16 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">How It Works (3 Simple Steps)</h2>
        
        <div className="relative">
          {/* Timeline connector */}
          <div className="hidden md:block absolute top-0 bottom-0 left-1/2 w-0.5 bg-[#B2F74D] -translate-x-1/2 z-0"></div>
          
          <div className="space-y-16 md:space-y-32 relative">
            {steps.map((step, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center relative z-10">
                {index % 2 === 0 ? (
                  <>
                    <div className={`${index % 2 === 0 ? 'order-2 md:order-1' : ''}`}>
                      <div className="bg-gray-100 rounded-lg p-8 h-64 flex items-center justify-center">
                        {step.icon === "globe" && (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-[#1A5A46]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                          </svg>
                        )}
                        {step.icon === "brain" && (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-[#1A5A46]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                          </svg>
                        )}
                        {step.icon === "file-text" && (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-[#1A5A46]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        )}
                      </div>
                    </div>
                    <div className={`${index % 2 === 0 ? 'order-1 md:order-2 md:text-right' : 'md:text-left'}`}>
                      <div className="inline-block bg-[#B2F74D] px-3 py-1 rounded-full text-[#0F3529] font-semibold mb-2">STEP {step.number}</div>
                      <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                      <p className="text-gray-600">{step.description}</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className={`${index % 2 !== 0 ? 'md:text-left' : 'md:text-right'}`}>
                      <div className="inline-block bg-[#B2F74D] px-3 py-1 rounded-full text-[#0F3529] font-semibold mb-2">STEP {step.number}</div>
                      <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                      <p className="text-gray-600">{step.description}</p>
                    </div>
                    <div>
                      <div className="bg-gray-100 rounded-lg p-8 h-64 flex items-center justify-center">
                        {step.icon === "globe" && (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-[#1A5A46]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                          </svg>
                        )}
                        {step.icon === "brain" && (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-[#1A5A46]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                          </svg>
                        )}
                        {step.icon === "file-text" && (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-[#1A5A46]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-16 text-center">
          <Button className="bg-[#0F3529] text-white font-semibold px-8 py-4 h-auto hover:bg-[#1A5A46] transition-all transform hover:-translate-y-0.5 hover:shadow-lg">
            Start Your SEO Audit Today
          </Button>
        </div>
      </div>
    </section>
  );
}
