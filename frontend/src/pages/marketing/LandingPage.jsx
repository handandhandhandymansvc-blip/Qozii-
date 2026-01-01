import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle, Users, Briefcase, DollarSign, Shield, Star, TrendingUp, Zap, Clock, Award, ChevronRight, Sparkles, Rocket, Globe, MessageCircle, Heart } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  const stats = [
    { value: '10K+', label: 'Jobs Posted', icon: Briefcase, gradient: 'from-purple-400 to-pink-500' },
    { value: '5K+', label: 'Trusted Pros', icon: Users, gradient: 'from-blue-400 to-cyan-500' },
    { value: '98%', label: 'Happy Customers', icon: Heart, gradient: 'from-orange-400 to-red-500' },
    { value: '$10', label: 'Per Lead', icon: DollarSign, gradient: 'from-green-400 to-emerald-500' },
  ];

  const services = [
    { name: 'Plumbing', icon: '🔧', gradient: 'from-blue-400 to-blue-600', jobs: '2.3k' },
    { name: 'Electrical', icon: '⚡', gradient: 'from-yellow-400 to-orange-500', jobs: '1.8k' },
    { name: 'Cleaning', icon: '✨', gradient: 'from-purple-400 to-pink-500', jobs: '3.1k' },
    { name: 'Painting', icon: '🎨', gradient: 'from-red-400 to-pink-500', jobs: '1.5k' },
    { name: 'HVAC', icon: '❄️', gradient: 'from-cyan-400 to-blue-500', jobs: '900' },
    { name: 'Landscaping', icon: '🌿', gradient: 'from-green-400 to-emerald-500', jobs: '1.2k' },
  ];

  const features = [
    {
      icon: Shield,
      title: 'Verified Pros',
      description: 'Background checked professionals',
      gradient: 'from-[#1C99A0] to-[#208FC3]',
      color: 'text-[#1C99A0]'
    },
    {
      icon: Zap,
      title: 'Instant Match',
      description: 'Connect in minutes, not days',
      gradient: 'from-yellow-400 to-orange-500',
      color: 'text-yellow-500'
    },
    {
      icon: DollarSign,
      title: 'Best Prices',
      description: 'Competitive rates you can trust',
      gradient: 'from-green-400 to-emerald-500',
      color: 'text-green-500'
    },
    {
      icon: Star,
      title: '5-Star Rated',
      description: 'Real reviews from real people',
      gradient: 'from-purple-400 to-pink-500',
      color: 'text-purple-500'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah M.',
      role: 'Homeowner',
      avatar: '👩🏽',
      rating: 5,
      text: 'Found a plumber in 20 mins! Super easy and affordable. 10/10 would recommend! 🔥',
      gradient: 'from-pink-400 to-rose-500'
    },
    {
      name: 'Mike T.',
      role: 'Electrician',
      avatar: '👨🏻',
      rating: 5,
      text: 'Best platform for pros! Quality leads and great pricing. My business has doubled! 💯',
      gradient: 'from-blue-400 to-cyan-500'
    },
    {
      name: 'Jennifer L.',
      role: 'Homeowner',
      avatar: '👩🏻',
      rating: 5,
      text: 'Love how everything is transparent. Got 5 quotes and picked the perfect pro! ✨',
      gradient: 'from-purple-400 to-pink-500'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation - Modern & Clean */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-xl border-b border-gray-100 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3">
              <img src="/qozii-logo.jpg" alt="Qozii" className="h-12 rounded-xl shadow-lg" />
              <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-[#1C99A0] to-[#208FC3] rounded-full">
                <Sparkles className="w-4 h-4 text-white" />
                <span className="text-white text-sm font-bold">Fresh 2025</span>
              </div>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              <a href="#services" className="text-gray-700 hover:text-[#1C99A0] transition-colors font-semibold">Services</a>
              <a href="#how-it-works" className="text-gray-700 hover:text-[#1C99A0] transition-colors font-semibold">How It Works</a>
              <a href="#pricing" className="text-gray-700 hover:text-[#1C99A0] transition-colors font-semibold">Pricing</a>
              <button
                onClick={() => navigate('/select')}
                className="px-6 py-2.5 bg-gradient-to-r from-[#1C99A0] to-[#208FC3] text-white rounded-full font-bold hover:shadow-xl hover:scale-105 transition-all"
              >
                Get Started 🚀
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Bold & Vibrant */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        {/* Background Gradient Blobs */}
        <div className="absolute top-20 right-0 w-96 h-96 bg-gradient-to-br from-[#1C99A0]/20 to-[#208FC3]/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-br from-purple-400/20 to-pink-500/20 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left - Hero Content */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full mb-6 border border-purple-200">
                <span className="text-2xl">🔥</span>
                <span className="font-bold text-purple-700">Trending in 2025</span>
              </div>
              
              <h1 className="text-6xl md:text-7xl font-black mb-6 leading-tight">
                <span className="text-gray-900">Find Your</span><br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1C99A0] via-purple-500 to-pink-500">
                  Perfect Pro
                </span>
                <span className="text-gray-900">.</span>
              </h1>
              
              <p className="text-2xl text-gray-600 mb-8 leading-relaxed font-medium">
                Connect with verified professionals in your area. Fast, easy, and 100% free! ✨
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button
                  onClick={() => navigate('/select')}
                  className="group relative px-8 py-5 bg-gradient-to-r from-[#1C99A0] to-[#208FC3] text-white rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all overflow-hidden"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    I Need A Pro
                    <Rocket className="w-6 h-6" />
                  </span>
                </button>
                
                <button
                  onClick={() => navigate('/select')}
                  className="px-8 py-5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
                >
                  I'm A Pro 💼
                </button>
              </div>

              {/* Quick Stats */}
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-gray-600 font-semibold">5K+ Pros Online</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-gray-600 font-semibold">100% Free</span>
                </div>
              </div>
            </div>

            {/* Right - Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="group relative bg-white rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all border-2 border-gray-100 hover:border-transparent hover:scale-105">
                    <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} rounded-3xl opacity-0 group-hover:opacity-10 transition-all`}></div>
                    <div className={`relative w-14 h-14 bg-gradient-to-br ${stat.gradient} rounded-2xl flex items-center justify-center mb-4 shadow-lg`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <p className={`text-4xl font-black mb-1 bg-gradient-to-br ${stat.gradient} bg-clip-text text-transparent`}>{stat.value}</p>
                    <p className="text-sm text-gray-600 font-semibold">{stat.label}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Popular Services - Vibrant Cards */}
      <section id="services" className="py-20 px-4 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-black mb-4 text-gray-900">
              Popular Services 🔥
            </h2>
            <p className="text-xl text-gray-600">Find pros for any job, any time</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {services.map((service, index) => (
              <button
                key={index}
                onClick={() => navigate('/select')}
                className="group relative bg-white rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all border-2 border-gray-100 hover:border-transparent hover:scale-105"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} rounded-3xl opacity-0 group-hover:opacity-100 transition-all`}></div>
                <div className="relative">
                  <div className="text-5xl mb-3">{service.icon}</div>
                  <h3 className="font-bold text-gray-900 group-hover:text-white transition-colors mb-1">{service.name}</h3>
                  <p className="text-xs text-gray-500 group-hover:text-white/80 transition-colors font-semibold">{service.jobs} jobs</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Features - Modern Cards */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-black mb-4 text-gray-900">
              Why <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1C99A0] to-[#208FC3]">Qozii</span>? 💯
            </h2>
            <p className="text-xl text-gray-600">We're different, and here's why</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="group relative bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all border-2 border-gray-100 hover:scale-105">
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} rounded-3xl opacity-0 group-hover:opacity-5 transition-all`}></div>
                  <div className="relative">
                    <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                      <Icon className="w-8 h-8 text-white" />
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
            <h2 className="text-5xl font-black mb-4 text-gray-900">How It Works ⚡</h2>
            <p className="text-xl text-gray-600">Get started in 3 simple steps</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '1', title: 'Post Your Job', desc: 'Tell us what you need - takes 2 minutes', icon: '📝', gradient: 'from-blue-400 to-cyan-500' },
              { step: '2', title: 'Get Quotes', desc: 'Receive offers from verified pros', icon: '💬', gradient: 'from-purple-400 to-pink-500' },
              { step: '3', title: 'Hire & Relax', desc: 'Choose your pro and get it done', icon: '✅', gradient: 'from-green-400 to-emerald-500' }
            ].map((item, index) => (
              <div key={index} className="relative group">
                <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-all`}></div>
                <div className="relative bg-white rounded-3xl p-8 shadow-xl border-2 border-gray-100 group-hover:scale-105 transition-all">
                  <div className="text-6xl mb-4">{item.icon}</div>
                  <div className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br ${item.gradient} rounded-full text-white font-black text-xl mb-4 shadow-lg`}>
                    {item.step}
                  </div>
                  <h3 className="text-2xl font-black mb-3 text-gray-900">{item.title}</h3>
                  <p className="text-gray-600 text-lg">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials - Fresh Style */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-black mb-4 text-gray-900">Real Talk 💬</h2>
            <p className="text-xl text-gray-600">What people are saying</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="group relative bg-white rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all border-2 border-gray-100 hover:scale-105">
                <div className={`absolute inset-0 bg-gradient-to-br ${testimonial.gradient} rounded-3xl opacity-0 group-hover:opacity-5 transition-all`}></div>
                <div className="relative">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-14 h-14 bg-gradient-to-br ${testimonial.gradient} rounded-full flex items-center justify-center text-2xl shadow-lg`}>
                      {testimonial.avatar}
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
                  <p className="text-gray-700 text-lg leading-relaxed">{testimonial.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Bold */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="relative bg-gradient-to-r from-[#1C99A0] via-purple-500 to-pink-500 rounded-3xl p-12 overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iI0ZGRiIgc3Ryb2tlLXdpZHRoPSIyIiBvcGFjaXR5PSIuMSIvPjwvZz48L3N2Zz4=')] opacity-20"></div>
            <div className="relative z-10 text-center text-white">
              <h2 className="text-5xl font-black mb-4">
                Ready to Get Started? 🚀
              </h2>
              <p className="text-2xl mb-8 opacity-90">
                Join thousands of happy customers and pros
              </p>
              <button
                onClick={() => navigate('/select')}
                className="px-12 py-5 bg-white text-[#1C99A0] rounded-2xl font-black text-xl shadow-2xl hover:scale-105 transition-all"
              >
                Let's Go! 💪
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer - Clean & Modern */}
      <footer className="border-t border-gray-200 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <img src="/qozii-logo.jpg" alt="Qozii" className="h-12 rounded-xl shadow-lg mb-4" />
              <p className="text-gray-600">The freshest way to find home services. 🔥</p>
            </div>
            <div>
              <h4 className="font-black mb-4 text-[#1C99A0]">For Customers</h4>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:text-[#1C99A0] transition-colors">Post a Job</a></li>
                <li><a href="#" className="hover:text-[#1C99A0] transition-colors">Find Pros</a></li>
                <li><a href="#" className="hover:text-[#1C99A0] transition-colors">How It Works</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-black mb-4 text-[#1C99A0]">For Professionals</h4>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:text-[#1C99A0] transition-colors">Join as a Pro</a></li>
                <li><a href="#" className="hover:text-[#1C99A0] transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-[#1C99A0] transition-colors">Success Stories</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-black mb-4 text-[#1C99A0]">Company</h4>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:text-[#1C99A0] transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-[#1C99A0] transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-[#1C99A0] transition-colors">Privacy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 pt-8 text-center">
            <p className="text-gray-600">© 2025 Qozii. Fresh to death. All rights reserved. 💯</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
