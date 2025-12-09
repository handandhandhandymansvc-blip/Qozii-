import React, { useState } from 'react';
import { CheckCircle2, Send } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { submitQuote } from '../services/api';

const QuoteForm = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    service: '',
    timeline: '',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await submitQuote(formData);
      
      if (response.success) {
        toast({
          title: "Quote Request Received!",
          description: "We'll contact you within 24 hours via text and email.",
        });
        
        // Reset form
        setFormData({
          firstName: '',
          lastName: '',
          phone: '',
          email: '',
          service: '',
          timeline: '',
          description: ''
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit quote. Please call us at 214-900-6899.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="quote" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Get Your Free Quote
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Tell us about your project and we'll provide a detailed, no-obligation estimate. Most quotes provided within 24 hours!
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Form */}
          <div className="bg-white rounded-lg shadow-xl p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    First Name*
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#5C1A1A] focus:outline-none transition-colors"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Last Name*
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#5C1A1A] focus:outline-none transition-colors"
                    placeholder="Doe"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number*
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#5C1A1A] focus:outline-none transition-colors"
                  placeholder="(214) 900-6899"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#5C1A1A] focus:outline-none transition-colors"
                  placeholder="example@example.com"
                />
              </div>

              {/* Service Needed */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Service Needed*
                </label>
                <select
                  name="service"
                  required
                  value={formData.service}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#5C1A1A] focus:outline-none transition-colors"
                >
                  <option value="">Please Select</option>
                  <option value="Painting Services">Painting Services</option>
                  <option value="Carpentry & Woodwork">Carpentry & Woodwork</option>
                  <option value="Plumbing Repairs">Plumbing Repairs</option>
                  <option value="Electrical Work">Electrical Work</option>
                  <option value="Drywall & Patching">Drywall & Patching</option>
                  <option value="General Repairs">General Repairs</option>
                  <option value="Multiple Services">Multiple Services</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Timeline */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Timeline*
                </label>
                <select
                  name="timeline"
                  required
                  value={formData.timeline}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#5C1A1A] focus:outline-none transition-colors"
                >
                  <option value="">Please Select</option>
                  <option value="Emergency (Same day)">Emergency (Same day)</option>
                  <option value="Urgent (Within 3 days)">Urgent (Within 3 days)</option>
                  <option value="Normal (Within 1 week)">Normal (Within 1 week)</option>
                  <option value="Flexible (Within 2 weeks)">Flexible (Within 2 weeks)</option>
                  <option value="Future (1 Month+)">Future (1 Month+)</option>
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Project Description*
                </label>
                <textarea
                  name="description"
                  required
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  maxLength="500"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#5C1A1A] focus:outline-none transition-colors resize-none"
                  placeholder="Please describe your project..."
                ></textarea>
                <div className="text-right text-sm text-gray-500 mt-1">
                  {formData.description.length}/500
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-[#5C1A1A] to-[#7A1F1F] text-white py-4 rounded-lg font-bold text-lg hover:shadow-lg transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Get Free Quote
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Benefits */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-bold text-xl text-gray-900 mb-2">No Obligation</h3>
                  <p className="text-gray-600">
                    Free estimates with no pressure to buy
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-xl text-gray-900 mb-2">Fast Response</h3>
                  <p className="text-gray-600">
                    Most quotes provided within 24 hours
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-[#5C1A1A] to-[#7A1F1F] rounded-lg p-8 text-white">
              <h3 className="font-bold text-2xl mb-4">Prefer to Talk?</h3>
              <p className="text-red-100 mb-6">
                Give us a call and we'll discuss your project over the phone. We're here to answer all your questions!
              </p>
              <a
                href="tel:2149006899"
                className="inline-block bg-white text-[#5C1A1A] px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition-colors"
              >
                Call 214-900-6899
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuoteForm;
