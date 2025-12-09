import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import AppPro from './AppPro';
import { Toaster } from './components/ui/toaster';

// Check app mode from localStorage or URL
// IMPORTANT: Check URL first, then localStorage
const currentPath = window.location.pathname;
const isPro = currentPath.startsWith('/pro') || currentPath.includes('/pro/');
const appMode = localStorage.getItem('app_mode');

let AppToRender;
if (isPro || appMode === 'pro') {
  AppToRender = AppPro;
  // Ensure app_mode is set correctly
  if (appMode !== 'pro') {
    localStorage.setItem('app_mode', 'pro');
  }
} else {
  // Default to customer app (includes selector route)
  AppToRender = App;
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AppToRender />
    <Toaster />
  </React.StrictMode>
);
