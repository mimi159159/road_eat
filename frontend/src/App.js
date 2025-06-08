import React, { useState } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import RoutePlanner from './components/RoutePlanner';

function App() {
  const [token, setToken] = useState(null);
  const [showRegister, setShowRegister] = useState(false);

  if (token) return <RoutePlanner token={token} />;
  if (showRegister) return <Register onRegistered={() => setShowRegister(false)} />;

  return (
    <div>
      <Login onLogin={setToken} />
      
    </div>
  );
}

export default App;
