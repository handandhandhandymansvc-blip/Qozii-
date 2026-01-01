import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle, Users, Briefcase, DollarSign, Shield, Star, TrendingUp, Zap, Clock, Award, ChevronRight, Sparkles, Rocket, Globe, MessageCircle, Heart, Wrench, Lightbulb, Droplet, Paintbrush, Wind, Leaf } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  const stats = [
    { value: '10,000+', label: 'Jobs Completed', icon: Briefcase, gradient: 'from-purple-500 to-purple-600' },
    { value: '5,000+', label: 'Verified Professionals', icon: Users, gradient: 'from-blue-500 to-cyan-500' },
    { value: '98%', label: 'Satisfaction Rate', icon: Star, gradient: 'from-orange-500 to-red-500' },
    { value: '$10', label: 'Cost Per Lead', icon: DollarSign, gradient: 'from-green-500 to-emerald-600' },
  ];

  const services = [
    { name: 'Plumbing', icon: Droplet, gradient: 'from-blue-500 to-blue-600', jobs: '2,345' },
    { name: 'Electrical', icon: Zap, gradient: 'from-yellow-500 to-orange-500', jobs: '1,876' },
    { name: 'Cleaning', icon: Sparkles, gradient: 'from-purple-500 to-pink-500', jobs: '3,102' },
    { name: 'Painting', icon: Paintbrush, gradient: 'from-red-500 to-pink-500', jobs: '1,543' },
    { name: 'HVAC', icon: Wind, gradient: 'from-cyan-500 to-blue-600', jobs: '987' },
    { name: 'Landscaping', icon: Leaf, gradient: 'from-green-500 to-emerald-600', jobs: '1,234' },
  ];

  const features = [
    {
      icon: Shield,
      title: 'Verified Professionals',
      description: 'All professionals are background checked and verified for your peace of mind',
      gradient: 'from-[#1C99A0] to-[#208FC3]'
    },
    {
      icon: Zap,
      title: 'Instant Matching',
      description: 'Get connected with qualified professionals in minutes, not days',
      gradient: 'from-yellow-500 to-orange-500'
    },
    {
      icon: DollarSign,
      title: 'Competitive Pricing',
      description: 'Compare multiple quotes and choose the best value for your project',
      gradient: 'from-green-500 to-emerald-600'
    },
    {
      icon: Star,
      title: 'Quality Guaranteed',
      description: 'Read verified reviews and ratings from real customers',
      gradient: 'from-purple-500 to-pink-500'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Mitchell',
      role: 'Homeowner',
      initials: 'SM',
      rating: 5,
      text: 'Found an excellent plumber within 20 minutes. The entire process was smooth and professional. Highly recommend!',
      gradient: 'from-pink-500 to-rose-500'
    },
    {
      name: 'Michael Torres',
      role: 'Licensed Electrician',
      initials: 'MT',
      rating: 5,
      text: 'The best platform for finding quality leads. My business has grown significantly since joining Qozii.',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      name: 'Jennifer Lee',
      role: 'Homeowner',
      initials: 'JL',
      rating: 5,
      text: 'Transparent pricing and professional service. Got 5 quotes and hired the perfect contractor for my renovation.',
      gradient: 'from-purple-500 to-pink-500'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-xl border-b border-gray-200 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3">
              <img src="/qozii-logo.jpg" alt="Qozii" className="h-12 rounded-xl shadow-md" />
              <div className="hidden md:block text-sm text-gray-600 font-medium">
                Professional Services Marketplace
              </div>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              <a href="#services" className="text-gray-700 hover:text-[#1C99A0] transition-colors font-semibold">Services</a>
              <a href="#how-it-works" className="text-gray-700 hover:text-[#1C99A0] transition-colors font-semibold">How It Works</a>
              <a href="#pricing" className="text-gray-700 hover:text-[#1C99A0] transition-colors font-semibold">Pricing</a>
              <button
                onClick={() => navigate('/select')}
                className="px-6 py-2.5 bg-gradient-to-r from-[#1C99A0] to-[#208FC3] text-white rounded-full font-bold hover:shadow-lg hover:scale-105 transition-all"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute top-20 right-0 w-96 h-96 bg-gradient-to-br from-[#1C99A0]/10 to-[#208FC3]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left - Hero Content */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#1C99A0]/10 to-[#208FC3]/10 rounded-full mb-6 border border-[#1C99A0]/20">
                <Sparkles className="w-4 h-4 text-[#1C99A0]" />
                <span className="font-semibold text-[#1C99A0]">New in 2025</span>
              </div>
              
              <h1 className="text-6xl md:text-7xl font-black mb-6 leading-tight">
                <span className="text-gray-900">Connect With</span><br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1C99A0] via-purple-500 to-pink-500">
                  Top Professionals
                </span>
              </h1>
              
              <p className="text-2xl text-gray-600 mb-8 leading-relaxed">
                Find verified professionals for any home service. Fast, reliable, and completely free for customers.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button
                  onClick={() => navigate('/select')}
                  className="group px-8 py-4 bg-gradient-to-r from-[#1C99A0] to-[#208FC3] text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2"
                >
                  Find A Professional
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                
                <button
                  onClick={() => navigate('/select')}
                  className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                >
                  Join as a Professional
                </button>
              </div>

              {/* Quick Info */}
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-gray-600 font-medium">5,000+ Verified Pros</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-[#1C99A0]" />
                  <span className="text-gray-600 font-medium">100% Free for Customers</span>
                </div>
              </div>
            </div>

            {/* Right - Stats Grid */}
            <div className="grid grid-cols-2 gap-5">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-gray-100 hover:border-transparent hover:scale-105">
                    <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} rounded-2xl opacity-0 group-hover:opacity-5 transition-all`}></div>
                    <div className={`relative w-12 h-12 bg-gradient-to-br ${stat.gradient} rounded-xl flex items-center justify-center mb-4 shadow-md`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <p className={`text-3xl font-black mb-1 bg-gradient-to-br ${stat.gradient} bg-clip-text text-transparent`}>{stat.value}</p>
                    <p className="text-sm text-gray-600 font-medium">{stat.label}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Popular Services */}
      <section id="services" className="py-20 px-4 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-black mb-4 text-gray-900">
              Popular Services
            </h2>
            <p className="text-xl text-gray-600">Browse professionals by category</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <button
                  key={index}
                  onClick={() => navigate('/select')}
                  className="group relative bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all border border-gray-100 hover:border-transparent hover:scale-105"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} rounded-2xl opacity-0 group-hover:opacity-100 transition-all`}></div>
                  <div className="relative">
                    <div className={`w-12 h-12 bg-gradient-to-br ${service.gradient} rounded-xl flex items-center justify-center mb-3 mx-auto shadow-md group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-bold text-gray-900 group-hover:text-white transition-colors mb-1">{service.name}</h3>
                    <p className="text-xs text-gray-500 group-hover:text-white/80 transition-colors font-medium">{service.jobs} available</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-black mb-4">
              <span className="text-gray-900">Why Choose </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1C99A0] to-[#208FC3]">Qozii</span>
            </h2>
            <p className="text-xl text-gray-600">The smarter way to find home services</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all border border-gray-100 hover:scale-105">
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} rounded-2xl opacity-0 group-hover:opacity-5 transition-all`}></div>
                  <div className="relative">
                    <div className={`w-14 h-14 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-gray-900">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-black mb-4 text-gray-900">How It Works</h2>
            <p className="text-xl text-gray-600">Get started in three simple steps</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '1', title: 'Post Your Job', desc: 'Describe your project in detail - it only takes 2 minutes', icon: Briefcase, gradient: 'from-blue-500 to-cyan-500' },
              { step: '2', title: 'Review Quotes', desc: 'Receive competitive quotes from verified professionals', icon: MessageCircle, gradient: 'from-purple-500 to-pink-500' },
              { step: '3', title: 'Hire with Confidence', desc: 'Choose the best professional and complete your project', icon: CheckCircle, gradient: 'from-green-500 to-emerald-600' }
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="relative group">
                  <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-all`}></div>
                  <div className="relative bg-white rounded-2xl p-8 shadow-lg border border-gray-100 group-hover:scale-105 transition-all">
                    <div className={`w-16 h-16 bg-gradient-to-br ${item.gradient} rounded-xl flex items-center justify-center mb-4 mx-auto shadow-md`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <div className={`inline-flex items-center justify-center w-10 h-10 bg-gradient-to-br ${item.gradient} rounded-full text-white font-black text-lg mb-4 shadow-md`}>
                      {item.step}
                    </div>
                    <h3 className="text-2xl font-black mb-3 text-gray-900">{item.title}</h3>
                    <p className="text-gray-600 text-lg leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-black mb-4 text-gray-900">Customer Reviews</h2>
            <p className="text-xl text-gray-600">See what our users have to say</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-gray-100 hover:scale-105">
                <div className={`absolute inset-0 bg-gradient-to-br ${testimonial.gradient} rounded-2xl opacity-0 group-hover:opacity-5 transition-all`}></div>
                <div className="relative">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${testimonial.gradient} rounded-full flex items-center justify-center shadow-md`}>
                      <span className="font-bold text-white">{testimonial.initials}</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                      <p className="text-sm text-gray-500">{testimonial.role}</p>
                    </div>
                  </div>
                  <div className="flex gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 leading-relaxed">{testimonial.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="relative bg-gradient-to-r from-[#1C99A0] via-purple-500 to-pink-500 rounded-3xl p-12 overflow-hidden shadow-2xl">
            <div className="relative z-10 text-center text-white">
              <h2 className="text-5xl font-black mb-4">
                Ready to Get Started?
              </h2>
              <p className="text-2xl mb-8 opacity-90">
                Join thousands of satisfied customers and professionals
              </p>
              <button
                onClick={() => navigate('/select')}
                className="px-10 py-4 bg-white text-[#1C99A0] rounded-xl font-black text-xl shadow-xl hover:scale-105 transition-all"
              >
                Get Started Today
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-12 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <img src="/qozii-logo.jpg" alt="Qozii" className="h-12 rounded-xl shadow-md mb-4" />
              <p className="text-gray-600">Professional services marketplace connecting customers with verified professionals.</p>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-[#1C99A0]">For Customers</h4>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:text-[#1C99A0] transition-colors">Post a Job</a></li>
                <li><a href="#" className="hover:text-[#1C99A0] transition-colors">Find Professionals</a></li>
                <li><a href="#" className="hover:text-[#1C99A0] transition-colors">How It Works</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-[#1C99A0]">For Professionals</h4>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:text-[#1C99A0] transition-colors">Join as a Pro</a></li>
                <li><a href="#" className="hover:text-[#1C99A0] transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-[#1C99A0] transition-colors">Success Stories</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-[#1C99A0]">Company</h4>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:text-[#1C99A0] transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-[#1C99A0] transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-[#1C99A0] transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-300 pt-8 text-center">
            <p className="text-gray-600">© 2025 Qozii. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
