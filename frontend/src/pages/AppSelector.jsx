import React from 'react';
import { Users, Briefcase, ArrowRight, Sparkles, Zap, Star } from 'lucide-react';

const AppSelector = () => {
  const selectCustomer = () => {
    localStorage.setItem('app_mode', 'customer');
    window.location.href = '/login';
  };

  const selectPro = () => {
    localStorage.setItem('app_mode', 'pro');
    window.location.href = '/pro/login';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-20 right-0 w-96 h-96 bg-gradient-to-br from-[#1C99A0]/20 to-[#208FC3]/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-0 w-96 h-96 bg-gradient-to-br from-purple-400/20 to-pink-500/20 rounded-full blur-3xl"></div>

      <div className="max-w-6xl w-full relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <img src="/qozii-logo.jpg" alt="Qozii" className="h-20 mx-auto mb-6 rounded-2xl shadow-2xl" />
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full mb-6 border border-purple-200">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <span className="font-bold text-purple-700">Choose Your Path</span>
          </div>
          <h1 className="text-6xl font-black mb-4">
            <span className="text-gray-900">Welcome to </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1C99A0] via-purple-500 to-pink-500">Qozii</span>
          </h1>
          <p className="text-2xl text-gray-600 font-medium">Pick your vibe and let's get it! 🔥</p>
        </div>

        {/* Selection Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Customer Card */}
          <button
            onClick={selectCustomer}
            className="group relative overflow-hidden bg-white rounded-3xl p-10 shadow-2xl hover:shadow-3xl transition-all border-4 border-transparent hover:border-[#1C99A0] hover:scale-105"
          >
            {/* Gradient Overlay on Hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#1C99A0]/5 to-[#208FC3]/5 opacity-0 group-hover:opacity-100 transition-all"></div>
            
            <div className="relative">
              {/* Icon */}
              <div className="w-24 h-24 bg-gradient-to-br from-[#1C99A0] to-[#208FC3] rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-transform shadow-xl">
                <Users className="w-12 h-12 text-white" />
              </div>
              
              {/* Title */}
              <h2 className="text-4xl font-black mb-3 text-gray-900">
                I'm a Customer 🏠
              </h2>
              
              {/* Description */}
              <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                Need something done? Find verified pros in your area. Fast, easy, and totally free! ✨
              </p>
              
              {/* Features */}
              <ul className="space-y-3 mb-8 text-left">
                <li className="flex items-center gap-3 text-gray-700">
                  <div className="w-8 h-8 bg-[#1C99A0]/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Zap className="w-5 h-5 text-[#1C99A0]" />
                  </div>
                  <span className="font-semibold">Post jobs for FREE</span>
                </li>
                <li className="flex items-center gap-3 text-gray-700">
                  <div className="w-8 h-8 bg-[#1C99A0]/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Zap className="w-5 h-5 text-[#1C99A0]" />
                  </div>
                  <span className="font-semibold">Get quotes in 24hrs</span>
                </li>
                <li className="flex items-center gap-3 text-gray-700">
                  <div className="w-8 h-8 bg-[#1C99A0]/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Zap className="w-5 h-5 text-[#1C99A0]" />
                  </div>
                  <span className="font-semibold">Verified professionals</span>
                </li>
              </ul>
              
              {/* CTA Button */}
              <div className="flex items-center justify-between bg-gradient-to-r from-[#1C99A0] to-[#208FC3] rounded-2xl p-5 text-white group-hover:shadow-xl transition-all">
                <span className="font-black text-xl">Let's Find A Pro!</span>
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <ArrowRight className="w-6 h-6" />
                </div>
              </div>
            </div>
          </button>

          {/* Pro Card */}
          <button
            onClick={selectPro}
            className="group relative overflow-hidden bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl p-10 shadow-2xl hover:shadow-3xl transition-all border-4 border-transparent hover:border-purple-600 hover:scale-105"
          >
            {/* Badge */}
            <div className="absolute top-6 right-6 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white font-bold text-sm shadow-lg">
              PRO ⚡
            </div>
            
            {/* Icon */}
            <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-transform shadow-xl">
              <Briefcase className="w-12 h-12 text-white" />
            </div>
            
            {/* Title */}
            <h2 className="text-4xl font-black mb-3 text-white">
              I'm a Pro 💼
            </h2>
            
            {/* Description */}
            <p className="text-white/90 mb-6 text-lg leading-relaxed">
              Grow your business! Get quality leads, set your own prices, and build your reputation. 💪
            </p>
            
            {/* Features */}
            <ul className="space-y-3 mb-8 text-left">
              <li className="flex items-center gap-3 text-white">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Star className="w-5 h-5 text-white" />
                </div>
                <span className="font-semibold">Quality verified leads</span>
              </li>
              <li className="flex items-center gap-3 text-white">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Star className="w-5 h-5 text-white" />
                </div>
                <span className="font-semibold">Flexible credit packages</span>
              </li>
              <li className="flex items-center gap-3 text-white">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Star className="w-5 h-5 text-white" />
                </div>
                <span className="font-semibold">Build your brand</span>
              </li>
            </ul>
            
            {/* CTA Button */}
            <div className="flex items-center justify-between bg-white/20 backdrop-blur-sm rounded-2xl p-5 text-white group-hover:bg-white/30 transition-all">
              <span className="font-black text-xl">Start Growing!</span>
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <ArrowRight className="w-6 h-6" />
              </div>
            </div>
          </button>
        </div>

        {/* Back Button */}
        <div className="text-center">
          <button
            onClick={() => window.location.href = '/'}
            className="text-gray-600 hover:text-[#1C99A0] transition-colors font-bold text-lg"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppSelector;
