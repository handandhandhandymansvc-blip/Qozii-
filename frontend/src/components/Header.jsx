import React, { useState, useEffect } from 'react';
import { Phone, Menu, X } from 'lucide-react';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'shadow-lg' : ''}`}>
      {/* Top Navigation Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-end items-center py-3">
            <nav className="hidden md:flex space-x-8 text-sm">
              <button onClick={() => scrollToSection('home')} className="text-gray-600 hover:text-gray-900 transition-colors">
                Home
              </button>
              <button onClick={() => scrollToSection('services')} className="text-gray-600 hover:text-gray-900 transition-colors">
                Services
              </button>
              <button onClick={() => scrollToSection('service-areas')} className="text-gray-600 hover:text-gray-900 transition-colors">
                Service Areas
              </button>
              <button onClick={() => scrollToSection('quote')} className="text-gray-600 hover:text-gray-900 transition-colors">
                Get Quote
              </button>
              <button onClick={() => scrollToSection('contact')} className="text-gray-600 hover:text-gray-900 transition-colors">
                Contact Us
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="bg-gradient-to-r from-[#5C1A1A] via-[#7A1F1F] to-[#5C1A1A] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3">
            {/* Logo */}
            <div className="flex items-center bg-[#5C1A1A]/30 px-3 py-2 rounded-lg backdrop-blur-sm">
              <img 
                src="/logo.jpg" 
                alt="Hand & Hand Handyman Service" 
                className="h-20 w-auto object-contain mix-blend-lighten"
              />
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-6">
              <button onClick={() => scrollToSection('services')} className="hover:text-gray-200 transition-colors font-medium">
                Services
              </button>
              <button onClick={() => scrollToSection('service-areas')} className="hover:text-gray-200 transition-colors font-medium">
                Service Areas
              </button>
              <button onClick={() => scrollToSection('why-choose-us')} className="hover:text-gray-200 transition-colors font-medium">
                Why Choose Us
              </button>
              <button onClick={() => scrollToSection('quote')} className="hover:text-gray-200 transition-colors font-medium">
                Get Quote
              </button>
              <button onClick={() => scrollToSection('contact')} className="hover:text-gray-200 transition-colors font-medium">
                Contact
              </button>
              <a
                href="sms:2149006899"
                className="bg-white text-[#5C1A1A] px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-lg"
              >
                Text 214-900-6899
              </a>
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-gradient-to-r from-[#5C1A1A] via-[#7A1F1F] to-[#5C1A1A] text-white border-t border-[#4A1515]">
          <nav className="max-w-7xl mx-auto px-4 py-4 space-y-3">
            <button onClick={() => scrollToSection('services')} className="block w-full text-left py-2 hover:text-gray-200">
              Services
            </button>
            <button onClick={() => scrollToSection('service-areas')} className="block w-full text-left py-2 hover:text-gray-200">
              Service Areas
            </button>
            <button onClick={() => scrollToSection('why-choose-us')} className="block w-full text-left py-2 hover:text-gray-200">
              Why Choose Us
            </button>
            <button onClick={() => scrollToSection('quote')} className="block w-full text-left py-2 hover:text-gray-200">
              Get Quote
            </button>
            <button onClick={() => scrollToSection('contact')} className="block w-full text-left py-2 hover:text-gray-200">
              Contact
            </button>
            <a
              href="sms:2149006899"
              className="block w-full bg-white text-[#5C1A1A] text-center px-6 py-2 rounded-full font-semibold"
            >
              Text 214-900-6899
            </a>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
