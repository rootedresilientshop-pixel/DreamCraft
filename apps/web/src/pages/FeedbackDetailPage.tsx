import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { getCurrentUserId } from '../utils/authStorage';

export default function FeedbackDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const currentUserId = getCurrentUserId();
  const [feedback, setFeedback] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(false);
  const [upvoted, setUpvoted] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminForm, setShowAdminForm] = useState(false);
  const [adminForm, setAdminForm] = useState({
    status: '',
    priority: '',
    adminNotes: '',
  });

  useEffect(() => {
    loadFeedback();
  }, [id]);

  const loadFeedback = async () => {
    setLoading(true);
    setError('');
    try {
      if (!id) {
        setError('Feedback ID not provided');
        return;
      }

      // Check if user is admin
      const userDataStr = localStorage.getItem('userData');
      if (userDataStr) {
        const userData = JSON.parse(userDataStr);
        setIsAdmin(userData.userType === 'admin');
      }

      const res = await api.getFeedback(id);
      if (res.success && res.data) {
        setFeedback(res.data);
        setAdminForm({
          status: res.data.status || '',
          priority: res.data.priority || '',
          adminNotes: res.data.adminNotes || '',
        });
        const userUpvoted = res.data.upvotedBy?.some(
          (u: any) => u._id === currentUserId || u === currentUserId
        );
        setUpvoted(userUpvoted);
      } else {
        setError(res.error || 'Failed to load feedback');
      }
    } catch (err: any) {
      setError(err.message || 'Error loading feedback');
    } finally {
      setLoading(false);
    }
  };

  const handleUpvote = async () => {
    setUpdating(true);
    try {
      const res = await api.upvoteFeedback(id!);
      if (res.success) {
        setFeedback(res.data);
        setUpvoted(res.upvoted);
      } else {
        alert(res.error || 'Failed to upvote');
      }
    } catch (err: any) {
      alert(err.message || 'Error upvoting');
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this feedback?')) return;

    try {
      const res = await api.deleteFeedback(id!);
      if (res.success) {
        navigate('/feedback');
      } else {
        alert(res.error || 'Failed to delete feedback');
      }
    } catch (err: any) {
      alert(err.message || 'Error deleting feedback');
    }
  };

  const handleAdminUpdate = async () => {
    setUpdating(true);
    try {
      const res = await api.updateFeedback(id!, {
        status: adminForm.status,
        priority: adminForm.priority,
        adminNotes: adminForm.adminNotes,
      });
      if (res.success) {
        setFeedback(res.data);
        setShowAdminForm(false);
        alert('Feedback updated successfully');
      } else {
        alert(res.error || 'Failed to update feedback');
      }
    } catch (err: any) {
      alert(err.message || 'Error updating feedback');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <p style={styles.loading}>Loading feedback...</p>
      </div>
    );
  }

  if (error || !feedback) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <p style={styles.errorText}>{error || 'Feedback not found'}</p>
          <button
            onClick={() => navigate('/feedback')}
            style={styles.backButton}
          >
            ← Back to Feedback Board
          </button>
        </div>
      </div>
    );
  }

  const getCategoryIcon = (category: string) => {
    const icons: any = {
      bug: '🐛',
      feature: '✨',
      improvement: '📈',
      other: '❓',
    };
    return icons[category] || '❓';
  };

  const getPriorityColor = (priority: string) => {
    const colors: any = {
      critical: '#ff6b6b',
      high: '#ff9999',
      medium: '#ffaa00',
      low: '#00cc66',
    };
    return colors[priority] || '#999';
  };

  const isOwner = feedback.userId._id === currentUserId || feedback.userId === currentUserId;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button
          onClick={() => navigate('/feedback')}
          style={{
            background: 'none',
            border: 'none',
            color: '#0099ff',
            cursor: 'pointer',
            fontSize: '14px',
            marginBottom: '20px',
          }}
        >
          ← Back to Feedback Board
        </button>
      </div>

      <div style={styles.card}>
        {/* Header */}
        <div style={styles.titleSection}>
          <div>
            <h1 style={styles.title}>
              {getCategoryIcon(feedback.category)} {feedback.title}
            </h1>
            <div style={styles.meta}>
              <span
                style={{
                  ...styles.badge,
                  backgroundColor: feedback.category === 'bug' ? '#ff6b6b' :
                                   feedback.category === 'feature' ? '#00cc66' :
                                   feedback.category === 'improvement' ? '#0099ff' : '#999',
                }}
              >
                {feedback.category}
              </span>
              <span
                style={{
                  ...styles.badge,
                  backgroundColor: feedback.status === 'open' ? '#999' :
                                   feedback.status === 'in-progress' ? '#0099ff' :
                                   feedback.status === 'resolved' ? '#00cc66' : '#666',
                }}
              >
                {feedback.status}
              </span>
              <span
                style={{
                  ...styles.badge,
                  backgroundColor: getPriorityColor(feedback.priority),
                }}
              >
                {feedback.priority} priority
              </span>
              <span style={styles.date}>
                {new Date(feedback.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          <div style={styles.actions}>
            <button
              onClick={handleUpvote}
              disabled={updating}
              style={{
                ...styles.actionButton,
                backgroundColor: upvoted ? '#0099ff' : '#333',
                color: upvoted ? '#fff' : '#999',
              }}
            >
              👍 {feedback.upvotes} {upvoted ? 'Upvoted' : 'Upvote'}
            </button>
            {isOwner && (
              <button
                onClick={handleDelete}
                style={styles.deleteButton}
              >
                🗑️ Delete
              </button>
            )}
          </div>
        </div>

        {/* Description */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Details</h2>
          <p style={styles.description}>{feedback.description}</p>
        </div>

        {/* User Info */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Submitted By</h2>
          <div style={styles.userInfo}>
            <div>
              <p style={styles.userName}>{feedback.userId?.username}</p>
              <p style={styles.userEmail}>{feedback.userId?.email}</p>
            </div>
            <p style={styles.userDate}>
              Submitted {new Date(feedback.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Admin Info */}
        {(feedback.status !== 'open' || feedback.adminNotes) && (
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Admin Notes</h2>
            {feedback.status !== 'open' && (
              <p style={styles.statusInfo}>
                Status: <strong>{feedback.status}</strong>
                {feedback.resolvedAt && (
                  <span> - Resolved on {new Date(feedback.resolvedAt).toLocaleDateString()}</span>
                )}
              </p>
            )}
            {feedback.assignedTo && (
              <p style={styles.statusInfo}>
                Assigned to: <strong>{feedback.assignedTo.username}</strong>
              </p>
            )}
            {feedback.adminNotes && (
              <div style={styles.notesBox}>
                <p style={styles.notesText}>{feedback.adminNotes}</p>
              </div>
            )}
          </div>
        )}

        {/* Admin Controls */}
        {isAdmin && (
          <div style={styles.section}>
            <div style={styles.adminHeader}>
              <h2 style={styles.sectionTitle}>Admin Controls</h2>
              <button
                onClick={() => setShowAdminForm(!showAdminForm)}
                style={styles.editButton}
              >
                {showAdminForm ? 'Cancel' : '✏️ Edit'}
              </button>
            </div>

            {showAdminForm ? (
              <div style={styles.adminForm}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Status</label>
                  <select
                    value={adminForm.status}
                    onChange={(e) => setAdminForm({ ...adminForm, status: e.target.value })}
                    style={styles.input}
                  >
                    <option value="open">Open</option>
                    <option value="in-progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Priority</label>
                  <select
                    value={adminForm.priority}
                    onChange={(e) => setAdminForm({ ...adminForm, priority: e.target.value })}
                    style={styles.input}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Admin Notes</label>
                  <textarea
                    value={adminForm.adminNotes}
                    onChange={(e) => setAdminForm({ ...adminForm, adminNotes: e.target.value })}
                    style={{ ...styles.input, minHeight: '100px' }}
                    placeholder="Add internal notes here..."
                  />
                </div>

                <button
                  onClick={handleAdminUpdate}
                  disabled={updating}
                  style={{
                    ...styles.submitButton,
                    opacity: updating ? 0.7 : 1,
                    cursor: updating ? 'not-allowed' : 'pointer',
                  }}
                >
                  {updating ? 'Updating...' : 'Update Feedback'}
                </button>
              </div>
            ) : (
              <div style={styles.adminInfo}>
                <p style={styles.adminInfoItem}>Status: <strong>{feedback.status}</strong></p>
                <p style={styles.adminInfoItem}>Priority: <strong>{feedback.priority}</strong></p>
                {feedback.adminNotes && (
                  <p style={styles.adminInfoItem}>Notes: <strong>{feedback.adminNotes}</strong></p>
                )}
              </div>
            )}
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
    maxWidth: '900px',
    margin: '0 auto',
    border: '1px solid #333',
  },
  titleSection: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '20px',
    marginBottom: '30px',
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#fff',
    margin: '0 0 12px 0',
  },
  meta: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
  },
  badge: {
    padding: '6px 12px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '600',
    color: '#fff',
  },
  date: {
    color: '#666',
    fontSize: '12px',
    padding: '6px 0',
  },
  actions: {
    display: 'flex',
    gap: '12px',
  },
  actionButton: {
    padding: '10px 16px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px',
    transition: 'all 0.2s',
  },
  deleteButton: {
    padding: '10px 16px',
    backgroundColor: '#330000',
    color: '#ff6b6b',
    border: '1px solid #660000',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px',
  },
  section: {
    marginBottom: '30px',
  },
  sectionTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#fff',
    marginBottom: '12px',
    margin: '0 0 12px 0',
  },
  description: {
    fontSize: '16px',
    color: '#ccc',
    lineHeight: '1.6',
    margin: 0,
    whiteSpace: 'pre-wrap',
    wordWrap: 'break-word',
  },
  userInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    border: '1px solid #333',
    borderRadius: '8px',
    padding: '16px',
  },
  userName: {
    color: '#0099ff',
    fontWeight: '600',
    margin: '0 0 4px 0',
    fontSize: '14px',
  },
  userEmail: {
    color: '#999',
    fontSize: '13px',
    margin: 0,
  },
  userDate: {
    color: '#666',
    fontSize: '12px',
    margin: 0,
  },
  statusInfo: {
    color: '#ccc',
    fontSize: '14px',
    margin: '0 0 8px 0',
  },
  notesBox: {
    backgroundColor: '#1a1a1a',
    border: '1px solid #333',
    borderRadius: '8px',
    padding: '12px',
  },
  notesText: {
    color: '#ccc',
    fontSize: '14px',
    margin: 0,
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: '16px',
    margin: '0 0 20px 0',
  },
  backButton: {
    padding: '10px 16px',
    backgroundColor: '#0099ff',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px',
  },
  loading: {
    textAlign: 'center',
    color: '#999',
    padding: '40px',
    fontSize: '16px',
  },
  adminHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  editButton: {
    padding: '8px 12px',
    backgroundColor: '#0099ff',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '600',
  },
  adminForm: {
    backgroundColor: '#1a1a1a',
    border: '1px solid #333',
    borderRadius: '8px',
    padding: '16px',
  },
  formGroup: {
    marginBottom: '12px',
  },
  label: {
    display: 'block',
    color: '#ddd',
    fontSize: '12px',
    fontWeight: '600',
    marginBottom: '6px',
  },
  input: {
    width: '100%',
    padding: '8px',
    backgroundColor: '#0a0a0a',
    border: '1px solid #333',
    borderRadius: '6px',
    color: '#fff',
    fontSize: '13px',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
  },
  submitButton: {
    width: '100%',
    padding: '10px',
    backgroundColor: '#00cc66',
    color: '#000',
    border: 'none',
    borderRadius: '6px',
    fontWeight: '600',
    fontSize: '14px',
  },
  adminInfo: {
    backgroundColor: '#1a1a1a',
    border: '1px solid #333',
    borderRadius: '8px',
    padding: '12px',
  },
  adminInfoItem: {
    color: '#ccc',
    fontSize: '13px',
    margin: '0 0 8px 0',
  },
};
