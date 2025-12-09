import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { ArrowLeft, MapPin, Calendar, DollarSign, User, Send } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';

const API_URL = `${process.env.REACT_APP_BACKEND_URL}/api`;

const JobDetailsPro = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [quoteData, setQuoteData] = useState({
    message: '',
    price: '',
    estimated_duration: ''
  });

  useEffect(() => {
    fetchJobDetails();
  }, [jobId]);

  const fetchJobDetails = async () => {
    try {
      const response = await axios.get(`${API_URL}/jobs/${jobId}`);
      setJob(response.data);
    } catch (error) {
      console.error('Error fetching job:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitQuote = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const quotePayload = {
        job_id: jobId,
        message: quoteData.message,
        price: parseFloat(quoteData.price),
        estimated_duration: quoteData.estimated_duration
      };

      await axios.post(`${API_URL}/quotes?pro_id=${user.id}`, quotePayload);
      
      toast({
        title: "Quote Submitted!",
        description: "Your quote has been sent to the customer. $10 lead fee charged."
      });
      
      navigate('/my-quotes');
    } catch (error) {
      const errorMsg = error.response?.data?.detail || 'Failed to submit quote';
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!job) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gradient-to-r from-gray-900 to-red-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button onClick={() => navigate('/browse-jobs')} className="flex items-center gap-2 hover:text-red-200">
            <ArrowLeft className="w-5 h-5" />
            Back to Jobs
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Job Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{job.title}</h1>
              
              <div className="flex flex-wrap gap-4 mb-6">
                <span className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-5 h-5" />
                  {job.location}, {job.zipcode}
                </span>
                <span className="flex items-center gap-2 text-gray-600">
                  <Calendar className="w-5 h-5" />
                  {job.timeline}
                </span>
                {job.budget_min && (
                  <span className="flex items-center gap-2 font-semibold text-green-600">
                    <DollarSign className="w-5 h-5" />
                    ${job.budget_min} - ${job.budget_max}
                  </span>
                )}
              </div>

              <div className="mb-6">
                <h3 className="font-bold text-lg text-gray-900 mb-2">Description</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{job.description}</p>
              </div>

              {job.images && job.images.length > 0 && (
                <div>
                  <h3 className="font-bold text-lg text-gray-900 mb-3">Images</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {job.images.map((img, idx) => (
                      <img key={idx} src={img} alt={`Job ${idx + 1}`} className="rounded-lg" />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Customer Info */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="font-bold text-lg text-gray-900 mb-4">Customer Information</h3>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{job.customer_name}</p>
                  <p className="text-gray-600 text-sm">{job.customer_phone}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Quote Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-4">
              <h3 className="font-bold text-xl text-gray-900 mb-4">Submit Your Quote</h3>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-yellow-800">
                  <strong>Lead Fee:</strong> $10 will be charged from your weekly budget when you submit this quote.
                </p>
              </div>

              <form onSubmit={handleSubmitQuote} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Your Price ($)*</label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    value={quoteData.price}
                    onChange={(e) => setQuoteData({ ...quoteData, price: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none"
                    placeholder="500.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Estimated Duration*</label>
                  <input
                    type="text"
                    required
                    value={quoteData.estimated_duration}
                    onChange={(e) => setQuoteData({ ...quoteData, estimated_duration: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none"
                    placeholder="2-3 days"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Message to Customer*</label>
                  <textarea
                    required
                    rows="4"
                    value={quoteData.message}
                    onChange={(e) => setQuoteData({ ...quoteData, message: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none resize-none"
                    placeholder="Introduce yourself and explain why you're the best fit..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-3 rounded-lg font-bold hover:shadow-lg transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Submit Quote ($10)
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default JobDetailsPro;
