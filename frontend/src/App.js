import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './components/Login';
import RoutePlanner from './components/RoutePlanner';
import ProfilePage from './components/ProfilePage';
import FloatingProfileButton from './components/FloatingProfileButton';

// Read key from .env (CRA)
const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

function ProtectedRoute({ token, children, onLogout }) {
  const location = useLocation();

  if (!token) {
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
  if (now - parseInt(loginTime, 10) > FIVE_HOURS) {
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
    // Your Login.js should navigate('/routes') after success
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('login_time');
    setToken(null);
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Login is ALWAYS the first page */}
        <Route path="/" element={<Login onLogin={handleLogin} />} />

        {/* Protected: Route Planner */}
        <Route
          path="/routes"
          element={
            <ProtectedRoute token={token} onLogout={handleLogout}>
              <RoutePlanner token={token} mapsApiKey={GOOGLE_MAPS_API_KEY} />
            </ProtectedRoute>
          }
        />

        {/* Protected: Profile */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute token={token} onLogout={handleLogout}>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        {/* Catch-all → Login */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
