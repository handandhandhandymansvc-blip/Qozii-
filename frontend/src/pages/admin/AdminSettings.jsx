import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, DollarSign, Percent, Shield, CheckCircle } from 'lucide-react';
import { getAdminSettings, updateAdminSettings } from '../../services/api';
import { useToast } from '../../hooks/use-toast';

const AdminSettings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const adminData = localStorage.getItem('admin');
    if (!adminData) {
      navigate('/admin/login');
      return;
    }
    loadSettings();
  }, [navigate]);

  const loadSettings = async () => {
    try {
      const data = await getAdminSettings();
      setSettings(data);
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateAdminSettings(settings);
      toast({
        title: "Settings Updated",
        description: "Platform settings have been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update settings. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="flex items-center gap-2 text-gray-700 hover:text-red-600 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Platform Settings</h1>
          <p className="text-gray-600 mt-2">Manage business rules and pricing</p>
        </div>
      </header>

      {/* Settings Form */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="space-y-8">
            {/* Pricing Section */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <DollarSign className="w-6 h-6 text-red-600" />
                Pricing Settings
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Lead Fee (Per Quote)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      step="0.01"
                      value={settings.lead_fee}
                      onChange={(e) => setSettings({ ...settings, lead_fee: parseFloat(e.target.value) })}
                      className="w-full pl-8 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none"
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Amount charged to pros per quote submission</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Platform Commission
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      value={settings.platform_commission}
                      onChange={(e) => setSettings({ ...settings, platform_commission: parseFloat(e.target.value) })}
                      className="w-full pr-10 pl-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Commission on completed jobs</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Featured Pro Fee (Monthly)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      step="0.01"
                      value={settings.featured_pro_fee}
                      onChange={(e) => setSettings({ ...settings, featured_pro_fee: parseFloat(e.target.value) })}
                      className="w-full pl-8 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none"
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Monthly fee for featured listing</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Minimum Weekly Budget
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      step="1"
                      value={settings.weekly_budget_min}
                      onChange={(e) => setSettings({ ...settings, weekly_budget_min: parseFloat(e.target.value) })}
                      className="w-full pl-8 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none"
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Minimum weekly budget for pros</p>
                </div>
              </div>
            </div>

            <hr className="border-gray-200" />

            {/* Quote Limits */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Percent className="w-6 h-6 text-red-600" />
                Quote Limits
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Minimum Quote Amount
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      step="1"
                      value={settings.min_quote_amount}
                      onChange={(e) => setSettings({ ...settings, min_quote_amount: parseFloat(e.target.value) })}
                      className="w-full pl-8 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Maximum Quote Amount
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      step="1"
                      value={settings.max_quote_amount}
                      onChange={(e) => setSettings({ ...settings, max_quote_amount: parseFloat(e.target.value) })}
                      className="w-full pl-8 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            <hr className="border-gray-200" />

            {/* Pro Approval Settings */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Shield className="w-6 h-6 text-red-600" />
                Pro Approval Settings
              </h2>
              <div className="space-y-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.auto_approve_pros}
                    onChange={(e) => setSettings({ ...settings, auto_approve_pros: e.target.checked })}
                    className="w-5 h-5 text-red-600 rounded focus:ring-red-500"
                  />
                  <div>
                    <p className="font-semibold text-gray-900">Auto-approve new pros</p>
                    <p className="text-sm text-gray-500">Allow pros to start bidding immediately after registration</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.require_background_check}
                    onChange={(e) => setSettings({ ...settings, require_background_check: e.target.checked })}
                    className="w-5 h-5 text-red-600 rounded focus:ring-red-500"
                  />
                  <div>
                    <p className="font-semibold text-gray-900">Require background check</p>
                    <p className="text-sm text-gray-500">Pros must complete background check before bidding</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-6 border-t border-gray-200">
              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    <span>Save Settings</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminSettings;