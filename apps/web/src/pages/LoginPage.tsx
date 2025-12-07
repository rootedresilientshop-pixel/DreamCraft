import React, { useState } from 'react';
import api from '../api';
import heroImage from '../assets/dreamcraft-hero.svg';

export default function LoginPage({ onLoginSuccess }: { onLoginSuccess: (token: string) => void }) {
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

          // Dispatch custom event to notify App component
          window.dispatchEvent(new Event('tokenChanged'));

          // Call the parent callback to update isLoggedIn state
          // This will trigger a re-render of App and show the authenticated routes
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
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0a0a0a' }}>
      {/* Hero Image Section */}
      <div style={{ flex: 1, display: 'none', '@media (min-width: 1024px)': { display: 'block' }, position: 'relative', overflow: 'hidden' }}>
        <img src={heroImage} alt="DreamCraft Hero" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>

      {/* Login Form Section */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '40px 20px', background: 'linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)' }}>
        <div style={{ maxWidth: '400px', width: '100%' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h1 style={{ color: '#ffd700', marginBottom: '8px', fontSize: '36px', fontWeight: 'bold', letterSpacing: '1px' }}>DreamCraft</h1>
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
              transition: 'border-color 0.3s',
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
              transition: 'border-color 0.3s',
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = '#ffd700')}
            onBlur={(e) => (e.currentTarget.style.borderColor = '#444')}
          />

          {error && <p style={{ color: '#ff6666', marginBottom: '15px', fontSize: '14px', textAlign: 'center' }}>{error}</p>}

          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              marginBottom: '12px',
              backgroundColor: '#ffd700',
              color: '#000',
              border: 'none',
              borderRadius: '6px',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1,
              fontSize: '16px',
              fontWeight: 'bold',
              transition: 'transform 0.2s, opacity 0.2s',
            }}
            onMouseEnter={(e) => !loading && (e.currentTarget.style.transform = 'scale(1.02)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            {loading ? 'Loading...' : isRegister ? 'Register' : 'Login'}
          </button>

          <button
            onClick={() => setIsRegister(!isRegister)}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: 'transparent',
              color: '#ffd700',
              border: '2px solid #ffd700',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 215, 0, 0.1)';
              e.currentTarget.style.transform = 'scale(1.02)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            {isRegister ? 'Already have an account? Login' : 'No account? Register'}
          </button>
        </div>
      </div>
    </div>
  );
}
