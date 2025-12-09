import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export const submitQuote = async (quoteData) => {
  try {
    const response = await axios.post(`${API}/quote`, quoteData);
    return response.data;
  } catch (error) {
    console.error('Error submitting quote:', error);
    throw error;
  }
};

export const getQuotes = async () => {
  try {
    const response = await axios.get(`${API}/quotes`);
    return response.data;
  } catch (error) {
    console.error('Error fetching quotes:', error);
    throw error;
  }
};
