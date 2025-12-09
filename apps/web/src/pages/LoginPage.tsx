import React, { useState } from 'react';
import api from '../api';
import heroImage from '../assets/dreamcraft-hero.svg';
import { saveToken, dispatchAuthChanged } from '../utils/authStorage';

export default function LoginPage() {
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
        // -------------------- REGISTER --------------------
        const res = await api.register(email, password);

        if (res.success) {
          setError('Account created! Please log in.');
          setIsRegister(false);
          setPassword('');
        } else {
          setError(res.error || 'Registration failed');
        }
      } else {
        // -------------------- LOGIN --------------------
        const res = await api.login(email, password);
        console.log('LoginPage received res:', res);
        if (res?.token) {
          saveToken(res.token);
          console.log('Token saved to localStorage:', res.token);

          // Dispatch auth-changed event to notify App component
          dispatchAuthChanged();
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
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0a0a0a' }}>
      
      {/* Hero Image Section (hidden on mobile) */}
      <div
        style={{
          flex: 1,
          display: 'none',
          position: 'relative',
          overflow: 'hidden'
        }}
        className="lg:flex"
      >
        <img
          src={heroImage}
          alt="DreamCraft Hero"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>

      {/* Login Form Section */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '40px 20px',
          background: 'linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)'
        }}
      >
        <div style={{ maxWidth: '400px', width: '100%' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h1
              style={{
                color: '#ffd700',
                marginBottom: '8px',
                fontSize: '36px',
                fontWeight: 'bold',
                letterSpacing: '1px'
              }}
            >
              DreamCraft
            </h1>
            <p style={{ color: '#ccc', fontSize: '16px' }}>Turn Your Ideas Into Reality</p>
          </div>

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
              padding: '12px',
              marginBottom: '15px',
              backgroundColor: '#0f1419',
              border: '1px solid #444',
              color: '#fff',
              borderRadius: '6px',
              boxSizing: 'border-box',
              fontSize: '14px',
              transition: 'border-color 0.3s'
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = '#ffd700')}
            onBlur={(e) => (e.currentTarget.style.borderColor = '#444')}
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
              padding: '12px',
              marginBottom: '15px',
              backgroundColor: '#0f1419',
              border: '1px solid #444',
              color: '#fff',
              borderRadius: '6px',
              boxSizing: 'border-box',
              fontSize: '14px',
              transition: 'border-color 0.3s'
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = '#ffd700')}
            onBlur={(e) => (e.currentTarget.style.borderColor = '#444')}
          />

          {error && (
            <div
              style={{
                backgroundColor: '#5a2e2e',
                color: '#ff6b6b',
                padding: '10px',
                borderRadius: '6px',
                marginBottom: '15px',
                fontSize: '14px',
                textAlign: 'center'
              }}
            >
              {error}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: loading ? '#666' : '#ffd700',
              color: loading ? '#999' : '#000',
              border: 'none',
              borderRadius: '6px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.3s',
              marginBottom: '15px'
            }}
            onMouseEnter={(e) => {
              if (!loading) e.currentTarget.style.backgroundColor = '#ffed4e';
            }}
            onMouseLeave={(e) => {
              if (!loading) e.currentTarget.style.backgroundColor = '#ffd700';
            }}
          >
            {loading ? 'Loading...' : isRegister ? 'Register' : 'Login'}
          </button>

          <div style={{ textAlign: 'center' }}>
            <button
              onClick={() => {
                setIsRegister(!isRegister);
                setError('');
                setPassword('');
              }}
              style={{
                background: 'none',
                border: 'none',
                color: '#ffd700',
                cursor: 'pointer',
                textDecoration: 'underline',
                fontSize: '14px'
              }}
            >
              {isRegister ? 'Already have an account? Login' : "Don't have an account? Register"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
