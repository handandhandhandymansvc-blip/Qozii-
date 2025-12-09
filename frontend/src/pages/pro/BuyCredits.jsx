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
      console.error('Error in payment status check:', error);
    }
  };

  const handlePurchase = async (packageId) => {
    if (!user) return;
    
    setPurchasing(true);
    setSelectedPackage(packageId);

    try {
      const originUrl = window.location.origin;
      const session = await createCheckoutSession(packageId, user.id, originUrl);
      
      // Redirect to Stripe Checkout
      window.location.href = session.url;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create checkout session. Please try again.",
        variant: "destructive"
      });
      setPurchasing(false);
      setSelectedPackage(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const packageArray = Object.entries(packages).map(([id, pkg]) => ({
    id,
    ...pkg
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate('/pro/dashboard')}
            className="flex items-center gap-2 text-gray-700 hover:text-red-600 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Buy Lead Credits</h1>
          <p className="text-gray-600 mt-1">Invest in your business growth</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Current Balance Card */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-2xl shadow-2xl p-8 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm font-medium mb-2">Your Current Balance</p>
              <h2 className="text-5xl font-bold mb-2">${(profile?.weekly_budget || 0).toFixed(2)}</h2>
              <p className="text-red-100">Available for {Math.floor((profile?.weekly_budget || 0) / 10)} leads</p>
            </div>
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
              <Wallet className="w-12 h-12" />
            </div>
          </div>
          
          <div className="mt-6 grid grid-cols-3 gap-4 pt-6 border-t border-red-500">
            <div>
              <p className="text-red-100 text-xs mb-1">This Week Spent</p>
              <p className="text-2xl font-bold">${(profile?.weekly_spent || 0).toFixed(2)}</p>
            </div>
            <div>
              <p className="text-red-100 text-xs mb-1">Leads Purchased</p>
              <p className="text-2xl font-bold">{paymentHistory.filter(h => h.payment_status === 'paid').length}</p>
            </div>
            <div>
              <p className="text-red-100 text-xs mb-1">Cost Per Lead</p>
              <p className="text-2xl font-bold">$10</p>
            </div>
          </div>
        </div>

        {/* Why Buy More Section */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Why professionals love FixItNow</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span><strong>50-75% cheaper</strong> than Thumbtack ($20-60/lead)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span>Only <strong>$10 per lead</strong> - keep more of your earnings</span>
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
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{pkg.description.split(' ')[0]} Leads</h3>
                    <p className="text-gray-500 text-sm">{pkg.description}</p>
                  </div>

                  <div className="text-center mb-6">
                    <div className="flex items-baseline justify-center gap-1 mb-2">
                      <span className="text-4xl font-bold text-gray-900">${pkg.amount}</span>
                    </div>
                    <p className="text-gray-500 text-sm">= {leads} job opportunities</p>
                  </div>

                  <button
                    onClick={() => handlePurchase(pkg.id)}
                    disabled={purchasing && selectedPackage === pkg.id}
                    className={`w-full py-3 rounded-xl font-semibold transition-all ${
                      isPopular
                        ? 'bg-gradient-to-r from-red-600 to-red-700 text-white hover:shadow-lg'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {purchasing && selectedPackage === pkg.id ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Processing...
                      </span>
                    ) : (
                      'Buy Now'
                    )}
                  </button>

                  <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Shield className="w-4 h-4 text-green-600" />
                      <span>Secure payment</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <span>Credits never expire</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Payment Methods Accepted */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">Secure Payment Options</h3>
          <div className="flex flex-wrap items-center justify-center gap-6">
            <div className="flex items-center gap-2 text-gray-700">
              <CreditCard className="w-6 h-6" />
              <span>All Major Cards</span>
            </div>
            <div className="text-gray-300">|</div>
            <div className="text-gray-700 font-semibold">Apple Pay</div>
            <div className="text-gray-300">|</div>
            <div className="text-gray-700 font-semibold">Google Pay</div>
            <div className="text-gray-300">|</div>
            <div className="text-gray-700 font-semibold">Buy Now Pay Later</div>
          </div>
          <p className="text-center text-gray-500 text-sm mt-4">
            <Shield className="w-4 h-4 inline mr-1" />
            256-bit SSL encryption • PCI compliant • Secure checkout by Stripe
          </p>
        </div>

        {/* Recent Purchases */}
        {paymentHistory.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">Recent Purchases</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Package</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Credits</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paymentHistory.slice(0, 5).map((tx) => (
                    <tr key={tx.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(tx.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 capitalize">
                        {tx.package_id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        ${tx.amount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-semibold">
                        +${tx.credits.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          tx.payment_status === 'paid' ? 'bg-green-100 text-green-800' :
                          tx.payment_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {tx.payment_status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default BuyCredits;
