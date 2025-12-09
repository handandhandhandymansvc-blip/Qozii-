import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import AppPro from './AppPro';
import AppSelector from './pages/AppSelector';
import { Toaster } from './components/ui/toaster';

// Check app mode from localStorage or URL
const appMode = localStorage.getItem('app_mode');
const isPro = window.location.pathname.startsWith('/pro');

let AppToRender;
if (isPro || appMode === 'pro') {
  AppToRender = AppPro;
} else if (appMode === 'customer') {
  AppToRender = App;
} else {
  // Show selector if no mode is set
  AppToRender = AppSelector;
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AppToRender />
    <Toaster />
  </React.StrictMode>
);
