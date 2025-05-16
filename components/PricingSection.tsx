"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  theme: {
    color: string;
  };
}

interface RazorpayInstance {
  open: () => void;
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
  "Optimize your website&apos;s structure and content to turn traffic into paying customers effectively.",
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
      "Get a comprehensive analysis of your website&apos;s SEO performance.",
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
  const [isLoading, setIsLoading] = useState<string | null>(null);

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
    if (!amount) {
      document
        .getElementById("contact")
        ?.scrollIntoView({ behavior: "smooth" });
      alert("Please fill out the contact form below for custom pricing.");
      return;
    }

    setIsLoading(packageId);

    try {
      const orderResponse = await fetch("/api/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: amount,
          currency: "INR",
          receipt: `receipt_${packageId}_${Date.now()}`,
          notes: {
            packageId,
          },
        }),
      });
      const orderData = await orderResponse.json();

      if (!orderData || !orderData.orderId) {
        throw new Error("Failed to create order");
      }

      const options: RazorpayOptions = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Search Madarth",
        description: "SEO Audit Services",
        order_id: orderData.orderId,
        handler: async function (response: RazorpayResponse) {
          try {
            const verificationResponse = await fetch("/api/verify-payment", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });
            const verificationData = await verificationResponse.json();

            if (verificationData.success) {
              alert(
                "Payment Successful! Thank you for your purchase. We&apos;ll start working on your SEO audit right away."
              );
              window.location.href = `/invoice?payment_id=${response.razorpay_payment_id}`;
            }
          } catch (error) {
            console.error("Payment verification error:", error);
            alert(
              "Payment Verification Failed: There was an issue verifying your payment. Please contact support."
            );
          }
        },
        prefill: {
          name: "",
          email: "",
          contact: "",
        },
        theme: {
          color: "#CADB3F",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Payment error:", error);
      alert(
        "Payment Failed: There was an issue processing your payment. Please try again later."
      );
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <section id="pricing" className="py-16 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="md:text-center mb-12">
          <h2 className="text-[28px] leading-[32px] md:text-3xl md:leading-[1.5] font-bold mb-4">
            Pricing &amp; Services
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
              className={`bg-white p-6 rounded-lg shadow-md border ${
                pkg.isPopular ? "border-[#CADB3F]" : "border-gray-200"
              } transition-all duration-300 hover:-translate-y-1 hover:shadow-xl relative overflow-hidden flex flex-col h-full justify-between`}
            >
              {pkg.isPopular && (
                <div className="absolute top-0 right-0">
                  <div className="bg-[#CADB3F] text-[#0F3529] text-xs font-bold px-3 py-1 transform rotate-0 origin-top-right">
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
                className={`w-full ${
                  pkg.isPopular
                    ? "bg-[#CADB3F] text-[#0F3529]"
                    : "bg-[#0F3529] text-white"
                } font-semibold hover:bg-[#0F3529] hover:text-[#CADB3F] hover:border hover:border-[#0F3529] transition-all`}
                onClick={() => handlePayment(pkg.id, pkg.priceInr)}
                disabled={isLoading === pkg.id}
              >
                {isLoading === pkg.id ? "Processing..." : "Get Started"}
              </Button>
            </div>
          ))}
        </div>

        <div className="py-16">
          <h2 className="text-[28px] leading-[32px] md:text-3xl md:leading-[1.5] font-bold mb-4 md:text-center">
            What You Can Expect When You Partner with Us
          </h2>
          <p className="text-gray-600 mb-12 md:text-center max-w-3xl mx-auto text-lg">
            We don&apos;t just analyze your website—we provide real, actionable
            insights that drive measurable growth. Here&apos;s what you get when
            you choose our AI-powered SEO audit service:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="flex flex-col items-start text-left group"
              >
                <div className="h-16 w-16 bg-[#E8F5E9] rounded-full flex items-center justify-center mb-6">
                  <Check className="h-8 w-8 text-[#0F3529]" />
                </div>
                <h4 className="font-bold text-xl mb-3 text-[#0F3529]">
                  {benefit}
                </h4>
                <p className="text-gray-600 leading-relaxed">
                  {benefitsDescriptions[index]}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <a
              href="#pricing"
              className="bg-[#CADB3F] text-[#0F3529] font-semibold px-6 py-3 h-auto border-[1px] border-[#CADB3F] hover:bg-[#0F3529] hover:text-[#CADB3F] hover:border hover:border-[#0F3529] transition-all transform px-4 py-2 rounded-md"
            >
              Start Your SEO Audit Now
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
