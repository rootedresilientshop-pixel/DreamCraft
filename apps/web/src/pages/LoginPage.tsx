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
          localStorage.setItem('userToken', res.token);
          console.log('Token saved to localStorage:', localStorage.getItem('userToken'));

          // 🔥 FIXED: Correct event name so App.tsx can detect login instantly
          window.dispatchEvent(new Event('auth-changed'));

          // Notify parent (App → RootNavigator)
          onLoginSuccess(res.token);
        } else {
          setError(res?.error || 'Login failed');
        }
      }
    } catch (err: any) {
      setError(err?.message || 'Unexpected error occurred');
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
