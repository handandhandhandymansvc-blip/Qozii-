import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle, Users, Briefcase, DollarSign, Shield, Star, TrendingUp, Zap, Clock, Award, ChevronRight } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  const stats = [
    { value: '10,000+', label: 'Jobs Posted' },
    { value: '5,000+', label: 'Trusted Pros' },
    { value: '98%', label: 'Satisfaction Rate' },
    { value: '$10', label: 'Cost Per Lead' },
  ];

  const features = [
    {
      icon: Shield,
      title: 'Verified Professionals',
      description: 'All pros are background checked and verified for your safety',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: DollarSign,
      title: 'Best Value Pricing',
      description: 'Competitive pricing means more savings for everyone',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: Zap,
      title: 'Instant Matching',
      description: 'Get connected with qualified pros in minutes, not days',
      color: 'from-orange-500 to-orange-600'
    },
    {
      icon: Star,
      title: 'Quality Guaranteed',
      description: 'Read reviews and ratings from real customers',
      color: 'from-purple-500 to-purple-600'
    }
  ];

  const howItWorksCustomer = [
    { step: 1, title: 'Post Your Job', description: 'Describe what you need done - free and takes 2 minutes' },
    { step: 2, title: 'Get Quotes', description: 'Receive competitive quotes from qualified pros' },
    { step: 3, title: 'Hire & Review', description: 'Choose the best pro and get the job done' }
  ];

  const howItWorksPro = [
    { step: 1, title: 'Create Profile', description: 'Showcase your skills and experience' },
    { step: 2, title: 'Buy Credits', description: 'Get affordable leads with flexible credit packages' },
    { step: 3, title: 'Grow Business', description: 'Win jobs and build your reputation' }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Homeowner',
      image: '👩',
      rating: 5,
      text: 'Found an amazing plumber in under an hour! The process was smooth and the quality was outstanding.'
    },
    {
      name: 'Mike Davis',
      role: 'Electrician',
      image: '👨‍🔧',
      rating: 5,
      text: 'Best decision for my business! The lead quality is excellent and pricing is very competitive.'
    },
    {
      name: 'Jennifer Lee',
      role: 'Homeowner',
      image: '👩‍💼',
      rating: 5,
      text: 'Completely free for customers and I got 5 quotes in 24 hours. The pros are professional and reasonably priced.'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-2">
              <img src="/fixitnow-customer-logo.jpg" alt="FixItNow" className="h-16" />
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              <a href="#how-it-works" className="text-gray-700 hover:text-red-600 transition-colors font-medium">How It Works</a>
              <a href="#pricing" className="text-gray-700 hover:text-red-600 transition-colors font-medium">Pricing</a>
              <a href="#testimonials" className="text-gray-700 hover:text-red-600 transition-colors font-medium">Reviews</a>
              <button
                onClick={() => navigate('/select')}
                className="px-6 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-red-50 via-orange-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-semibold mb-6">
                🎉 Best Value for Quality Service
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Get Your Home Projects Done <span className="bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">Right Now</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Connect with trusted local professionals for any job. Free for customers, affordable for pros.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button
                  onClick={() => navigate('/select')}
                  className="group px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-bold text-lg hover:shadow-2xl transition-all flex items-center justify-center gap-2"
                >
                  I Need A Pro
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => navigate('/select')}
                  className="px-8 py-4 bg-white text-gray-900 rounded-xl font-bold text-lg border-2 border-gray-300 hover:border-red-600 hover:text-red-600 transition-all"
                >
                  I'm A Professional
                </button>
              </div>

              <div className="flex items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>100% Free for Customers</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>Verified Professionals</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white rounded-3xl shadow-2xl p-8">
                <div className="grid grid-cols-2 gap-4">
                  {stats.map((stat, index) => (
                    <div key={index} className="text-center p-4 bg-gradient-to-br from-red-50 to-orange-50 rounded-xl">
                      <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
                      <p className="text-sm text-gray-600">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-to-br from-red-600 to-orange-600 rounded-full opacity-20 blur-3xl"></div>
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full opacity-20 blur-3xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose FixItNow?</h2>
            <p className="text-xl text-gray-600">The smarter way to connect customers with professionals</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="bg-white rounded-2xl p-6 border-2 border-gray-100 hover:border-red-200 hover:shadow-xl transition-all">
                  <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-4`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600">Simple, fast, and transparent</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* For Customers */}
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <Users className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">For Customers</h3>
              </div>
              
              <div className="space-y-6">
                {howItWorksCustomer.map((item, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                      {item.step}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">{item.title}</h4>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => navigate('/select')}
                className="w-full mt-8 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                Post a Job - Free
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* For Professionals */}
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-600 rounded-xl flex items-center justify-center">
                  <Briefcase className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">For Professionals</h3>
              </div>
              
              <div className="space-y-6">
                {howItWorksPro.map((item, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-red-500 to-orange-600 rounded-full flex items-center justify-center text-white font-bold">
                      {item.step}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">{item.title}</h4>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => navigate('/select')}
                className="w-full mt-8 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                Join as a Pro
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Transparent Pricing</h2>
            <p className="text-xl text-gray-600">No hidden fees. Just honest, affordable prices.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl p-8 border-2 border-blue-200">
              <div className="text-center mb-6">
                <Users className="w-16 h-16 mx-auto mb-4 text-blue-600" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">For Customers</h3>
                <div className="text-5xl font-bold text-blue-600 mb-2">$0</div>
                <p className="text-gray-600">100% Free Forever</p>
              </div>
              <ul className="space-y-3">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>Unlimited job posts</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>Compare multiple quotes</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>Read verified reviews</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>Direct messaging with pros</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-orange-100 rounded-3xl p-8 border-2 border-red-200 relative">
              <div className="absolute -top-4 right-8 px-4 py-1 bg-red-600 text-white rounded-full text-sm font-bold">
                Best Value!
              </div>
              <div className="text-center mb-6">
                <Briefcase className="w-16 h-16 mx-auto mb-4 text-red-600" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">For Professionals</h3>
                <div className="text-5xl font-bold text-red-600 mb-2">Pay As You Go</div>
                <p className="text-gray-600">Flexible Credit Packages</p>
              </div>
              <ul className="space-y-3">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>Quality verified leads</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>Flexible credit packages</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>Build your reputation</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>No monthly fees</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What People Say</h2>
            <p className="text-xl text-gray-600">Real reviews from real customers and pros</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-2xl">
                    {testimonial.image}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex gap-1 mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700">{testimonial.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-red-600 to-orange-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-red-100 mb-8">
            Join thousands of satisfied customers and professionals
          </p>
          <button
            onClick={() => navigate('/select')}
            className="px-8 py-4 bg-white text-red-600 rounded-xl font-bold text-lg hover:shadow-2xl transition-all"
          >
            Sign Up Now - It's Free
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="mb-4 bg-white/10 rounded-lg p-2 inline-block">
                <img 
                  src="/fixitnow-customer-logo.jpg" 
                  alt="FixItNow" 
                  className="h-10"
                />
              </div>
              <p className="text-gray-400">The affordable way to connect with trusted professionals.</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">For Customers</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Post a Job</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Find Pros</a></li>
                <li><a href="#" className="hover:text-white transition-colors">How It Works</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">For Professionals</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Join as a Pro</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Success Stories</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>© 2025 FixItNow. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
