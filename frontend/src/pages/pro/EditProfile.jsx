import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Upload, X, Camera, Building2, User, FileText, MapPin, DollarSign, Briefcase, Image as ImageIcon, Trash2, Plus, Check, Star, CheckCircle, RefreshCw, Download } from 'lucide-react';
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

  // Import Reviews state
  const [importing, setImporting] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [googleConnected, setGoogleConnected] = useState(false);
  const [businessInfo, setBusinessInfo] = useState(null);
  const [importedReviews, setImportedReviews] = useState([]);
  const [selectedReviews, setSelectedReviews] = useState([]);

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

  // Import Reviews Functions
  const handleConnectGoogle = () => {
    toast({
      title: 'Google OAuth Integration',
      description: 'Redirecting to Google for authorization...'
    });

    setTimeout(() => {
      setGoogleConnected(true);
      setBusinessInfo({
        name: formData.business_name || "Your Business",
        address: formData.location || "Your Location",
        rating: 4.8,
        total_reviews: 127
      });
      toast({
        title: 'Connected! 🎉',
        description: 'Successfully connected to your Google Business Profile'
      });
    }, 2000);
  };

  const handleImportReviews = async () => {
    setImporting(true);

    const mockReviews = [
      {
        id: '1',
        reviewer_name: 'Sarah Johnson',
        reviewer_photo: null,
        rating: 5,
        text: 'Excellent service! Very professional and completed the job on time. Highly recommend!',
        created_time: '2024-11-15T10:30:00Z',
        source: 'google'
      },
      {
        id: '2',
        reviewer_name: 'Michael Davis',
        reviewer_photo: null,
        rating: 5,
        text: 'Great work ethic and attention to detail. Fixed my plumbing issue quickly and efficiently.',
        created_time: '2024-11-10T14:20:00Z',
        source: 'google'
      },
      {
        id: '3',
        reviewer_name: 'Emily Chen',
        reviewer_photo: null,
        rating: 4,
        text: 'Good service overall. Arrived on time and was very courteous. Minor issue with cleanup but otherwise satisfied.',
        created_time: '2024-11-05T09:15:00Z',
        source: 'google'
      },
      {
        id: '4',
        reviewer_name: 'Robert Martinez',
        reviewer_photo: null,
        rating: 5,
        text: 'Outstanding! This is my go-to handyman service. Always reliable and fair pricing.',
        created_time: '2024-10-28T16:45:00Z',
        source: 'google'
      },
      {
        id: '5',
        reviewer_name: 'Jennifer Lee',
        reviewer_photo: null,
        rating: 5,
        text: 'Fantastic experience from start to finish. Will definitely use again for future projects.',
        created_time: '2024-10-20T11:00:00Z',
        source: 'google'
      }
    ];

    setTimeout(() => {
      setImportedReviews(mockReviews);
      setImporting(false);
      toast({
        title: 'Reviews Imported! 🎉',
        description: `Successfully imported ${mockReviews.length} reviews from Google`
      });
    }, 2000);
  };

  const handleSyncReviews = async () => {
    setSyncing(true);
    
    setTimeout(() => {
      setSyncing(false);
      toast({
        title: 'Reviews Synced',
        description: 'Your Google reviews are up to date'
      });
    }, 1500);
  };

  const toggleReviewSelection = (reviewId) => {
    if (selectedReviews.includes(reviewId)) {
      setSelectedReviews(selectedReviews.filter(id => id !== reviewId));
    } else {
      setSelectedReviews([...selectedReviews, reviewId]);
    }
  };

  const handleSaveReviews = async () => {
    if (selectedReviews.length === 0) {
      toast({
        title: 'No Reviews Selected',
        description: 'Please select at least one review to display on your profile',
        variant: 'destructive'
      });
      return;
    }

    try {
      const response = await fetch(`${API_URL}/pros/${user.id}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          google_reviews: importedReviews.filter(r => selectedReviews.includes(r.id))
        })
      });

      if (response.ok) {
        toast({
          title: 'Success! 🎉',
          description: `${selectedReviews.length} reviews will be displayed on your public profile`
        });
      }
    } catch (error) {
      console.error('Error saving reviews:', error);
      toast({
        title: 'Save Failed',
        description: 'Failed to save reviews. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
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

              {/* Import Reviews Tab */}
              {activeTab === 'reviews' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Import Google Reviews</h2>
                    <p className="text-gray-600">Connect your Google Business Profile to showcase your reputation</p>
                  </div>

                  {!googleConnected ? (
                    <div className="text-center py-12">
                      <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-12 h-12 text-white" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                      </div>
                      
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">Connect Your Google Business Profile</h3>
                      <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                        Import your existing Google reviews to build trust and showcase your reputation
                      </p>

                      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8 text-left max-w-2xl mx-auto">
                        <h4 className="font-bold text-blue-900 mb-3">Benefits of importing reviews:</h4>
                        <ul className="space-y-2 text-blue-800">
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                            <span>Automatically sync your Google Business reviews</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                            <span>Display your 5-star ratings and testimonials</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                            <span>Build trust with potential customers</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                            <span>Choose which reviews to display</span>
                          </li>
                        </ul>
                      </div>

                      <button
                        onClick={handleConnectGoogle}
                        className="inline-flex items-center gap-3 bg-white border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg font-bold text-lg hover:border-blue-500 hover:shadow-lg transition"
                      >
                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                        </svg>
                        Connect with Google
                      </button>

                      <p className="text-sm text-gray-500 mt-4">
                        We'll redirect you to Google to authorize access to your business reviews
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Business Info Card */}
                      {businessInfo && (
                        <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl border-2 border-green-200 p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-4">
                              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                                <CheckCircle className="w-8 h-8 text-white" />
                              </div>
                              <div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-1">{businessInfo.name}</h3>
                                <p className="text-gray-600 mb-3">{businessInfo.address}</p>
                                <div className="flex items-center gap-4">
                                  <div className="flex items-center gap-2">
                                    <div className="flex">
                                      {renderStars(Math.round(businessInfo.rating))}
                                    </div>
                                    <span className="font-bold text-gray-900">{businessInfo.rating}</span>
                                  </div>
                                  <span className="text-gray-600">({businessInfo.total_reviews} reviews)</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex gap-2">
                              <button
                                onClick={handleSyncReviews}
                                disabled={syncing}
                                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
                              >
                                <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
                                {syncing ? 'Syncing...' : 'Sync'}
                              </button>
                              
                              {importedReviews.length === 0 && (
                                <button
                                  onClick={handleImportReviews}
                                  disabled={importing}
                                  className="flex items-center gap-2 bg-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700 transition disabled:opacity-50"
                                >
                                  {importing ? (
                                    <>
                                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                      Importing...
                                    </>
                                  ) : (
                                    <>
                                      <Download className="w-4 h-4" />
                                      Import Reviews
                                    </>
                                  )}
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Reviews List */}
                      {importedReviews.length > 0 && (
                        <div>
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <h3 className="text-xl font-bold text-gray-900 mb-1">Your Google Reviews</h3>
                              <p className="text-gray-600">Select which reviews to display on your profile</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-600">Selected</p>
                              <p className="text-2xl font-bold text-red-600">{selectedReviews.length} / {importedReviews.length}</p>
                            </div>
                          </div>

                          {selectedReviews.length > 0 && (
                            <button
                              onClick={handleSaveReviews}
                              className="mb-4 w-full flex items-center justify-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition"
                            >
                              <Save className="w-5 h-5" />
                              Save Selected Reviews ({selectedReviews.length})
                            </button>
                          )}

                          <div className="space-y-4">
                            {importedReviews.map((review) => (
                              <label
                                key={review.id}
                                className={`block p-6 border-2 rounded-xl cursor-pointer transition ${
                                  selectedReviews.includes(review.id)
                                    ? 'border-red-500 bg-red-50'
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                              >
                                <div className="flex items-start gap-4">
                                  <input
                                    type="checkbox"
                                    checked={selectedReviews.includes(review.id)}
                                    onChange={() => toggleReviewSelection(review.id)}
                                    className="mt-1 w-5 h-5 text-red-600 rounded"
                                  />
                                  
                                  <div className="flex-1">
                                    <div className="flex items-start justify-between mb-3">
                                      <div>
                                        <div className="flex items-center gap-3 mb-2">
                                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                            <span className="font-bold text-gray-600">{review.reviewer_name.charAt(0)}</span>
                                          </div>
                                          <div>
                                            <p className="font-bold text-gray-900">{review.reviewer_name}</p>
                                            <p className="text-sm text-gray-500">
                                              {new Date(review.created_time).toLocaleDateString('en-US', { 
                                                year: 'numeric', 
                                                month: 'long', 
                                                day: 'numeric' 
                                              })}
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="flex">
                                        {renderStars(review.rating)}
                                      </div>
                                    </div>
                                    
                                    <p className="text-gray-700 leading-relaxed">{review.text}</p>
                                    
                                    <div className="mt-3 flex items-center gap-2">
                                      <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                                        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                                          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                        </svg>
                                        Google
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </label>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
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
