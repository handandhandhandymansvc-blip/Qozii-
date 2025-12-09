import React from 'react';
import { Wrench, Lightbulb, Hammer, Paintbrush, Home, Settings } from 'lucide-react';

const services = [
  {
    icon: Wrench,
    title: 'Plumbing Repairs',
    description: 'Leak repairs, fixture installation, drain cleaning, and emergency plumbing services.',
    features: ['Leak Repairs', 'Fixture Installation', 'Drain Cleaning', 'Emergency Service']
  },
  {
    icon: Lightbulb,
    title: 'Electrical Work',
    description: 'Safe electrical repairs, outlet installation, lighting fixtures, and electrical troubleshooting.',
    features: ['Outlet Installation', 'Light Fixtures', 'Switch Repair', 'Troubleshooting']
  },
  {
    icon: Hammer,
    title: 'Carpentry & Woodwork',
    description: 'Custom carpentry, trim work, cabinet installation, and furniture repairs by skilled craftsmen.',
    features: ['Custom Carpentry', 'Trim Installation', 'Cabinet Work', 'Furniture Repair']
  },
  {
    icon: Paintbrush,
    title: 'Painting Services',
    description: 'Interior and exterior painting, color consultation, and surface preparation for lasting results.',
    features: ['Interior Painting', 'Exterior Painting', 'Color Consultation', 'Surface Prep']
  },
  {
    icon: Home,
    title: 'Drywall & Patching',
    description: 'Drywall repair, hole patching, texture matching, and professional finishing work.',
    features: ['Hole Repair', 'Texture Matching', 'Professional Finish', 'Large Patches']
  },
  {
    icon: Settings,
    title: 'General Repairs',
    description: 'Door repairs, window fixes, hardware installation, and various household maintenance tasks.',
    features: ['Door Repairs', 'Window Fixes', 'Hardware Install', 'Maintenance']
  }
];

const Services = () => {
  const scrollToQuote = () => {
    const element = document.getElementById('quote');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="services" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Our Professional Services
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From small repairs to major projects, we handle it all with expertise and attention to detail. Licensed, insured, and committed to quality craftsmanship.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group hover:-translate-y-2"
              >
                <div className="p-8">
                  {/* Icon */}
                  <div className="w-16 h-16 bg-gradient-to-br from-[#5C1A1A] to-[#7A1F1F] rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-8 h-8 text-white" />
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {service.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 mb-6">
                    {service.description}
                  </p>

                  {/* Features */}
                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-gray-700">
                        <span className="w-2 h-2 bg-[#5C1A1A] rounded-full mr-3"></span>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <button
                    onClick={scrollToQuote}
                    className="w-full bg-gradient-to-r from-[#5C1A1A] to-[#7A1F1F] text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
                  >
                    Get Quote
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <a
            href="tel:2149006899"
            className="inline-flex items-center gap-2 text-[#5C1A1A] font-semibold text-lg hover:text-[#7A1F1F] transition-colors"
          >
            Talk with us →
          </a>
        </div>
      </div>
    </section>
  );
};

export default Services;
