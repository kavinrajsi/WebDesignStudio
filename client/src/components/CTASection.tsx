import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="py-16 bg-[#0F3529] text-white">
      <div className="container mx-auto px-4 md:px-6 md:text-center">
        <h2 className="text-[28px] leading-[32px] md:text-3xl md:leading-[1.5] font-bold mb-4">Ready to Boost Your Search Rankings?</h2>
        <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
          Join hundreds of businesses that have improved their online visibility and organic traffic with our AI-powered SEO audits.
        </p>
        <a href="#pricing" className="bg-[#CADB3F] text-[#0F3529] font-semibold px-6 py-3 h-auto border-[1px] border-[--color-border] border-[#CADB3F] hover:bg-[#0F3529] hover:text-[#CADB3F] hover:border hover:border-[#CADB3F] transition-all transform px-4 py-2 rounded-md">
            Start Your SEO Audit Now
        </a>
      </div>
    </section>
  );
}
