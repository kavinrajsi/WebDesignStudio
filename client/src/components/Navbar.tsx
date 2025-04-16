import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-[#0F3529] text-white py-4">
      <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/" className="font-bold text-xl flex items-center gap-2">
            <span className="text-[#B2F74D]">Growth</span><span>INSIGHT</span>
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <a href="#features" className="hover:text-[#B2F74D] transition-colors">Features</a>
          <a href="#pricing" className="hover:text-[#B2F74D] transition-colors">Pricing</a>
          <a href="#industries" className="hover:text-[#B2F74D] transition-colors">Industries</a>
          <a href="#process" className="hover:text-[#B2F74D] transition-colors">Process</a>
          <Button className="bg-[#B2F74D] text-[#0F3529] font-semibold hover:bg-opacity-90 transition-all transform hover:-translate-y-0.5 hover:shadow-lg">
            Get Started
          </Button>
        </div>
        
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-white"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>
      
      {/* Mobile Navigation */}
      <div className={`md:hidden bg-[#1A5A46] absolute w-full z-50 px-4 py-2 shadow-lg transition-all duration-300 ${isMenuOpen ? 'block' : 'hidden'}`}>
        <div className="flex flex-col space-y-3 py-3">
          <a href="#features" className="hover:text-[#B2F74D] transition-colors py-2" onClick={closeMenu}>Features</a>
          <a href="#pricing" className="hover:text-[#B2F74D] transition-colors py-2" onClick={closeMenu}>Pricing</a>
          <a href="#industries" className="hover:text-[#B2F74D] transition-colors py-2" onClick={closeMenu}>Industries</a>
          <a href="#process" className="hover:text-[#B2F74D] transition-colors py-2" onClick={closeMenu}>Process</a>
          <Button 
            className="bg-[#B2F74D] text-[#0F3529] font-semibold hover:bg-opacity-90 transition-all w-full"
            onClick={closeMenu}
          >
            Get Started
          </Button>
        </div>
      </div>
    </nav>
  );
}
