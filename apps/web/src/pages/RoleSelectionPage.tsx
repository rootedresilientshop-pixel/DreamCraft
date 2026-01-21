import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../api';
import { saveToken, dispatchAuthChanged } from '../utils/authStorage';

interface LocationState {
  email?: string;
  password?: string;
  inviteCode?: string;
}

export default function RoleSelectionPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;
  const [selectedRole, setSelectedRole] = useState<'creator' | 'collaborator' | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleBack = () => {
    navigate('/login', { replace: true });
  };

  const email = state?.email || '';
  const password = state?.password || '';
  const inviteCode = state?.inviteCode || '';

  const handleRoleSelect = async (role: 'creator' | 'collaborator') => {
    setSelectedRole(role);
    setLoading(true);
    setError('');

    try {
      const res = await api.register(email, password, role, inviteCode);

      if (res.success || res.token) {
        // Save the token from registration so profile updates are authenticated
        if (res.token) {
          saveToken(res.token);
          // Store user data if available
          if (res.user) {
            localStorage.setItem('userData', JSON.stringify(res.user));
          }
          dispatchAuthChanged();
        }

        if (role === 'collaborator') {
          // Collaborators go to profile wizard to complete their profile
          navigate('/profile-wizard', {
            state: { email },
            replace: true,
          });
        } else {
          // Creators go to login
          navigate('/login', {
            state: { message: 'Account created! Please log in.' },
            replace: true,
          });
        }
      } else {
        setError(res.error || 'Registration failed');
        setLoading(false);
        setSelectedRole(null);
      }
    } catch (err: any) {
      setError(err.message || 'Error occurred');
      setLoading(false);
      setSelectedRole(null);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0a0a0a' }}>
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '40px 20px',
          background: 'linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)',
        }}
      >
        <div style={{ maxWidth: '500px', width: '100%' }}>
          {/* Back Button */}
          <button
            onClick={handleBack}
            disabled={loading}
            style={{
              marginBottom: '20px',
              padding: '8px 16px',
              backgroundColor: 'transparent',
              border: '1px solid #666',
              borderRadius: '6px',
              color: '#ccc',
              fontSize: '14px',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.5 : 1,
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                (e.currentTarget as HTMLButtonElement).style.borderColor = '#00cc66';
                (e.currentTarget as HTMLButtonElement).style.color = '#00cc66';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                (e.currentTarget as HTMLButtonElement).style.borderColor = '#666';
                (e.currentTarget as HTMLButtonElement).style.color = '#ccc';
              }
            }}
          >
            ← Back
          </button>

          {error && (
            <div style={{
              backgroundColor: '#ff6b6b20',
              border: '1px solid #ff6b6b',
              borderRadius: '6px',
              padding: '12px 16px',
              color: '#ff6b6b',
              fontSize: '14px',
              marginBottom: '20px',
            }}>
              {error}
            </div>
          )}

          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h1
              style={{
                color: '#ffd700',
                marginBottom: '8px',
                fontSize: '36px',
                fontWeight: 'bold',
                letterSpacing: '1px',
              }}
            >
              DreamCraft
            </h1>
            <p style={{ color: '#ccc', fontSize: '16px', marginBottom: '20px' }}>
              Choose Your Role
            </p>
            <p style={{ color: '#999', fontSize: '14px' }}>
              {email}
            </p>
          </div>

          {/* Creator Card */}
          <div
            onClick={() => !loading && handleRoleSelect('creator')}
            style={{
              backgroundColor: selectedRole === 'creator' ? '#0f5d3f' : '#0f1419',
              border: selectedRole === 'creator' ? '2px solid #00cc66' : '1px solid #444',
              borderRadius: '8px',
              padding: '30px',
              marginBottom: '20px',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s',
              opacity: loading && selectedRole !== 'creator' ? 0.5 : 1,
              pointerEvents: loading && selectedRole !== 'creator' ? 'none' : 'auto',
            }}
            onMouseEnter={(e) => {
              if (!loading && selectedRole !== 'creator') {
                (e.currentTarget as HTMLDivElement).style.borderColor = '#00cc66';
                (e.currentTarget as HTMLDivElement).style.backgroundColor = '#0a2417';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading && selectedRole !== 'creator') {
                (e.currentTarget as HTMLDivElement).style.borderColor = '#444';
                (e.currentTarget as HTMLDivElement).style.backgroundColor = '#0f1419';
              }
            }}
          >
            <h2 style={{ color: '#00cc66', marginBottom: '12px', fontSize: '20px' }}>Creator</h2>
            <p style={{ color: '#ccc', fontSize: '14px', lineHeight: '1.6', marginBottom: '15px' }}>
              Pitch your innovative ideas, get valuations, collaborate with experts, and explore
              funding opportunities.
            </p>
            <ul style={{ color: '#999', fontSize: '13px', listStyle: 'none', padding: 0 }}>
              <li style={{ marginBottom: '8px' }}>✓ Create and pitch ideas</li>
              <li style={{ marginBottom: '8px' }}>✓ Get AI valuations</li>
              <li style={{ marginBottom: '8px' }}>✓ Find collaborators</li>
            </ul>
            {loading && selectedRole === 'creator' && (
              <p style={{ color: '#ffd700', fontSize: '12px', marginTop: '15px' }}>
                Setting up your account...
              </p>
            )}
          </div>

          {/* Collaborator Card */}
          <div
            onClick={() => !loading && handleRoleSelect('collaborator')}
            style={{
              backgroundColor: selectedRole === 'collaborator' ? '#1a3a5d' : '#0f1419',
              border: selectedRole === 'collaborator' ? '2px solid #0099ff' : '1px solid #444',
              borderRadius: '8px',
              padding: '30px',
              marginBottom: '20px',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s',
              opacity: loading && selectedRole !== 'collaborator' ? 0.5 : 1,
              pointerEvents: loading && selectedRole !== 'collaborator' ? 'none' : 'auto',
            }}
            onMouseEnter={(e) => {
              if (!loading && selectedRole !== 'collaborator') {
                (e.currentTarget as HTMLDivElement).style.borderColor = '#0099ff';
                (e.currentTarget as HTMLDivElement).style.backgroundColor = '#0a1929';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading && selectedRole !== 'collaborator') {
                (e.currentTarget as HTMLDivElement).style.borderColor = '#444';
                (e.currentTarget as HTMLDivElement).style.backgroundColor = '#0f1419';
              }
            }}
          >
            <h2 style={{ color: '#0099ff', marginBottom: '12px', fontSize: '20px' }}>
              Collaborator
            </h2>
            <p style={{ color: '#ccc', fontSize: '14px', lineHeight: '1.6', marginBottom: '15px' }}>
              Discover promising ideas, offer your expertise, and build a portfolio of successful
              collaborations.
            </p>
            <ul style={{ color: '#999', fontSize: '13px', listStyle: 'none', padding: 0 }}>
              <li style={{ marginBottom: '8px' }}>✓ Browse ideas</li>
              <li style={{ marginBottom: '8px' }}>✓ Offer expertise</li>
              <li style={{ marginBottom: '8px' }}>✓ Build portfolio</li>
            </ul>
            {loading && selectedRole === 'collaborator' && (
              <p style={{ color: '#ffd700', fontSize: '12px', marginTop: '15px' }}>
                Setting up your account...
              </p>
            )}
          </div>

          <div style={{ textAlign: 'center' }}>
            <p style={{ color: '#999', fontSize: '12px' }}>
              You can change your role anytime in your profile settings
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
