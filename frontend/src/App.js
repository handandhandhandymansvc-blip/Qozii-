import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import AppSelector from './pages/AppSelector';
import Login from './pages/customer/Login';
import Register from './pages/customer/Register';
import Dashboard from './pages/customer/Dashboard';
import PostJob from './pages/customer/PostJob';
import JobDetails from './pages/customer/JobDetails';
import BrowsePros from './pages/customer/BrowsePros';
import ProProfile from './pages/customer/ProProfile';
import Messages from './pages/customer/Messages';
import LoginPro from './pages/pro/LoginPro';
import RegisterPro from './pages/pro/RegisterPro';
import DashboardPro from './pages/pro/DashboardPro';
import BrowseJobs from './pages/pro/BrowseJobs';
import JobDetailsPro from './pages/pro/JobDetailsPro';
import ProfileSettings from './pages/pro/ProfileSettingsEnhanced';
import MyQuotes from './pages/pro/MyQuotes';
import MessagesPro from './pages/pro/MessagesPro';
import Earnings from './pages/pro/Earnings';
import BuyCredits from './pages/pro/BuyCredits';
import Portfolio from './pages/pro/Portfolio';
import BackgroundCheck from './pages/pro/BackgroundCheck';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminSettings from './pages/admin/AdminSettings';
import AdminUsers from './pages/admin/AdminUsers';
import AdminRevenue from './pages/admin/AdminRevenue';
import AdminCategories from './pages/admin/AdminCategories';
import AdminPayments from './pages/admin/AdminPayments';
import LandingPage from './pages/marketing/LandingPage';
import './App.css';

const CustomerPrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user && user.role === 'customer' ? children : <Navigate to="/login" />;
};

const ProPrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user && user.role === 'pro' ? children : <Navigate to="/pro/login" />;
};

const RootRedirect = () => {
  const { user } = useAuth();
  
  // If user is logged in, redirect based on role
  if (user) {
    if (user.role === 'pro') {
      return <Navigate to="/pro/dashboard" />;
    } else if (user.role === 'customer') {
      return <Navigate to="/dashboard" />;
    }
  }
  
  // Otherwise show landing page
  return <LandingPage />;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Root and Common Routes */}
          <Route path="/" element={<RootRedirect />} />
          <Route path="/select" element={<AppSelector />} />
          
          {/* Customer Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<CustomerPrivateRoute><Dashboard /></CustomerPrivateRoute>} />
          <Route path="/post-job" element={<CustomerPrivateRoute><PostJob /></CustomerPrivateRoute>} />
          <Route path="/job/:jobId" element={<CustomerPrivateRoute><JobDetails /></CustomerPrivateRoute>} />
          <Route path="/browse-pros" element={<CustomerPrivateRoute><BrowsePros /></CustomerPrivateRoute>} />
          <Route path="/pro/:proId" element={<CustomerPrivateRoute><ProProfile /></CustomerPrivateRoute>} />
          <Route path="/messages" element={<CustomerPrivateRoute><Messages /></CustomerPrivateRoute>} />
          
          {/* Pro Routes */}
          <Route path="/pro/login" element={<LoginPro />} />
          <Route path="/pro/register" element={<RegisterPro />} />
          <Route path="/pro/dashboard" element={<ProPrivateRoute><DashboardPro /></ProPrivateRoute>} />
          <Route path="/pro/browse-jobs" element={<ProPrivateRoute><BrowseJobs /></ProPrivateRoute>} />
          <Route path="/pro/job/:jobId" element={<ProPrivateRoute><JobDetailsPro /></ProPrivateRoute>} />
          <Route path="/pro/profile" element={<ProPrivateRoute><ProfileSettings /></ProPrivateRoute>} />
          <Route path="/pro/my-quotes" element={<ProPrivateRoute><MyQuotes /></ProPrivateRoute>} />
          <Route path="/pro/messages" element={<ProPrivateRoute><MessagesPro /></ProPrivateRoute>} />
          <Route path="/pro/earnings" element={<ProPrivateRoute><Earnings /></ProPrivateRoute>} />
          <Route path="/pro/buy-credits" element={<ProPrivateRoute><BuyCredits /></ProPrivateRoute>} />
          <Route path="/pro/payment-success" element={<ProPrivateRoute><BuyCredits /></ProPrivateRoute>} />
          
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/revenue" element={<AdminRevenue />} />
          <Route path="/admin/categories" element={<AdminCategories />} />
          <Route path="/admin/payments" element={<AdminPayments />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
