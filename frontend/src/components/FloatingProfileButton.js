import React from 'react';
import { useNavigate } from 'react-router-dom';
import './FloatingProfileButton.css';

export default function FloatingProfileButton({ onLogout }) {
  const navigate = useNavigate();

  return (
    <>
      {/* Top-left Logout button */}
      <div style={{
        position: 'fixed',
        top: 20,
        left: 20,
        zIndex: 9999,
        pointerEvents: 'auto'
      }}>
        <button
          onClick={() => {
            if (onLogout) onLogout();
            navigate('/');
          }}
          style={{
            background: 'black',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            padding: '8px 14px',
            fontSize: '14px',
            fontWeight: 'bold',
            cursor: 'pointer',
            pointerEvents: 'auto'
          }}
        >
          Logout
        </button>
      </div>

      
      <div style={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        zIndex: 9999,
      }}>
        <button
          className="fab-profile-btn"
          onClick={() => navigate('/profile')}
          aria-label="Go to profile"
          style={{
            background: 'transparent',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          <img src="/images/avatar.png" alt="Profile" style={{ width: '58px', height: '58px', borderRadius: '50%' }} />
        </button>
      </div>
    </>
  );
}
