import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Mail, Lock, AlertCircle, Eye, EyeOff, Shield, ShieldCheck } from 'lucide-react';

const API_URL = `${process.env.REACT_APP_BACKEND_URL}/api`;

const AdminLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/admin/login`, formData);
      if (response.data.access_token) {
        const adminData = {
          id: response.data.user.id,
          email: response.data.user.email,
          role: 'admin',
          token: response.data.access_token
        };
        localStorage.setItem('user', JSON.stringify(adminData));
        navigate('/admin/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid admin credentials');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-md w-full relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl shadow-2xl mb-4 transform rotate-3 hover:rotate-0 transition-transform">
            <ShieldCheck className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Admin Portal</h1>
          <p className="text-purple-200">Authorized personnel only</p>
        </div>

        {/* Login Card */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
          {/* Security Header */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-3">
            <div className="flex items-center justify-center gap-2 text-white">
              <Shield className="w-4 h-4" />
              <span className="text-sm font-semibold">Maximum Security Login</span>
            </div>
          </div>

          <div className="p-8">
            {error && (
              <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl flex items-start gap-3 backdrop-blur-sm animate-shake">
                <AlertCircle className="w-5 h-5 text-red-300 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-red-100 text-sm font-medium">Access Denied</p>
                  <p className="text-red-200 text-xs mt-1">{error}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Field */}
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Admin Email
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <Mail className="w-5 h-5 text-purple-300" />
                  </div>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-12 pr-4 py-3.5 bg-white/10 border-2 border-white/20 rounded-xl focus:border-purple-400 focus:ring-4 focus:ring-purple-500/30 transition-all outline-none text-white placeholder-purple-300/50 backdrop-blur-sm"
                    placeholder="admin@fixitnow.com"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Admin Password
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <Lock className="w-5 h-5 text-purple-300" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full pl-12 pr-12 py-3.5 bg-white/10 border-2 border-white/20 rounded-xl focus:border-purple-400 focus:ring-4 focus:ring-purple-500/30 transition-all outline-none text-white placeholder-purple-300/50 backdrop-blur-sm"
                    placeholder="Enter secure password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-purple-300 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3.5 rounded-xl font-bold text-base hover:from-purple-700 hover:to-blue-700 focus:ring-4 focus:ring-purple-500/50 transition-all shadow-lg hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Authenticating...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Shield className="w-5 h-5" />
                    Access Admin Panel
                  </span>
                )}
              </button>
            </form>

            {/* Security Notice */}
            <div className="mt-6 pt-6 border-t border-white/10">
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                <p className="text-xs text-yellow-200 text-center">
                  <Shield className="w-3 h-3 inline mr-1" />
                  All admin actions are logged and monitored for security
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Warning */}
        <div className="mt-6 text-center">
          <p className="text-xs text-purple-300">
            Unauthorized access is prohibited and will be prosecuted
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;