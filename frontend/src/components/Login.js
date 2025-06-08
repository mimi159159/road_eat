import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';
import { useNavigate } from 'react-router-dom';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = () => {
    const url = isSignup ? 'http://127.0.0.1:8000/api/register/' : 'http://127.0.0.1:8000/api/token/';
    const payload = { username,email, password };

    axios.post(url, payload)
      .then(res => {
        if (!isSignup) {
          onLogin(res.data.access);
        navigate('/routes');}
        else {alert('Signup successful!');}
      })
      .catch(() => alert(isSignup ? "Signup failed" : "Login failed"));
  };

  return (
    <div className="section full-height">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 text-center py-5">
            <div className="auth-wrapper">
              <h6 className="auth-tabs"><span>Log In</span><span>Sign Up</span></h6>
              <input className="checkbox" type="checkbox" id="reg-log" name="reg-log" checked={isSignup} onChange={() => setIsSignup(!isSignup)} />
              <label htmlFor="reg-log"></label>
              <div className="card-3d-wrap">
                <div className="card-3d-wrapper">
                  <div className="card-front">
                    <div className="center-wrap">
                      <div className="section text-center">
                        <h4 className="mb-4 pb-3">Log In</h4>
                        <div className="form-group">
                          <input type="text" className="form-style" placeholder="Your Username" value={username} onChange={e => setUsername(e.target.value)} />
                          <i className="input-icon uil uil-user"></i>
                        </div>
                        <div className="form-group mt-2">
                          <input type="password" className="form-style" placeholder="Your Password" value={password} onChange={e => setPassword(e.target.value)} />
                          <i className="input-icon uil uil-lock-alt"></i>
                        </div>
                        <a className="btn mt-4" onClick={handleSubmit}>Submit</a>
                        <p className="mb-0 mt-4 text-center"><a href="#0" className="link">Forgot your password?</a></p>
                      </div>
                    </div>
                  </div>
                  <div className="card-back">
                    <div className="center-wrap">
                      <div className="section text-center">
                        <h4 className="mb-4 pb-3">Sign Up</h4>
                        <div className="form-group">
                          <input name='username' type="text" className="form-style" placeholder="Your Username" value={username} onChange={e => setUsername(e.target.value)} />
                          <i className="input-icon uil uil-user"></i>
                        </div>
                        <div className="form-group">
                          <input name='email' type="text" className="form-style" placeholder="Your Email" value={email} onChange={e => setEmail(e.target.value)} />
                          <i className="input-icon uil uil-user"></i>
                        </div>
                        <div className="form-group mt-2">
                          <input name='password' type="password" className="form-style" placeholder="Your Password" value={password} onChange={e => setPassword(e.target.value)} />
                          <i className="input-icon uil uil-lock-alt"></i>
                        </div>
                        <a className="btn mt-4" onClick={handleSubmit}>Submit</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
