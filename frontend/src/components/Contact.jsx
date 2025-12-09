import React from 'react';
import { Phone, Mail, MapPin, Clock, MessageSquare } from 'lucide-react';

const Contact = () => {
  return (
    <section id="contact" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Contact Us Today
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Ready to get started on your project? We're here to help with all your handyman needs. Contact us today for fast, reliable service.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Get In Touch</h3>
            
            {/* Phone */}
            <div className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#5C1A1A] to-[#7A1F1F] rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-700 mb-1">Phone</div>
                  <a
                    href="tel:2149006899"
                    className="text-2xl font-bold text-[#5C1A1A] hover:text-[#7A1F1F] transition-colors"
                  >
                    214-900-6899
                  </a>
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-700 mb-1">Email</div>
                  <a
                    href="mailto:handandhandhandymansvc@gmail.com"
                    className="text-lg font-semibold text-[#5C1A1A] hover:text-[#7A1F1F] transition-colors break-all"
                  >
                    handandhandhandymansvc@gmail.com
                  </a>
                </div>
              </div>
            </div>

            {/* Service Area */}
            <div className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-700 mb-1">Service Area</div>
                  <div className="text-lg text-gray-900">
                    Forney, TX & Surrounding Areas
                  </div>
                </div>
              </div>
            </div>

            {/* Business Hours */}
            <div className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-700 mb-1">Business Hours</div>
                  <div className="text-gray-900">
                    <div>Monday - Saturday: 8:00 AM - 6:00 PM</div>
                    <div className="text-sm text-gray-600 mt-1">Emergency services available 24/7</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Cards */}
          <div className="space-y-6">
            {/* Call CTA */}
            <div className="bg-gradient-to-r from-[#5C1A1A] to-[#7A1F1F] rounded-lg p-8 text-white">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-16 h-16 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">Call Us Now</h3>
                  <p className="text-red-100">
                    Speak directly with our team. We're ready to answer your questions and schedule your service.
                  </p>
                </div>
              </div>
              <a
                href="tel:2149006899"
                className="block w-full bg-white text-[#5C1A1A] text-center px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-colors"
              >
                Call 214-900-6899
              </a>
            </div>

            {/* Text CTA */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-8 text-white">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-16 h-16 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">Text Us</h3>
                  <p className="text-blue-100">
                    Prefer texting? Send us a message and we'll respond quickly with the information you need.
                  </p>
                </div>
              </div>
              <a
                href="sms:2149006899"
                className="block w-full bg-white text-blue-600 text-center px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-colors"
              >
                Text 214-900-6899
              </a>
            </div>

            {/* Email CTA */}
            <div className="bg-white rounded-lg p-8 border-2 border-gray-200">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-gray-600 to-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Email Us</h3>
                  <p className="text-gray-600">
                    Send us a detailed message about your project and we'll get back to you promptly.
                  </p>
                </div>
              </div>
              <a
                href="mailto:handandhandhandymansvc@gmail.com"
                className="block w-full bg-gradient-to-r from-[#5C1A1A] to-[#7A1F1F] text-white text-center px-8 py-4 rounded-full font-bold text-lg hover:shadow-lg transition-all"
              >
                Send Email
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
