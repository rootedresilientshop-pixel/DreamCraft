import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { addFavorite, removeFavorite, isFavorite } from '../utils/favorites';

export default function IdeaDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [idea, setIdea] = useState<any>(null);
  const [creator, setCreator] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [valuating, setValuating] = useState(false);
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    fetchIdea();
  }, [id]);

  useEffect(() => {
    if (id) {
      setIsFav(isFavorite(id));
    }
  }, [id, idea]);

  const fetchIdea = async () => {
    setLoading(true);
    setError('');
    try {
      if (!id) {
        setError('Idea ID not provided');
        return;
      }
      const res = await api.getIdeaDetail(id);
      if (res.success && res.data) {
        setIdea(res.data);
        setIsFav(isFavorite(id));
      } else {
        setError(res.error || 'Failed to load idea');
      }
    } catch (err: any) {
      setError(err.message || 'Error loading idea');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = () => {
    if (id) {
      if (isFav) {
        removeFavorite(id);
      } else {
        addFavorite(id);
      }
      setIsFav(!isFav);
    }
  };

  const handleCopyLink = () => {
    const link = `${window.location.origin}/ideas/${id}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGenerateValuation = async () => {
    setValuating(true);
    try {
      const res = await api.valuateIdea(id!);
      if (res.success && res.data) {
        setIdea((prev: any) => ({ ...prev, valuation: res.data.valuation }));
      } else {
        alert(res.error || 'Failed to generate valuation');
      }
    } catch (err: any) {
      alert(err.message || 'Error generating valuation');
    } finally {
      setValuating(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingBox}>
          <p style={styles.loading}>Loading idea details...</p>
        </div>
      </div>
    );
  }

  if (error || !idea) {
    return (
      <div style={styles.container}>
        <div style={styles.errorBox}>
          <p style={styles.errorText}>{error || 'Idea not found'}</p>
          <button
            onClick={() => navigate('/')}
            style={{
              padding: '10px 20px',
              backgroundColor: '#0099ff',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              marginTop: '15px',
            }}
          >
            Back to Marketplace
          </button>
        </div>
      </div>
    );
  }

  const statusColor = {
    draft: '#999',
    published: '#00cc66',
    'in-collaboration': '#0099ff',
    sold: '#ffaa00',
  }[idea.status] || '#999';

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
        {/* Title & Status */}
        <div style={styles.titleSection}>
          <div>
            <h1 style={styles.title}>{idea.title}</h1>
            <div style={styles.meta}>
              <span style={{ ...styles.status, backgroundColor: statusColor }}>
                {idea.status.charAt(0).toUpperCase() + idea.status.slice(1)}
              </span>
              <span style={styles.category}>{idea.category || 'Uncategorized'}</span>
              <span style={styles.date}>
                {new Date(idea.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={handleToggleFavorite}
              style={{
                padding: '10px 20px',
                backgroundColor: isFav ? '#ffaa00' : '#333',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '14px',
              }}
            >
              {isFav ? '❤️ Favorited' : '🤍 Add to Favorites'}
            </button>
            <button
              onClick={handleCopyLink}
              style={{
                ...styles.shareButton,
                backgroundColor: copied ? '#00cc66' : '#0099ff',
              }}
            >
              {copied ? '✓ Copied' : '📋 Share'}
            </button>
          </div>
        </div>

        {/* Description */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Description</h2>
          <p style={styles.description}>{idea.description}</p>
        </div>

        {/* Valuation Metrics */}
        {idea.valuation ? (
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Valuation Metrics</h2>
            <div style={styles.metricsGrid}>
              <div style={styles.metricCard}>
                <p style={styles.metricLabel}>AI Score</p>
                <p style={styles.metricValue}>
                  {idea.valuation.aiScore ? `${(idea.valuation.aiScore * 100).toFixed(0)}%` : 'N/A'}
                </p>
              </div>
              <div style={styles.metricCard}>
                <p style={styles.metricLabel}>Market Size</p>
                <p style={styles.metricValue}>{idea.valuation.marketSize || 'Unknown'}</p>
              </div>
              <div style={styles.metricCard}>
                <p style={styles.metricLabel}>Estimated Value</p>
                <p style={styles.metricValue}>
                  {idea.valuation.estimatedValue
                    ? `$${(idea.valuation.estimatedValue / 1000).toFixed(1)}K`
                    : 'N/A'}
                </p>
              </div>
              <div style={styles.metricCard}>
                <p style={styles.metricLabel}>Confidence</p>
                <p style={styles.metricValue}>
                  {idea.valuation.confidence ? `${(idea.valuation.confidence * 100).toFixed(0)}%` : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div style={styles.section}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={styles.sectionTitle}>Generate Valuation</h2>
                <p style={{ color: '#999', fontSize: '14px', margin: '5px 0 0 0' }}>
                  AI-powered analysis coming soon
                </p>
              </div>
              <button
                onClick={handleGenerateValuation}
                disabled={valuating}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#0099ff',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: valuating ? 'not-allowed' : 'pointer',
                  fontWeight: '600',
                  fontSize: '14px',
                  opacity: valuating ? 0.7 : 1,
                }}
              >
                {valuating ? '⏳ Generating...' : '✨ Generate'}
              </button>
            </div>
          </div>
        )}

        {/* Documentation */}
        {idea.documentation && (
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Detailed Documentation</h2>
            <div style={styles.docGrid}>
              {idea.documentation.problemStatement && (
                <div style={styles.docItem}>
                  <h3 style={styles.docTitle}>Problem Statement</h3>
                  <p style={styles.docText}>{idea.documentation.problemStatement}</p>
                </div>
              )}
              {idea.documentation.targetMarket && (
                <div style={styles.docItem}>
                  <h3 style={styles.docTitle}>Target Market</h3>
                  <p style={styles.docText}>{idea.documentation.targetMarket}</p>
                </div>
              )}
              {idea.documentation.solutionOverview && (
                <div style={styles.docItem}>
                  <h3 style={styles.docTitle}>Solution Overview</h3>
                  <p style={styles.docText}>{idea.documentation.solutionOverview}</p>
                </div>
              )}
              {idea.documentation.uniqueValue && (
                <div style={styles.docItem}>
                  <h3 style={styles.docTitle}>Unique Value</h3>
                  <p style={styles.docText}>{idea.documentation.uniqueValue}</p>
                </div>
              )}
              {idea.documentation.competitors && (
                <div style={styles.docItem}>
                  <h3 style={styles.docTitle}>Competitors</h3>
                  <p style={styles.docText}>{idea.documentation.competitors}</p>
                </div>
              )}
              {idea.documentation.businessModel && (
                <div style={styles.docItem}>
                  <h3 style={styles.docTitle}>Business Model</h3>
                  <p style={styles.docText}>{idea.documentation.businessModel}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* NDA Notice */}
        {idea.nda?.required && (
          <div style={styles.ndaBox}>
            <p style={styles.ndaText}>
              📋 This idea requires an NDA before access to detailed information.
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div style={styles.actionButtons}>
          <button style={{ ...styles.actionButton, ...styles.primaryButton }}>
            👥 Collaborate
          </button>
          {idea.price && (
            <button
              onClick={() => navigate(`/checkout/${id}`)}
              style={{ ...styles.actionButton, ...styles.purchaseButton }}
            >
              💳 Purchase (${idea.price})
            </button>
          )}
        </div>
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
    maxWidth: '900px',
    margin: '0 auto',
    border: '1px solid #333',
  },
  titleSection: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '30px',
    paddingBottom: '30px',
    borderBottom: '1px solid #333',
  },
  title: {
    fontSize: '36px',
    fontWeight: 'bold',
    margin: '0 0 12px 0',
  },
  meta: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  status: {
    padding: '6px 12px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: '600',
    color: '#000',
  },
  category: {
    color: '#999',
    fontSize: '14px',
  },
  date: {
    color: '#666',
    fontSize: '13px',
  },
  shareButton: {
    padding: '10px 20px',
    color: '#000',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px',
    transition: 'all 0.2s',
  },
  section: {
    marginBottom: '30px',
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '15px',
    color: '#ddd',
  },
  description: {
    fontSize: '16px',
    lineHeight: '1.6',
    color: '#ccc',
    margin: 0,
  },
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '15px',
  },
  metricCard: {
    backgroundColor: '#1a1a1a',
    padding: '20px',
    borderRadius: '8px',
    border: '1px solid #333',
    textAlign: 'center',
  },
  metricLabel: {
    fontSize: '12px',
    color: '#999',
    margin: '0 0 8px 0',
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  metricValue: {
    fontSize: '24px',
    color: '#0099ff',
    fontWeight: 'bold',
    margin: 0,
  },
  docGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '15px',
  },
  docItem: {
    backgroundColor: '#1a1a1a',
    padding: '15px',
    borderRadius: '8px',
    border: 'left 4px solid #0099ff',
    borderLeft: '4px solid #0099ff',
  },
  docTitle: {
    fontSize: '14px',
    fontWeight: '600',
    margin: '0 0 8px 0',
    color: '#fff',
  },
  docText: {
    fontSize: '13px',
    color: '#ccc',
    margin: 0,
    lineHeight: '1.5',
  },
  ndaBox: {
    backgroundColor: '#3d1f1f',
    border: '1px solid #7a3f3f',
    color: '#ffaa99',
    padding: '15px',
    borderRadius: '6px',
    marginBottom: '20px',
  },
  ndaText: {
    margin: 0,
    fontSize: '14px',
  },
  actionButtons: {
    display: 'flex',
    gap: '12px',
    marginTop: '30px',
    paddingTop: '30px',
    borderTop: '1px solid #333',
  },
  actionButton: {
    padding: '12px 24px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px',
    flex: 1,
  },
  primaryButton: {
    backgroundColor: '#00cc66',
    color: '#000',
  },
  purchaseButton: {
    backgroundColor: '#0099ff',
    color: '#fff',
  },
  loadingBox: {
    textAlign: 'center',
    padding: '40px',
  },
  loading: {
    color: '#999',
    margin: 0,
  },
  errorBox: {
    backgroundColor: '#3d1f1f',
    border: '1px solid #7a3f3f',
    borderRadius: '8px',
    padding: '30px',
    textAlign: 'center',
    maxWidth: '500px',
    margin: '100px auto',
  },
  errorText: {
    color: '#ff6666',
    margin: '0 0 15px 0',
    fontSize: '16px',
  },
};
