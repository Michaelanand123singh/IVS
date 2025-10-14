"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-professional border-b border-gray-200">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 sm:px-6 py-4">
        <Link href="#" className="flex items-center" aria-label="Integrated Value Solutions - Home">
          <Image
            src="/logo.png"
            alt="Integrated Value Solutions - Microsoft Dynamics 365 Business Central Partner"
            width={160}
            height={45}
            className="h-10 sm:h-12 w-auto"
            priority
            quality={90}
          />
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex text-sm font-medium" role="navigation" aria-label="Main navigation">
          <a href="#services" className="text-gray-600 transition-all duration-300 hover:text-[#1F4E79] hover:font-semibold relative group" aria-label="View our services">
            Services
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#1F4E79] to-[#F47A21] transition-all duration-300 group-hover:w-full"></span>
          </a>
          <a href="#about" className="text-gray-600 transition-all duration-300 hover:text-[#1F4E79] hover:font-semibold relative group" aria-label="Learn about Integrated Value Solutions">
            About
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#1F4E79] to-[#F47A21] transition-all duration-300 group-hover:w-full"></span>
          </a>
          <a href="#testimonials" className="text-gray-600 transition-all duration-300 hover:text-[#1F4E79] hover:font-semibold relative group" aria-label="Read client testimonials">
            Testimonials
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#1F4E79] to-[#F47A21] transition-all duration-300 group-hover:w-full"></span>
          </a>
          <a href="#contact" className="text-gray-600 transition-all duration-300 hover:text-[#1F4E79] hover:font-semibold relative group" aria-label="Contact us for consultation">
            Contact
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#1F4E79] to-[#F47A21] transition-all duration-300 group-hover:w-full"></span>
          </a>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMobileMenu}
          className="md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
          aria-label="Toggle mobile menu"
          aria-expanded={isMobileMenuOpen}
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white/95 backdrop-blur-md">
          <nav className="px-4 py-4 space-y-2" role="navigation" aria-label="Mobile navigation">
            <a
              href="#services"
              onClick={closeMobileMenu}
              className="block px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="View our services"
            >
              Services
            </a>
            <a
              href="#about"
              onClick={closeMobileMenu}
              className="block px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Learn about Integrated Value Solutions"
            >
              About
            </a>
            <a
              href="#testimonials"
              onClick={closeMobileMenu}
              className="block px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Read client testimonials"
            >
              Testimonials
            </a>
            <a
              href="#contact"
              onClick={closeMobileMenu}
              className="block px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Contact us for consultation"
            >
              Contact
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}


