import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What is included in the SEO audit?",
    answer: "Our AI-powered SEO audit analyzes key areas such as website performance, technical SEO, keyword rankings, backlinks, and security issues. You'll receive a detailed report with actionable insights to improve your website's visibility and rankings."
  },
  {
    question: "How long does it take to receive the audit report?",
    answer: "You will receive your comprehensive SEO audit report within 48 hours of placing your order."
  },
  {
    question: "Why should I use this service instead of free SEO tools?",
    answer: "Unlike free tools, our audit provides a detailed, human-reviewed analysis, highlighting practical improvements tailored to your website's needs. We combine AI-driven insights with expert recommendations to deliver real, actionable strategies."
  },
  {
    question: "Who is this SEO audit for?",
    answer: "Our service is perfect for business owners, marketers, website owners, and agencies looking to optimize their online presence and improve search rankings."
  },
  {
    question: "Will I get step-by-step recommendations to fix issues?",
    answer: "Yes! Your report will not only highlight issues but also provide clear, step-by-step guidance on how to resolve them for better SEO performance."
  },
  {
    question: "Do you offer SEO implementation services?",
    answer: "Yes! We offer SEO services, website maintenance, and website creation if you need help implementing the recommendations from your audit."
  },
  {
    question: "How do I get started?",
    answer: "Simply choose your package, complete the payment, and submit your website details. Our AI-powered system will analyze your site, and you'll receive your audit report within 48 hours!"
  },
];

export function FAQSection() {
  return (
    <section id="faq" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-2xl md:text-3xl font-bold md:text-center mb-4">Frequently Asked Questions (FAQ)</h2>
        <p className="text-gray-600 mb-12 max-w-3xl mx-auto md:text-center">
          Get answers to common questions about our SEO audit service and process. 
          If you can't find what you're looking for, feel free to reach out to our team.
        </p>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="bg-white p-4 rounded-lg shadow-sm text-center hover:shadow-md transition-all mb-4">
                <AccordionTrigger className="text-left font-semibold hover:no-underline">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-gray-600 text-left">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}