import React from 'react';
import { Users, Briefcase, ArrowRight, Sparkles, Zap } from 'lucide-react';

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
    <div className="min-h-screen bg-[#0A0E27] text-white flex items-center justify-center p-4 overflow-hidden relative">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#1C99A0] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-[#208FC3] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="max-w-6xl w-full relative z-10">
        <div className="text-center mb-16">
          <img src="/qozii-logo.jpg" alt="Qozii" className="h-24 mx-auto mb-6 rounded-xl shadow-2xl shadow-[#1C99A0]/30" />
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#1C99A0]/20 to-[#208FC3]/20 backdrop-blur-sm border border-[#1C99A0]/30 rounded-full text-sm font-semibold mb-6">
            <Sparkles className="w-4 h-4 text-[#1C99A0]" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1C99A0] to-[#208FC3]">
              Choose Your Journey
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black mb-4">
            <span className="text-white">Welcome to </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1C99A0] via-[#208FC3] to-[#1C99A0]">Qozii</span>
          </h1>
          <p className="text-xl text-gray-400">The next generation of home services</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Customer App */}
          <button
            onClick={selectCustomer}
            className="group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#1C99A0]/20 to-[#208FC3]/20 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-all"></div>
            <div className="relative bg-white/5 backdrop-blur-xl rounded-3xl p-10 border border-[#1C99A0]/20 hover:border-[#1C99A0] transition-all text-left h-full">
              <div className="w-20 h-20 bg-gradient-to-br from-[#1C99A0] to-[#208FC3] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-transform shadow-lg shadow-[#1C99A0]/30">
                <Users className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-4xl font-black mb-3">I'm a Customer</h2>
              <p className="text-gray-300 mb-6 text-lg">Find and hire verified professionals for your home projects</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-[#1C99A0]/20 rounded-full flex items-center justify-center">
                    <Zap className="w-4 h-4 text-[#1C99A0]" />
                  </div>
                  <span className="text-gray-300">Post jobs for free</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-[#1C99A0]/20 rounded-full flex items-center justify-center">
                    <Zap className="w-4 h-4 text-[#1C99A0]" />
                  </div>
                  <span className="text-gray-300">Get quotes in 24 hours</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-[#1C99A0]/20 rounded-full flex items-center justify-center">
                    <Zap className="w-4 h-4 text-[#1C99A0]" />
                  </div>
                  <span className="text-gray-300">Browse verified pros</span>
                </li>
              </ul>
              <div className="flex items-center gap-3 text-[#1C99A0] font-bold text-lg group-hover:gap-5 transition-all">
                Continue as Customer 
                <div className="w-10 h-10 bg-gradient-to-br from-[#1C99A0] to-[#208FC3] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <ArrowRight className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
          </button>

          {/* Pro App */}
          <button
            onClick={selectPro}
            className="group relative overflow-hidden"
          >
            <div className="absolute -top-4 right-8 px-4 py-2 bg-gradient-to-r from-[#208FC3] to-[#1C99A0] rounded-full text-sm font-bold z-10 shadow-lg">
              PRO
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-[#208FC3]/20 to-[#1C99A0]/20 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-all"></div>
            <div className="relative bg-white/5 backdrop-blur-xl rounded-3xl p-10 border border-[#208FC3]/20 hover:border-[#208FC3] transition-all text-left h-full">
              <div className="w-20 h-20 bg-gradient-to-br from-[#208FC3] to-[#1C99A0] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-transform shadow-lg shadow-[#208FC3]/30">
                <Briefcase className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-4xl font-black mb-3">I'm a Pro</h2>
              <p className="text-gray-300 mb-6 text-lg">Find jobs, submit quotes, and grow your business</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-[#208FC3]/20 rounded-full flex items-center justify-center">
                    <Zap className="w-4 h-4 text-[#208FC3]" />
                  </div>
                  <span className="text-gray-300">Access quality leads</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-[#208FC3]/20 rounded-full flex items-center justify-center">
                    <Zap className="w-4 h-4 text-[#208FC3]" />
                  </div>
                  <span className="text-gray-300">Flexible credit packages</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-[#208FC3]/20 rounded-full flex items-center justify-center">
                    <Zap className="w-4 h-4 text-[#208FC3]" />
                  </div>
                  <span className="text-gray-300">Build your reputation</span>
                </li>
              </ul>
            <div className="flex items-center gap-2 text-red-400 font-bold text-lg group-hover:gap-4 transition-all">
              Continue as Pro <ArrowRight className="w-5 h-5" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppSelector;
