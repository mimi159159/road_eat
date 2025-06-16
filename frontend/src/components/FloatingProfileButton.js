import React from 'react';
import { useNavigate } from 'react-router-dom';
import './FloatingProfileButton.css';

export default function FloatingProfileButton() {
  const navigate = useNavigate();
  return (
    <button
      className="fab-profile-btn"
      onClick={() => navigate('/profile')}
      aria-label="Go to profile"
    >
      <img src="/images/avatar.png" alt="Profile" />
    </button>
  );
}
