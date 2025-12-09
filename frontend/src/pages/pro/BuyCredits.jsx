import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, CreditCard, DollarSign, Check, Zap, TrendingUp, Shield, Clock, Wallet } from 'lucide-react';
import { getPaymentPackages, createCheckoutSession, getCheckoutStatus, getProProfile, getPaymentHistory } from '../../services/api';
import { useToast } from '../../hooks/use-toast';

const BuyCredits = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [packages, setPackages] = useState({});
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [paymentHistory, setPaymentHistory] = useState([]);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/pro/login');
      return;
    }
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    loadData(parsedUser.id);

    // Check for payment success
    const sessionId = searchParams.get('session_id');
    if (sessionId) {
      checkPaymentStatus(sessionId);
    }
  }, [navigate, searchParams]);

  const loadData = async (userId) => {
    try {
      const [pkgs, prof, history] = await Promise.all([
        getPaymentPackages(),
        getProProfile(userId),
        getPaymentHistory(userId)
      ]);
      setPackages(pkgs);
      setProfile(prof);
      setPaymentHistory(history);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkPaymentStatus = async (sessionId) => {
    try {
      // Poll for payment status
      let attempts = 0;
      const maxAttempts = 5;

      const pollStatus = async () => {
        if (attempts >= maxAttempts) {
          toast({
            title: "Payment Check Timeout",
            description: "Please refresh the page to see your updated balance.",
            variant: "default"
          });
          return;
        }

        try {
          const status = await getCheckoutStatus(sessionId);
          
          if (status.payment_status === 'paid') {
            toast({
              title: "Payment Successful! 🎉",
              description: `Credits added to your account. Redirecting to dashboard...`,
            });
            
            // Reload profile to show updated balance
            await loadData(user.id);
            
            // Redirect to dashboard after 2 seconds
            setTimeout(() => {
              navigate('/pro/dashboard');
            }, 2000);
          } else if (status.status === 'expired') {
            toast({
              title: "Payment Session Expired",
              description: "Please try purchasing credits again.",
              variant: "destructive"
            });
          } else {
            // Continue polling
            attempts++;
            setTimeout(pollStatus, 2000);
          }
        } catch (error) {
          console.error('Error checking payment status:', error);
          attempts++;
          setTimeout(pollStatus, 2000);
        }
      };

      pollStatus();
    } catch (error) {
      console.error('Error in checkPaymentStatus:', error);
    }
  };

  const handlePurchase = async (packageId) => {
    setPurchasing(true);
    try {
      const result = await createCheckoutSession(packageId);
      if (result.url) {
        // Redirect to Stripe Checkout
        window.location.href = result.url;
      } else {
        toast({
          title: "Error",
          description: "Failed to create checkout session. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error creating checkout:', error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setPurchasing(false);
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

  const packageArray = Object.entries(packages).map(([id, pkg]) => ({
    id,
    ...pkg
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/pro/dashboard')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Dashboard</span>
            </button>
            {profile && (
              <div className="flex items-center gap-3">
                <Wallet className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Current Balance</p>
                  <p className="text-lg font-bold text-gray-900">${profile.weekly_budget || 0}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Invest in Your Success</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Purchase credits to connect with quality customers and grow your business
          </p>
        </div>

        {/* Benefits Section */}
        <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-3xl p-8 mb-12">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Shield className="w-6 h-6 text-red-600" />
                Why Our Platform Works
              </h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span><strong>Pre-qualified customers</strong> who are ready to hire</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span><strong>Instant notifications</strong> when new jobs match your skills</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span><strong>Direct communication</strong> with customers</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Why professionals love FixItNow</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span><strong>Competitive pricing</strong> - Great value for quality leads</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span>100% verified customers ready to hire</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span>Instant notifications for new opportunities</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Credit Packages */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Choose Your Package</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {packageArray.map((pkg, index) => {
              const isPopular = index === 1; // Make "basic" popular
              const leads = pkg.credits / 10;
              
              return (
                <div
                  key={pkg.id}
                  className={`relative bg-white rounded-2xl shadow-lg p-6 transition-all hover:shadow-2xl hover:scale-105 ${
                    isPopular ? 'ring-4 ring-red-500' : ''
                  }`}
                >
                  {isPopular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <span className="bg-red-600 text-white px-4 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                        <Zap className="w-4 h-4" />
                        Most Popular
                      </span>
                    </div>
                  )}
                  
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <CreditCard className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 capitalize mb-2">{pkg.id}</h3>
                    <div className="mb-2">
                      <span className="text-4xl font-bold text-gray-900">${pkg.amount}</span>
                    </div>
                    <p className="text-gray-600 text-sm">{pkg.description}</p>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-600" />
                      <span className="text-gray-700"><strong>${pkg.credits}</strong> in credits</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <TrendingUp className="w-4 h-4 text-blue-600" />
                      <span className="text-gray-700">Connect with quality customers</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-purple-600" />
                      <span className="text-gray-700">Credits never expire</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handlePurchase(pkg.id)}
                    disabled={purchasing}
                    className={`w-full py-3 rounded-lg font-semibold transition ${
                      isPopular
                        ? 'bg-red-600 text-white hover:bg-red-700'
                        : 'bg-gray-900 text-white hover:bg-gray-800'
                    } disabled:opacity-50`}
                  >
                    {purchasing ? 'Processing...' : 'Buy Now'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Payment History */}
        {paymentHistory.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Payment History</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Type</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paymentHistory.slice(0, 5).map((payment, index) => (
                    <tr key={index}>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {new Date(payment.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 capitalize">
                        {payment.payment_type.replace('_', ' ')}
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                        ${payment.amount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* FAQ Section */}
        <div className="mt-12 bg-white rounded-2xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">How do credits work?</h4>
              <p className="text-gray-600">Credits allow you to respond to customer job requests. Each time you submit a quote, credits are deducted from your balance.</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Do credits expire?</h4>
              <p className="text-gray-600">No! Your credits never expire. Use them at your own pace.</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Can I get a refund?</h4>
              <p className="text-gray-600">Unused credits can be refunded within 30 days of purchase. Contact our support team for assistance.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyCredits;