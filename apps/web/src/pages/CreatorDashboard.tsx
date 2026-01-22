import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import DashboardFooter from '../components/DashboardFooter';

export default function CreatorDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'ideas' | 'invitations'>('overview');
  const [stats, setStats] = useState<any>(null);
  const [ideas, setIdeas] = useState<any[]>([]);
  const [invitations, setInvitations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    setError('');
    try {
      const [statsRes, ideasRes, invitRes] = await Promise.all([
        api.getDashboard(),
        api.getMyIdeas(),
        api.getInvitations('received'),
      ]);

      if (statsRes.success) setStats(statsRes.data);
      if (ideasRes.success) setIdeas(ideasRes.data);
      if (invitRes.success) setInvitations(invitRes.data);
    } catch (err) {
      console.error('Failed to load dashboard:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptInvitation = async (invitationId: string) => {
    try {
      const res = await api.acceptInvitation(invitationId);
      if (res.success) {
        setInvitations(invitations.filter((inv) => inv._id !== invitationId));
        setError('');
      } else {
        setError(res.error || 'Failed to accept invitation');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to accept invitation');
    }
  };

  const handleRejectInvitation = async (invitationId: string) => {
    try {
      const res = await api.rejectInvitation(invitationId);
      if (res.success) {
        setInvitations(invitations.filter((inv) => inv._id !== invitationId));
        setError('');
      } else {
        setError(res.error || 'Failed to reject invitation');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to reject invitation');
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <p style={styles.loading}>Loading your creative space...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header with Hero Section */}
      <div style={styles.heroSection}>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>Create, Collaborate, Conquer</h1>
          <p style={styles.heroSubtitle}>Turn your brilliant ideas into reality with expert collaborators</p>
        </div>
        <button
          onClick={() => navigate('/create-idea')}
          style={styles.heroCTA}
        >
          ✨ Start a New Idea
        </button>
      </div>

      {/* Tabs */}
      <div style={styles.tabsContainer}>
        <div style={styles.tabs}>
          {(['overview', 'ideas', 'invitations'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                ...styles.tab,
                ...(activeTab === tab ? styles.tabActive : {}),
              }}
            >
              {tab === 'overview' && '🎯 Overview'}
              {tab === 'ideas' && '💡 My Ideas'}
              {tab === 'invitations' && '🤝 Collaboration Requests'}
            </button>
          ))}
        </div>
      </div>

      {/* Error Display */}
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

      {/* Content */}
      <div style={styles.content}>
        {/* Overview Tab */}
        {activeTab === 'overview' && stats && (
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Dashboard Overview</h2>
            <div style={styles.statsGrid}>
              <div style={styles.statCard}>
                <div style={styles.statIcon}>💡</div>
                <p style={styles.statLabel}>Ideas Created</p>
                <p style={styles.statValue}>{stats.myIdeasCount || 0}</p>
              </div>
              <div style={styles.statCard}>
                <div style={styles.statIcon}>🤝</div>
                <p style={styles.statLabel}>Active Collaborations</p>
                <p style={styles.statValue}>{stats.myCollaborationsCount || 0}</p>
              </div>
              <div style={styles.statCard}>
                <div style={styles.statIcon}>📬</div>
                <p style={styles.statLabel}>Pending Requests</p>
                <p style={styles.statValue}>{stats.pendingInvitationsCount || 0}</p>
              </div>
              <div style={styles.statCard}>
                <div style={styles.statIcon}>✅</div>
                <p style={styles.statLabel}>Collaboration Offers</p>
                <p style={styles.statValue}>{stats.pendingCollaborationRequests || 0}</p>
              </div>
            </div>

            <div style={styles.quickActionsContainer}>
              <h3 style={styles.quickActionsTitle}>Quick Actions</h3>
              <div style={styles.quickActions}>
                <button
                  onClick={() => navigate('/create-idea')}
                  style={styles.actionBtnPrimary}
                >
                  + Create Idea
                </button>
                <button
                  onClick={() => navigate('/collaborators')}
                  style={styles.actionBtnSecondary}
                >
                  Find Collaborators
                </button>
                <button
                  onClick={() => navigate('/marketplace')}
                  style={styles.actionBtnSecondary}
                >
                  Browse Ideas
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Ideas Tab */}
        {activeTab === 'ideas' && (
          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}>My Ideas</h2>
              <button
                onClick={() => navigate('/create-idea')}
                style={styles.newIdeaBtn}
              >
                + New Idea
              </button>
            </div>
            {ideas.length === 0 ? (
              <div style={styles.emptyState}>
                <div style={styles.emptyIcon}>💭</div>
                <p style={styles.emptyTitle}>No ideas yet</p>
                <p style={styles.emptyText}>Start creating your first idea and find collaborators!</p>
                <button
                  onClick={() => navigate('/create-idea')}
                  style={styles.actionBtnPrimary}
                >
                  Create First Idea
                </button>
              </div>
            ) : (
              <div style={styles.ideasGrid}>
                {ideas.map((idea: any) => (
                  <div key={idea._id} style={styles.ideaCard}>
                    <div style={styles.ideaCardHeader}>
                      <h3 style={styles.ideaTitle}>{idea.title}</h3>
                      <span style={styles.ideaStatus}>{idea.status || 'draft'}</span>
                    </div>
                    <p style={styles.ideaDesc}>{idea.description?.substring(0, 120)}...</p>
                    <div style={styles.ideaFooter}>
                      <div style={styles.ideaStats}>
                        <span>🤝 {idea.stats?.activeCollaborators || 0}</span>
                        <span>⏳ {idea.stats?.pendingRequests || 0}</span>
                      </div>
                      <button
                        onClick={() => navigate(`/ideas/${idea._id}`)}
                        style={styles.viewBtn}
                      >
                        View →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Invitations Tab */}
        {activeTab === 'invitations' && (
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Collaboration Requests</h2>
            {invitations.length === 0 ? (
              <div style={styles.emptyState}>
                <div style={styles.emptyIcon}>📨</div>
                <p style={styles.emptyTitle}>No pending requests</p>
                <p style={styles.emptyText}>When people want to collaborate on your ideas, they'll appear here</p>
              </div>
            ) : (
              <div style={styles.invitationsList}>
                {invitations.map((inv: any) => (
                  <div key={inv._id} style={styles.invitationCard}>
                    <div style={styles.invContent}>
                      <h3 style={styles.invTitle}>{inv.ideaId?.title}</h3>
                      <p style={styles.invCreator}>From: <strong>{inv.creatorId?.username}</strong></p>
                      {inv.message && <p style={styles.invMessage}>"{inv.message}"</p>}
                      {inv.role && <span style={styles.roleTag}>{inv.role}</span>}
                    </div>
                    <div style={styles.invActions}>
                      <button
                        onClick={() => handleAcceptInvitation(inv._id)}
                        style={styles.acceptBtn}
                      >
                        Accept ✓
                      </button>
                      <button
                        onClick={() => handleRejectInvitation(inv._id)}
                        style={styles.rejectBtn}
                      >
                        Decline ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <DashboardFooter />
    </div>
  );
}

const styles: any = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0a0a0a 0%, #1a0f0f 100%)',
    color: '#fff',
    padding: '0',
  },
  heroSection: {
    background: 'linear-gradient(135deg, #ff9800 0%, #f97316 50%, #e91e63 100%)',
    padding: '60px 40px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '40px',
  },
  heroContent: {
    flex: 1,
  },
  heroTitle: {
    fontSize: '42px',
    fontWeight: 'bold',
    margin: '0 0 12px 0',
    color: '#fff',
    letterSpacing: '-1px',
  },
  heroSubtitle: {
    fontSize: '18px',
    color: 'rgba(255,255,255,0.9)',
    margin: '0',
    lineHeight: '1.5',
  },
  heroCTA: {
    padding: '14px 32px',
    backgroundColor: '#fff',
    color: '#f97316',
    border: 'none',
    borderRadius: '24px',
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    transition: 'all 0.3s',
    boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
  },
  tabsContainer: {
    borderBottom: '1px solid #333',
    backgroundColor: '#111',
    padding: '0 40px',
    position: 'sticky' as const,
    top: 0,
    zIndex: 100,
  },
  tabs: {
    display: 'flex',
    gap: '0',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  tab: {
    padding: '16px 24px',
    backgroundColor: 'transparent',
    color: '#999',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    borderBottom: '3px solid transparent',
    transition: 'all 0.2s',
  },
  tabActive: {
    color: '#ff9800',
    borderBottomColor: '#ff9800',
  },
  content: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '40px 40px',
  },
  section: {
    marginBottom: '40px',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  sectionTitle: {
    fontSize: '28px',
    fontWeight: 'bold',
    margin: '0',
    color: '#fff',
  },
  newIdeaBtn: {
    padding: '10px 20px',
    backgroundColor: '#ff9800',
    color: '#fff',
    border: 'none',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '20px',
    marginBottom: '40px',
  },
  statCard: {
    backgroundColor: 'rgba(255, 152, 0, 0.1)',
    border: '1px solid rgba(255, 152, 0, 0.3)',
    borderRadius: '16px',
    padding: '24px',
    textAlign: 'center',
    transition: 'all 0.3s',
    cursor: 'pointer',
  },
  statIcon: {
    fontSize: '32px',
    marginBottom: '12px',
  },
  statLabel: {
    color: '#aaa',
    fontSize: '12px',
    margin: '0 0 8px 0',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  statValue: {
    fontSize: '36px',
    fontWeight: 'bold',
    color: '#ff9800',
    margin: '0',
  },
  quickActionsContainer: {
    marginTop: '40px',
  },
  quickActionsTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '16px',
    margin: '0 0 16px 0',
  },
  quickActions: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
  },
  actionBtnPrimary: {
    padding: '12px 28px',
    backgroundColor: '#ff9800',
    color: '#fff',
    border: 'none',
    borderRadius: '20px',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'all 0.3s',
  },
  actionBtnSecondary: {
    padding: '12px 28px',
    backgroundColor: 'rgba(255, 152, 0, 0.2)',
    color: '#ff9800',
    border: '1px solid rgba(255, 152, 0, 0.5)',
    borderRadius: '20px',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'all 0.3s',
  },
  ideasGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px',
  },
  ideaCard: {
    backgroundColor: '#111',
    border: '1px solid #333',
    borderRadius: '16px',
    padding: '24px',
    transition: 'all 0.3s',
    display: 'flex',
    flexDirection: 'column' as const,
  },
  ideaCardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '12px',
  },
  ideaTitle: {
    fontSize: '18px',
    margin: '0',
    fontWeight: 'bold',
    flex: 1,
  },
  ideaStatus: {
    fontSize: '11px',
    backgroundColor: 'rgba(255, 152, 0, 0.2)',
    color: '#ff9800',
    padding: '4px 12px',
    borderRadius: '12px',
    textTransform: 'capitalize',
    fontWeight: '600',
  },
  ideaDesc: {
    color: '#999',
    fontSize: '14px',
    margin: '0 0 16px 0',
    lineHeight: '1.5',
    flex: 1,
  },
  ideaFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ideaStats: {
    display: 'flex',
    gap: '12px',
    fontSize: '12px',
    color: '#999',
  },
  viewBtn: {
    padding: '8px 16px',
    backgroundColor: '#ff9800',
    color: '#fff',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '600',
    transition: 'all 0.3s',
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px 40px',
    backgroundColor: 'rgba(255,152,0,0.05)',
    borderRadius: '16px',
    border: '1px dashed rgba(255,152,0,0.2)',
  },
  emptyIcon: {
    fontSize: '48px',
    marginBottom: '16px',
  },
  emptyTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#fff',
    margin: '0 0 8px 0',
  },
  emptyText: {
    color: '#999',
    fontSize: '14px',
    margin: '0 0 24px 0',
  },
  invitationsList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '16px',
  },
  invitationCard: {
    backgroundColor: '#111',
    border: '1px solid #333',
    borderRadius: '12px',
    padding: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '20px',
  },
  invContent: {
    flex: 1,
  },
  invTitle: {
    fontSize: '16px',
    margin: '0 0 8px 0',
    fontWeight: 'bold',
    color: '#ff9800',
  },
  invCreator: {
    color: '#999',
    fontSize: '13px',
    margin: '0 0 8px 0',
  },
  invMessage: {
    color: '#ccc',
    fontSize: '13px',
    fontStyle: 'italic',
    margin: '0 0 12px 0',
  },
  roleTag: {
    display: 'inline-block',
    backgroundColor: 'rgba(255, 152, 0, 0.2)',
    color: '#ff9800',
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '600',
  },
  invActions: {
    display: 'flex',
    gap: '8px',
    flexShrink: 0,
  },
  acceptBtn: {
    padding: '8px 16px',
    backgroundColor: '#00cc66',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '600',
    transition: 'all 0.3s',
  },
  rejectBtn: {
    padding: '8px 16px',
    backgroundColor: 'rgba(255, 102, 102, 0.2)',
    color: '#ff6666',
    border: '1px solid rgba(255, 102, 102, 0.5)',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '600',
    transition: 'all 0.3s',
  },
  loading: {
    color: '#999',
    textAlign: 'center',
    padding: '60px 40px',
  },
};
