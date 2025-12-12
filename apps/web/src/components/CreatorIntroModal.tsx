import React from 'react';
import api from '../api';

interface CreatorIntroModalProps {
  isOpen: boolean;
  onDismiss: () => void;
}

export default function CreatorIntroModal({ isOpen, onDismiss }: CreatorIntroModalProps) {
  const [loading, setLoading] = React.useState(false);

  const handleDismiss = async () => {
    setLoading(true);
    try {
      await api.completeOnboarding({ type: 'creator-intro' });
      onDismiss();
    } catch (error) {
      console.error('Failed to save intro state:', error);
      onDismiss(); // Dismiss anyway
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
      onClick={handleDismiss}
    >
      <div
        style={{
          backgroundColor: '#1a1a2e',
          borderRadius: '12px',
          border: '1px solid #333',
          maxWidth: '500px',
          width: '90%',
          padding: '40px',
          position: 'relative',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleDismiss}
          disabled={loading}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            width: '32px',
            height: '32px',
            borderRadius: '6px',
            border: 'none',
            backgroundColor: 'transparent',
            color: '#999',
            fontSize: '24px',
            cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            if (!loading) (e.currentTarget as HTMLButtonElement).style.color = '#ccc';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color = '#999';
          }}
        >
          ×
        </button>

        {/* Content */}
        <div>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <h2 style={{ color: '#00cc66', fontSize: '28px', fontWeight: 'bold', margin: '0 0 8px 0' }}>
              Welcome to DreamCraft!
            </h2>
            <p style={{ color: '#999', fontSize: '14px', margin: 0 }}>
              Let's help you bring your ideas to life
            </p>
          </div>

          {/* Main Message */}
          <p style={{ color: '#ccc', fontSize: '14px', lineHeight: '1.8', marginBottom: '30px' }}>
            We're excited to have you here. DreamCraft connects visionary creators like you with
            talented collaborators who can help bring your ideas to life. Whether you're building a
            startup, launching a product, or exploring new opportunities, we've got the tools and
            community you need.
          </p>

          {/* Features */}
          <div style={{ marginBottom: '30px' }}>
            <div
              style={{
                marginBottom: '16px',
                padding: '16px',
                backgroundColor: '#0f1419',
                borderRadius: '8px',
              }}
            >
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '24px' }}>💡</span>
                <div>
                  <h3 style={{ color: '#00cc66', fontSize: '14px', fontWeight: '600', margin: '0 0 4px 0' }}>
                    Create & Share Ideas
                  </h3>
                  <p style={{ color: '#999', fontSize: '13px', margin: 0 }}>
                    Post your innovative ideas and get instant AI-powered valuations
                  </p>
                </div>
              </div>
            </div>

            <div
              style={{
                marginBottom: '16px',
                padding: '16px',
                backgroundColor: '#0f1419',
                borderRadius: '8px',
              }}
            >
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '24px' }}>🤝</span>
                <div>
                  <h3 style={{ color: '#00cc66', fontSize: '14px', fontWeight: '600', margin: '0 0 4px 0' }}>
                    Find Collaborators
                  </h3>
                  <p style={{ color: '#999', fontSize: '13px', margin: 0 }}>
                    Search and invite talented people based on their skills and expertise
                  </p>
                </div>
              </div>
            </div>

            <div
              style={{
                padding: '16px',
                backgroundColor: '#0f1419',
                borderRadius: '8px',
              }}
            >
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '24px' }}>🚀</span>
                <div>
                  <h3 style={{ color: '#00cc66', fontSize: '14px', fontWeight: '600', margin: '0 0 4px 0' }}>
                    Build Together
                  </h3>
                  <p style={{ color: '#999', fontSize: '13px', margin: 0 }}>
                    Collaborate in real-time, iterate on feedback, and turn your vision into reality
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <button
            onClick={handleDismiss}
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: '#00cc66',
              color: '#000',
              fontSize: '14px',
              fontWeight: '700',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              opacity: loading ? 0.7 : 1,
            }}
            onMouseEnter={(e) => {
              if (!loading) (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#00e673';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#00cc66';
            }}
          >
            {loading ? 'Loading...' : 'Get Started'}
          </button>

          {/* Footer Message */}
          <p style={{ color: '#666', fontSize: '12px', textAlign: 'center', marginTop: '16px', margin: '16px 0 0 0' }}>
            You can explore your dashboard and manage your profile anytime
          </p>
        </div>
      </div>
    </div>
  );
}
