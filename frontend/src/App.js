import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './components/Login';
import RoutePlanner from './components/RoutePlanner';
import ProfilePage from './components/ProfilePage';
import FloatingProfileButton from './components/FloatingProfileButton';
import { LoadScript } from '@react-google-maps/api';

const GOOGLE_MAPS_API_KEY = 'AIzaSyAgSKju-_3E-9JRqkaelFMFg4SI8IXH_jE';

function ProtectedRoute({ token, children }) {
  const location = useLocation();

  if (!token) {
    if (location.pathname !== '/login') {
      window.alert('This page cannot be accessed by unregistered users.');
    }
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <>
      <FloatingProfileButton />
      {children}
    </>
  );
}

function App() {
  const [token, setToken] = useState(() => localStorage.getItem('access_token'));

  return (
    <BrowserRouter>
      {/* Move LoadScript here: it loads the script ONCE for all pages */}
      <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY} libraries={['places']}>
        <Routes>
          <Route path="/login" element={<Login onLogin={setToken} />} />
          <Route
            path="/routes"
            element={
              <ProtectedRoute token={token}>
                <RoutePlanner token={token} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute token={token}>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="*"
            element={
              <ProtectedRoute token={token}>
                <RoutePlanner token={token} />
              </ProtectedRoute>
            }
          />
        </Routes>
      </LoadScript>
    </BrowserRouter>
  );
}

export default App;
