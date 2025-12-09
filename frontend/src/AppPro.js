import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import AppSelector from './pages/AppSelector';
import LoginPro from './pages/pro/LoginPro';
import RegisterPro from './pages/pro/RegisterPro';
import DashboardPro from './pages/pro/DashboardPro';
import BrowseJobs from './pages/pro/BrowseJobs';
import JobDetailsPro from './pages/pro/JobDetailsPro';
import ProfileSettings from './pages/pro/ProfileSettings';
import MyQuotes from './pages/pro/MyQuotes';
import MessagesPro from './pages/pro/MessagesPro';
import Earnings from './pages/pro/Earnings';
import './App.css';

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user && user.role === 'pro' ? children : <Navigate to="/pro/login" />;
};

function AppPro() {
  useEffect(() => {
    localStorage.setItem('app_mode', 'pro');
  }, []);

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/select" element={<AppSelector />} />
          <Route path="/pro/login" element={<LoginPro />} />
          <Route path="/pro/register" element={<RegisterPro />} />
          <Route path="/" element={<PrivateRoute><DashboardPro /></PrivateRoute>} />
          <Route path="/pro" element={<PrivateRoute><DashboardPro /></PrivateRoute>} />
          <Route path="/pro/browse-jobs" element={<PrivateRoute><BrowseJobs /></PrivateRoute>} />
          <Route path="/pro/job/:jobId" element={<PrivateRoute><JobDetailsPro /></PrivateRoute>} />
          <Route path="/pro/profile" element={<PrivateRoute><ProfileSettings /></PrivateRoute>} />
          <Route path="/pro/my-quotes" element={<PrivateRoute><MyQuotes /></PrivateRoute>} />
          <Route path="/pro/messages" element={<PrivateRoute><MessagesPro /></PrivateRoute>} />
          <Route path="/pro/earnings" element={<PrivateRoute><Earnings /></PrivateRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default AppPro;
