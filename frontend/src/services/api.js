import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ============ USER AUTHENTICATION ============
export const registerUser = async (userData) => {
  try {
    const response = await apiClient.post('/users/register', userData);
    return response.data;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

export const loginUser = async (email, password) => {
  try {
    const response = await apiClient.post('/users/login', null, {
      params: { email, password }
    });
    return response.data;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

export const getUser = async (userId) => {
  try {
    const response = await apiClient.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
};

// ============ JOB MANAGEMENT ============
export const createJob = async (jobData, customerId) => {
  try {
    const response = await apiClient.post(`/jobs?customer_id=${customerId}`, jobData);
    return response.data;
  } catch (error) {
    console.error('Error creating job:', error);
    throw error;
  }
};

export const getJobs = async (filters = {}) => {
  try {
    const response = await apiClient.get('/jobs', { params: filters });
    return response.data;
  } catch (error) {
    console.error('Error fetching jobs:', error);
    throw error;
  }
};

export const getJob = async (jobId) => {
  try {
    const response = await apiClient.get(`/jobs/${jobId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching job:', error);
    throw error;
  }
};

export const updateJobStatus = async (jobId, status) => {
  try {
    const response = await apiClient.put(`/jobs/${jobId}/status`, null, {
      params: { status }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating job status:', error);
    throw error;
  }
};

// ============ QUOTE MANAGEMENT ============
export const createQuote = async (quoteData, proId) => {
  try {
    const response = await apiClient.post(`/quotes?pro_id=${proId}`, quoteData);
    return response.data;
  } catch (error) {
    console.error('Error creating quote:', error);
    throw error;
  }
};

export const getQuotes = async (filters = {}) => {
  try {
    const response = await apiClient.get('/quotes', { params: filters });
    return response.data;
  } catch (error) {
    console.error('Error fetching quotes:', error);
    throw error;
  }
};

export const updateQuoteStatus = async (quoteId, status) => {
  try {
    const response = await apiClient.put(`/quotes/${quoteId}/status`, null, {
      params: { status }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating quote status:', error);
    throw error;
  }
};

// ============ PRO PROFILE MANAGEMENT ============
export const getProProfile = async (userId) => {
  try {
    const response = await apiClient.get(`/pros/${userId}/profile`);
    return response.data;
  } catch (error) {
    console.error('Error fetching pro profile:', error);
    throw error;
  }
};

export const updateProProfile = async (userId, profileData) => {
  try {
    const response = await apiClient.put(`/pros/${userId}/profile`, profileData);
    return response.data;
  } catch (error) {
    console.error('Error updating pro profile:', error);
    throw error;
  }
};

export const searchPros = async (filters = {}) => {
  try {
    const response = await apiClient.get('/pros/search', { params: filters });
    return response.data;
  } catch (error) {
    console.error('Error searching pros:', error);
    throw error;
  }
};

export const updateProBudget = async (proId, budget) => {
  try {
    const response = await apiClient.put(`/pros/${proId}/budget`, null, {
      params: { budget }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating pro budget:', error);
    throw error;
  }
};

// ============ MESSAGING ============
export const sendMessage = async (messageData) => {
  try {
    const response = await apiClient.post('/messages', messageData);
    return response.data;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

export const getMessages = async (conversationId) => {
  try {
    const response = await apiClient.get(`/messages/${conversationId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }
};

export const getUserConversations = async (userId) => {
  try {
    const response = await apiClient.get(`/conversations/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching conversations:', error);
    throw error;
  }
};

// ============ REVIEWS ============
export const createReview = async (reviewData, customerId) => {
  try {
    const response = await apiClient.post(`/reviews?customer_id=${customerId}`, reviewData);
    return response.data;
  } catch (error) {
    console.error('Error creating review:', error);
    throw error;
  }
};

export const getProReviews = async (proId) => {
  try {
    const response = await apiClient.get(`/reviews/${proId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching reviews:', error);
    throw error;
  }
};

// ============ PAYMENTS ============
export const getProPayments = async (proId) => {
  try {
    const response = await apiClient.get(`/payments/${proId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching payments:', error);
    throw error;
  }
};

// ============ ADMIN APIs ============
export const adminLogin = async (email, password) => {
  try {
    const response = await apiClient.post('/admin/login', null, {
      params: { email, password }
    });
    return response.data;
  } catch (error) {
    console.error('Error admin login:', error);
    throw error;
  }
};

export const getAdminSettings = async () => {
  try {
    const response = await apiClient.get('/admin/settings');
    return response.data;
  } catch (error) {
    console.error('Error fetching admin settings:', error);
    throw error;
  }
};

export const updateAdminSettings = async (settings) => {
  try {
    const response = await apiClient.put('/admin/settings', settings);
    return response.data;
  } catch (error) {
    console.error('Error updating admin settings:', error);
    throw error;
  }
};

export const getAdminAnalytics = async () => {
  try {
    const response = await apiClient.get('/admin/analytics');
    return response.data;
  } catch (error) {
    console.error('Error fetching admin analytics:', error);
    throw error;
  }
};

export const getAllUsers = async (filters = {}) => {
  try {
    const response = await apiClient.get('/admin/users', { params: filters });
    return response.data;
  } catch (error) {
    console.error('Error fetching all users:', error);
    throw error;
  }
};

export const updateUserStatus = async (userId, isActive) => {
  try {
    const response = await apiClient.put(`/admin/users/${userId}/status`, { is_active: isActive });
    return response.data;
  } catch (error) {
    console.error('Error updating user status:', error);
    throw error;
  }
};

export const getAdminRevenue = async (filters = {}) => {
  try {
    const response = await apiClient.get('/admin/revenue', { params: filters });
    return response.data;
  } catch (error) {
    console.error('Error fetching revenue:', error);
    throw error;
  }
};

export default apiClient;
