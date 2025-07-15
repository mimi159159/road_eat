import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './components/Login';
import RoutePlanner from './components/RoutePlanner';
import ProfilePage from './components/ProfilePage';
import FloatingProfileButton from './components/FloatingProfileButton';
import { LoadScript } from '@react-google-maps/api';

const GOOGLE_MAPS_API_KEY = 'AIzaSyAgSKju-_3E-9JRqkaelFMFg4SI8IXH_jE';

function ProtectedRoute({ token, children, onLogout }) {
  const location = useLocation();

  if (!token) {
    if (location.pathname !== '/') {
      window.alert('This page cannot be accessed by unregistered users.');
    }
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return (
    <>
      <FloatingProfileButton onLogout={onLogout} />
      {children}
    </>
  );
}

function getValidToken() {
  const token = localStorage.getItem('access_token');
  const loginTime = localStorage.getItem('login_time');

  if (!token || !loginTime) return null;

  const FIVE_HOURS = 5 * 60 * 60 * 1000;
  const now = Date.now();

  if (now - parseInt(loginTime) > FIVE_HOURS) {
    localStorage.removeItem('access_token');
    localStorage.removeItem('login_time');
    return null;
  }

  return token;
}

function App() {
  const [token, setToken] = useState(() => getValidToken());

  const handleLogin = (newToken) => {
    localStorage.setItem('access_token', newToken);
    localStorage.setItem('login_time', Date.now().toString());
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('login_time');
    setToken(null);
  };

  return (
    <BrowserRouter>
      <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY} libraries={['places']}>
        <Routes>
          <Route
            path="/"
            element={
              token ? <Navigate to="/routes" replace /> : <Login onLogin={handleLogin} />
            }
          />
          <Route
            path="/login"
            element={<Login onLogin={handleLogin} />}
          />
          <Route
            path="/routes"
            element={
              <ProtectedRoute token={token} onLogout={handleLogout}>
                <RoutePlanner token={token} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute token={token} onLogout={handleLogout}>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </LoadScript>
    </BrowserRouter>
  );
}

export default App;
