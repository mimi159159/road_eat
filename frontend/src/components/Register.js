import React, { useState } from 'react';
import axios from 'axios';

function Register({ onRegistered }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const handleRegister = () => {
    axios.post('http://127.0.0.1:8000/api/register/', { username, password, email })
      .then(() => {
        alert("Registration successful, please login.");
        onRegistered();
      })
      .catch(err => alert("Registration failed"));
  };

  return (
    <div>
      <input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
      <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
      <button onClick={handleRegister}>Register</button>
    </div>
  );
}

export default Register;
