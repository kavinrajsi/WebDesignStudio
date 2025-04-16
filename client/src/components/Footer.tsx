import { Link } from "wouter";
import { Icon } from "@/components/ui/icon";

export function Footer() {
  return (
    <footer className="bg-[#1E1E1E] text-white py-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
              <span className="text-[#B2F74D]">Growth</span><span>INSIGHT</span>
            </h3>
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
          
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/"><a className="text-gray-400 hover:text-[#B2F74D]">Home</a></Link></li>
              <li><a href="#features" className="text-gray-400 hover:text-[#B2F74D]">Features</a></li>
              <li><a href="#industries" className="text-gray-400 hover:text-[#B2F74D]">Industries</a></li>
              <li><a href="#process" className="text-gray-400 hover:text-[#B2F74D]">How It Works</a></li>
              <li><a href="#" className="text-gray-400 hover:text-[#B2F74D]">Pricing</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-[#B2F74D]">SEO Guide</a></li>
              <li><a href="#" className="text-gray-400 hover:text-[#B2F74D]">Blog</a></li>
              <li><a href="#" className="text-gray-400 hover:text-[#B2F74D]">Case Studies</a></li>
              <li><a href="#" className="text-gray-400 hover:text-[#B2F74D]">FAQ</a></li>
              <li><a href="#" className="text-gray-400 hover:text-[#B2F74D]">Support</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-2">
              <li className="flex items-start space-x-3">
                <Icon name="map-pin" className="mt-1 text-[#B2F74D]" />
                <span className="text-gray-400">123 SEO Street, Digital City, 10001</span>
              </li>
              <li className="flex items-start space-x-3">
                <Icon name="mail" className="mt-1 text-[#B2F74D]" />
                <span className="text-gray-400">info@growthinsight.com</span>
              </li>
              <li className="flex items-start space-x-3">
                <Icon name="phone" className="mt-1 text-[#B2F74D]" />
                <span className="text-gray-400">+1 (555) 123-4567</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Growth Insight. All rights reserved.
          </p>
          <div className="flex space-x-4 text-sm text-gray-500">
            <a href="#" className="hover:text-gray-400">Privacy Policy</a>
            <a href="#" className="hover:text-gray-400">Terms of Service</a>
            <a href="#" className="hover:text-gray-400">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
