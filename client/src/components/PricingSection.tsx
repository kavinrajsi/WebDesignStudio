import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const benefits = [
  "Higher Search Engine Rankings",
  "More Leads & Conversions",
  "Stronger Brand Presence",
  "Clear, Data-Backed Insights",
  "A Partner in Your Growth",
];

const benefitsDescriptions = [
  "Unlock greater organic visibility and attract more qualified visitors with data-driven SEO improvements.",
  "Optimize your website's structure and content to turn traffic into paying customers effectively.",
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
      "Get a comprehensive analysis of your website's SEO performance.",
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
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [showRazorpayModal, setShowRazorpayModal] = useState(false);

  // Load Razorpay script when component mounts
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePayment = async (packageId: string, amount: number | null) => {
    // For custom pricing packages, redirect to contact form
    if (!amount) {
      document
        .getElementById("contact")
        ?.scrollIntoView({ behavior: "smooth" });
      toast({
        title: "Custom Pricing",
        description:
          "Please fill out the contact form below for custom pricing.",
      });
      return;
    }

    setIsLoading(packageId);

    try {
      // Create Razorpay order
      const orderData = await apiRequest<{
        orderId: string;
        amount: number;
        currency: string;
        keyId: string;
      }>("/api/create-order", {
        method: "POST",
        body: JSON.stringify({
          amount: amount,
          currency: "INR",
          receipt: `receipt_${packageId}_${Date.now()}`,
          notes: {
            packageId,
          },
        }),
      });

      if (!orderData || !orderData.orderId) {
        throw new Error("Failed to create order");
      }

      // Initialize Razorpay payment
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Search Madarth",
        description: "SEO Audit Services",
        order_id: orderData.orderId,
        handler: async function (response: any) {
          try {
            // Verify payment
            const verificationData = await apiRequest<{
              success: boolean;
              message: string;
              paymentId: string;
            }>("/api/verify-payment", {
              method: "POST",
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            if (verificationData.success) {
              toast({
                title: "Payment Successful!",
                description:
                  "Thank you for your purchase. We'll start working on your SEO audit right away.",
              });

              // Redirect to the invoice page
              window.location.href = `/invoice?payment_id=${response.razorpay_payment_id}`;
            }
          } catch (error) {
            console.error("Payment verification error:", error);
            toast({
              title: "Payment Verification Failed",
              description:
                "There was an issue verifying your payment. Please contact support.",
              variant: "destructive",
            });
          }
        },
        prefill: {
          name: "",
          email: "",
          contact: "",
        },
        theme: {
          color: "#B2F74D",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Payment error:", error);
      toast({
        title: "Payment Failed",
        description:
          "There was an issue processing your payment. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <section id="pricing" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Pricing & Services
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
              className={`bg-white p-6 rounded-lg shadow-md border ${pkg.isPopular ? "border-[#B2F74D]" : "border-gray-200"} transition-all duration-300 hover:-translate-y-1 hover:shadow-xl relative overflow-hidden`}
            >
              {pkg.isPopular && (
                <div className="absolute top-0 right-0">
                  <div className="bg-[#B2F74D] text-[#0F3529] text-xs font-bold px-3 py-1 transform rotate-0 origin-top-right">
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
                className={`w-full ${pkg.isPopular ? "bg-[#B2F74D] text-[#0F3529]" : "bg-[#0F3529] text-white"} font-semibold hover:bg-[#0F3529] hover:text-[#B2F74D] hover:border hover:border-[#B2F74D] transition-all`}
                onClick={() => handlePayment(pkg.id, pkg.priceInr)}
                disabled={isLoading === pkg.id}
              >
                {isLoading === pkg.id ? "Processing..." : "Get Started"}
              </Button>
            </div>
          ))}
        </div>

        <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-xl font-bold mb-6 text-center">
            What You Can Expect When You Partner with Us
          </h3>
          <p className="text-gray-600 mb-8 text-center max-w-3xl mx-auto">
            We don't just analyze your website—we provide real, actionable
            insights that drive measurable growth. Here's what you get when you
            choose our AI-powered SEO audit service:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center"
              >
                <div className="h-12 w-12 bg-[#F3FAE9] rounded-full flex items-center justify-center mb-4">
                  <Check className="h-6 w-6 text-[#0F3529]" />
                </div>
                <h4 className="font-semibold mb-2">{benefit}</h4>
                <p className="text-sm text-gray-600">
                  {benefitsDescriptions[index]}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Button
              className="bg-[#B2F74D] text-[#0F3529] font-semibold px-8 py-3 h-auto hover:bg-[#0F3529] hover:text-[#B2F74D] hover:border hover:border-[#B2F74D] transition-all"
              onClick={() => handlePayment("seo-audit", 870)}
              disabled={isLoading === "seo-audit-bottom"}
            >
              {isLoading === "seo-audit-bottom"
                ? "Processing..."
                : "Get Your SEO Audit Now"}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
