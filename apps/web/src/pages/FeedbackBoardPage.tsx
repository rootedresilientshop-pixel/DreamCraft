import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { getCurrentUserId } from '../utils/authStorage';
import { SocketContext } from '../contexts/SocketContext';

export default function FeedbackBoardPage() {
  const navigate = useNavigate();
  const currentUserId = getCurrentUserId();
  const { socket } = useContext(SocketContext) || {};
  const [feedback, setFeedback] = useState<any[]>([]);
  const [filteredFeedback, setFilteredFeedback] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    loadFeedback();
    loadStats();
  }, []);

  // Socket.io listeners for real-time updates
  useEffect(() => {
    if (!socket) return;

    const handleFeedbackCreated = (newFeedback: any) => {
      setFeedback((prev) => [newFeedback, ...prev]);
    };

    const handleFeedbackUpdated = (updatedFeedback: any) => {
      setFeedback((prev) =>
        prev.map((f) => (f._id === updatedFeedback._id ? updatedFeedback : f))
      );
    };

    const handleFeedbackUpvoted = ({ feedbackId, upvotes }: any) => {
      setFeedback((prev) =>
        prev.map((f) => (f._id === feedbackId ? { ...f, upvotes } : f))
      );
    };

    socket.on('feedback:created', handleFeedbackCreated);
    socket.on('feedback:updated', handleFeedbackUpdated);
    socket.on('feedback:upvoted', handleFeedbackUpvoted);

    return () => {
      socket.off('feedback:created', handleFeedbackCreated);
      socket.off('feedback:updated', handleFeedbackUpdated);
      socket.off('feedback:upvoted', handleFeedbackUpvoted);
    };
  }, [socket]);

  useEffect(() => {
    filterFeedback();
  }, [feedback, selectedCategory, selectedStatus, sortBy, searchQuery]);

  const loadFeedback = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.listFeedback();
      if (res.success && res.data) {
        setFeedback(res.data);
      } else {
        setError(res.error || 'Failed to load feedback');
      }
    } catch (err: any) {
      setError(err.message || 'Error loading feedback');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const res = await api.getFeedbackStats();
      if (res.success) {
        setStats(res.data);
      }
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  };

  const filterFeedback = () => {
    let filtered = [...feedback];

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((f) => f.category === selectedCategory);
    }

    // Filter by status
    if (selectedStatus !== 'all') {
      filtered = filtered.filter((f) => f.status === selectedStatus);
    }

    // Search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (f) =>
          f.title.toLowerCase().includes(query) ||
          f.description.toLowerCase().includes(query)
      );
    }

    // Sort
    if (sortBy === 'newest') {
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortBy === 'upvotes') {
      filtered.sort((a, b) => b.upvotes - a.upvotes);
    }

    setFilteredFeedback(filtered);
  };

  const handleUpvote = async (id: string, isUpvoted: boolean) => {
    try {
      const res = await api.upvoteFeedback(id);
      if (res.success) {
        setFeedback(
          feedback.map((f) =>
            f._id === id
              ? {
                  ...f,
                  upvotes: res.data.upvotes,
                  upvotedBy: res.data.upvotedBy,
                }
              : f
          )
        );
      } else {
        alert(res.error || 'Failed to upvote');
      }
    } catch (err: any) {
      alert(err.message || 'Error upvoting');
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: any = {
      bug: '#ff6b6b',
      feature: '#00cc66',
      improvement: '#0099ff',
      other: '#999',
    };
    return colors[category] || '#999';
  };

  const getStatusColor = (status: string) => {
    const colors: any = {
      open: '#999',
      'in-progress': '#0099ff',
      resolved: '#00cc66',
      closed: '#666',
    };
    return colors[status] || '#999';
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <p style={styles.loading}>Loading feedback board...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button
          onClick={() => navigate('/dashboard')}
          style={{
            background: 'none',
            border: 'none',
            color: '#0099ff',
            cursor: 'pointer',
            fontSize: '14px',
            marginBottom: '20px',
          }}
        >
          ← Back to Dashboard
        </button>
      </div>

      <div style={styles.card}>
        <h1 style={styles.title}>📣 Community Feedback Board</h1>
        <p style={styles.subtitle}>
          Help us improve by sharing your feedback. Vote for features you want to see.
        </p>

        {/* Stats */}
        {stats && (
          <div style={styles.statsGrid}>
            <div style={styles.statItem}>
              <p style={styles.statLabel}>Total Feedback</p>
              <p style={styles.statValue}>{stats.total}</p>
            </div>
            <div style={styles.statItem}>
              <p style={styles.statLabel}>Open</p>
              <p style={styles.statValue}>{stats.byStatus?.open}</p>
            </div>
            <div style={styles.statItem}>
              <p style={styles.statLabel}>In Progress</p>
              <p style={styles.statValue}>{stats.byStatus?.inProgress}</p>
            </div>
            <div style={styles.statItem}>
              <p style={styles.statLabel}>Resolved</p>
              <p style={styles.statValue}>{stats.byStatus?.resolved}</p>
            </div>
          </div>
        )}

        {error && (
          <div style={styles.errorBox}>
            <p style={styles.errorText}>{error}</p>
          </div>
        )}

        {/* Controls */}
        <div style={styles.controls}>
          <input
            type="text"
            placeholder="Search feedback..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={styles.searchInput}
          />

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={styles.select}
          >
            <option value="all">All Categories</option>
            <option value="bug">🐛 Bug Report</option>
            <option value="feature">✨ Feature Request</option>
            <option value="improvement">📈 Improvement</option>
            <option value="other">❓ Other</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            style={styles.select}
          >
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={styles.select}
          >
            <option value="newest">Newest</option>
            <option value="upvotes">Most Upvotes</option>
          </select>
        </div>

        {/* Feedback List */}
        {filteredFeedback.length === 0 ? (
          <div style={styles.emptyBox}>
            <p style={styles.emptyText}>
              {searchQuery || selectedCategory !== 'all' || selectedStatus !== 'all'
                ? 'No feedback matches your filters'
                : 'No feedback yet'}
            </p>
          </div>
        ) : (
          <div style={styles.feedbackList}>
            {filteredFeedback.map((item: any) => {
              const userUpvoted = item.upvotedBy?.some((u: any) => u._id === currentUserId || u === currentUserId);
              return (
                <div
                  key={item._id}
                  style={styles.feedbackItem}
                  onClick={() => navigate(`/feedback/${item._id}`)}
                >
                  <div style={styles.upvoteSection}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUpvote(item._id, userUpvoted);
                      }}
                      style={{
                        ...styles.upvoteButton,
                        backgroundColor: userUpvoted ? '#0099ff' : '#333',
                        color: userUpvoted ? '#fff' : '#999',
                      }}
                    >
                      👍
                    </button>
                    <p style={styles.upvoteCount}>{item.upvotes}</p>
                  </div>

                  <div style={styles.feedbackContent}>
                    <div style={styles.feedbackHeader}>
                      <h3 style={styles.feedbackTitle}>{item.title}</h3>
                      <div style={styles.badges}>
                        <span
                          style={{
                            ...styles.badge,
                            backgroundColor: getCategoryColor(item.category),
                          }}
                        >
                          {item.category}
                        </span>
                        <span
                          style={{
                            ...styles.badge,
                            backgroundColor: getStatusColor(item.status),
                          }}
                        >
                          {item.status}
                        </span>
                        {item.priority && (
                          <span style={styles.priorityBadge}>
                            {item.priority === 'critical' && '⚠️'}
                            {item.priority === 'high' && '🔴'}
                            {item.priority === 'medium' && '🟡'}
                            {item.priority === 'low' && '🟢'} {item.priority}
                          </span>
                        )}
                      </div>
                    </div>

                    <p style={styles.feedbackDescription}>
                      {item.description.substring(0, 150)}
                      {item.description.length > 150 ? '...' : ''}
                    </p>

                    <div style={styles.feedbackFooter}>
                      <span style={styles.author}>by {item.userId?.username}</span>
                      <span style={styles.date}>
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
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
    maxWidth: '1000px',
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
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
    gap: '12px',
    marginBottom: '30px',
  },
  statItem: {
    backgroundColor: '#1a1a1a',
    border: '1px solid #333',
    borderRadius: '8px',
    padding: '12px',
    textAlign: 'center',
  },
  statLabel: {
    color: '#999',
    fontSize: '12px',
    margin: '0',
    textTransform: 'uppercase',
  },
  statValue: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#00cc66',
    margin: '4px 0 0 0',
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
  controls: {
    display: 'flex',
    gap: '12px',
    marginBottom: '24px',
    flexWrap: 'wrap',
  },
  searchInput: {
    flex: 1,
    minWidth: '200px',
    padding: '10px',
    backgroundColor: '#1a1a1a',
    border: '1px solid #333',
    borderRadius: '6px',
    color: '#fff',
    fontSize: '14px',
    boxSizing: 'border-box',
  },
  select: {
    padding: '10px',
    backgroundColor: '#1a1a1a',
    border: '1px solid #333',
    borderRadius: '6px',
    color: '#fff',
    fontSize: '14px',
    cursor: 'pointer',
  },
  emptyBox: {
    backgroundColor: '#1a1a1a',
    border: '1px solid #333',
    borderRadius: '8px',
    padding: '40px',
    textAlign: 'center',
  },
  emptyText: {
    color: '#999',
    fontSize: '16px',
    margin: 0,
  },
  feedbackList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  feedbackItem: {
    display: 'flex',
    gap: '16px',
    backgroundColor: '#1a1a1a',
    border: '1px solid #333',
    borderRadius: '8px',
    padding: '16px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    ':hover': {
      backgroundColor: '#222',
      borderColor: '#0099ff',
    },
  },
  upvoteSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    minWidth: '60px',
  },
  upvoteButton: {
    width: '40px',
    height: '40px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'all 0.2s',
  },
  upvoteCount: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#0099ff',
    margin: 0,
  },
  feedbackContent: {
    flex: 1,
  },
  feedbackHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '12px',
    marginBottom: '8px',
  },
  feedbackTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#fff',
    margin: 0,
    flex: 1,
  },
  badges: {
    display: 'flex',
    gap: '6px',
    flexWrap: 'wrap',
  },
  badge: {
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: '600',
    color: '#fff',
  },
  priorityBadge: {
    fontSize: '12px',
    fontWeight: '600',
    padding: '4px 8px',
    borderRadius: '4px',
    backgroundColor: '#333',
    color: '#fff',
  },
  feedbackDescription: {
    fontSize: '14px',
    color: '#ccc',
    margin: '0 0 8px 0',
  },
  feedbackFooter: {
    display: 'flex',
    gap: '16px',
    fontSize: '12px',
  },
  author: {
    color: '#0099ff',
    fontWeight: '600',
  },
  date: {
    color: '#666',
  },
  loading: {
    textAlign: 'center',
    color: '#999',
    padding: '40px',
    fontSize: '16px',
  },
};
