import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const ProProfile = () => {
  const { proId } = useParams();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-700 hover:text-red-600">
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold">Pro Profile</h1>
          <p className="text-gray-600 mt-4">Profile details coming soon</p>
        </div>
      </main>
    </div>
  );
};

export default ProProfile;
