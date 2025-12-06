import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function LoginPage({ onLoginSuccess }: { onLoginSuccess: (token: string) => void }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setError('');
    setLoading(true);
    try {
      if (isRegister) {
        const res = await api.register(email, password);
        if (res.success) {
          setError('Account created! Now try logging in.');
          setIsRegister(false);
          setPassword('');
        } else {
          setError(res.error || 'Registration failed');
        }
      } else {
        const res = await api.login(email, password);
        console.log('LoginPage received res:', res);
        if (res?.token) {
          localStorage.setItem('userToken', res.token);
          console.log('Token saved to localStorage:', localStorage.getItem('userToken'));
          // Call the parent callback to update isLoggedIn state
          onLoginSuccess(res.token);
        } else {
          setError(res?.error || 'Login failed');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '100px auto', padding: '20px' }}>
      <h1 style={{ color: '#0099ff' }}>DreamCraft</h1>
      <p style={{ color: '#999' }}>Where dreams become reality</p>

      <input
        id="email"
        name="email"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        autoComplete="email"
        style={{
          width: '100%',
          padding: '10px',
          marginBottom: '10px',
          backgroundColor: '#1a1a1a',
          border: '1px solid #333',
          color: '#fff',
          borderRadius: '4px',
          boxSizing: 'border-box',
        }}
      />

      <input
        id="password"
        name="password"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoComplete={isRegister ? 'new-password' : 'current-password'}
        style={{
          width: '100%',
          padding: '10px',
          marginBottom: '10px',
          backgroundColor: '#1a1a1a',
          border: '1px solid #333',
          color: '#fff',
          borderRadius: '4px',
          boxSizing: 'border-box',
        }}
      />

      {error && <p style={{ color: '#ff6666', marginBottom: '10px' }}>{error}</p>}

      <button
        onClick={handleSubmit}
        disabled={loading}
        style={{
          width: '100%',
          padding: '10px',
          marginBottom: '10px',
          backgroundColor: '#0099ff',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.5 : 1,
        }}
      >
        {loading ? 'Loading...' : isRegister ? 'Register' : 'Login'}
      </button>

      <button
        onClick={() => setIsRegister(!isRegister)}
        style={{
          width: '100%',
          padding: '10px',
          backgroundColor: 'transparent',
          color: '#0099ff',
          border: '1px solid #0099ff',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        {isRegister ? 'Already have an account? Login' : 'No account? Register'}
      </button>
    </div>
  );
}
