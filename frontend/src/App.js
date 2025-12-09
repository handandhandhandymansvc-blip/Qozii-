import React, { useEffect } from 'react';
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
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminSettings from './pages/admin/AdminSettings';
import AdminUsers from './pages/admin/AdminUsers';
import AdminRevenue from './pages/admin/AdminRevenue';
import AdminCategories from './pages/admin/AdminCategories';
import './App.css';

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

const RootRedirect = () => {
  const appMode = localStorage.getItem('app_mode');
  const { user } = useAuth();
  
  if (user) {
    return <Navigate to="/dashboard" />;
  }
  if (!appMode) {
    return <Navigate to="/select" />;
  }
  return <Navigate to="/login" />;
};

function App() {
  useEffect(() => {
    // Only set if not already set
    if (!localStorage.getItem('app_mode')) {
      localStorage.setItem('app_mode', 'customer');
    }
  }, []);

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RootRedirect />} />
          <Route path="/select" element={<AppSelector />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/post-job" element={<PrivateRoute><PostJob /></PrivateRoute>} />
          <Route path="/job/:jobId" element={<PrivateRoute><JobDetails /></PrivateRoute>} />
          <Route path="/browse-pros" element={<PrivateRoute><BrowsePros /></PrivateRoute>} />
          <Route path="/pro/:proId" element={<PrivateRoute><ProProfile /></PrivateRoute>} />
          <Route path="/messages" element={<PrivateRoute><Messages /></PrivateRoute>} />
          
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/revenue" element={<AdminRevenue />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
