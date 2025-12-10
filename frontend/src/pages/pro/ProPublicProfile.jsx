import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Star, Shield, CheckCircle, Clock, DollarSign, Award, Briefcase, Calendar, Phone, Mail, MessageSquare, Image as ImageIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import VerificationBadge from '../../components/VerificationBadge';

const API_URL = `${process.env.REACT_APP_BACKEND_URL}/api`;

const ProPublicProfile = () => {
  const { proId } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showGallery, setShowGallery] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, [proId]);

  const fetchProfile = async () => {
    try {
      const response = await fetch(`${API_URL}/pro-profile/${proId}`);
      const data = await response.json();
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const nextImage = () => {
    if (profile?.portfolio_images) {
      setSelectedImageIndex((prev) => (prev + 1) % profile.portfolio_images.length);
    }
  };

  const prevImage = () => {
    if (profile?.portfolio_images) {
      setSelectedImageIndex((prev) => (prev - 1 + profile.portfolio_images.length) % profile.portfolio_images.length);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600">Profile not found</p>
          <button onClick={() => navigate(-1)} className="mt-4 text-red-600 hover:text-red-700">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const hasPortfolio = profile.portfolio_images && profile.portfolio_images.length > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Business Name */}
      <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-white/80 hover:text-white mb-6 transition"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to search</span>
          </button>

          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Business Logo/Profile Picture */}
            <div className="flex-shrink-0">
              {profile.business_logo ? (
                <img
                  src={profile.business_logo}
                  alt={profile.business_name || 'Business'}
                  className="w-32 h-32 rounded-2xl object-cover border-4 border-white shadow-2xl"
                />
              ) : profile.profile_picture ? (
                <img
                  src={profile.profile_picture}
                  alt={profile.name}
                  className="w-32 h-32 rounded-2xl object-cover border-4 border-white shadow-2xl"
                />
              ) : (
                <div className="w-32 h-32 rounded-2xl bg-white/20 border-4 border-white shadow-2xl flex items-center justify-center">
                  <Briefcase className="w-16 h-16 text-white" />
                </div>
              )}
            </div>

            {/* Business Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between flex-wrap gap-4">
                <div>
                  <h1 className="text-4xl font-bold mb-2">
                    {profile.business_name || profile.name || 'Professional Service Provider'}
                  </h1>
                  
                  {/* Services */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {profile.services && profile.services.map((service, index) => (
                      <span key={index} className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">
                        {service}
                      </span>
                    ))}
                  </div>

                  {/* Location & Rating */}
                  <div className="flex flex-wrap items-center gap-4 text-white/90">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{profile.location || 'Service Area'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-bold">4.9</span>
                      <span>(127 reviews)</span>
                    </div>
                    {profile.background_check_verified && (
                      <VerificationBadge verified={true} size="sm" />
                    )}
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button className="px-6 py-3 bg-white text-red-600 rounded-lg font-bold hover:bg-gray-100 transition shadow-lg flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Contact Pro
                  </button>
                  <button className="px-6 py-3 bg-red-700 text-white rounded-lg font-bold hover:bg-red-800 transition border-2 border-white flex items-center gap-2">
                    <Star className="w-5 h-5" />
                    Request Quote
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Portfolio Gallery Section */}
      {hasPortfolio && (
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Portfolio & Completed Projects</h2>
                <p className="text-gray-600">View {profile.portfolio_images.length} photos of our work</p>
              </div>
              <button
                onClick={() => setShowGallery(true)}
                className="text-red-600 hover:text-red-700 font-semibold flex items-center gap-2"
              >
                <ImageIcon className="w-5 h-5" />
                View All Photos
              </button>
            </div>

            {/* Gallery Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {profile.portfolio_images.slice(0, 8).map((image, index) => (
                <div
                  key={index}
                  onClick={() => {
                    setSelectedImageIndex(index);
                    setShowGallery(true);
                  }}
                  className="relative aspect-square rounded-xl overflow-hidden cursor-pointer group"
                >
                  <img
                    src={image}
                    alt={`Project ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                    <ImageIcon className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              ))}
            </div>

            {profile.portfolio_images.length > 8 && (
              <button
                onClick={() => setShowGallery(true)}
                className="mt-6 w-full py-3 border-2 border-gray-300 rounded-lg font-semibold text-gray-700 hover:border-red-600 hover:text-red-600 transition"
              >
                View All {profile.portfolio_images.length} Photos
              </button>
            )}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* About Section */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About {profile.business_name || 'Us'}</h2>
              <p className="text-gray-700 leading-relaxed">
                {profile.bio || 'Professional service provider committed to delivering high-quality workmanship and exceptional customer service. With years of experience in the industry, we take pride in every project we complete.'}
              </p>
            </div>

            {/* Why Choose Us */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Why Choose Us</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <Shield className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Background Checked</h3>
                    <p className="text-sm text-gray-600">Fully verified and background checked professional</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Award className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Top Rated Pro</h3>
                    <p className="text-sm text-gray-600">Consistently high ratings from customers</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Clock className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Quick Response</h3>
                    <p className="text-sm text-gray-600">Typically responds within 1 hour</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Briefcase className="w-6 h-6 text-orange-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Licensed & Insured</h3>
                    <p className="text-sm text-gray-600">Fully licensed and insured for your protection</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Services & Pricing */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Services & Pricing</h2>
              <div className="space-y-4">
                {profile.services && profile.services.map((service, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-red-300 transition">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="font-semibold text-gray-900">{service}</span>
                    </div>
                    <span className="text-gray-600">Contact for quote</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews Section */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Customer Reviews</h2>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="text-2xl font-bold text-gray-900">4.9</span>
                  <span className="text-gray-600">(127 reviews)</span>
                </div>
              </div>

              {/* Review Items */}
              <div className="space-y-6">
                {[1, 2, 3].map((review) => (
                  <div key={review} className="border-b border-gray-200 pb-6 last:border-0">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-gray-600 font-bold">JD</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-bold text-gray-900">John Doe</h4>
                          <span className="text-sm text-gray-500">2 weeks ago</span>
                        </div>
                        <div className="flex gap-1 mb-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                        <p className="text-gray-700">
                          Excellent service! Professional, on time, and did a fantastic job. Highly recommend!
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button className="mt-6 w-full py-3 border-2 border-gray-300 rounded-lg font-semibold text-gray-700 hover:border-red-600 hover:text-red-600 transition">
                View All Reviews
              </button>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-6">
              {/* Quick Info Card */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Info</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-gray-700">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Member since</p>
                      <p className="font-semibold">January 2023</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <Briefcase className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Projects completed</p>
                      <p className="font-semibold">150+ jobs</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <Clock className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Response time</p>
                      <p className="font-semibold">Within 1 hour</p>
                    </div>
                  </div>
                  {profile.weekly_budget && (
                    <div className="flex items-center gap-3 text-gray-700">
                      <DollarSign className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Starting from</p>
                        <p className="font-semibold">Contact for pricing</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Contact Card */}
              <div className="bg-gradient-to-br from-red-600 to-orange-600 rounded-2xl shadow-lg p-6 text-white">
                <h3 className="text-lg font-bold mb-4">Ready to get started?</h3>
                <p className="text-white/90 mb-6 text-sm">
                  Get a free quote and schedule your project today
                </p>
                <button className="w-full bg-white text-red-600 py-3 rounded-lg font-bold hover:bg-gray-100 transition mb-3">
                  Request Free Quote
                </button>
                <button className="w-full bg-red-700 text-white py-3 rounded-lg font-bold hover:bg-red-800 transition border-2 border-white">
                  Send Message
                </button>
              </div>

              {/* Trust Badges */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Trust & Safety</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm text-gray-700">Background Verified</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm text-gray-700">License Verified</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm text-gray-700">Insurance Verified</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm text-gray-700">Identity Verified</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Gallery Modal */}
      {showGallery && hasPortfolio && (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
          <button
            onClick={() => setShowGallery(false)}
            className="absolute top-6 right-6 text-white text-4xl hover:text-gray-300 z-10"
          >
            ×
          </button>

          <button
            onClick={prevImage}
            className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>

          <div className="max-w-5xl max-h-[90vh] px-16">
            <img
              src={profile.portfolio_images[selectedImageIndex]}
              alt={`Project ${selectedImageIndex + 1}`}
              className="max-w-full max-h-[90vh] object-contain"
            />
            <p className="text-white text-center mt-4">
              {selectedImageIndex + 1} / {profile.portfolio_images.length}
            </p>
          </div>

          <button
            onClick={nextImage}
            className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition"
          >
            <ChevronRight className="w-8 h-8" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ProPublicProfile;
