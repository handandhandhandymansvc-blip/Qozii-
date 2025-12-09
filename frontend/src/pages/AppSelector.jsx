import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Briefcase, ArrowRight } from 'lucide-react';

const AppSelector = () => {
  const navigate = useNavigate();

  const selectCustomer = () => {
    localStorage.setItem('app_mode', 'customer');
    window.location.href = '/login';
  };

  const selectPro = () => {
    localStorage.setItem('app_mode', 'pro');
    window.location.href = '/pro/login';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-5xl w-full">
        <div className="text-center mb-12">
          <img src="/fixitnow-customer-logo.jpg" alt="FixItNow" className="h-20 mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Welcome to FixItNow</h1>
          <p className="text-xl text-gray-600">Choose how you want to use FixItNow</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Customer App */}
          <button
            onClick={selectCustomer}
            className="group bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 text-left border-4 border-transparent hover:border-red-500"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-red-200 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Users className="w-10 h-10 text-red-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">I'm a Customer</h2>
            <p className="text-gray-600 mb-6 text-lg">Find and hire verified professionals for your home projects</p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center gap-2 text-gray-700">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Post jobs for free
              </li>
              <li className="flex items-center gap-2 text-gray-700">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Get quotes in 24 hours
              </li>
              <li className="flex items-center gap-2 text-gray-700">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Browse verified pros
              </li>
            </ul>
            <div className="flex items-center gap-2 text-red-600 font-bold text-lg group-hover:gap-4 transition-all">
              Continue as Customer <ArrowRight className="w-5 h-5" />
            </div>
          </button>

          {/* Pro App */}
          <button
            onClick={selectPro}
            className="group bg-gradient-to-br from-gray-900 to-black rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 text-left border-4 border-transparent hover:border-red-500"
          >
            <div className="w-20 h-20 bg-red-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Briefcase className="w-10 h-10 text-white" />
            </div>
            <div className="flex items-center gap-2 mb-3">
              <h2 className="text-3xl font-bold text-white">I'm a Pro</h2>
              <span className="bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-xs font-bold">PRO</span>
            </div>
            <p className="text-gray-300 mb-6 text-lg">Find jobs, submit quotes, and grow your business</p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center gap-2 text-gray-300">
                <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                Access quality leads
              </li>
              <li className="flex items-center gap-2 text-gray-300">
                <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                Set your own budget
              </li>
              <li className="flex items-center gap-2 text-gray-300">
                <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                Build your reputation
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
