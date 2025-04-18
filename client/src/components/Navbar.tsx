import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import logoSvg from "@/assets/logo.svg";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location] = useLocation();
  const isHomePage = location === "/";

  const toggleMenu = () => {
    const nextState = !isMenuOpen;
    setIsMenuOpen(nextState);
    document.body.style.overflow = nextState ? 'hidden' : 'auto';
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    document.body.style.overflow = 'auto';
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const menu = document.querySelector('.mobile-menu');
      if (isMenuOpen && menu && !menu.contains(event.target as Node)) {
        closeMenu();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  // Function to handle navigation with hash for home page
  const handleNavigation = (event: React.MouseEvent<HTMLAnchorElement>, target: string) => {
    event.preventDefault();
    if (!isHomePage) {
      // Redirect to home page with hash
      window.location.href = `/${target}`;
    } else {
      // Just scroll to the section if we're already on the home page
      document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' });
    }
    closeMenu();
  };

  return (
    <nav className="bg-[#0F3529] text-white h-[64px] flex items-center fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/" className="font-bold flex items-center">
            <img src={logoSvg} alt="Search Madarth®" className="h-6" />
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <a 
            href={isHomePage ? "#features" : "/#features"} 
            className="hover:text-[#B2F74D] transition-colors"
            onClick={(e) => isHomePage && handleNavigation(e, "#features")}
          >
            Features
          </a>
          <a 
            href={isHomePage ? "#pricing" : "/#pricing"} 
            className="hover:text-[#B2F74D] transition-colors"
            onClick={(e) => isHomePage && handleNavigation(e, "#pricing")}
          >
            Pricing
          </a>
          <a 
            href={isHomePage ? "#industries" : "/#industries"} 
            className="hover:text-[#B2F74D] transition-colors"
            onClick={(e) => isHomePage && handleNavigation(e, "#industries")}
          >
            Industries
          </a>
          <a 
            href={isHomePage ? "#process" : "/#process"} 
            className="hover:text-[#B2F74D] transition-colors"
            onClick={(e) => isHomePage && handleNavigation(e, "#process")}
          >
            Process
          </a>
          <a href={isHomePage ? "#pricing" : "/#pricing"}  className="bg-[#B2F74D] text-[#0F3529] font-semibold border-[1px] border-[--color-border] hover:bg-[#0F3529] hover:text-[#B2F74D] hover:border hover:border-[#B2F74D] transition-all px-4 py-2 rounded-md"
           onClick={(e) => isHomePage && handleNavigation(e, "#pricing")}>
            Get Started
          </a>
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
      <div className={`mobile-menu md:hidden bg-[#1A5A46] fixed top-[64px] left-0 w-full z-50 px-4 py-2 shadow-lg transition-all duration-300 ${isMenuOpen ? 'block' : 'hidden'}`}>
        <div className="flex flex-col space-y-3 py-3">
          <a 
            href={isHomePage ? "#features" : "/#features"}
            className="hover:text-[#B2F74D] transition-colors py-2" 
            onClick={(e) => isHomePage && handleNavigation(e, "#features")}
          >
            Features
          </a>
          <a 
            href={isHomePage ? "#pricing" : "/#pricing"}
            className="hover:text-[#B2F74D] transition-colors py-2" 
            onClick={(e) => isHomePage && handleNavigation(e, "#pricing")}
          >
            Pricing
          </a>
          <a 
            href={isHomePage ? "#industries" : "/#industries"}
            className="hover:text-[#B2F74D] transition-colors py-2" 
            onClick={(e) => isHomePage && handleNavigation(e, "#industries")}
          >
            Industries
          </a>
          <a 
            href={isHomePage ? "#process" : "/#process"}
            className="hover:text-[#B2F74D] transition-colors py-2" 
            onClick={(e) => isHomePage && handleNavigation(e, "#process")}
          >
            Process
          </a>
          <Button 
            className="bg-[#B2F74D] text-[#0F3529] font-semibold border-[1px] border-[--color-border] hover:bg-[#0F3529] hover:text-[#B2F74D] hover:border hover:border-[#B2F74D] transition-all w-full"
            onClick={closeMenu}
          >
            Get Started
          </Button>
        </div>
      </div>
    </nav>
  );
}
