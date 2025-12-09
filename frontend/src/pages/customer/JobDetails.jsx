import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { ArrowLeft, MapPin, Calendar, DollarSign, Star } from 'lucide-react';

const API_URL = `${process.env.REACT_APP_BACKEND_URL}/api`;

const JobDetails = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobDetails();
    fetchQuotes();
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

  const fetchQuotes = async () => {
    try {
      const response = await axios.get(`${API_URL}/quotes?job_id=${jobId}`);
      setQuotes(response.data);
    } catch (error) {
      console.error('Error fetching quotes:', error);
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
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-gray-700 hover:text-red-600">
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
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
              <span className="flex items-center gap-2 text-gray-600">
                <DollarSign className="w-5 h-5" />
                ${job.budget_min} - ${job.budget_max}
              </span>
            )}
          </div>
          <p className="text-gray-700 whitespace-pre-wrap">{job.description}</p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Quotes ({quotes.length})</h2>
          {quotes.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center">
              <p className="text-gray-600">No quotes yet. Pros will start sending quotes soon!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {quotes.map((quote) => (
                <div key={quote.id} className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-lg">{quote.pro_name}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        {quote.pro_rating.toFixed(1)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-red-600">${quote.price}</div>
                      <div className="text-sm text-gray-500">{quote.estimated_duration}</div>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-4">{quote.message}</p>
                  <div className="flex gap-3">
                    <button className="flex-1 bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700">
                      Accept Quote
                    </button>
                    <button 
                      onClick={() => navigate(`/messages?pro_id=${quote.pro_id}&job_id=${job.id}`)}
                      className="flex-1 border-2 border-red-600 text-red-600 py-2 rounded-lg font-semibold hover:bg-red-50"
                    >
                      Message Pro
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default JobDetails;
