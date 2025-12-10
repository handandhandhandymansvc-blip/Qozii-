import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Upload, X, Camera, Building2, User, FileText, MapPin, DollarSign, Briefcase, Image as ImageIcon, Trash2, Plus, Check } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';

const API_URL = `${process.env.REACT_APP_BACKEND_URL}/api`;

const EditProfile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  
  const [formData, setFormData] = useState({
    business_name: '',
    name: '',
    bio: '',
    services: [],
    location: '',
    hourly_rate: '',
    years_experience: '',
    profile_picture: null,
    business_logo: null,
    portfolio_images: []
  });

  const [newService, setNewService] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  const availableServices = [
    'Plumbing', 'Electrical', 'Carpentry', 'Painting', 'HVAC',
    'Landscaping', 'Cleaning', 'Moving', 'Handyman', 'Roofing',
    'Flooring', 'Pest Control', 'Appliance Repair', 'Window Cleaning',
    'Pressure Washing', 'Snow Removal', 'Pool Service', 'Locksmith'
  ];

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
      const response = await fetch(`${API_URL}/pros/${userId}/profile`);
      if (response.ok) {
        const data = await response.json();
        setFormData({
          business_name: data.business_name || '',
          name: data.name || '',
          bio: data.bio || '',
          services: data.services || [],
          location: data.location || '',
          hourly_rate: data.hourly_rate || '',
          years_experience: data.years_experience || '',
          profile_picture: data.profile_picture || null,
          business_logo: data.business_logo || null,
          portfolio_images: data.portfolio_images || []
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (type, file) => {
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'File Too Large',
        description: 'Please upload an image smaller than 5MB',
        variant: 'destructive'
      });
      return;
    }

    setUploadingImage(true);

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Image = reader.result;
        
        if (type === 'portfolio') {
          setFormData(prev => ({
            ...prev,
            portfolio_images: [...prev.portfolio_images, base64Image]
          }));
        } else {
          setFormData(prev => ({
            ...prev,
            [type]: base64Image
          }));
        }

        toast({
          title: 'Success',
          description: 'Image uploaded successfully'
        });
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: 'Upload Failed',
        description: 'Failed to upload image. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setUploadingImage(false);
    }
  };

  const removePortfolioImage = (index) => {
    setFormData(prev => ({
      ...prev,
      portfolio_images: prev.portfolio_images.filter((_, i) => i !== index)
    }));
  };

  const addService = (service) => {
    if (!formData.services.includes(service)) {
      setFormData(prev => ({
        ...prev,
        services: [...prev.services, service]
      }));
    }
  };

  const removeService = (service) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.filter(s => s !== service)
    }));
  };

  const addCustomService = () => {
    if (newService && !formData.services.includes(newService)) {
      setFormData(prev => ({
        ...prev,
        services: [...prev.services, newService]
      }));
      setNewService('');
    }
  };

  const handleSave = async () => {
    setSaving(true);

    try {
      const response = await fetch(`${API_URL}/pros/${user.id}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        toast({
          title: 'Profile Updated! 🎉',
          description: 'Your changes have been saved successfully'
        });
        
        setTimeout(() => {
          navigate('/pro/dashboard');
        }, 1500);
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: 'Save Failed',
        description: 'Failed to save changes. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'basic', name: 'Basic Info', icon: User },
    { id: 'business', name: 'Business Details', icon: Building2 },
    { id: 'photos', name: 'Photos & Portfolio', icon: ImageIcon },
    { id: 'services', name: 'Services & Pricing', icon: Briefcase },
    { id: 'reviews', name: 'Import Reviews', icon: Star }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/pro/dashboard')}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">Back to Dashboard</span>
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-xl font-bold text-gray-900">Edit Profile</h1>
            </div>
            
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 bg-red-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-red-700 transition disabled:opacity-50"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Tabs */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-4 sticky top-24">
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition ${
                        activeTab === tab.id
                          ? 'bg-red-600 text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {tab.name}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-lg p-8">
              {/* Basic Info Tab */}
              {activeTab === 'basic' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Basic Information</h2>
                    <p className="text-gray-600">Tell customers about yourself</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Your Full Name *
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:ring-4 focus:ring-red-100 transition-all outline-none"
                          placeholder="John Smith"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Location / Service Area *
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          value={formData.location}
                          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                          className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:ring-4 focus:ring-red-100 transition-all outline-none"
                          placeholder="New York, NY"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Years of Experience
                      </label>
                      <input
                        type="number"
                        value={formData.years_experience}
                        onChange={(e) => setFormData({ ...formData, years_experience: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:ring-4 focus:ring-red-100 transition-all outline-none"
                        placeholder="10"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Hourly Rate ($)
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="number"
                          value={formData.hourly_rate}
                          onChange={(e) => setFormData({ ...formData, hourly_rate: e.target.value })}
                          className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:ring-4 focus:ring-red-100 transition-all outline-none"
                          placeholder="75"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      About You / Bio *
                    </label>
                    <textarea
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      rows={6}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:ring-4 focus:ring-red-100 transition-all outline-none resize-none"
                      placeholder="Tell customers about your experience, specialties, and what makes you unique..."
                    />
                    <p className="text-sm text-gray-500 mt-2">
                      {formData.bio.length}/500 characters
                    </p>
                  </div>
                </div>
              )}

              {/* Business Details Tab */}
              {activeTab === 'business' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Business Details</h2>
                    <p className="text-gray-600">Showcase your professional brand</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Business Name *
                    </label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={formData.business_name}
                        onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:ring-4 focus:ring-red-100 transition-all outline-none text-lg font-semibold"
                        placeholder="Your Business Name"
                      />
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      This will be displayed prominently on your profile
                    </p>
                  </div>

                  {/* Business Logo Upload */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Business Logo
                    </label>
                    <div className="flex items-start gap-6">
                      <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-xl overflow-hidden bg-gray-50 flex items-center justify-center">
                        {formData.business_logo ? (
                          <img src={formData.business_logo} alt="Business Logo" className="w-full h-full object-cover" />
                        ) : (
                          <Building2 className="w-12 h-12 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <label className="cursor-pointer">
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleImageUpload('business_logo', e.target.files[0])}
                          />
                          <div className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition">
                            <Upload className="w-5 h-5" />
                            Upload Logo
                          </div>
                        </label>
                        <p className="text-sm text-gray-600 mt-2">
                          Square image recommended (500x500px)<br />
                          Max file size: 5MB
                        </p>
                        {formData.business_logo && (
                          <button
                            onClick={() => setFormData({ ...formData, business_logo: null })}
                            className="text-red-600 text-sm font-semibold mt-2 hover:text-red-700"
                          >
                            Remove Logo
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Photos & Portfolio Tab */}
              {activeTab === 'photos' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Photos & Portfolio</h2>
                    <p className="text-gray-600">Show off your best work to attract more customers</p>
                  </div>

                  {/* Profile Picture */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Profile Picture
                    </label>
                    <div className="flex items-start gap-6">
                      <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-full overflow-hidden bg-gray-50 flex items-center justify-center">
                        {formData.profile_picture ? (
                          <img src={formData.profile_picture} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-12 h-12 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <label className="cursor-pointer">
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleImageUpload('profile_picture', e.target.files[0])}
                          />
                          <div className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
                            <Camera className="w-5 h-5" />
                            Upload Photo
                          </div>
                        </label>
                        <p className="text-sm text-gray-600 mt-2">
                          Professional headshot recommended<br />
                          Max file size: 5MB
                        </p>
                        {formData.profile_picture && (
                          <button
                            onClick={() => setFormData({ ...formData, profile_picture: null })}
                            className="text-red-600 text-sm font-semibold mt-2 hover:text-red-700"
                          >
                            Remove Photo
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Portfolio Images */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-4">
                      Portfolio / Work Photos ({formData.portfolio_images.length})
                    </label>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                      {formData.portfolio_images.map((image, index) => (
                        <div key={index} className="relative group aspect-square">
                          <img
                            src={image}
                            alt={`Portfolio ${index + 1}`}
                            className="w-full h-full object-cover rounded-lg"
                          />
                          <button
                            onClick={() => removePortfolioImage(index)}
                            className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition hover:bg-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      
                      {/* Upload New Button */}
                      <label className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-red-500 hover:bg-red-50 transition group">
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleImageUpload('portfolio', e.target.files[0])}
                          disabled={uploadingImage}
                        />
                        <Plus className="w-8 h-8 text-gray-400 group-hover:text-red-600 mb-2" />
                        <span className="text-sm font-medium text-gray-600 group-hover:text-red-600">Add Photo</span>
                      </label>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-sm text-blue-900">
                        <strong>Tips for great portfolio photos:</strong><br />
                        • Upload high-quality images of your completed projects<br />
                        • Show before & after photos when possible<br />
                        • Include variety - different types of jobs and angles<br />
                        • Aim for 8-12 photos for the best results
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Services & Pricing Tab */}
              {activeTab === 'services' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Services & Pricing</h2>
                    <p className="text-gray-600">Select the services you offer</p>
                  </div>

                  {/* Selected Services */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Your Services ({formData.services.length})
                    </label>
                    {formData.services.length > 0 ? (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {formData.services.map((service, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-full font-medium"
                          >
                            <Check className="w-4 h-4" />
                            {service}
                            <button
                              onClick={() => removeService(service)}
                              className="ml-1 hover:text-red-900"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 italic mb-4">No services selected yet</p>
                    )}
                  </div>

                  {/* Available Services */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Popular Services
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {availableServices.map((service) => (
                        <button
                          key={service}
                          onClick={() => addService(service)}
                          disabled={formData.services.includes(service)}
                          className={`px-4 py-3 rounded-lg font-medium text-left transition ${
                            formData.services.includes(service)
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-red-500 hover:text-red-600'
                          }`}
                        >
                          {service}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Custom Service */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Add Custom Service
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newService}
                        onChange={(e) => setNewService(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addCustomService()}
                        className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:ring-4 focus:ring-red-100 transition-all outline-none"
                        placeholder="Enter a custom service..."
                      />
                      <button
                        onClick={addCustomService}
                        className="px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
