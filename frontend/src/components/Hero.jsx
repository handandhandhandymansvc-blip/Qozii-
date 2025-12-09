import React from 'react';
import { Phone } from 'lucide-react';

const Hero = () => {
  const scrollToQuote = () => {
    const element = document.getElementById('quote');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-32">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1505798577917-a65157d3320a?q=80&w=2000)',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-[#5C1A1A]/60 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Experience Badge */}
        <div className="inline-flex items-center justify-center bg-white/95 rounded-full px-8 py-3 mb-8 shadow-lg backdrop-blur-sm">
          <div className="text-center">
            <div className="text-4xl font-bold text-[#5C1A1A]">15+</div>
            <div className="text-sm text-gray-700 font-semibold">Years Experience</div>
          </div>
        </div>

        {/* Main Heading */}
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
          Your Trusted Handyman<br />
          <span className="text-[#DC2626]">One Call Away!</span>
        </h1>

        {/* Subheading */}
        <p className="text-xl md:text-2xl text-white mb-12 max-w-3xl mx-auto font-medium drop-shadow-md">
          Professional repairs, honest work, and reliable service in Forney, TX and surrounding areas.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a
            href="tel:2149006899"
            className="group bg-white text-[#5C1A1A] px-8 py-4 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 flex items-center gap-2"
          >
            <Phone className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            Call Now: 214-900-6899
          </a>
          <button
            onClick={scrollToQuote}
            className="bg-gradient-to-r from-[#5C1A1A] to-[#7A1F1F] text-white px-8 py-4 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
          >
            Get Free Quote*
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
