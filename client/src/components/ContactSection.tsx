import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

export function ContactSection() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    website: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Thank you for your submission!",
        description: "We'll get back to you as soon as possible.",
      });
      
      setFormData({
        name: "",
        email: "",
        mobile: "",
        website: "",
        message: ""
      });
      
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <section id="contact" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">Get Your SEO Audit Today!</h2>
          <p className="text-center text-gray-600 mb-8">
            Have questions or need more details? Fill out the form below, and we'll get back to you as soon as possible.
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Name <span className="text-red-500">*</span>
                </label>
                <Input 
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  required
                  className="w-full"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email <span className="text-red-500">*</span>
                </label>
                <Input 
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Your email address"
                  required
                  className="w-full"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="mobile" className="block text-sm font-medium text-gray-700">
                  Mobile <span className="text-red-500">*</span>
                </label>
                <Input 
                  id="mobile"
                  name="mobile"
                  type="tel"
                  value={formData.mobile}
                  onChange={handleChange}
                  placeholder="Your phone number"
                  required
                  className="w-full"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="website" className="block text-sm font-medium text-gray-700">
                  Website URL <span className="text-red-500">*</span>
                </label>
                <Input 
                  id="website"
                  name="website"
                  type="url"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="https://yourwebsite.com"
                  required
                  className="w-full"
                />
              </div>
            </div>
            
            <div className="space-y-2">
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
                className="w-full"
              />
            </div>
            
            <div className="text-center">
              <Button 
                type="submit"
                disabled={isSubmitting}
                className="bg-[#B2F74D] text-[#0F3529] font-semibold px-8 py-3 h-auto hover:bg-opacity-90 transition-all transform hover:-translate-y-0.5 hover:shadow-lg"
              >
                {isSubmitting ? "Submitting..." : "Get My Audit Now"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}