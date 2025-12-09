import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const Earnings = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gradient-to-r from-gray-900 to-red-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 hover:text-red-200">
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold">Earnings</h1>
          <p className="text-gray-600 mt-4">Earnings tracking feature coming soon</p>
        </div>
      </main>
    </div>
  );
};

export default Earnings;
