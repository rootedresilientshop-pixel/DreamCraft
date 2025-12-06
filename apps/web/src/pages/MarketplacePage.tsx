import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { getFavorites, addFavorite, removeFavorite, isFavorite } from '../utils/favorites';
import NotificationBell from '../components/NotificationBell';
import Footer from '../components/Footer';

export default function MarketplacePage() {
  const navigate = useNavigate();
  const [ideas, setIdeas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQ, setSearchQ] = useState('');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

  useEffect(() => {
    loadIdeas();
    setFavorites(getFavorites());
  }, []);

  const loadIdeas = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.listMarketplace(searchQ);
      if (res.success) {
        setIdeas(res.data || []);
      } else {
        setError(res.error || 'Failed to load ideas');
      }
    } catch (err: any) {
      setError(err.message || 'Error loading marketplace');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = (e: React.MouseEvent, ideaId: string) => {
    e.stopPropagation();
    if (isFavorite(ideaId)) {
      removeFavorite(ideaId);
      setFavorites(getFavorites());
    } else {
      addFavorite(ideaId);
      setFavorites(getFavorites());
    }
  };

  const displayIdeas = showOnlyFavorites ? ideas.filter((idea) => favorites.includes(idea._id)) : ideas;

  return (
    <div style={{ padding: '20px', color: '#fff' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', gap: '10px', flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ margin: 0 }}>Marketplace</h1>
          <p style={{ color: '#999', margin: '5px 0 0 0' }}>Discover innovative ideas</p>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <NotificationBell />
          <a
            href="/create-idea"
            style={{
              padding: '10px 20px',
              backgroundColor: '#00cc66',
              color: '#000',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '14px',
            }}
          >
            + New Idea
          </a>
          <a
            href="/collaborators"
            style={{
              padding: '10px 20px',
              backgroundColor: '#0099ff',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '14px',
            }}
          >
            👥 Collaborators
          </a>
          <a
            href="/profile"
            style={{
              padding: '10px 20px',
              backgroundColor: '#00ccaa',
              color: '#000',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '14px',
            }}
          >
            👤 Profile
          </a>
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <input
          id="searchQ"
          name="searchQ"
          type="text"
          placeholder="Search ideas..."
          value={searchQ}
          onChange={(e) => setSearchQ(e.target.value)}
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#1a1a1a',
            border: '1px solid #333',
            color: '#fff',
            borderRadius: '4px',
            marginBottom: '10px',
            boxSizing: 'border-box',
          }}
        />
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={loadIdeas}
            style={{
              padding: '10px 20px',
              backgroundColor: '#0099ff',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Search
          </button>
          <button
            onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
            style={{
              padding: '10px 20px',
              backgroundColor: showOnlyFavorites ? '#ffaa00' : '#333',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: showOnlyFavorites ? '600' : '400',
            }}
          >
            ❤️ Favorites ({favorites.length})
          </button>
        </div>
      </div>

      {error && (
        <div style={{
          backgroundColor: '#3d1f1f',
          border: '1px solid #7a3f3f',
          color: '#ff6666',
          padding: '12px',
          borderRadius: '6px',
          marginBottom: '20px',
          fontSize: '14px',
        }}>
          Error: {error}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {loading ? (
          // Skeleton loaders
          <>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                style={{
                  backgroundColor: '#1a1a1a',
                  padding: '20px',
                  borderRadius: '8px',
                  borderLeft: '4px solid #333',
                  animation: 'pulse 2s infinite',
                }}
              >
                <div style={{
                  height: '20px',
                  backgroundColor: '#333',
                  borderRadius: '4px',
                  marginBottom: '12px',
                  width: '70%',
                }} />
                <div style={{
                  height: '16px',
                  backgroundColor: '#333',
                  borderRadius: '4px',
                  marginBottom: '8px',
                }} />
                <div style={{
                  height: '16px',
                  backgroundColor: '#333',
                  borderRadius: '4px',
                  width: '85%',
                  marginBottom: '12px',
                }} />
                <div style={{
                  height: '12px',
                  backgroundColor: '#333',
                  borderRadius: '4px',
                  width: '60%',
                }} />
              </div>
            ))}
            <style>{`
              @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.6; }
              }
            `}</style>
          </>
        ) : displayIdeas.length > 0 ? (
          displayIdeas.map((idea: any) => (
            <div
              key={idea._id}
              style={{
                backgroundColor: '#1a1a1a',
                padding: '20px',
                borderRadius: '8px',
                borderLeft: `4px solid ${favorites.includes(idea._id) ? '#ffaa00' : '#0099ff'}`,
                transition: 'transform 0.2s, box-shadow 0.2s, border-left-color 0.2s',
                cursor: 'pointer',
                position: 'relative',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 12px rgba(0, 153, 255, 0.2)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                (e.currentTarget as HTMLElement).style.boxShadow = 'none';
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1, cursor: 'pointer' }} onClick={() => navigate(`/ideas/${idea._id}`)}>
                  <h3 style={{ marginTop: 0, marginBottom: '10px' }}>{idea.title}</h3>
                  <p style={{ color: '#999', marginBottom: '10px' }}>{idea.description}</p>
                  {idea.valuation && (
                    <p style={{ color: '#0099ff', fontSize: '12px' }}>
                      Score: {idea.valuation.aiScore} | Market: {idea.valuation.marketSize}
                    </p>
                  )}
                </div>
                <button
                  onClick={(e) => handleToggleFavorite(e, idea._id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '20px',
                    cursor: 'pointer',
                    padding: '0 0 0 10px',
                    minWidth: '30px',
                  }}
                >
                  {favorites.includes(idea._id) ? '❤️' : '🤍'}
                </button>
              </div>
            </div>
          ))
        ) : (
          <div style={{
            gridColumn: '1 / -1',
            textAlign: 'center',
            padding: '40px 20px',
            backgroundColor: '#111',
            borderRadius: '8px',
            border: '1px solid #333',
          }}>
            <p style={{ color: '#666', margin: 0, fontSize: '16px' }}>
              No ideas found. Try adjusting your search or create a new one!
            </p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
