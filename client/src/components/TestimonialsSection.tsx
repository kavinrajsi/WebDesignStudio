import { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Testimonial data
const testimonials = [
  {
    name: "Sarah Johnson",
    profession: "Marketing Director",
    testimonial: "Exceptional service, always reliable and supportive, highly recommend for all SEO needs.",
    initials: "SJ"
  },
  {
    name: "Michael Chen",
    profession: "E-commerce Founder",
    testimonial: "Professional and efficient, consistently putting clients first, an outstanding SEO experience.",
    initials: "MC"
  },
  {
    name: "Jessica Williams",
    profession: "Startup CEO",
    testimonial: "Outstanding customer service, seamless and hassle-free handling, highly trustworthy institution.",
    initials: "JW"
  },
  {
    name: "David Rodriguez",
    profession: "Online Store Owner",
    testimonial: "Personalized service, highly professional and trustworthy team, makes SEO optimization a pleasure.",
    initials: "DR"
  },
  {
    name: "Emily Taylor",
    profession: "Content Creator",
    testimonial: "Top-notch service, responsive and knowledgeable staff, always there when needed.",
    initials: "ET"
  },
  {
    name: "Robert Kim",
    profession: "Digital Agency CEO",
    testimonial: "Friendly and personalized service, delivered exceptional SEO results for our business.",
    initials: "RK"
  }
];

export function TestimonialsSection() {
  const [activeSlide, setActiveSlide] = useState(0);
  const slideInterval = useRef<NodeJS.Timeout | null>(null);

  // Auto-rotate testimonials
  useEffect(() => {
    slideInterval.current = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % testimonials.length);
    }, 5000); // Change slide every 5 seconds
    
    return () => {
      if (slideInterval.current) {
        clearInterval(slideInterval.current);
      }
    };
  }, []);

  // Manual navigation
  const goToSlide = (index: number) => {
    setActiveSlide(index);
    // Reset interval when manually navigating
    if (slideInterval.current) {
      clearInterval(slideInterval.current);
    }
    slideInterval.current = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % testimonials.length);
    }, 5000);
  };

  return (
    <section className="py-16 bg-[#0F3529] text-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-[28px] leading-[32px] md:text-3xl md:leading-[1.5] font-bold mb-4">What Our Clients Say About Us</h2>
          <p className="text-gray-300 max-w-3xl mx-auto">
            Our SEO service is designed to empower your business growth with
            innovative solutions and unwavering commitment.
          </p>
        </div>

        {/* Testimonials Carousel */}
        <div className="relative overflow-hidden">
          <div 
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${activeSlide * 100}%)` }}
          >
            {testimonials.map((testimonial, index) => (
              <div key={index} className="w-full flex-shrink-0 px-4">
                <div className="bg-[#1A5A46] p-8 rounded-lg shadow-lg max-w-2xl mx-auto">
                  <p className="text-lg mb-6 italic">"{testimonial.testimonial}"</p>
                  <div className="flex items-center">
                    <Avatar className="mr-4">
                      <AvatarFallback className="bg-[#CADB3F] text-[#0F3529]">
                        {testimonial.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-semibold">{testimonial.name}</h4>
                      <p className="text-gray-300 text-sm">{testimonial.profession}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Dots */}
          <div className="flex justify-center mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-3 w-3 rounded-full mx-1 transition-all ${
                  activeSlide === index ? 'bg-[#CADB3F]' : 'bg-gray-500'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}