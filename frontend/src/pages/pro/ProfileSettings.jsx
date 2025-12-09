import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { ArrowLeft, Save, DollarSign } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';

const API_URL = `${process.env.REACT_APP_BACKEND_URL}/api`;

const categories = [
  { value: 'handyman', label: 'Handyman' },
  { value: 'plumbing', label: 'Plumbing' },
  { value: 'electrical', label: 'Electrical' },
  { value: 'painting', label: 'Painting' },
  { value: 'carpet_cleaning', label: 'Carpet Cleaning' },
  { value: 'landscaping', label: 'Landscaping' },
  { value: 'cleaning', label: 'Cleaning' },
  { value: 'hvac', label: 'HVAC' },
  { value: 'roofing', label: 'Roofing' },
  { value: 'other', label: 'Other' }
];

const ProfileSettings = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    bio: '',
    services: [],
    service_areas: '',
    hourly_rate: '',
    years_experience: '',
    weekly_budget: ''
  });

  useEffect(() => {
    fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    try {
      const response = await axios.get(`${API_URL}/pros/${user.id}/profile`);
      const data = response.data;
      setProfile({
        bio: data.bio || '',
        services: data.services || [],
        service_areas: data.service_areas?.join(', ') || '',
        hourly_rate: data.hourly_rate || '',
        years_experience: data.years_experience || '',
        weekly_budget: data.weekly_budget || ''
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updateData = {
        bio: profile.bio,
        services: profile.services,
        service_areas: profile.service_areas.split(',').map(s => s.trim()),
        hourly_rate: profile.hourly_rate ? parseFloat(profile.hourly_rate) : null,
        years_experience: profile.years_experience ? parseInt(profile.years_experience) : null
      };

      await axios.put(`${API_URL}/pros/${user.id}/profile`, updateData);
      
      if (profile.weekly_budget) {
        await axios.put(`${API_URL}/pros/${user.id}/budget?budget=${parseFloat(profile.weekly_budget)}`);
      }

      toast({
        title: "Profile Updated!",
        description: "Your profile has been saved successfully."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const toggleService = (service) => {
    if (profile.services.includes(service)) {
      setProfile({ ...profile, services: profile.services.filter(s => s !== service) });
    } else {
      setProfile({ ...profile, services: [...profile.services, service] });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gradient-to-r from-gray-900 to-red-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 hover:text-red-200">
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Profile Settings</h1>

        <div className="bg-white rounded-xl shadow-lg p-8 space-y-6">
          {/* Bio */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Bio</label>
            <textarea
              rows="4"
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none resize-none"
              placeholder="Tell customers about your experience and skills..."
            ></textarea>
          </div>

          {/* Services */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Services You Offer</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => toggleService(cat.value)}
                  className={`px-4 py-2 rounded-lg border-2 font-semibold transition-all ${
                    profile.services.includes(cat.value)
                      ? 'bg-red-600 text-white border-red-600'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Service Areas */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Service Areas (Cities/Zips)</label>
            <input
              type="text"
              value={profile.service_areas}
              onChange={(e) => setProfile({ ...profile, service_areas: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none"
              placeholder="Dallas, Forney, 75001, 75002"
            />
            <p className="text-sm text-gray-500 mt-1">Separate multiple areas with commas</p>
          </div>

          {/* Rates & Experience */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Hourly Rate ($)</label>
              <input
                type="number"
                step="0.01"
                value={profile.hourly_rate}
                onChange={(e) => setProfile({ ...profile, hourly_rate: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none"
                placeholder="75.00"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Years Experience</label>
              <input
                type="number"
                value={profile.years_experience}
                onChange={(e) => setProfile({ ...profile, years_experience: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none"
                placeholder="5"
              />
            </div>
          </div>

          {/* Weekly Budget */}
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-lg p-6">
            <div className="flex items-start gap-3 mb-4">
              <DollarSign className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-lg text-gray-900 mb-1">Weekly Lead Budget</h3>
                <p className="text-sm text-gray-600">Set how much you want to spend on job leads per week. Each quote submission costs $10.</p>
              </div>
            </div>
            <input
              type="number"
              step="0.01"
              value={profile.weekly_budget}
              onChange={(e) => setProfile({ ...profile, weekly_budget: e.target.value })}
              className="w-full px-4 py-3 border-2 border-yellow-300 rounded-lg focus:border-yellow-500 focus:outline-none"
              placeholder="100.00"
            />
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-4 rounded-lg font-bold text-lg hover:shadow-lg transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Save Profile
              </>
            )}
          </button>
        </div>
      </main>
    </div>
  );
};

export default ProfileSettings;
