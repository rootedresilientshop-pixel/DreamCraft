import React, { useState, useEffect } from 'react';
import api from '../api';

export default function MarketplacePage() {
  const [ideas, setIdeas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQ, setSearchQ] = useState('');

  useEffect(() => {
    loadIdeas();
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

  return (
    <div style={{ padding: '20px', color: '#fff' }}>
      <h1>Marketplace</h1>
      <p style={{ color: '#999' }}>Discover innovative ideas</p>

      <div style={{ marginBottom: '20px' }}>
        <input
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
      </div>

      {error && <p style={{ color: '#ff6666' }}>Error: {error}</p>}

      {loading && <p style={{ color: '#999' }}>Loading ideas...</p>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {ideas.map((idea: any) => (
          <div
            key={idea._id}
            style={{
              backgroundColor: '#1a1a1a',
              padding: '20px',
              borderRadius: '8px',
              borderLeft: '4px solid #0099ff',
            }}
          >
            <h3 style={{ marginTop: 0 }}>{idea.title}</h3>
            <p style={{ color: '#999', marginBottom: '10px' }}>{idea.description}</p>
            {idea.valuation && (
              <p style={{ color: '#0099ff', fontSize: '12px' }}>
                Score: {idea.valuation.aiScore} | Market: {idea.valuation.marketSize}
              </p>
            )}
          </div>
        ))}
      </div>

      {!loading && ideas.length === 0 && <p style={{ color: '#999' }}>No ideas found</p>}
    </div>
  );
}
