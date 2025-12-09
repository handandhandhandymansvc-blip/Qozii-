import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Star, MapPin, Shield, Award, Clock, CheckCircle, Zap, ThumbsUp, Camera } from 'lucide-react';

const API_URL = `${process.env.REACT_APP_BACKEND_URL}/api`;

const BrowsePros = () => {
  const navigate = useNavigate();
  const [pros, setPros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, top-rated, instant-book, verified

  useEffect(() => {
    fetchPros();
  }, []);

  const fetchPros = async () => {
    try {
      const response = await axios.get(`${API_URL}/pros/search`);
      // Add mock enhanced data
      const enhancedPros = response.data.map(pro => ({
        ...pro,
        verified: Math.random() > 0.3,
        instantBook: Math.random() > 0.6,
        topRated: pro.rating >= 4.5,
        avgResponse: `${Math.floor(Math.random() * 3) + 1}hr`,
        completedJobs: pro.total_jobs || Math.floor(Math.random() * 50) + 10,
        portfolioImages: Math.floor(Math.random() * 10) + 3,
        reviewCount: Math.floor(Math.random() * 100) + 20,
        elitePro: Math.random() > 0.8
      }));
      setPros(enhancedPros);
    } catch (error) {
      console.error('Error fetching pros:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPros = pros.filter(pro => {
    if (filter === 'top-rated') return pro.topRated;
    if (filter === 'instant-book') return pro.instantBook;
    if (filter === 'verified') return pro.verified;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button onClick={() => navigate('/')} className="flex items-center gap-2 text-gray-700 hover:text-red-600">
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>
            <img src="/fixitnow-customer-logo.jpg" alt="FixItNow" className="h-12" />
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Verified Professionals</h1>
          <p className="text-gray-600">All pros are background checked, insured, and top-rated</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
          <div className="flex gap-3 overflow-x-auto">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-all ${
                filter === 'all'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Pros
            </button>
            <button
              onClick={() => setFilter('instant-book')}
              className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                filter === 'instant-book'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Zap className="w-4 h-4" />
              Instant Book
            </button>
            <button
              onClick={() => setFilter('top-rated')}
              className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                filter === 'top-rated'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Star className="w-4 h-4" />
              Top Rated
            </button>
            <button
              onClick={() => setFilter('verified')}
              className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                filter === 'verified'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Shield className="w-4 h-4" />
              Verified Only
            </button>
          </div>
        </div>

        {/* Pros Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredPros.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center">
            <p className="text-gray-600">No pros found. Try adjusting your filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredPros.map((pro) => (
              <div
                key={pro.user_id}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border-2 border-transparent hover:border-red-500 group"
              >
                {/* Pro Header */}
                <div className="p-6">
                  <div className="flex gap-4">
                    {/* Avatar */}
                    <div className="relative">
                      <div className="w-20 h-20 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl flex items-center justify-center text-white text-2xl font-bold">
                        {pro.name?.charAt(0)}
                      </div>
                      {pro.verified && (
                        <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center border-4 border-white">
                          <CheckCircle className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>

                    {/* Pro Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-bold text-xl text-gray-900 group-hover:text-red-600">{pro.name}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                              <span className="font-bold text-gray-900">{(pro.rating || 0).toFixed(1)}</span>
                            </div>
                            <span className="text-gray-500 text-sm">({pro.reviewCount} reviews)</span>
                          </div>
                        </div>
                        {pro.elitePro && (
                          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                            <Award className="w-3 h-3" />
                            ELITE
                          </div>
                        )}
                      </div>

                      {/* Badges */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        {pro.verified && (
                          <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1">
                            <Shield className="w-3 h-3" />
                            Verified
                          </span>
                        )}
                        {pro.instantBook && (
                          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1">
                            <Zap className="w-3 h-3" />
                            Instant Book
                          </span>
                        )}
                        {pro.topRated && (
                          <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1">
                            <Star className="w-3 h-3" />
                            Top Rated
                          </span>
                        )}
                        <span className="bg-purple-100 text-purple-800 text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1">
                          <ThumbsUp className="w-3 h-3" />
                          98% recommend
                        </span>
                      </div>

                      {/* Stats */}
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span>{pro.completedJobs} jobs</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4 text-blue-600" />
                          <span>{pro.avgResponse} response</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Camera className="w-4 h-4 text-purple-600" />
                          <span>{pro.portfolioImages} photos</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bio */}
                  {pro.bio && (
                    <p className="text-gray-600 text-sm mt-4 line-clamp-2">{pro.bio}</p>
                  )}

                  {/* Price Range */}
                  {pro.hourly_rate && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Starting from</span>
                        <span className="text-xl font-bold text-gray-900">${pro.hourly_rate}/hr</span>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    <button
                      onClick={() => navigate(`/pro/${pro.user_id}`)}
                      className="border-2 border-gray-900 text-gray-900 py-3 rounded-lg font-semibold hover:bg-gray-900 hover:text-white transition-colors"
                    >
                      View Profile
                    </button>
                    {pro.instantBook ? (
                      <button className="bg-gradient-to-r from-red-600 to-red-700 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2">
                        <Zap className="w-4 h-4" />
                        Instant Book
                      </button>
                    ) : (
                      <button className="bg-gradient-to-r from-red-600 to-red-700 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all">
                        Request Quote
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default BrowsePros;
