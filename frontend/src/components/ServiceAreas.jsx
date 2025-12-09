import React from 'react';
import { MapPin, Clock } from 'lucide-react';

const cities = [
  { name: 'Forney', distance: 'Primary Service Area', highlight: true },
  { name: 'Fate', distance: '8 miles' },
  { name: 'Mesquite', distance: '10 miles' },
  { name: 'Rockwall', distance: '12 miles' },
  { name: 'Seagoville', distance: '14 miles' },
  { name: 'Terrell', distance: '15 miles' },
  { name: 'Sunnyvale', distance: '16 miles' },
  { name: 'Balch Springs', distance: '18 miles' },
  { name: 'Crandall', distance: '19 miles' },
  { name: 'Kaufman', distance: '22 miles' },
  { name: 'Royce City', distance: '25 miles' },
  { name: 'Combine', distance: '20 miles' }
];

const ServiceAreas = () => {
  return (
    <section id="service-areas" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center bg-gradient-to-r from-[#5C1A1A] to-[#7A1F1F] text-white rounded-full px-8 py-3 mb-6 shadow-lg">
            <div className="text-center">
              <div className="text-4xl font-bold">25+</div>
              <div className="text-sm font-semibold">Mile Radius</div>
            </div>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Service Areas
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We proudly serve Forney, TX and the surrounding Dallas-Fort Worth communities. Fast response times and reliable service throughout the region.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Map */}
          <div className="relative rounded-lg overflow-hidden shadow-xl">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d107318.26547891697!2d-96.54175468193357!3d32.746201999999996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x864ea0b1eb4d7c5b%3A0x7c8c2a3f3a3b3c3d!2sForney%2C%20TX!5e0!3m2!1sen!2sus!4v1234567890123!5m2!1sen!2sus"
              width="100%"
              height="500"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-[500px]"
            ></iframe>
          </div>

          {/* Cities List */}
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {cities.map((city, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-2 transition-all duration-300 hover:shadow-md ${
                    city.highlight
                      ? 'bg-gradient-to-r from-[#5C1A1A] to-[#7A1F1F] text-white border-[#5C1A1A]'
                      : 'bg-white border-gray-200 hover:border-[#5C1A1A]'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-bold text-lg">{city.name}</div>
                      <div className={`text-sm ${city.highlight ? 'text-red-100' : 'text-gray-500'}`}>
                        {city.distance}
                      </div>
                    </div>
                    <MapPin className={`w-5 h-5 ${city.highlight ? 'text-white' : 'text-[#5C1A1A]'}`} />
                  </div>
                </div>
              ))}
            </div>

            {/* Fast Response Badge */}
            <div className="bg-gradient-to-r from-[#5C1A1A] to-[#7A1F1F] rounded-lg p-6 text-white shadow-lg">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-2">Fast Response Time</h3>
                  <p className="text-red-100 mb-3">
                    Same-day service available for emergency repairs. We understand that some home repairs can't wait!
                  </p>
                  <a
                    href="tel:2149006899"
                    className="inline-block bg-white text-[#5C1A1A] px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition-colors"
                  >
                    Call now for immediate assistance
                  </a>
                </div>
              </div>
            </div>

            {/* Don't See Your Area */}
            <div className="mt-8 p-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <h3 className="font-bold text-xl text-gray-900 mb-2">
                Don't See Your Area Listed?
              </h3>
              <p className="text-gray-600 mb-4">
                We may still be able to help! Contact us to discuss your project and location. We're always looking to expand our service area for the right projects.
              </p>
              <a
                href="tel:2149006899"
                className="inline-block text-[#5C1A1A] font-semibold hover:text-[#7A1F1F] transition-colors"
              >
                Call to Check 214-900-6899 →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceAreas;
