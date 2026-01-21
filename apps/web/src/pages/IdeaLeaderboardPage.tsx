import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function IdeaLeaderboardPage() {
  const navigate = useNavigate();
  const [ideas, setIdeas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.getLeaderboard(50);
      if (res.success && res.data) {
        setIdeas(res.data);
      } else {
        setError(res.error || 'Failed to load leaderboard');
      }
    } catch (err: any) {
      setError(err.message || 'Error loading leaderboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <p style={styles.loading}>Loading leaderboard...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button
          onClick={() => navigate('/')}
          style={{
            background: 'none',
            border: 'none',
            color: '#0099ff',
            cursor: 'pointer',
            fontSize: '14px',
            marginBottom: '20px',
          }}
        >
          ← Back to Marketplace
        </button>
      </div>

      <div style={styles.card}>
        <h1 style={styles.title}>🏆 Top Rated Ideas</h1>
        <p style={styles.subtitle}>
          Explore the highest-scoring ideas based on market potential, clarity, and innovation
        </p>

        {error && (
          <div style={styles.errorBox}>
            <p style={styles.errorText}>{error}</p>
          </div>
        )}

        {ideas.length === 0 ? (
          <div style={styles.emptyBox}>
            <p style={styles.emptyText}>No rated ideas yet. Be the first to create and valuate an idea!</p>
          </div>
        ) : (
          <div style={styles.leaderboard}>
            {ideas.map((idea: any, index: number) => (
              <div
                key={idea._id}
                style={styles.leaderboardItem}
                onClick={() => navigate(`/ideas/${idea._id}`)}
              >
                <div style={styles.rank}>
                  {index === 0 && '🥇'}
                  {index === 1 && '🥈'}
                  {index === 2 && '🥉'}
                  {index > 2 && `#${index + 1}`}
                </div>

                <div style={styles.ideaInfo}>
                  <h3 style={styles.ideaTitle}>{idea.title}</h3>
                  <p style={styles.ideaDescription}>{idea.description}</p>
                  <div style={styles.creatorInfo}>
                    <span style={styles.creator}>
                      {idea.creatorId?.username || 'Unknown'}
                    </span>
                    <span style={styles.date}>
                      {new Date(idea.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div style={styles.metrics}>
                  <div style={styles.metricBox}>
                    <p style={styles.metricLabel}>AI Score</p>
                    <p style={styles.metricValue}>
                      {idea.valuation?.aiScore ? `${idea.valuation.aiScore.toFixed(0)}%` : 'N/A'}
                    </p>
                  </div>
                  <div style={styles.metricBox}>
                    <p style={styles.metricLabel}>Valuation</p>
                    <p style={styles.metricValue}>
                      {idea.valuation?.estimatedValue
                        ? `$${(idea.valuation.estimatedValue / 1000).toFixed(1)}K`
                        : 'N/A'}
                    </p>
                  </div>
                  <div style={styles.metricBox}>
                    <p style={styles.metricLabel}>Confidence</p>
                    <p style={styles.metricValue}>
                      {idea.valuation?.confidence ? `${idea.valuation.confidence.toFixed(0)}%` : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const styles: any = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#000',
    color: '#fff',
    padding: '20px',
  },
  header: {
    marginBottom: '20px',
  },
  card: {
    backgroundColor: '#111',
    borderRadius: '12px',
    padding: '40px',
    maxWidth: '1200px',
    margin: '0 auto',
    border: '1px solid #333',
  },
  title: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#fff',
    margin: '0 0 10px 0',
  },
  subtitle: {
    color: '#999',
    fontSize: '16px',
    marginBottom: '30px',
  },
  errorBox: {
    backgroundColor: '#330000',
    border: '1px solid #660000',
    borderRadius: '6px',
    padding: '15px',
    marginBottom: '20px',
  },
  errorText: {
    color: '#ff6666',
    margin: 0,
    fontSize: '14px',
  },
  emptyBox: {
    backgroundColor: '#1a1a1a',
    border: '1px solid #333',
    borderRadius: '6px',
    padding: '40px',
    textAlign: 'center',
  },
  emptyText: {
    color: '#999',
    fontSize: '16px',
    margin: 0,
  },
  leaderboard: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  leaderboardItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    backgroundColor: '#1a1a1a',
    border: '1px solid #333',
    borderRadius: '8px',
    padding: '20px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    ':hover': {
      backgroundColor: '#222',
      borderColor: '#0099ff',
    },
  },
  rank: {
    fontSize: '24px',
    fontWeight: 'bold',
    minWidth: '50px',
    textAlign: 'center',
    color: '#ffaa00',
  },
  ideaInfo: {
    flex: 1,
  },
  ideaTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#fff',
    margin: '0 0 8px 0',
  },
  ideaDescription: {
    fontSize: '14px',
    color: '#ccc',
    margin: '0 0 10px 0',
  },
  creatorInfo: {
    display: 'flex',
    gap: '15px',
    fontSize: '12px',
  },
  creator: {
    color: '#0099ff',
    fontWeight: '600',
  },
  date: {
    color: '#666',
  },
  metrics: {
    display: 'flex',
    gap: '20px',
    minWidth: '300px',
  },
  metricBox: {
    textAlign: 'center',
  },
  metricLabel: {
    fontSize: '12px',
    color: '#999',
    margin: '0 0 4px 0',
    textTransform: 'uppercase',
  },
  metricValue: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#00cc66',
    margin: 0,
  },
  loading: {
    textAlign: 'center',
    color: '#999',
    padding: '40px',
    fontSize: '16px',
  },
};
