import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Upload, X, Camera, Image as ImageIcon, Trash2 } from 'lucide-react';
import { getProProfile, updateProProfile, uploadProImage, deletePortfolioImage } from '../../services/api';
import { useToast } from '../../hooks/use-toast';

const ProfileSettingsEnhanced = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [profile, setProfile] = useState({
    bio: '',
    services: [],
    service_areas: '',
    hourly_rate: '',
    years_experience: '',
    weekly_budget: '',
    profile_image: null,
    logo_image: null,
    portfolio_images: [],
    cashapp_handle: ''
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
      const data = await getProProfile(userId);
      setProfile({
        bio: data.bio || '',
        services: data.services || [],
        service_areas: data.service_areas ? data.service_areas.join(', ') : '',
        hourly_rate: data.hourly_rate || '',
        years_experience: data.years_experience || '',
        weekly_budget: data.weekly_budget || '',
        profile_image: data.profile_image || null,
        logo_image: data.logo_image || null,
        portfolio_images: data.portfolio_images || [],
        cashapp_handle: data.cashapp_handle || ''
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e, imageType) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'File Too Large',
        description: 'Please upload an image smaller than 5MB',
        variant: 'destructive'
      });
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid File Type',
        description: 'Please upload an image file',
        variant: 'destructive'
      });
      return;
    }

    setUploadingImage(true);

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Image = reader.result;
        
        await uploadProImage(user.id, imageType, base64Image);
        
        // Update local state
        if (imageType === 'profile') {
          setProfile({ ...profile, profile_image: base64Image });
        } else if (imageType === 'logo') {
          setProfile({ ...profile, logo_image: base64Image });
        } else if (imageType === 'portfolio') {
          setProfile({ ...profile, portfolio_images: [...profile.portfolio_images, base64Image] });
        }

        toast({
          title: 'Image Uploaded',
          description: 'Your image has been uploaded successfully',
        });
      };
      reader.readAsDataURL(file);
    } catch (error) {
      toast({
        title: 'Upload Failed',
        description: 'Failed to upload image. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleDeletePortfolioImage = async (index) => {
    try {
      await deletePortfolioImage(user.id, index);
      const newPortfolio = profile.portfolio_images.filter((_, i) => i !== index);
      setProfile({ ...profile, portfolio_images: newPortfolio });
      toast({
        title: 'Image Deleted',
        description: 'Portfolio image removed successfully',
      });
    } catch (error) {
      toast({
        title: 'Delete Failed',
        description: 'Failed to delete image. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updateData = {
        bio: profile.bio,
        services: profile.services,
        service_areas: profile.service_areas.split(',').map(s => s.trim()).filter(s => s),
        hourly_rate: profile.hourly_rate ? parseFloat(profile.hourly_rate) : null,
        years_experience: profile.years_experience ? parseInt(profile.years_experience) : null,
        cashapp_handle: profile.cashapp_handle
      };

      await updateProProfile(user.id, updateData);
      
      toast({
        title: 'Profile Updated',
        description: 'Your profile has been saved successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update profile. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate('/pro/dashboard')}
            className="flex items-center gap-2 text-gray-700 hover:text-red-600 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
          <p className="text-gray-600 mt-1">Manage your professional profile and showcase your work</p>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Images Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Profile Images</h2>
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Profile Picture */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Profile Picture</label>
              <div className="relative w-full h-48 bg-gray-100 rounded-xl overflow-hidden border-2 border-dashed border-gray-300 hover:border-red-400 transition-colors">
                {profile.profile_image ? (
                  <img src={profile.profile_image} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400">
                    <Camera className="w-12 h-12 mb-2" />
                    <p className="text-sm">Add your photo</p>
                  </div>
                )}
                <label className="absolute inset-0 cursor-pointer flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity">
                  <Upload className="w-8 h-8 text-white" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'profile')}
                    className="hidden"
                    disabled={uploadingImage}
                  />
                </label>
              </div>
              <p className="text-xs text-gray-500 mt-2">Recommended: Square image, max 5MB</p>
            </div>

            {/* Business Logo */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Business Logo</label>
              <div className="relative w-full h-48 bg-gray-100 rounded-xl overflow-hidden border-2 border-dashed border-gray-300 hover:border-red-400 transition-colors">
                {profile.logo_image ? (
                  <img src={profile.logo_image} alt="Logo" className="w-full h-full object-contain p-4" />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400">
                    <ImageIcon className="w-12 h-12 mb-2" />
                    <p className="text-sm">Add your logo</p>
                  </div>
                )}
                <label className="absolute inset-0 cursor-pointer flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity">
                  <Upload className="w-8 h-8 text-white" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'logo')}
                    className="hidden"
                    disabled={uploadingImage}
                  />
                </label>
              </div>
              <p className="text-xs text-gray-500 mt-2">Recommended: PNG with transparent background</p>
            </div>
          </div>

          {/* Portfolio Gallery */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Work Portfolio</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              {profile.portfolio_images.map((img, index) => (
                <div key={index} className="relative group aspect-square">
                  <img src={img} alt={`Work ${index + 1}`} className="w-full h-full object-cover rounded-lg" />
                  <button
                    onClick={() => handleDeletePortfolioImage(index)}
                    className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              
              {/* Add New Portfolio Image */}
              <label className="aspect-square bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 hover:border-red-400 transition-colors cursor-pointer flex flex-col items-center justify-center text-gray-400 hover:text-red-600">
                <Upload className="w-8 h-8 mb-2" />
                <p className="text-xs">Add Photo</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'portfolio')}
                  className="hidden"
                  disabled={uploadingImage}
                />
              </label>
            </div>
            <p className="text-xs text-gray-500">Showcase your best work (max 12 images)</p>
          </div>
        </div>

        {/* Basic Info */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Professional Information</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Bio</label>
              <textarea
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                rows="4"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none"
                placeholder="Tell customers about your experience and expertise..."
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Hourly Rate ($)</label>
                <input
                  type="number"
                  value={profile.hourly_rate}
                  onChange={(e) => setProfile({ ...profile, hourly_rate: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none"
                  placeholder="50"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Years of Experience</label>
                <input
                  type="number"
                  value={profile.years_experience}
                  onChange={(e) => setProfile({ ...profile, years_experience: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none"
                  placeholder="5"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Service Areas (comma separated)</label>
              <input
                type="text"
                value={profile.service_areas}
                onChange={(e) => setProfile({ ...profile, service_areas: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none"
                placeholder="New York, Brooklyn, Queens"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Cash App Handle (for payments)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="text"
                  value={profile.cashapp_handle}
                  onChange={(e) => setProfile({ ...profile, cashapp_handle: e.target.value })}
                  className="w-full pl-8 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none"
                  placeholder="yourcashtag"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Customers can pay you directly via Cash App</p>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex gap-4">
          <button
            onClick={handleSave}
            disabled={saving || uploadingImage}
            className="flex-1 px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
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

export default ProfileSettingsEnhanced;