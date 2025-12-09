import React from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';

const Footer = () => {
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <div className="mb-4 bg-[#5C1A1A]/30 inline-block px-3 py-2 rounded-lg">
              <img 
                src="/logo.jpg" 
                alt="Hand & Hand Handyman Service" 
                className="h-24 w-auto object-contain mix-blend-lighten"
              />
            </div>
            <p className="text-gray-400 mb-4">
              Professional repairs, honest work, and reliable service in Forney, TX and surrounding areas.
            </p>
            <div className="flex gap-4">
              <a
                href="tel:2149006899"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-[#5C1A1A] transition-colors"
              >
                <Phone className="w-5 h-5" />
              </a>
              <a
                href="mailto:handandhandhandymansvc@gmail.com"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-[#5C1A1A] transition-colors"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <button onClick={() => scrollToSection('home')} className="text-gray-400 hover:text-white transition-colors">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('services')} className="text-gray-400 hover:text-white transition-colors">
                  Services
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('service-areas')} className="text-gray-400 hover:text-white transition-colors">
                  Service Areas
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('quote')} className="text-gray-400 hover:text-white transition-colors">
                  Get Quote
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('contact')} className="text-gray-400 hover:text-white transition-colors">
                  Contact
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-4">Contact Info</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-[#7A1F1F] mt-1 flex-shrink-0" />
                <div>
                  <div className="text-gray-400 text-sm">Phone</div>
                  <a href="tel:2149006899" className="text-white hover:text-[#7A1F1F] transition-colors">
                    214-900-6899
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-[#7A1F1F] mt-1 flex-shrink-0" />
                <div>
                  <div className="text-gray-400 text-sm">Email</div>
                  <a href="mailto:handandhandhandymansvc@gmail.com" className="text-white hover:text-[#7A1F1F] transition-colors break-all">
                    handandhandhandymansvc@gmail.com
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#7A1F1F] mt-1 flex-shrink-0" />
                <div>
                  <div className="text-gray-400 text-sm">Service Area</div>
                  <div className="text-white">Forney, TX & Surrounding Areas</div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400 text-sm">
          <p>© {new Date().getFullYear()} Hand & Hand Handyman Service. All rights reserved.</p>
          <p className="mt-2">Licensed, Insured & Committed to Quality Craftsmanship</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
