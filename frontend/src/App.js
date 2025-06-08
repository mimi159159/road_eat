import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './components/Login';
import RoutePlanner from './components/RoutePlanner';
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
  return children;
}

function App() {
  const [token, setToken] = useState(null);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login onLogin={setToken} />} />
        <Route
          path="/routes"
          element={
            <ProtectedRoute token={token}>
              <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY} libraries={['places']}>
                <RoutePlanner token={token} />
              </LoadScript>
            </ProtectedRoute>
          }
        />
        <Route
          path="*"
          element={
            <ProtectedRoute token={token}>
              <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY} libraries={['places']}>
                <RoutePlanner token={token} />
              </LoadScript>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
