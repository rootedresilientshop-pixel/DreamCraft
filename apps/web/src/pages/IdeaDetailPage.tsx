import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { addFavorite, removeFavorite, isFavorite } from '../utils/favorites';
import { getCurrentUserId } from '../utils/authStorage';

export default function IdeaDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const currentUserId = getCurrentUserId();
  const [idea, setIdea] = useState<any>(null);
  const [creator, setCreator] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [valuating, setValuating] = useState(false);
  const [isFav, setIsFav] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [messageContent, setMessageContent] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [proposingCollaboration, setProposingCollaboration] = useState(false);
  const [loadingNda, setLoadingNda] = useState(false);
  const [showNDAModal, setShowNDAModal] = useState(false);
  const [collaborationId, setCollaborationId] = useState<string | null>(null);
  const [ndaStatus, setNdaStatus] = useState<any>(null);
  const [showCollaborationForm, setShowCollaborationForm] = useState(false);
  const [collaborationTerms, setCollaborationTerms] = useState({
    timeCommitment: '',
    equityPercentage: '',
    successDefinition: '',
    timelineToMVP: '',
  });

  useEffect(() => {
    fetchIdea();
  }, [id]);

  useEffect(() => {
    if (id) {
      setIsFav(isFavorite(id));
      fetchMessages();
    }
  }, [id, idea]);

  const fetchMessages = async () => {
    if (!id) return;
    setLoadingMessages(true);
    try {
      const res = await api.getIdeaMessages(id);
      if (res.success && res.data) {
        setMessages(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch messages:', err);
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleSendMessage = async () => {
    if (!id || !messageContent.trim()) return;

    setSendingMessage(true);
    try {
      const res = await api.sendIdeaMessage(id, messageContent);
      if (res.success && res.data) {
        setMessages((prev) => [...prev, res.data]);
        setMessageContent('');
      } else {
        alert(res.error || 'Failed to send message');
      }
    } catch (err: any) {
      alert(err.message || 'Error sending message');
    } finally {
      setSendingMessage(false);
    }
  };

  const handleAcceptNDA = async () => {
    if (!collaborationId) return;

    setLoadingNda(true);
    try {
      const res = await api.acceptNDA(collaborationId);
      if (res.success) {
        setNdaStatus(res.data);
        if (res.data.bothAccepted) {
          setShowNDAModal(false);
        }
      }
    } catch (err: any) {
      alert(err.message || 'Failed to accept NDA');
    } finally {
      setLoadingNda(false);
    }
  };

  const handleCollaborate = () => {
    if (!id || !idea || !currentUserId) return;

    // If user is the creator, they shouldn't collaborate with themselves
    if (idea.creatorId === currentUserId || idea.creatorId._id === currentUserId) {
      alert('You are the creator of this idea');
      return;
    }

    // Show collaboration terms form
    setShowCollaborationForm(true);
  };

  const handleSubmitCollaborationTerms = async () => {
    if (!id || !currentUserId) return;

    setProposingCollaboration(true);
    try {
      const res = await api.inviteCollaborator(
        currentUserId,
        id,
        'other',
        'I\'m interested in collaborating on this idea',
        collaborationTerms.timeCommitment ? parseInt(collaborationTerms.timeCommitment) : undefined,
        collaborationTerms.equityPercentage ? parseInt(collaborationTerms.equityPercentage) : undefined,
        collaborationTerms.successDefinition || undefined,
        collaborationTerms.timelineToMVP || undefined
      );

      if (res.success) {
        setCollaborationId(res.data._id);
        setShowCollaborationForm(false);
        setShowNDAModal(true);
        setNdaStatus({
          ndaAcceptedByCreator: false,
          ndaAcceptedByCollaborator: false,
          bothAccepted: false,
          ndaText: res.data.ndaText || 'Standard NDA for idea collaboration - Both parties agree not to disclose proprietary information without written consent.'
        });
      } else {
        alert(res.error || 'Failed to propose collaboration');
      }
    } catch (err: any) {
      alert(err.message || 'Error proposing collaboration');
    } finally {
      setProposingCollaboration(false);
    }
  };

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

  const handleViewNDA = async () => {
    if (!id) return;
    setLoadingNda(true);
    try {
      const response = await fetch(`/api/ideas/${id}/nda`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('userToken')}`
        }
      });
      if (response.ok) {
        const text = await response.text();
        // Show NDA in modal instead of downloading
        setNdaStatus({
          ndaText: text,
          ndaAcceptedByCreator: false,
          ndaAcceptedByCollaborator: false,
          bothAccepted: false
        });
        setShowNDAModal(true);
      } else {
        alert('Failed to load NDA');
      }
    } catch (err: any) {
      alert('Error loading NDA: ' + err.message);
    } finally {
      setLoadingNda(false);
    }
  };

  const handleGenerateValuation = async () => {
    setValuating(true);
    try {
      const res = await api.valuateIdea(id!);
      if (res.success && res.data) {
        setIdea((prev: any) => ({ ...prev, valuation: res.data.valuation }));
        // Refetch the idea to ensure data persists
        await fetchIdea();
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
  }[idea.status as string] || '#999';

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
                  {idea.valuation.aiScore ? `${idea.valuation.aiScore.toFixed(0)}%` : 'N/A'}
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
                  {idea.valuation.confidence ? `${idea.valuation.confidence.toFixed(0)}%` : 'N/A'}
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

        {/* Discussion Thread */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>💬 Discussion</h2>

          {/* Messages List */}
          <div style={styles.messagesList}>
            {loadingMessages ? (
              <p style={{ color: '#999', textAlign: 'center', padding: '20px' }}>Loading messages...</p>
            ) : messages.length === 0 ? (
              <p style={{ color: '#999', textAlign: 'center', padding: '20px' }}>
                No messages yet. Be the first to comment!
              </p>
            ) : (
              messages.map((msg: any) => {
                const isOwn = msg.fromUserId._id === currentUserId || msg.fromUserId === currentUserId;
                return (
                  <div
                    key={msg._id}
                    style={{
                      ...styles.messageItem,
                      ...(isOwn ? styles.messageItemOwn : {}),
                    }}
                  >
                    <div style={styles.messageMeta}>
                      <span
                        style={{
                          ...styles.messageAuthor,
                          ...(isOwn ? { color: '#00cc66' } : {}),
                        }}
                      >
                        {msg.fromUserId?.username || 'Anonymous'}
                        {isOwn && ' (You)'}
                      </span>
                      <span style={styles.messageTime}>
                        {new Date(msg.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p style={styles.messageContent}>{msg.content}</p>
                  </div>
                );
              })
            )}
          </div>

          {/* Message Composer */}
          <div style={styles.messageComposer}>
            <textarea
              value={messageContent}
              onChange={(e) => setMessageContent(e.target.value)}
              placeholder="Share your thoughts about this idea..."
              style={styles.messageInput}
              disabled={sendingMessage}
            />
            <button
              onClick={handleSendMessage}
              disabled={sendingMessage || !messageContent.trim()}
              style={{
                padding: '10px 20px',
                backgroundColor: sendingMessage || !messageContent.trim() ? '#555' : '#0099ff',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                cursor: sendingMessage || !messageContent.trim() ? 'not-allowed' : 'pointer',
                fontWeight: '600',
                fontSize: '14px',
                opacity: sendingMessage || !messageContent.trim() ? 0.6 : 1,
              }}
            >
              {sendingMessage ? '📤 Sending...' : '💬 Send Message'}
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={styles.actionButtons}>
          <button
            onClick={handleCollaborate}
            disabled={proposingCollaboration}
            style={{
              ...styles.actionButton,
              ...styles.primaryButton,
              opacity: proposingCollaboration ? 0.7 : 1,
              cursor: proposingCollaboration ? 'not-allowed' : 'pointer',
            }}
          >
            {proposingCollaboration ? '⏳ Proposing...' : '👥 Collaborate'}
          </button>
          <button
            onClick={handleViewNDA}
            disabled={loadingNda}
            style={{
              ...styles.actionButton,
              backgroundColor: '#666',
              color: '#fff',
              opacity: loadingNda ? 0.7 : 1,
              cursor: loadingNda ? 'not-allowed' : 'pointer',
            }}
          >
            {loadingNda ? '⏳ Downloading...' : '📋 View NDA'}
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

      {/* Collaboration Terms Form Modal */}
      {showCollaborationForm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            backgroundColor: '#111',
            borderRadius: '12px',
            padding: '32px',
            maxWidth: '600px',
            width: '90%',
            border: '1px solid #333',
            maxHeight: '80vh',
            overflow: 'auto',
          }}>
            <h2 style={{ color: '#fff', marginTop: 0 }}>📋 Collaboration Terms</h2>
            <p style={{ color: '#999', marginBottom: '24px' }}>
              Let's establish clear expectations for this collaboration. Fill in the details that matter most to you.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Time Commitment */}
              <div>
                <label style={{ color: '#ddd', fontSize: '14px', fontWeight: '600', display: 'block', marginBottom: '6px' }}>
                  Time Commitment (hours/week)
                </label>
                <input
                  type="number"
                  min="0"
                  max="168"
                  placeholder="e.g., 20"
                  value={collaborationTerms.timeCommitment}
                  onChange={(e) => setCollaborationTerms({ ...collaborationTerms, timeCommitment: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px',
                    backgroundColor: '#1a1a1a',
                    border: '1px solid #333',
                    borderRadius: '6px',
                    color: '#fff',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                  }}
                />
                <p style={{ color: '#666', fontSize: '12px', margin: '4px 0 0 0' }}>Expected hours per week you can dedicate</p>
              </div>

              {/* Equity Percentage */}
              <div>
                <label style={{ color: '#ddd', fontSize: '14px', fontWeight: '600', display: 'block', marginBottom: '6px' }}>
                  Equity Percentage (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  placeholder="e.g., 30"
                  value={collaborationTerms.equityPercentage}
                  onChange={(e) => setCollaborationTerms({ ...collaborationTerms, equityPercentage: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px',
                    backgroundColor: '#1a1a1a',
                    border: '1px solid #333',
                    borderRadius: '6px',
                    color: '#fff',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                  }}
                />
                <p style={{ color: '#666', fontSize: '12px', margin: '4px 0 0 0' }}>Proposed equity stake for this collaborator</p>
              </div>

              {/* Success Definition */}
              <div>
                <label style={{ color: '#ddd', fontSize: '14px', fontWeight: '600', display: 'block', marginBottom: '6px' }}>
                  Success Definition
                </label>
                <textarea
                  placeholder="e.g., Launch MVP with core features, 100 users, first revenue"
                  value={collaborationTerms.successDefinition}
                  onChange={(e) => setCollaborationTerms({ ...collaborationTerms, successDefinition: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px',
                    backgroundColor: '#1a1a1a',
                    border: '1px solid #333',
                    borderRadius: '6px',
                    color: '#fff',
                    fontSize: '14px',
                    fontFamily: 'inherit',
                    minHeight: '80px',
                    boxSizing: 'border-box',
                  }}
                />
                <p style={{ color: '#666', fontSize: '12px', margin: '4px 0 0 0' }}>What does MVP success look like?</p>
              </div>

              {/* Timeline to MVP */}
              <div>
                <label style={{ color: '#ddd', fontSize: '14px', fontWeight: '600', display: 'block', marginBottom: '6px' }}>
                  Timeline to MVP
                </label>
                <input
                  type="text"
                  placeholder="e.g., 8 weeks, 3 months"
                  value={collaborationTerms.timelineToMVP}
                  onChange={(e) => setCollaborationTerms({ ...collaborationTerms, timelineToMVP: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px',
                    backgroundColor: '#1a1a1a',
                    border: '1px solid #333',
                    borderRadius: '6px',
                    color: '#fff',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                  }}
                />
                <p style={{ color: '#666', fontSize: '12px', margin: '4px 0 0 0' }}>Expected timeline to launch MVP</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <button
                onClick={() => setShowCollaborationForm(false)}
                style={{
                  flex: 1,
                  padding: '12px',
                  backgroundColor: '#333',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitCollaborationTerms}
                disabled={proposingCollaboration}
                style={{
                  flex: 1,
                  padding: '12px',
                  backgroundColor: '#00cc66',
                  color: '#000',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: proposingCollaboration ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  opacity: proposingCollaboration ? 0.7 : 1,
                }}
              >
                {proposingCollaboration ? '⏳ Submitting...' : '✓ Propose Collaboration'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* NDA Modal */}
      {showNDAModal && ndaStatus && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            backgroundColor: '#111',
            borderRadius: '12px',
            padding: '32px',
            maxWidth: '500px',
            width: '90%',
            border: '1px solid #333',
          }}>
            <h2 style={{ color: '#fff', marginTop: 0 }}>🔐 Non-Disclosure Agreement</h2>

            <div style={{
              backgroundColor: '#1a1a1a',
              border: '1px solid #444',
              borderRadius: '6px',
              padding: '16px',
              marginBottom: '20px',
              maxHeight: '200px',
              overflow: 'auto',
              fontSize: '13px',
              color: '#ccc',
              lineHeight: '1.6',
            }}>
              {ndaStatus.ndaText}
            </div>

            <div style={{ marginBottom: '20px', color: '#999', fontSize: '12px' }}>
              <p>By accepting this NDA, you agree to:</p>
              <ul style={{ marginTop: '8px', paddingLeft: '20px' }}>
                <li>Not disclose proprietary information without written consent</li>
                <li>Keep shared details confidential for the duration of collaboration</li>
                <li>Use information solely for the purpose of collaboration</li>
              </ul>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setShowNDAModal(false)}
                style={{
                  flex: 1,
                  padding: '12px',
                  backgroundColor: '#333',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                }}
              >
                Decline
              </button>
              <button
                onClick={handleAcceptNDA}
                disabled={loadingNda}
                style={{
                  flex: 1,
                  padding: '12px',
                  backgroundColor: '#00cc66',
                  color: '#000',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: loadingNda ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  opacity: loadingNda ? 0.7 : 1,
                }}
              >
                {loadingNda ? '⏳ Accepting...' : '✓ Accept NDA'}
              </button>
            </div>
          </div>
        </div>
      )}
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
  messagesList: {
    backgroundColor: '#1a1a1a',
    borderRadius: '8px',
    border: '1px solid #333',
    maxHeight: '400px',
    overflowY: 'auto' as const,
    marginBottom: '20px',
    padding: '15px',
  },
  messageItem: {
    borderBottom: '1px solid #333',
    paddingBottom: '15px',
    marginBottom: '15px',
  },
  messageItemOwn: {
    backgroundColor: 'rgba(0, 204, 102, 0.1)',
    borderLeft: '3px solid #00cc66',
    paddingLeft: '12px',
  },
  messageMeta: {
    display: 'flex',
    gap: '10px',
    marginBottom: '8px',
    fontSize: '13px',
  },
  messageAuthor: {
    color: '#0099ff',
    fontWeight: '600',
  },
  messageTime: {
    color: '#666',
  },
  messageContent: {
    color: '#ccc',
    margin: '0',
    fontSize: '14px',
    lineHeight: '1.5',
    wordWrap: 'break-word' as const,
  },
  messageComposer: {
    display: 'flex',
    gap: '10px',
    flexDirection: 'column' as const,
  },
  messageInput: {
    backgroundColor: '#1a1a1a',
    border: '1px solid #333',
    borderRadius: '6px',
    color: '#fff',
    padding: '12px',
    fontSize: '14px',
    fontFamily: 'inherit',
    minHeight: '80px',
    resize: 'vertical' as const,
  },
};
