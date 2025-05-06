import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Check } from "lucide-react";

export function ContactSection() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "+91 ",
    website: "",
    message: ""
  });
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    mobile?: string;
    website?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateForm = () => {
    const newErrors: {
      name?: string;
      email?: string;
      mobile?: string;
      website?: string;
    } = {};
    let isValid = true;

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    // Mobile validation (Indian mobile number)
    const mobileRegex = /^\+91 [6-9]\d{9}$/;
    if (!formData.mobile.trim()) {
      newErrors.mobile = "Mobile number is required";
      isValid = false;
    } else if (!mobileRegex.test(formData.mobile)) {
      newErrors.mobile = "Please enter a valid 10-digit Indian mobile number with +91 prefix";
      isValid = false;
    }

    // Website validation
    if (!formData.website.trim()) {
      newErrors.website = "Website URL is required";
      isValid = false;
    } else {
      try {
        new URL(formData.website);
      } catch (_) {
        newErrors.website = "Please enter a valid URL";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Special handling for mobile field
    if (name === "mobile") {
      // Ensure the input always starts with +91
      let formattedValue = value;
      if (!formattedValue.startsWith("+91 ")) {
        formattedValue = "+91 " + formattedValue.replace("+91 ", "");
      }
      
      // Only allow changing the part after +91
      setFormData(prev => ({
        ...prev,
        [name]: formattedValue
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear error for this field if it exists
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real application, you would send this data to your backend
      // This is a simulated API call with email to sikavinraj@gmail.com
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Success!",
        description: "Thank you for your submission. We'll get back to you soon.",
      });
      
      // Show success message instead of form
      setIsSubmitted(true);
      
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-16 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">Get Your SEO Audit Today!</h2>
        <p className="text-center text-gray-600 mb-8">
          Have questions or need more details? Fill out the form below, and we'll get back to you as soon as possible.
        </p>
          {isSubmitted ? (
            <div className="text-center py-8">
              <div className="mx-auto bg-green-100 rounded-full h-20 w-20 flex items-center justify-center mb-6">
                <Check className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Thank You!</h3>
              <p className="text-gray-600 mb-6">
                Your submission has been received successfully. We'll analyze your website and get back to you within 48 hours with your SEO audit report.
              </p>
              <p className="text-gray-600">
                A confirmation has been sent to your email address. If you have any questions, please contact us at manoj@madarth.com.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <Input 
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    className={`w-full ${errors.name ? 'border-red-500' : ''}`}
                  />
                  {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
                </div>
                
                <div className="space-y-1">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <Input 
                    id="email"
                    name="email"
                    type="text"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Your email address"
                    className={`w-full ${errors.email ? 'border-red-500' : ''}`}
                  />
                  {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
                </div>
                
                <div className="space-y-1">
                  <label htmlFor="mobile" className="block text-sm font-medium text-gray-700">
                    Mobile <span className="text-red-500">*</span>
                  </label>
                  <Input 
                    id="mobile"
                    name="mobile"
                    type="text"
                    value={formData.mobile}
                    onChange={handleChange}
                    placeholder="+91 9876543210"
                    className={`w-full ${errors.mobile ? 'border-red-500' : ''}`}
                  />
                  {errors.mobile && <p className="text-sm text-red-500 mt-1">{errors.mobile}</p>}
                </div>
                
                <div className="space-y-1">
                  <label htmlFor="website" className="block text-sm font-medium text-gray-700">
                    Website URL <span className="text-red-500">*</span>
                  </label>
                  <Input 
                    id="website"
                    name="website"
                    type="text"
                    value={formData.website}
                    onChange={handleChange}
                    placeholder="https://yourwebsite.com"
                    className={`w-full ${errors.website ? 'border-red-500' : ''}`}
                  />
                  {errors.website && <p className="text-sm text-red-500 mt-1">{errors.website}</p>}
                </div>
              </div>
              
              <div className="space-y-1">
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                  Message (Optional)
                </label>
                <Textarea 
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us about your specific SEO needs or concerns"
                  rows={4}
                  className="w-full resize-none"
                />
              </div>
              
              <div className="text-center">
                <Button 
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#CADB3F] text-[#0F3529] font-semibold px-6 py-3 h-auto border-[1px] border-[#CADB3F] hover:bg-[#0F3529] hover:text-[#CADB3F] hover:border hover:border-[#0F3529] transition-all transform"
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}