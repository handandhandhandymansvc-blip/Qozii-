import React from 'react';
import { Award, Shield, DollarSign, CheckCircle, Clock } from 'lucide-react';

const reasons = [
  {
    icon: Award,
    title: '15+ years of professional experience',
    color: 'from-blue-500 to-blue-600'
  },
  {
    icon: Shield,
    title: 'Licensed and fully insured',
    color: 'from-green-500 to-green-600'
  },
  {
    icon: DollarSign,
    title: 'Honest pricing with no hidden fees',
    color: 'from-yellow-500 to-yellow-600'
  },
  {
    icon: CheckCircle,
    title: 'Quality workmanship guaranteed',
    color: 'from-purple-500 to-purple-600'
  },
  {
    icon: Clock,
    title: 'Same-day emergency service available',
    color: 'from-red-500 to-red-600'
  }
];

const WhyChooseUs = () => {
  return (
    <section id="why-choose-us" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Why Choose Hand & Hand?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We stand behind our work with a 100% satisfaction guarantee. If you're not completely happy with our service, we'll make it right.
          </p>
        </div>

        {/* Reasons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
          {reasons.map((reason, index) => {
            const Icon = reason.icon;
            return (
              <div
                key={index}
                className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-[#5C1A1A] transition-all duration-300 hover:shadow-lg group"
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${reason.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <p className="text-gray-800 font-semibold leading-tight">
                  {reason.title}
                </p>
              </div>
            );
          })}
        </div>

        {/* Guarantee Section */}
        <div className="bg-gradient-to-r from-[#5C1A1A] to-[#7A1F1F] rounded-lg p-8 md:p-12 text-white text-center">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-3xl font-bold mb-4">Customer Satisfaction Guarantee</h3>
            <p className="text-xl text-red-100 mb-6">
              We stand behind our work with a 100% satisfaction guarantee. If you're not completely happy with our service, we'll make it right.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:2149006899"
                className="bg-white text-[#5C1A1A] px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition-all duration-300 hover:scale-105"
              >
                Call 214-900-6899
              </a>
              <a
                href="sms:2149006899"
                className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-full font-bold hover:bg-white hover:text-[#5C1A1A] transition-all duration-300 hover:scale-105"
              >
                Text Us
              </a>
            </div>
          </div>
        </div>

        {/* Emergency Service Banner */}
        <div className="mt-12 bg-gray-50 rounded-lg p-8 border-2 border-dashed border-gray-300">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Emergency Service</h3>
              <p className="text-gray-600">
                Need immediate assistance? We offer 24/7 emergency handyman services for urgent repairs that can't wait until regular business hours.
              </p>
            </div>
            <a
              href="tel:2149006899"
              className="bg-gradient-to-r from-[#5C1A1A] to-[#7A1F1F] text-white px-8 py-3 rounded-full font-bold hover:shadow-lg transition-all whitespace-nowrap"
            >
              Emergency Call: 214-900-6899
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
