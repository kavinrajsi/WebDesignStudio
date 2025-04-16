import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="py-16 bg-[#0F3529] text-white">
      <div className="container mx-auto px-4 md:px-6 text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Boost Your Search Rankings?</h2>
        <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
          Join hundreds of businesses that have improved their online visibility and organic traffic with our AI-powered SEO audits.
        </p>
        <Button className="bg-[#B2F74D] text-[#0F3529] font-semibold px-8 py-4 h-auto hover:bg-[#0F3529] hover:text-[#B2F74D] hover:border hover:border-[#B2F74D] transition-all">
          Get Your Free SEO Consultation
        </Button>
      </div>
    </section>
  );
}
