import { Link } from "wouter";
import { Icon } from "@/components/ui/icon";
import logoSvg from "@/assets/logo.svg";

export function Footer() {
  return (
    <footer className="bg-[#1E1E1E] text-white py-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-5">
            <div className="mb-4">
              <img src={logoSvg} alt="Search Madarth®" className="h-6" />
            </div>
            <p className="text-gray-400 mb-4">
              Helping businesses improve their online presence through data-driven SEO strategies.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-[#B2F74D]" aria-label="Twitter">
                <Icon name="twitter" />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#B2F74D]" aria-label="Facebook">
                <Icon name="facebook" />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#B2F74D]" aria-label="LinkedIn">
                <Icon name="linkedin" />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#B2F74D]" aria-label="Instagram">
                <Icon name="instagram" />
              </a>
            </div>
          </div>
          
          <div className="md:col-span-3">
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-400 hover:text-[#B2F74D]">Home</Link></li>
              <li><a href="#features" className="text-gray-400 hover:text-[#B2F74D]">Features</a></li>
              <li><a href="#industries" className="text-gray-400 hover:text-[#B2F74D]">Industries</a></li>
              <li><a href="#process" className="text-gray-400 hover:text-[#B2F74D]">How It Works</a></li>
              <li><a href="#pricing" className="text-gray-400 hover:text-[#B2F74D]">Pricing</a></li>
            </ul>
          </div>
          
          <div className="md:col-span-4">
            <h4 className="font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start">
                <Icon name="map-pin" className="h-5 w-5 mr-3 mt-1 flex-shrink-0 text-[#B2F74D]" />
                <span className="text-gray-400">4, Alamelu Manga Puram Rd, Saradapuram, Mylapore, Chennai, Tamil Nadu 600004</span>
              </li>
              <li className="flex items-center">
                <Icon name="mail" className="h-5 w-5 mr-3 flex-shrink-0 text-[#B2F74D]" />
                <span className="text-gray-400">manoj@madarth.com</span>
              </li>
              <li className="flex items-center">
                <Icon name="phone" className="h-5 w-5 mr-3 flex-shrink-0 text-[#B2F74D]" />
                <span className="text-gray-400">+91 86677 67447</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Pixel Boy Private Ltd. All rights reserved.
          </p>
          <div className="flex space-x-4 text-sm text-gray-500">
            <Link href="/privacy-policy" className="hover:text-gray-400">Privacy Policy</Link>
            <Link href="/terms-of-service" className="hover:text-gray-400">Terms of Service</Link>
            <Link href="/cookie-policy" className="hover:text-gray-400">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
