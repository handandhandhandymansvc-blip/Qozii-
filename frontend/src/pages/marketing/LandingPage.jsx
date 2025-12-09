import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Wrench, Calendar, CreditCard, ArrowRight, CheckCircle, Star, Users, Briefcase, Building } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Home className="w-8 h-8" />,
      title: 'Post Your Job Free',
      description: 'Tell us what you need done. Quick, easy, always free for customers.'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Get Matched with Pros',
      description: 'Competitive pricing with quality guaranteed professionals.'
    },
    {
      icon: <Wrench className="w-8 h-8" />,
      title: 'Quality Service',
      description: 'Work with verified, top-rated professionals in your area.'
    },
    {
      icon: <CreditCard className="w-8 h-8" />,
      title: 'Secure Payments',
      description: 'Pay safely with multiple payment options and protection.'
    }
  ];

  const services = [
    { name: 'Home Repair', icon: '🔧' },
    { name: 'Plumbing', icon: '🚰' },
    { name: 'Electrical', icon: '⚡' },
    { name: 'Cleaning', icon: '🧹' },
    { name: 'Landscaping', icon: '🌳' },
    { name: 'Moving', icon: '📦' },
    { name: 'Painting', icon: '🎨' },
    { name: 'HVAC', icon: '❄️' },
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Homeowner',
      text: 'Found a great plumber within hours! The process was so easy and the price was fair.',
      rating: 5
    },
    {
      name: 'Mike Rodriguez',
      role: 'Contractor',
      text: 'Best decision for my business! The lead quality is excellent and I can focus on doing great work.',
      rating: 5
    },
    {
      name: 'Emily Chen',
      role: 'Property Manager',
      text: 'I manage 15 properties and FixItNow has become my go-to platform for all maintenance needs.',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="bg-red-600 text-white rounded-lg p-2">
                <Wrench className="w-6 h-6" />
              </div>
              <span className="text-2xl font-bold text-gray-900">FixItNow</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#how-it-works" className="text-gray-600 hover:text-red-600 font-medium">How It Works</a>
              <a href="#pricing" className="text-gray-600 hover:text-red-600 font-medium">Pricing</a>
              <a href="#testimonials" className="text-gray-600 hover:text-red-600 font-medium">Reviews</a>
              <button
                onClick={() => navigate('/select')}
                className="bg-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700 transition"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-50 to-red-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block mb-4 px-4 py-2 bg-red-100 rounded-full">
                <span className="text-red-700 font-semibold text-sm">🎉 Best Value for Quality Service</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                Get Your Home Projects Done <span className="text-red-600">Right Now</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Connect with trusted local professionals for any job. Free for customers, affordable for pros.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => navigate('/register')}
                  className="bg-red-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-red-700 transition flex items-center justify-center gap-2 group"
                >
                  I Need A Pro
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
                </button>
                <button
                  onClick={() => navigate('/pro/register')}
                  className="bg-white text-gray-900 px-8 py-4 rounded-lg font-semibold text-lg border-2 border-gray-300 hover:border-red-600 transition"
                >
                  I'm A Professional
                </button>
              </div>
              <div className="mt-8 flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700">100% Free for Customers</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700">Verified Professionals</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-2xl p-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center p-6 bg-red-50 rounded-2xl">
                  <div className="text-4xl font-bold text-red-600 mb-2">10,000+</div>
                  <div className="text-gray-600 font-medium">Jobs Posted</div>
                </div>
                <div className="text-center p-6 bg-red-50 rounded-2xl">
                  <div className="text-4xl font-bold text-red-600 mb-2">5,000+</div>
                  <div className="text-gray-600 font-medium">Trusted Pros</div>
                </div>
                <div className="text-center p-6 bg-red-50 rounded-2xl">
                  <div className="text-4xl font-bold text-red-600 mb-2">98%</div>
                  <div className="text-gray-600 font-medium">Satisfaction Rate</div>
                </div>
                <div className="text-center p-6 bg-red-50 rounded-2xl">
                  <div className="text-4xl font-bold text-red-600 mb-2">$10</div>
                  <div className="text-gray-600 font-medium">Cost Per Lead</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600">Simple, fast, and reliable</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Services */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Popular Services</h2>
            <p className="text-xl text-gray-600">Whatever you need, we've got you covered</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition cursor-pointer group"
              >
                <div className="text-4xl mb-3 group-hover:scale-110 transition">{service.icon}</div>
                <div className="font-semibold text-gray-900">{service.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-gray-600">No hidden fees, no surprises</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl p-8 border-2 border-gray-200 shadow-lg">
              <div className="text-center mb-6">
                <Home className="w-16 h-16 mx-auto mb-4 text-red-600" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">For Customers</h3>
                <div className="text-5xl font-bold text-red-600 mb-2">FREE</div>
                <p className="text-gray-600">Always Free</p>
              </div>
              <ul className="space-y-3">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>Post unlimited jobs</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>Get multiple quotes</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>Review pro profiles</span>
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
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">"{testimonial.text}"</p>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-500">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-red-600 to-red-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-red-100 mb-8">
            Join thousands of happy customers and professionals on FixItNow
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/register')}
              className="bg-white text-red-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition"
            >
              Post a Job (Free)
            </button>
            <button
              onClick={() => navigate('/pro/register')}
              className="bg-red-800 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-red-900 transition border-2 border-white"
            >
              Become a Pro
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-red-600 text-white rounded-lg p-2">
                  <Wrench className="w-6 h-6" />
                </div>
                <span className="text-xl font-bold">FixItNow</span>
              </div>
              <p className="text-gray-400">Connecting customers with quality professionals.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Customers</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">How It Works</a></li>
                <li><a href="#" className="hover:text-white">Post a Job</a></li>
                <li><a href="#" className="hover:text-white">Browse Pros</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Professionals</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Join as Pro</a></li>
                <li><a href="#" className="hover:text-white">Pricing</a></li>
                <li><a href="#" className="hover:text-white">Success Stories</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">About Us</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
                <li><a href="#" className="hover:text-white">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 FixItNow. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;