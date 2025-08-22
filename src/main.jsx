import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import './index.css';
import Home from './pages/Home.jsx';
import CreateTrip from './Create-trip/index.jsx';
import ViewTrip from './view-trip/[tripId]/index.jsx';
import ContactUsPage from "./pages/ContactUs.jsx";
import MyTrips from "./pages/MyTrips.jsx";
import { Toaster } from 'sonner';
import { GoogleOAuthProvider } from '@react-oauth/google';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/create-trip', element: <CreateTrip /> },
      { path: '/view-trip/:tripId', element: <ViewTrip /> },
      { path: '/contact-us', element: <ContactUsPage /> },
      { path: '/my-trips', element: <MyTrips /> },
    ],
  },
]);

// Get Google Client ID from environment variables
const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={googleClientId}>
      <Toaster />
      <RouterProvider router={router} />
    </GoogleOAuthProvider>
  </React.StrictMode>
);
