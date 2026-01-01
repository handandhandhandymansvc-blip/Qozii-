import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { Plus, Search, MessageSquare, LogOut, ArrowRight, Star, TrendingUp, Shield, Award, Zap, CheckCircle, Users } from 'lucide-react';

const API_URL = `${process.env.REACT_APP_BACKEND_URL}/api`;

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [myJobs, setMyJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [liveStats, setLiveStats] = useState({
    jobsToday: 147,
    activePros: 523,
    avgResponse: '2.3hrs',
    completedToday: 89
  });

  useEffect(() => {
    fetchMyJobs();
    const interval = setInterval(() => {
      setLiveStats(prev => ({
        ...prev,
        jobsToday: prev.jobsToday + Math.floor(Math.random() * 3)
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, [user]);

  const fetchMyJobs = async () => {
    try {
      const response = await axios.get(`${API_URL}/jobs?customer_id=${user.id}`);
      setMyJobs(response.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate('/browse-pros', { state: { search: searchQuery } });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <img src="/qozii-logo.jpg" alt="Qozii" className="h-12" />
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/browse-pros')}
                className="hidden md:flex items-center gap-2 text-gray-700 hover:text-red-600 font-medium transition-colors"
              >
                Find Pros
              </button>
              <button
                onClick={() => navigate('/messages')}
                className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <MessageSquare className="w-6 h-6 text-gray-700" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-600 rounded-full"></span>
              </button>
              <div className="h-8 w-px bg-gray-300"></div>
              <button
                onClick={logout}
                className="flex items-center gap-2 text-gray-700 hover:text-red-600 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden md:inline font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Live Stats Banner */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white py-3">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-center gap-8 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="font-semibold">{liveStats.jobsToday} jobs posted today</span>
            </div>
            <div className="hidden md:flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>{liveStats.activePros} pros online</span>
            </div>
            <div className="hidden md:flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>{liveStats.completedToday} jobs completed today</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Hero */}
        <div className="bg-gradient-to-r from-black to-gray-900 rounded-2xl p-8 md:p-12 mb-8 text-white">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-3">
              <Award className="w-6 h-6 text-yellow-400" />
              <span className="text-yellow-400 font-semibold">Trusted by 10,000+ customers</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Welcome back, {user?.name}!</h1>
            <p className="text-xl text-gray-300 mb-6">Get 3 quotes in 24 hours - Guaranteed or your money back!</p>
            <div className="relative max-w-2xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Search verified pros instantly..."
                className="w-full pl-14 pr-4 py-4 rounded-xl text-lg text-gray-900 focus:outline-none focus:ring-4 focus:ring-red-500/50"
              />
            </div>
            
            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-400" />
                <span className="text-sm">Background Checked</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-400" />
                <span className="text-sm">Fast Response</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-400" />
                <span className="text-sm">Top Rated</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Main Actions */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Actions */}
            <div className="grid md:grid-cols-2 gap-4">
              <button
                onClick={() => navigate('/post-job')}
                className="group bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 text-left border-2 border-transparent hover:border-red-500"
              >
                <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Plus className="w-7 h-7 text-red-600" />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-xl font-bold text-gray-900">Post a Job</h3>
                  <Zap className="w-5 h-5 text-yellow-500" />
                </div>
                <p className="text-gray-600 mb-2">Get 3 quotes in 24hrs guaranteed</p>
                <div className="flex items-center gap-2 text-sm text-green-600 font-semibold">
                  <CheckCircle className="w-4 h-4" />
                  FREE to post
                </div>
                <div className="flex items-center gap-2 text-red-600 font-semibold mt-4">
                  Get Started <ArrowRight className="w-4 h-4" />
                </div>
              </button>

              <button
                onClick={() => navigate('/browse-pros')}
                className="group bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 text-left border-2 border-transparent hover:border-red-500"
              >
                <div className="w-14 h-14 bg-gray-900 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Search className="w-7 h-7 text-white" />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-xl font-bold text-gray-900">Browse Pros</h3>
                  <Shield className="w-5 h-5 text-green-600" />
                </div>
                <p className="text-gray-600 mb-2">Search verified professionals</p>
                <div className="flex items-center gap-2 text-sm text-blue-600 font-semibold">
                  <Star className="w-4 h-4" />
                  Top rated only
                </div>
                <div className="flex items-center gap-2 text-gray-900 font-semibold mt-4">
                  Explore <ArrowRight className="w-4 h-4" />
                </div>
              </button>
            </div>

            {/* My Jobs */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">My Jobs</h2>
                {myJobs.length > 0 && (
                  <button className="text-red-600 font-semibold hover:text-red-700">
                    View All <ArrowRight className="w-4 h-4 inline" />
                  </button>
                )}
              </div>

              {loading ? (
                <div className="text-center py-8">
                  <div className="inline-block w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : myJobs.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Plus className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-600 mb-4">No jobs posted yet</p>
                  <button
                    onClick={() => navigate('/post-job')}
                    className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
                  >
                    Post Your First Job
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {myJobs.slice(0, 3).map((job) => (
                    <div
                      key={job.id}
                      onClick={() => navigate(`/job/${job.id}`)}
                      className="border-2 border-gray-200 rounded-lg p-4 hover:border-red-500 transition-all cursor-pointer group"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-lg text-gray-900 group-hover:text-red-600">{job.title}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          job.status === 'open' ? 'bg-green-100 text-green-800' :
                          job.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {job.status}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{job.description}</p>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">{job.location}</span>
                        <span className="flex items-center gap-1 text-red-600 font-semibold">
                          {job.quotes_count} quotes <ArrowRight className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Info Cards */}
          <div className="space-y-6">
            {/* Service Guarantee */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-lg p-6 text-white">
              <Shield className="w-12 h-12 mb-3" />
              <h3 className="text-xl font-bold mb-2">Qozii Guarantee</h3>
              <ul className="space-y-2 text-sm text-blue-100">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Money-back guarantee
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Background checked pros
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Secure payments
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  24/7 support
                </li>
              </ul>
            </div>

            {/* Platform Stats */}
            <div className="bg-gradient-to-br from-red-600 to-red-700 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="w-8 h-8" />
                <h3 className="text-xl font-bold">Platform Stats</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-red-100">Active Pros</span>
                  <span className="text-2xl font-bold">{liveStats.activePros}+</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-red-100">Jobs Completed</span>
                  <span className="text-2xl font-bold">12.5K+</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-red-100">Avg Response</span>
                  <span className="text-2xl font-bold">{liveStats.avgResponse}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-red-100">Satisfaction</span>
                  <span className="text-2xl font-bold">98%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
