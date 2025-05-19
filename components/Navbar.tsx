"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const isHomePage = pathname === "/";

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    const nextState = !isMenuOpen;
    setIsMenuOpen(nextState);
    document.body.style.overflow = nextState ? "hidden" : "auto";
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    document.body.style.overflow = "auto";
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const menu = document.querySelector(".mobile-menu");
      if (isMenuOpen && menu && !menu.contains(event.target as Node)) {
        closeMenu();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen]);

  // Handle navigation with smooth scroll on home page, otherwise navigate to home with hash
  const handleNavigation = (event: React.MouseEvent<HTMLAnchorElement>, target: string) => {
    event.preventDefault();
    if (!isHomePage) {
      router.push(`/${target}`);
    } else {
      const element = document.querySelector(target);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
    closeMenu();
  };

  return (
    <nav className="bg-[#0F3529] text-white h-[64px] flex items-center fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/" className="font-bold flex items-center">
            <Image
              src="/assets/logo.svg"
              alt="Search Madarth®"
              width={300} // adjust as needed
              height={38} // adjust as needed
              priority
              className="h-6"
            />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <a
            href={isHomePage ? "#features" : "/#features"}
            className="hover:text-[#CADB3F] transition-colors"
            onClick={(e) => isHomePage && handleNavigation(e, "#features")}
          >
            Features
          </a>
          <a
            href={isHomePage ? "#pricing" : "/#pricing"}
            className="hover:text-[#CADB3F] transition-colors"
            onClick={(e) => isHomePage && handleNavigation(e, "#pricing")}
          >
            Pricing
          </a>
          <a
            href={isHomePage ? "#industries" : "/#industries"}
            className="hover:text-[#CADB3F] transition-colors"
            onClick={(e) => isHomePage && handleNavigation(e, "#industries")}
          >
            Industries
          </a>
          <a
            href={isHomePage ? "#process" : "/#process"}
            className="hover:text-[#CADB3F] transition-colors"
            onClick={(e) => isHomePage && handleNavigation(e, "#process")}
          >
            Process
          </a>
          <button
            onClick={() => router.push('/auth/signin')}
            className="bg-[#CADB3F] text-[#0F3529] font-semibold border-[1px] border-[--color-border] hover:bg-[#0F3529] hover:text-[#CADB3F] hover:border hover:border-[#CADB3F] transition-all px-4 py-2 rounded-md"
          >
            Get Started
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`mobile-menu md:hidden bg-[#1A5A46] fixed top-[64px] left-0 w-full z-50 px-4 py-2 shadow-lg transition-all duration-300 ${
          isMenuOpen ? "block" : "hidden"
        }`}
      >
        <div className="flex flex-col space-y-3 py-3">
          <a
            href={isHomePage ? "#features" : "/#features"}
            className="hover:text-[#CADB3F] transition-colors py-2"
            onClick={(e) => isHomePage && handleNavigation(e, "#features")}
          >
            Features
          </a>
          <a
            href={isHomePage ? "#pricing" : "/#pricing"}
            className="hover:text-[#CADB3F] transition-colors py-2"
            onClick={(e) => isHomePage && handleNavigation(e, "#pricing")}
          >
            Pricing
          </a>
          <a
            href={isHomePage ? "#industries" : "/#industries"}
            className="hover:text-[#CADB3F] transition-colors py-2"
            onClick={(e) => isHomePage && handleNavigation(e, "#industries")}
          >
            Industries
          </a>
          <a
            href={isHomePage ? "#process" : "/#process"}
            className="hover:text-[#CADB3F] transition-colors py-2"
            onClick={(e) => isHomePage && handleNavigation(e, "#process")}
          >
            Process
          </a>
          <Button
            className="bg-[#CADB3F] text-[#0F3529] font-semibold border-[1px] border-[--color-border] hover:bg-[#0F3529] hover:text-[#CADB3F] hover:border hover:border-[#CADB3F] transition-all w-full"
            onClick={() => {
              router.push('/auth/signin');
              closeMenu();
            }}
          >
            Get Started
          </Button>
        </div>
      </div>
    </nav>
  );
}
