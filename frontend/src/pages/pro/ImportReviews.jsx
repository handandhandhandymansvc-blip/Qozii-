import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Star, CheckCircle, AlertCircle, Upload, RefreshCw, ExternalLink, Download, Trash2, Eye } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';

const API_URL = `${process.env.REACT_APP_BACKEND_URL}/api`;

const ImportReviews = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);
  const [syncing, setSyncing] = useState(false);
  
  const [googleConnected, setGoogleConnected] = useState(false);
  const [businessInfo, setBusinessInfo] = useState(null);
  const [importedReviews, setImportedReviews] = useState([]);
  const [selectedReviews, setSelectedReviews] = useState([]);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/pro/login');
      return;
    }
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    fetchReviewsData(parsedUser.id);
  }, [navigate]);

  const fetchReviewsData = async (userId) => {
    try {
      const response = await fetch(`${API_URL}/pros/${userId}/reviews`);
      if (response.ok) {
        const data = await response.json();
        setImportedReviews(data.reviews || []);
        setGoogleConnected(data.google_connected || false);
        setBusinessInfo(data.business_info || null);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConnectGoogle = () => {
    // In production, this would initiate OAuth flow
    // For now, we'll simulate it
    toast({
      title: 'Google OAuth Integration',
      description: 'Redirecting to Google for authorization...'
    });

    // Simulate OAuth - in production, redirect to Google OAuth
    setTimeout(() => {
      setGoogleConnected(true);
      setBusinessInfo({
        name: "John's Professional Services",
        address: "123 Main St, Dallas, TX",
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

    // Simulate fetching reviews from Google API
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

  const handleSaveToProfile = async () => {
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
        
        setTimeout(() => {
          navigate('/pro/dashboard');
        }, 2000);
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
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

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
              <h1 className="text-xl font-bold text-gray-900">Import Google Reviews</h1>
            </div>
            
            {selectedReviews.length > 0 && (
              <button
                onClick={handleSaveToProfile}
                className="flex items-center gap-2 bg-red-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-red-700 transition"
              >
                <Save className="w-5 h-5" />
                Save to Profile ({selectedReviews.length})
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Connection Status */}
        {!googleConnected ? (
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              </div>
              
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Connect Your Google Business Profile</h2>
              <p className="text-xl text-gray-600 mb-8">
                Import your existing Google reviews to build trust and showcase your reputation
              </p>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8 text-left">
                <h3 className="font-bold text-blue-900 mb-3">Benefits of importing reviews:</h3>
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
          </div>
        ) : (
          <div className="space-y-6">
            {/* Business Info Card */}
            {businessInfo && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
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
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-1">Your Google Reviews</h2>
                    <p className="text-gray-600">Select which reviews to display on your profile</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Selected</p>
                    <p className="text-2xl font-bold text-red-600">{selectedReviews.length} / {importedReviews.length}</p>
                  </div>
                </div>

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
    </div>
  );
};

export default ImportReviews;
