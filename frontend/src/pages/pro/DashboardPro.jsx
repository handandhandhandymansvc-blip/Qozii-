import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { Briefcase, MessageSquare, LogOut, DollarSign, Star, Settings, TrendingUp, Shield, ArrowRight, X } from 'lucide-react';
import VerificationBadge from '../../components/VerificationBadge';

const API_URL = `${process.env.REACT_APP_BACKEND_URL}/api`;

const DashboardPro = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [stats, setStats] = useState({ jobs: 0, quotes: 0, earnings: 0, rating: 0 });
  const [recentJobs, setRecentJobs] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showVerificationBanner, setShowVerificationBanner] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      const [jobsRes, quotesRes, profileRes] = await Promise.all([
        axios.get(`${API_URL}/jobs?status=open`),
        axios.get(`${API_URL}/quotes?pro_id=${user.id}`),
        axios.get(`${API_URL}/pros/${user.id}/profile`)
      ]);

      setRecentJobs(jobsRes.data.slice(0, 6));
      setProfile(profileRes.data);
      setStats({
        jobs: jobsRes.data.length,
        quotes: quotesRes.data.length,
        earnings: profileRes.data.weekly_spent || 0,
        rating: profileRes.data.rating || 0
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-gray-900 to-red-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <img src="/fixitnow-pro-logo.jpg" alt="FixItNow Pro" className="h-12" />
              <span className="bg-yellow-400 text-gray-900 px-2 py-1 rounded-full font-bold text-xs">PRO</span>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/browse-jobs')}
                className="flex items-center gap-2 hover:text-red-200 transition-colors"
              >
                <Briefcase className="w-5 h-5" />
                <span className="hidden sm:inline">Browse Jobs</span>
              </button>
              <button
                onClick={() => navigate('/my-quotes')}
                className="flex items-center gap-2 hover:text-red-200 transition-colors"
              >
                <Star className="w-5 h-5" />
                <span className="hidden sm:inline">My Quotes</span>
              </button>
              <button
                onClick={() => navigate('/profile')}
                className="flex items-center gap-2 hover:text-red-200 transition-colors"
              >
                <Settings className="w-5 h-5" />
                <span className="hidden sm:inline">Profile</span>
              </button>
              <button
                onClick={logout}
                className="flex items-center gap-2 hover:text-red-200 transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {user?.name}!</h1>
          <p className="text-gray-600">Here's your business overview</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Available Jobs</p>
                <p className="text-3xl font-bold text-gray-900">{stats.jobs}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">My Quotes</p>
                <p className="text-3xl font-bold text-gray-900">{stats.quotes}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Week Spent</p>
                <p className="text-3xl font-bold text-gray-900">${stats.earnings.toFixed(0)}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Rating</p>
                <p className="text-3xl font-bold text-gray-900">{stats.rating.toFixed(1)}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-purple-600 fill-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Budget Alert */}
        {profile && (
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-xl p-6 mb-8">
            <div className="flex items-start gap-4">
              <TrendingUp className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="font-bold text-lg text-gray-900 mb-2">Weekly Budget</h3>
                <div className="flex items-center gap-4 mb-3">
                  <div>
                    <p className="text-sm text-gray-600">Spent: <span className="font-bold text-gray-900">${profile.weekly_spent.toFixed(2)}</span></p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Budget: <span className="font-bold text-gray-900">${profile.weekly_budget.toFixed(2)}</span></p>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-red-600 to-red-700 h-3 rounded-full transition-all"
                    style={{ width: `${Math.min((profile.weekly_spent / profile.weekly_budget) * 100, 100)}%` }}
                  ></div>
                </div>
                <button
                  onClick={() => navigate('/profile')}
                  className="mt-3 text-red-600 font-semibold text-sm hover:text-red-700"
                >
                  Manage Budget →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Recent Jobs */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Available Jobs</h2>
            <button
              onClick={() => navigate('/browse-jobs')}
              className="text-red-600 font-semibold hover:text-red-700"
            >
              View All →
            </button>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : recentJobs.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center">
              <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No jobs available</h3>
              <p className="text-gray-600">Check back soon for new opportunities!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentJobs.map((job) => (
                <div
                  key={job.id}
                  onClick={() => navigate(`/job/${job.id}`)}
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer p-6"
                >
                  <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">{job.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{job.description}</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">{job.location}</span>
                    <span className="text-red-600 font-semibold">View →</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default DashboardPro;
