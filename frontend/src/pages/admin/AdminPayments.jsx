import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, DollarSign, CreditCard, Package, TrendingUp, Edit2, Save, X } from 'lucide-react';
import { getAdminPaymentPackages, updatePaymentPackage, getAllTransactions, getPaymentStats, getAdminSettings, updateAdminSettings } from '../../services/api';
import { useToast } from '../../hooks/use-toast';

const AdminPayments = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [packages, setPackages] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState(null);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingPackage, setEditingPackage] = useState(null);
  const [savingSettings, setSavingSettings] = useState(false);

  useEffect(() => {
    const adminData = localStorage.getItem('admin');
    if (!adminData) {
      navigate('/admin/login');
      return;
    }
    loadData();
  }, [navigate]);

  const loadData = async () => {
    try {
      const [pkgs, txs, sts, stgs] = await Promise.all([
        getAdminPaymentPackages(),
        getAllTransactions(50),
        getPaymentStats(),
        getAdminSettings()
      ]);
      setPackages(pkgs);
      setTransactions(txs);
      setStats(sts);
      setSettings(stgs);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSavePackage = async (pkg) => {
    try {
      await updatePaymentPackage(pkg.package_id, {
        name: pkg.name,
        amount: parseFloat(pkg.amount),
        credits: parseFloat(pkg.credits),
        description: pkg.description,
        is_active: pkg.is_active
      });
      await loadData();
      setEditingPackage(null);
      toast({
        title: "Package Updated",
        description: "Payment package has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update package.",
        variant: "destructive"
      });
    }
  };

  const handleSaveSettings = async () => {
    setSavingSettings(true);
    try {
      await updateAdminSettings(settings);
      toast({
        title: "Settings Saved",
        description: "Payment method settings updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update settings.",
        variant: "destructive"
      });
    } finally {
      setSavingSettings(false);
    }
  };

  if (loading || !stats || !settings) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading payment data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="flex items-center gap-2 text-gray-700 hover:text-red-600 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Payment Management</h1>
          <p className="text-gray-600 mt-2">Control payment methods, packages, and view all transactions</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-4">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-gray-500 text-sm font-medium mb-1">Total Revenue</h3>
            <p className="text-3xl font-bold text-gray-900">${stats.total_revenue.toFixed(2)}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-gray-500 text-sm font-medium mb-1">This Month</h3>
            <p className="text-3xl font-bold text-gray-900">${stats.monthly_revenue.toFixed(2)}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-gray-500 text-sm font-medium mb-1">Transactions</h3>
            <p className="text-3xl font-bold text-gray-900">{stats.total_transactions}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mb-4">
              <Package className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-gray-500 text-sm font-medium mb-1">Avg Transaction</h3>
            <p className="text-3xl font-bold text-gray-900">${stats.avg_transaction.toFixed(2)}</p>
          </div>
        </div>

        {/* Payment Method Settings */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Payment Methods</h2>
            <button
              onClick={handleSaveSettings}
              disabled={savingSettings}
              className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              Save Settings
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { key: 'enable_stripe', label: 'Stripe (Cards)', desc: 'All major credit/debit cards' },
              { key: 'enable_apple_pay', label: 'Apple Pay', desc: 'Apple device payments' },
              { key: 'enable_google_pay', label: 'Google Pay', desc: 'Google wallet payments' },
              { key: 'enable_cashapp', label: 'Cash App', desc: 'Pros can share their $cashtag' },
              { key: 'enable_paypal', label: 'PayPal', desc: 'PayPal account payments' },
              { key: 'enable_bnpl', label: 'Buy Now Pay Later', desc: 'Klarna, Affirm, Afterpay' },
            ].map((method) => (
              <label key={method.key} className="flex items-start gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-red-300 transition-colors">
                <input
                  type="checkbox"
                  checked={settings[method.key]}
                  onChange={(e) => setSettings({ ...settings, [method.key]: e.target.checked })}
                  className="mt-1 w-5 h-5 text-red-600 rounded focus:ring-red-500"
                />
                <div>
                  <p className="font-semibold text-gray-900">{method.label}</p>
                  <p className="text-sm text-gray-500">{method.desc}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Payment Packages */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Lead Credit Packages</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {packages.map((pkg) => (
              <div key={pkg.id} className="border-2 border-gray-200 rounded-xl p-6">
                {editingPackage?.id === pkg.id ? (
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={editingPackage.name}
                      onChange={(e) => setEditingPackage({ ...editingPackage, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder="Package Name"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Amount ($)</label>
                        <input
                          type="number"
                          step="0.01"
                          value={editingPackage.amount}
                          onChange={(e) => setEditingPackage({ ...editingPackage, amount: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Credits ($)</label>
                        <input
                          type="number"
                          step="0.01"
                          value={editingPackage.credits}
                          onChange={(e) => setEditingPackage({ ...editingPackage, credits: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                      </div>
                    </div>
                    <input
                      type="text"
                      value={editingPackage.description}
                      onChange={(e) => setEditingPackage({ ...editingPackage, description: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder="Description"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSavePackage(editingPackage)}
                        className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700"
                      >
                        <Save className="w-4 h-4 inline mr-2" />
                        Save
                      </button>
                      <button
                        onClick={() => setEditingPackage(null)}
                        className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300"
                      >
                        <X className="w-4 h-4 inline mr-2" />
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{pkg.name}</h3>
                        <p className="text-sm text-gray-500">{pkg.description}</p>
                      </div>
                      <button
                        onClick={() => setEditingPackage(pkg)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-3xl font-bold text-gray-900">${pkg.amount}</span>
                      <span className="text-gray-500">= ${pkg.credits} credits</span>
                    </div>
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      pkg.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {pkg.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Recent Transactions</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pro</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Package</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(tx.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{tx.pro_name || 'Unknown'}</div>
                      <div className="text-sm text-gray-500">{tx.pro_email || tx.pro_id.substring(0, 8)}...</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {tx.package_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                      ${tx.amount.toFixed(2)}
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
      </main>
    </div>
  );
};

export default AdminPayments;
