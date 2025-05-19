"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
      "Get a comprehensive analysis of your websites SEO performance.",
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

interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
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
  modal: {
    ondismiss: () => void;
  };
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => {
      open: () => void;
    };
  }
}

export function PricingSection() {
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState(false);
  const [userInfo, setUserInfo] = useState({
    ip: '',
    userAgent: '',
    referrer: '',
    location: '',
  });
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    website: "",
    website_url: "",
  });
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState({
    name: '',
    email: '',
    phone: '',
    website: '',
  });
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [paymentId, setPaymentId] = useState<string | null>(null);

  // Rate limiting constants
  // const MAX_SUBMISSIONS_PER_HOUR = 2;
  // const MAX_SUBMISSIONS_PER_DAY = 5;
  // const SUBMISSION_COOLDOWN = 3600000; // 1 hour in milliseconds
  // const DAILY_COOLDOWN = 86400000; // 24 hours in milliseconds

  useEffect(() => {
    // Get user agent
    setUserInfo(prev => ({
      ...prev,
      userAgent: navigator.userAgent,
      referrer: document.referrer,
    }));

    // Get IP and location
    fetch('https://api.ipify.org?format=json')
      .then(res => res.json())
      .then(data => {
        setUserInfo(prev => ({
          ...prev,
          ip: data.ip,
        }));
      })
      .catch(console.error);

    // Get location using IP
    fetch('https://ipapi.co/json/')
      .then(res => res.json())
      .then(data => {
        const location = `${data.city}, ${data.region}, ${data.country_name}`;
        setUserInfo(prev => ({
          ...prev,
          location,
        }));
      })
      .catch(console.error);

    // Load submission counts from localStorage
    // const savedHourlyCount = localStorage.getItem('formSubmissionCount');
    // const savedDailyCount = localStorage.getItem('dailySubmissionCount');
    // const savedLastSubmissionTime = localStorage.getItem('lastSubmissionTime');
    // const savedFirstSubmissionTime = localStorage.getItem('firstSubmissionTime');

    // if (savedHourlyCount) setSubmissionCount(parseInt(savedHourlyCount));
    // if (savedLastSubmissionTime) setLastSubmissionTime(parseInt(savedLastSubmissionTime));

    // // Check if we need to reset daily count
    // const now = Date.now();
    // const firstSubmissionTime = savedFirstSubmissionTime ? parseInt(savedFirstSubmissionTime) : now;
    // if (now - firstSubmissionTime > DAILY_COOLDOWN) {
    //   localStorage.setItem('dailySubmissionCount', '0');
    //   localStorage.setItem('firstSubmissionTime', now.toString());
    // } else if (savedDailyCount) {
    //   const dailyCount = parseInt(savedDailyCount);
    //   if (dailyCount >= MAX_SUBMISSIONS_PER_DAY) {
    //     const remainingHours = Math.ceil((DAILY_COOLDOWN - (now - firstSubmissionTime)) / 3600000);
    //     setFormError(`Daily submission limit reached. Please try again in ${remainingHours} hours.`);
    //   }
    // }
  }, []);

  const validatePhoneNumber = (phone: string): boolean => {
    // Indian phone number validation
    const phoneRegex = /^\+91[6-9]\d{9}$/;
    return phoneRegex.test(phone);
  };

  const formatPhoneNumber = (value: string): string => {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, '');
    
    // If empty, return empty string
    if (!digits) return '';
    
    // If starts with 91, keep it, otherwise add +91
    if (digits.startsWith('91')) {
      return `+${digits}`;
    }
    
    // Add +91 prefix if not present
    return `+91${digits}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedPhone = formatPhoneNumber(e.target.value);
    setFormData(prev => ({
      ...prev,
      phone: formattedPhone
    }));

    // Validate phone number
    if (formattedPhone && !validatePhoneNumber(formattedPhone)) {
      setPhoneError('Please enter a valid Indian phone number starting with +91 followed by 10 digits');
    } else {
      setPhoneError(null);
    }
  };

  // const checkRateLimit = (): boolean => {
  //   // Bypass rate limiting in development mode
  //   if (isDevelopment) {
  //     return true;
  //   }

  //   const now = Date.now();
  //   const timeSinceLastSubmission = now - lastSubmissionTime;
  //   const savedDailyCount = localStorage.getItem('dailySubmissionCount');
  //   const savedFirstSubmissionTime = localStorage.getItem('firstSubmissionTime');
  //   const firstSubmissionTime = savedFirstSubmissionTime ? parseInt(savedFirstSubmissionTime) : now;
  //   const dailyCount = savedDailyCount ? parseInt(savedDailyCount) : 0;

  //   // Reset hourly count if an hour has passed
  //   if (timeSinceLastSubmission > SUBMISSION_COOLDOWN) {
  //     setSubmissionCount(0);
  //     localStorage.setItem('formSubmissionCount', '0');
  //   }

  //   // Reset daily count if 24 hours have passed
  //   if (now - firstSubmissionTime > DAILY_COOLDOWN) {
  //     localStorage.setItem('dailySubmissionCount', '0');
  //     localStorage.setItem('firstSubmissionTime', now.toString());
  //     return true;
  //   }

  //   // Check hourly limit
  //   if (submissionCount >= MAX_SUBMISSIONS_PER_HOUR) {
  //     const remainingMinutes = Math.max(
  //       1,
  //       Math.ceil((SUBMISSION_COOLDOWN - timeSinceLastSubmission) / 60000)
  //     );
  //     setFormError(`Too many submissions. Please try again in ${remainingMinutes} minutes.`);
  //     return false;
  //   }

  //   // Check daily limit
  //   if (dailyCount >= MAX_SUBMISSIONS_PER_DAY) {
  //     const remainingHours = Math.ceil((DAILY_COOLDOWN - (now - firstSubmissionTime)) / 3600000);
  //     setFormError(`Daily submission limit reached. Please try again in ${remainingHours} hours.`);
  //     return false;
  //   }

  //   return true;
  // };

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'Name is required';
        if (value.length < 2) return 'Name must be at least 2 characters';
        return '';
      
      case 'email':
        if (!value) return 'Email is required';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return 'Please enter a valid email address';
        return '';
      
      case 'website':
        if (!value) return 'Website URL is required';
        try {
          new URL(value);
        } catch {
          return 'Please enter a valid URL (e.g., https://example.com)';
        }
        return '';
      
      default:
        return '';
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'phone') {
      handlePhoneChange(e);
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
      
      // Validate field and update error
      const error = validateField(name, value);
      setFieldErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setFieldErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  // Initialize Razorpay
  const initializeRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const makePayment = async () => {
    const res = await initializeRazorpay();
    if (!res) {
      setFormError("Razorpay SDK failed to load");
      return;
    }

    try {
      // Create a new order
      const response = await fetch("/api/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: 102660, // Amount in paise (1026.60)
          currency: "INR",
          receipt: `receipt_${Date.now()}`, // Unique receipt ID
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Order creation failed:', data);
        throw new Error(data.details || 'Failed to create order');
      }

      // Verify that we have a valid order ID
      if (!data.id) {
        console.error('Invalid order data received:', data);
        throw new Error('Invalid order ID received');
      }

      console.log('Order created successfully:', data);

      const isTestMode = process.env.NEXT_PUBLIC_RAZORPAY_TEST_MODE === 'true';
      const razorpayKey = isTestMode
        ? process.env.NEXT_PUBLIC_RAZORPAY_TEST_KEY_ID
        : process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

      if (!razorpayKey) {
        throw new Error('Razorpay key not found');
      }

      const options: RazorpayOptions = {
        key: razorpayKey,
        amount: data.amount,
        currency: data.currency,
        name: "SEO Audit Solutions",
        description: "SEO Audit Service",
        order_id: data.id,
        handler: async function (response: RazorpayResponse) {
          try {
            console.log('Payment response received:', response);
            setPaymentId(response.razorpay_payment_id);

            // In test mode, we don't need to verify the signature
            if (isTestMode) {
              console.log('Updating Supabase with orderId:', orderId);
              const { data, error } = await supabase
                .from('seoaudit_product')
                .update({ 
                  payment_status: 'completed',
                  payment_id: response.razorpay_payment_id,
                  order_id: response.razorpay_order_id,
                  test_mode: true
                })
                .eq('id', orderId);

              console.log('Supabase update response:', { data, error });

              if (error) {
                console.error('Supabase update error:', error);
                throw error;
              }

              setFormSuccess(true);
              return;
            }

            // For production mode, verify the payment
            const verifyResponse = await fetch("/api/verify-payment", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId: orderId,
              }),
            });

            const verifyData = await verifyResponse.json();
            console.log('Payment verification response:', verifyData);

            if (verifyData.success) {
              console.log('Updating Supabase with orderId:', orderId);
              const { data, error } = await supabase
                .from('seoaudit_product')
                .update({ 
                  payment_status: 'completed',
                  payment_id: response.razorpay_payment_id,
                  order_id: response.razorpay_order_id,
                  test_mode: false
                })
                .eq('id', orderId);

              console.log('Supabase update response:', { data, error });

              if (error) {
                console.error('Supabase update error:', error);
                throw error;
              }

              setFormSuccess(true);
            } else {
              console.error('Payment verification failed:', verifyData);
              throw new Error(verifyData.message || "Payment verification failed");
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            setFormError(error instanceof Error ? error.message : 'Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: "#0F3529",
        },
        modal: {
          ondismiss: function() {
            console.log('Payment modal dismissed');
          }
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error('Payment initialization error:', error);
      setFormError(error instanceof Error ? error.message : 'Failed to initialize payment. Please try again.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    const errors = {
      name: validateField('name', formData.name),
      email: validateField('email', formData.email),
      phone: phoneError || '',
      website: validateField('website', formData.website),
    };

    setFieldErrors(errors);

    // Check if there are any errors
    if (Object.values(errors).some(error => error)) {
      return;
    }

    // Check honeypot field
    if (formData.website_url) {
      setShowForm(false);
      return;
    }

    setIsSubmitting(true);
    setFormError(null);
    setFormSuccess(false);

    try {
      // Insert into Supabase
      const { data, error } = await supabase
        .from('seoaudit_product')
        .insert([
          {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            website: formData.website,
            status: 'pending',
            payment_status: 'pending',
            created_at: new Date().toISOString(),
            ip_address: userInfo.ip,
            user_agent: userInfo.userAgent,
            referrer_url: userInfo.referrer,
            location: userInfo.location,
          }
        ])
        .select()
        .single();

      if (error) throw error;

      // Store order ID for payment
      setOrderId(data.id);

      // Show payment form
      setShowPaymentForm(true);

    } catch (error) {
      console.error('Error submitting form:', error);
      setFormError('Failed to submit form. Please try again.');
    } finally {
      setIsSubmitting(false);
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
                } font-semibold hover:bg-[#0F3529] hover:text-[#CADB3F] hover:border hover:border-[#0F3529] transition-all cursor-pointer`}
                onClick={() => {
                  if (pkg.id === "seo-audit") {
                    setShowForm(true);
                  } else {
                    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
                  }
                }}
              >
                {pkg.id === "seo-audit" ? "Payment" : "Contact Us"}
              </Button>
            </div>
          ))}
        </div>

        {/* Modal Form */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg max-w-md w-full mx-4">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Get Your SEO Audit</h3>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setFormError(null);
                    setFormSuccess(false);
                    setShowPaymentForm(false);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              {formSuccess ? (
                <div className="text-center py-8">
                  <div className="mx-auto bg-green-100 rounded-full h-20 w-20 flex items-center justify-center mb-6">
                    <Check className="h-10 w-10 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Thank You!</h3>
                  <p className="text-gray-600 mb-4">
                    Your payment has been processed successfully. We&apos;ll get back to you soon.
                  </p>
                  <div className="space-y-4">
                    <Button
                      onClick={() => {
                        const viewUrl = `/dashboard/invoice?orderId=${orderId}&paymentId=${paymentId}`;
                        window.open(viewUrl, '_blank');
                      }}
                      className="bg-[#CADB3F] text-[#0F3529] font-semibold hover:bg-[#0F3529] hover:text-[#CADB3F]"
                    >
                      View Invoice
                    </Button>
                  </div>
                </div>
              ) : showPaymentForm ? (
                <div className="text-center py-8">
                  <h3 className="text-xl font-bold mb-4">Complete Your Payment</h3>
                  <p className="text-gray-600 mb-6">
                    Amount to pay: ₹870 + 18% GST
                  </p>
                  <Button
                    onClick={makePayment}
                    className="w-full bg-[#CADB3F] text-[#0F3529] font-semibold hover:bg-[#0F3529] hover:text-[#CADB3F]"
                  >
                    Proceed to Payment
                  </Button>
                  {process.env.NEXT_PUBLIC_RAZORPAY_TEST_MODE === 'true' && (
                    <div className="text-yellow-600 text-sm mt-2">
                      Test Mode Active - No real payments will be processed
                    </div>
                  )}
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                  {formError && (
                    <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">
                      {formError}
                    </div>
                  )}
                  {/* Honeypot field */}
                  <div className="hidden">
                    <input
                      type="text"
                      name="website_url"
                      value={formData.website_url}
                      onChange={handleInputChange}
                      tabIndex={-1}
                      autoComplete="off"
                    />
                  </div>
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Name *
                    </label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      required
                      placeholder="Your name"
                      className={`w-full ${fieldErrors.name ? 'border-red-500' : ''}`}
                      disabled={isSubmitting}
                    />
                    {fieldErrors.name && (
                      <p className="text-sm text-red-500 mt-1">{fieldErrors.name}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      required
                      placeholder="your@email.com"
                      className={`w-full ${fieldErrors.email ? 'border-red-500' : ''}`}
                      disabled={isSubmitting}
                    />
                    {fieldErrors.email && (
                      <p className="text-sm text-red-500 mt-1">{fieldErrors.email}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone *
                    </label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      required
                      placeholder="+91 9876543210"
                      className={`w-full ${phoneError ? 'border-red-500' : ''}`}
                      disabled={isSubmitting}
                    />
                    {phoneError && (
                      <p className="text-sm text-red-500 mt-1">{phoneError}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
                      Website URL *
                    </label>
                    <Input
                      id="website"
                      name="website"
                      type="url"
                      value={formData.website}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      required
                      placeholder="https://yourwebsite.com"
                      className={`w-full ${fieldErrors.website ? 'border-red-500' : ''}`}
                      disabled={isSubmitting}
                    />
                    {fieldErrors.website && (
                      <p className="text-sm text-red-500 mt-1">{fieldErrors.website}</p>
                    )}
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-[#CADB3F] text-[#0F3529] font-semibold hover:bg-[#0F3529] hover:text-[#CADB3F]"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                  </Button>
                </form>
              )}
            </div>
          </div>
        )}

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
              href="#contact"
              className="bg-[#CADB3F] text-[#0F3529] font-semibold px-6 py-3 h-auto border-[1px] border-[#CADB3F] hover:bg-[#0F3529] hover:text-[#CADB3F] hover:border hover:border-[#0F3529] transition-all transform px-4 py-2 rounded-md"
            >
              Contact Us Now
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}