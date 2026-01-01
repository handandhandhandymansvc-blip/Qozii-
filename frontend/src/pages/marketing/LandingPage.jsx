import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle, Users, Briefcase, DollarSign, Shield, Star, TrendingUp, Zap, Clock, Award, ChevronRight, Sparkles, Rocket, Globe } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  const stats = [
    { value: '10,000+', label: 'Jobs Posted', icon: Briefcase },
    { value: '5,000+', label: 'Trusted Pros', icon: Users },
    { value: '98%', label: 'Satisfaction Rate', icon: Star },
    { value: '$10', label: 'Cost Per Lead', icon: DollarSign },
  ];

  const features = [
    {
      icon: Shield,
      title: 'Verified Professionals',
      description: 'All pros are background checked and verified for your safety',
      gradient: 'from-[#1C99A0] to-[#208FC3]'
    },
    {
      icon: Zap,
      title: 'Instant Matching',
      description: 'Get connected with qualified pros in minutes, not days',
      gradient: 'from-[#208FC3] to-[#1C99A0]'
    },
    {
      icon: DollarSign,
      title: 'Best Value Pricing',
      description: 'Competitive pricing means more savings for everyone',
      gradient: 'from-[#1C99A0] via-[#208FC3] to-[#1C99A0]'
    },
    {
      icon: Sparkles,
      title: 'Quality Guaranteed',
      description: 'Read reviews and ratings from real customers',
      gradient: 'from-[#208FC3] to-[#1C99A0]'
    }
  ];

  const howItWorksCustomer = [
    { step: 1, title: 'Post Your Job', description: 'Describe what you need done - free and takes 2 minutes', icon: Rocket },
    { step: 2, title: 'Get Quotes', description: 'Receive competitive quotes from qualified pros', icon: Star },
    { step: 3, title: 'Hire & Review', description: 'Choose the best pro and get the job done', icon: CheckCircle }
  ];

  const howItWorksPro = [
    { step: 1, title: 'Create Profile', description: 'Showcase your skills and experience', icon: Users },
    { step: 2, title: 'Buy Credits', description: 'Get affordable leads with flexible credit packages', icon: DollarSign },
    { step: 3, title: 'Grow Business', description: 'Win jobs and build your reputation', icon: TrendingUp }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Homeowner',
      initials: 'SJ',
      gradient: 'from-[#1C99A0] to-[#208FC3]',
      rating: 5,
      text: 'Found an amazing plumber in under an hour! The process was smooth and the quality was outstanding.'
    },
    {
      name: 'Mike Davis',
      role: 'Electrician',
      initials: 'MD',
      gradient: 'from-[#208FC3] to-[#1C99A0]',
      rating: 5,
      text: 'Best decision for my business! The lead quality is excellent and pricing is very competitive.'
    },
    {
      name: 'Jennifer Lee',
      role: 'Homeowner',
      initials: 'JL',
      gradient: 'from-[#1C99A0] via-[#208FC3] to-[#1C99A0]',
      rating: 5,
      text: 'Completely free for customers and I got 5 quotes in 24 hours. The pros are professional and reasonably priced.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#0A0E27] text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#1C99A0] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-[#208FC3] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-[#1C99A0] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-[#0A0E27]/80 backdrop-blur-xl border-b border-[#1C99A0]/20 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3">
              <img src="/qozii-logo.jpg" alt="Qozii" className="h-14 rounded-lg" />
              <div className="hidden md:block">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1C99A0] to-[#208FC3] font-bold text-lg">
                  Next-Gen Services
                </span>
              </div>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              <a href="#how-it-works" className="text-gray-300 hover:text-[#1C99A0] transition-colors font-medium">How It Works</a>
              <a href="#pricing" className="text-gray-300 hover:text-[#1C99A0] transition-colors font-medium">Pricing</a>
              <a href="#testimonials" className="text-gray-300 hover:text-[#1C99A0] transition-colors font-medium">Reviews</a>
              <button
                onClick={() => navigate('/select')}
                className="px-6 py-2.5 bg-gradient-to-r from-[#1C99A0] to-[#208FC3] rounded-full font-bold hover:shadow-lg hover:shadow-[#1C99A0]/50 transition-all transform hover:scale-105"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#1C99A0]/20 to-[#208FC3]/20 backdrop-blur-sm border border-[#1C99A0]/30 rounded-full text-sm font-semibold mb-6">
                <Sparkles className="w-4 h-4 text-[#1C99A0]" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1C99A0] to-[#208FC3]">
                  The Future of Home Services
                </span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
                <span className="text-white">Connect With</span>{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1C99A0] via-[#208FC3] to-[#1C99A0] animate-gradient">
                  Elite Professionals
                </span>
              </h1>
              
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Experience the next generation of home services. Powered by innovation, driven by excellence.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button
                  onClick={() => navigate('/select')}
                  className="group relative px-8 py-4 bg-gradient-to-r from-[#1C99A0] to-[#208FC3] rounded-full font-bold text-lg overflow-hidden transition-all transform hover:scale-105 hover:shadow-2xl hover:shadow-[#1C99A0]/50"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    I Need A Pro
                    <Rocket className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-[#208FC3] to-[#1C99A0] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </button>
                
                <button
                  onClick={() => navigate('/select')}
                  className="px-8 py-4 bg-white/5 backdrop-blur-sm text-white rounded-full font-bold text-lg border-2 border-[#1C99A0]/30 hover:border-[#1C99A0] hover:bg-white/10 transition-all transform hover:scale-105"
                >
                  I'm A Professional
                </button>
              </div>

              <div className="flex items-center gap-6 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#1C99A0] rounded-full animate-pulse"></div>
                  <span>100% Free for Customers</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#1C99A0] rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                  <span>Verified Professionals</span>
                </div>
              </div>
            </div>

            {/* Stats Card */}
            <div className="relative">
              <div className="relative bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl rounded-3xl p-8 border border-[#1C99A0]/20 hover:border-[#1C99A0]/40 transition-all">
                <div className="absolute inset-0 bg-gradient-to-br from-[#1C99A0]/5 to-[#208FC3]/5 rounded-3xl"></div>
                <div className="relative grid grid-cols-2 gap-6">
                  {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                      <div key={index} className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#1C99A0]/20 to-[#208FC3]/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all opacity-0 group-hover:opacity-100"></div>
                        <div className="relative bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-[#1C99A0]/20 group-hover:border-[#1C99A0]/40 transition-all">
                          <Icon className="w-8 h-8 text-[#1C99A0] mb-3" />
                          <p className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#1C99A0] to-[#208FC3] mb-1">{stat.value}</p>
                          <p className="text-sm text-gray-400">{stat.label}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-gradient-to-br from-[#1C99A0] to-[#208FC3] rounded-full opacity-20 blur-3xl animate-pulse"></div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-br from-[#208FC3] to-[#1C99A0] rounded-full opacity-20 blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1C99A0] to-[#208FC3]">
                Why Choose Qozii?
              </span>
            </h2>
            <p className="text-xl text-gray-400">The smarter way to connect customers with professionals</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="group relative">
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} rounded-3xl blur-xl opacity-0 group-hover:opacity-30 transition-all`}></div>
                  <div className="relative bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-[#1C99A0]/20 hover:border-[#1C99A0]/40 transition-all h-full">
                    <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 transform group-hover:scale-110 group-hover:rotate-3 transition-all`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                    <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="relative py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black mb-4">How It Works</h2>
            <p className="text-xl text-gray-400">Simple, fast, and transparent</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* For Customers */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-[#1C99A0]/20 to-[#208FC3]/20 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-all"></div>
              <div className="relative bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-[#1C99A0]/20 hover:border-[#1C99A0]/40 transition-all">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#1C99A0] to-[#208FC3] rounded-2xl flex items-center justify-center">
                    <Users className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold">For Customers</h3>
                </div>
                
                <div className="space-y-6">
                  {howItWorksCustomer.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <div key={index} className="flex gap-4 group/item">
                        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#1C99A0] to-[#208FC3] rounded-full flex items-center justify-center font-bold shadow-lg shadow-[#1C99A0]/30 group-hover/item:scale-110 transition-transform">
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-lg mb-1">{item.title}</h4>
                          <p className="text-gray-400">{item.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <button
                  onClick={() => navigate('/select')}
                  className="w-full mt-8 px-6 py-4 bg-gradient-to-r from-[#1C99A0] to-[#208FC3] rounded-full font-bold hover:shadow-lg hover:shadow-[#1C99A0]/50 transition-all flex items-center justify-center gap-2 group/btn"
                >
                  Post a Job - Free
                  <ChevronRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* For Professionals */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-[#208FC3]/20 to-[#1C99A0]/20 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-all"></div>
              <div className="relative bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-[#208FC3]/20 hover:border-[#208FC3]/40 transition-all">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#208FC3] to-[#1C99A0] rounded-2xl flex items-center justify-center">
                    <Briefcase className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold">For Professionals</h3>
                </div>
                
                <div className="space-y-6">
                  {howItWorksPro.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <div key={index} className="flex gap-4 group/item">
                        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#208FC3] to-[#1C99A0] rounded-full flex items-center justify-center font-bold shadow-lg shadow-[#208FC3]/30 group-hover/item:scale-110 transition-transform">
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-lg mb-1">{item.title}</h4>
                          <p className="text-gray-400">{item.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <button
                  onClick={() => navigate('/select')}
                  className="w-full mt-8 px-6 py-4 bg-gradient-to-r from-[#208FC3] to-[#1C99A0] rounded-full font-bold hover:shadow-lg hover:shadow-[#208FC3]/50 transition-all flex items-center justify-center gap-2 group/btn"
                >
                  Join as a Pro
                  <ChevronRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="relative py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1C99A0] to-[#208FC3]">
                Transparent Pricing
              </span>
            </h2>
            <p className="text-xl text-gray-400">No hidden fees. Just honest, affordable prices.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Customer Pricing */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-[#1C99A0] to-[#208FC3] rounded-3xl blur-2xl opacity-20"></div>
              <div className="relative bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-[#1C99A0]/30 hover:border-[#1C99A0] transition-all">
                <div className="text-center mb-6">
                  <Users className="w-16 h-16 mx-auto mb-4 text-[#1C99A0]" />
                  <h3 className="text-2xl font-bold mb-2">For Customers</h3>
                  <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#1C99A0] to-[#208FC3] mb-2">$0</div>
                  <p className="text-gray-400">100% Free Forever</p>
                </div>
                <ul className="space-y-3">
                  {['Unlimited job posts', 'Compare multiple quotes', 'Read verified reviews', 'Direct messaging with pros'].map((item, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-[#1C99A0] flex-shrink-0" />
                      <span className="text-gray-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Pro Pricing */}
            <div className="relative group">
              <div className="absolute -top-4 right-8 px-4 py-2 bg-gradient-to-r from-[#1C99A0] to-[#208FC3] rounded-full text-sm font-bold z-10 shadow-lg">
                Best Value!
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-[#208FC3] to-[#1C99A0] rounded-3xl blur-2xl opacity-20"></div>
              <div className="relative bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-[#208FC3]/30 hover:border-[#208FC3] transition-all">
                <div className="text-center mb-6">
                  <Briefcase className="w-16 h-16 mx-auto mb-4 text-[#208FC3]" />
                  <h3 className="text-2xl font-bold mb-2">For Professionals</h3>
                  <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#208FC3] to-[#1C99A0] mb-2">Pay As You Go</div>
                  <p className="text-gray-400">Flexible Credit Packages</p>
                </div>
                <ul className="space-y-3">
                  {['Quality verified leads', 'Flexible credit packages', 'Build your reputation', 'No monthly fees'].map((item, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-[#208FC3] flex-shrink-0" />
                      <span className="text-gray-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="relative py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black mb-4">What People Say</h2>
            <p className="text-xl text-gray-400">Real reviews from real customers and pros</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="relative group">
                <div className={`absolute inset-0 bg-gradient-to-br ${testimonial.gradient} rounded-3xl blur-2xl opacity-0 group-hover:opacity-30 transition-all`}></div>
                <div className="relative bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-[#1C99A0]/20 hover:border-[#1C99A0]/40 transition-all">
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`w-14 h-14 bg-gradient-to-br ${testimonial.gradient} rounded-full flex items-center justify-center shadow-lg`}>
                      <span className="font-bold text-lg">{testimonial.initials}</span>
                    </div>
                    <div>
                      <h4 className="font-bold">{testimonial.name}</h4>
                      <p className="text-sm text-gray-400">{testimonial.role}</p>
                    </div>
                  </div>
                  <div className="flex gap-1 mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-[#1C99A0] text-[#1C99A0]" />
                    ))}
                  </div>
                  <p className="text-gray-300 italic leading-relaxed">"{testimonial.text}"</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative bg-gradient-to-r from-[#1C99A0] to-[#208FC3] rounded-3xl p-12 overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iI0ZGRiIgc3Ryb2tlLXdpZHRoPSIyIiBvcGFjaXR5PSIuMSIvPjwvZz48L3N2Zz4=')] opacity-20"></div>
            <div className="relative z-10">
              <Globe className="w-16 h-16 mx-auto mb-6 animate-pulse" />
              <h2 className="text-4xl font-black mb-4">
                Ready to Get Started?
              </h2>
              <p className="text-xl mb-8 opacity-90">
                Join thousands of satisfied customers and professionals
              </p>
              <button
                onClick={() => navigate('/select')}
                className="px-10 py-4 bg-white text-[#1C99A0] rounded-full font-black text-lg hover:shadow-2xl transition-all transform hover:scale-105"
              >
                Sign Up Now - It's Free
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-[#1C99A0]/20 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <img src="/qozii-logo.jpg" alt="Qozii" className="h-12 rounded-lg mb-4" />
              <p className="text-gray-400 text-sm">The next generation of home services marketplace.</p>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-[#1C99A0]">For Customers</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-[#1C99A0] transition-colors">Post a Job</a></li>
                <li><a href="#" className="hover:text-[#1C99A0] transition-colors">Find Pros</a></li>
                <li><a href="#" className="hover:text-[#1C99A0] transition-colors">How It Works</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-[#1C99A0]">For Professionals</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-[#1C99A0] transition-colors">Join as a Pro</a></li>
                <li><a href="#" className="hover:text-[#1C99A0] transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-[#1C99A0] transition-colors">Success Stories</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-[#1C99A0]">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-[#1C99A0] transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-[#1C99A0] transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-[#1C99A0] transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-[#1C99A0] transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-[#1C99A0]/20 pt-8 text-center text-sm text-gray-400">
            <p>© 2025 Qozii. All rights reserved. Built for the future.</p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
