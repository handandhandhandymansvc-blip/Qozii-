import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, CheckCircle, CreditCard, Wallet, Lock, AlertCircle, TrendingUp, Star, Award } from 'lucide-react';
import { getProProfile } from '../../services/api';
import { useToast } from '../../hooks/use-toast';
import VerificationBadge from '../../components/VerificationBadge';

const API_URL = `${process.env.REACT_APP_BACKEND_URL}/api`;

const BackgroundCheck = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card'); // 'card' or 'credits'
  const [formData, setFormData] = useState({
    fullName: '',
    dob: '',
    ssn: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    consent: false
  });

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/pro/login');
      return;
    }
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    fetchProfile(parsedUser.id);
  }, [navigate]);

  const fetchProfile = async (userId) => {
    try {
      const response = await fetch(`${API_URL}/pro-profile/${userId}`);
      const data = await response.json();
      setProfile(data);
      
      // Pre-fill name if available
      if (data.name) {
        setFormData(prev => ({ ...prev, fullName: data.name }));
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.consent) {
      toast({
        title: 'Consent Required',
        description: 'You must consent to the background check to proceed',
        variant: 'destructive'
      });
      return;
    }

    // Check if paying with credits and has enough balance
    if (paymentMethod === 'credits' && profile.weekly_budget < 50) {
      toast({
        title: 'Insufficient Balance',
        description: 'You need at least $50 in credits. Please choose card payment or add more credits.',
        variant: 'destructive'
      });
      return;
    }

    setProcessing(true);

    try {
      const response = await fetch(`${API_URL}/background-check/initiate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_id: user.id,
          ...formData,
          payment_method: paymentMethod
        })
      });

      const result = await response.json();

      if (response.ok) {
        toast({
          title: 'Background Check Initiated! 🎉',
          description: 'Your background check is being processed. You will be notified once completed (typically 1-3 business days).'
        });
        
        // Refresh profile to show pending status
        setTimeout(() => {
          navigate('/pro/dashboard');
        }, 2000);
      } else {
        throw new Error(result.detail || 'Failed to initiate background check');
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to initiate background check. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If already verified
  if (profile?.background_check_verified) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <button
            onClick={() => navigate('/pro/dashboard')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </button>

          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Shield className="w-12 h-12 text-white fill-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">You're Verified!</h1>
            <p className="text-xl text-gray-600 mb-6">
              Your background check was completed successfully
            </p>
            <div className="flex items-center justify-center gap-2 mb-8">
              <VerificationBadge verified={true} verificationDate={profile.background_check_date} showDate={true} size="lg" />
            </div>
            <p className="text-gray-600 mb-8">
              Your verification badge is now displayed on your profile, quotes, and in search results
            </p>
            <button
              onClick={() => navigate('/pro/dashboard')}
              className="bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // If verification is pending
  if (profile?.background_check_status === 'pending') {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <button
            onClick={() => navigate('/pro/dashboard')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </button>

          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Shield className="w-12 h-12 text-yellow-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Background Check In Progress</h1>
            <p className="text-xl text-gray-600 mb-8">
              Your background check is being processed. This typically takes 1-3 business days.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-md mx-auto mb-8">
              <p className="text-sm text-blue-900">
                <strong>What happens next?</strong><br />
                We'll email you once your background check is complete. Your verification badge will automatically appear on your profile.
              </p>
            </div>
            <button
              onClick={() => navigate('/pro/dashboard')}
              className="bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main form for new verification
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => navigate('/pro/dashboard')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Dashboard</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Benefits Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border-2 border-green-200 sticky top-6">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                <Shield className="w-8 h-8 text-white fill-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Why Get Verified?</h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <TrendingUp className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900">Stand Out</p>
                    <p className="text-sm text-gray-600">Show customers you're trustworthy</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Star className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900">Win More Jobs</p>
                    <p className="text-sm text-gray-600">Verified pros get more quote requests</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Award className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900">Build Trust</p>
                    <p className="text-sm text-gray-600">Customers prefer verified professionals</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-white rounded-lg">
                <p className="text-sm text-gray-600 mb-2"><strong>One-time fee:</strong></p>
                <p className="text-3xl font-bold text-green-600">$50</p>
                <p className="text-xs text-gray-500 mt-1">Pay with card or use your credits</p>
              </div>
            </div>
          </div>

          {/* Main Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Get Background Check Verified</h1>
              <p className="text-gray-600 mb-8">Complete the form below to start your verification process</p>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Legal Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder="John Smith"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth *</label>
                      <input
                        type="date"
                        required
                        value={formData.dob}
                        onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* SSN */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Social Security Number * 
                    <span className="text-xs text-gray-500 ml-2">(Encrypted & Secure)</span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="password"
                      required
                      value={formData.ssn}
                      onChange={(e) => setFormData({ ...formData, ssn: e.target.value })}
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="XXX-XX-XXXX"
                      maxLength="11"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Your information is encrypted and handled securely by Checkr</p>
                </div>

                {/* Address */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Address</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Street Address *</label>
                      <input
                        type="text"
                        required
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder="123 Main St"
                      />
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                        <input
                          type="text"
                          required
                          value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          placeholder="New York"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
                        <input
                          type="text"
                          required
                          value={formData.state}
                          onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          placeholder="NY"
                          maxLength="2"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code *</label>
                        <input
                          type="text"
                          required
                          value={formData.zipCode}
                          onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          placeholder="10001"
                          maxLength="5"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Method</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <label
                      className={`relative flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition ${
                        paymentMethod === 'card'
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="card"
                        checked={paymentMethod === 'card'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-4 h-4 text-red-600"
                      />
                      <CreditCard className="w-6 h-6 text-gray-600" />
                      <div>
                        <p className="font-semibold text-gray-900">Credit/Debit Card</p>
                        <p className="text-sm text-gray-600">Pay $50 now</p>
                      </div>
                    </label>

                    <label
                      className={`relative flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition ${
                        paymentMethod === 'credits'
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="credits"
                        checked={paymentMethod === 'credits'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-4 h-4 text-red-600"
                      />
                      <Wallet className="w-6 h-6 text-gray-600" />
                      <div>
                        <p className="font-semibold text-gray-900">Use Credits</p>
                        <p className="text-sm text-gray-600">
                          Balance: ${profile?.weekly_budget || 0}
                        </p>
                      </div>
                      {profile?.weekly_budget < 50 && (
                        <div className="absolute -top-2 -right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
                          Insufficient
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                {/* Consent */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      required
                      checked={formData.consent}
                      onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                      className="mt-1 w-5 h-5 text-red-600 rounded"
                    />
                    <div className="text-sm text-gray-700">
                      <p className="font-semibold mb-1">I consent to the background check *</p>
                      <p className="text-gray-600">
                        I authorize FixItNow and Checkr to obtain consumer reports and related information about me for employment purposes. 
                        I understand that the background check will include criminal history and other relevant records.
                      </p>
                    </div>
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={processing}
                  className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-4 rounded-lg font-bold text-lg hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {processing ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Processing...
                    </span>
                  ) : (
                    `Submit & Pay $50`
                  )}
                </button>

                <p className="text-xs text-gray-500 text-center">
                  Your information is encrypted and processed securely. Results typically available in 1-3 business days.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BackgroundCheck;
