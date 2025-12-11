import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function CollaboratorDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'tasks' | 'collaborations' | 'invitations'>('overview');
  const [stats, setStats] = useState<any>(null);
  const [ideas, setIdeas] = useState<any[]>([]);
  const [collaborations, setCollaborations] = useState<any[]>([]);
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
      const [statsRes, ideasRes, collabRes, invitRes] = await Promise.all([
        api.getDashboard(),
        api.listMarketplace(),
        api.getMyCollaborations(),
        api.getInvitations('received'),
      ]);

      if (statsRes.success) setStats(statsRes.data);
      if (ideasRes.success) setIdeas(ideasRes.data);
      if (collabRes.success) setCollaborations(collabRes.data);
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
        alert('Collaboration accepted!');
      }
    } catch (err: any) {
      alert(err.message || 'Failed to accept invitation');
    }
  };

  const handleRejectInvitation = async (invitationId: string) => {
    try {
      const res = await api.rejectInvitation(invitationId);
      if (res.success) {
        setInvitations(invitations.filter((inv) => inv._id !== invitationId));
      }
    } catch (err: any) {
      alert(err.message || 'Failed to reject invitation');
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <p style={styles.loading}>Loading your workspace...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <h1 style={styles.title}>Collaborator Workspace</h1>
          <p style={styles.subtitle}>Find ideas to collaborate on, build your portfolio</p>
        </div>
        <button
          onClick={() => navigate('/marketplace')}
          style={styles.headerCTA}
        >
          Browse Ideas
        </button>
      </div>

      {/* Tabs */}
      <div style={styles.tabsContainer}>
        <div style={styles.tabs}>
          {(['overview', 'tasks', 'collaborations', 'invitations'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                ...styles.tab,
                ...(activeTab === tab ? styles.tabActive : {}),
              }}
            >
              {tab === 'overview' && '📊 Overview'}
              {tab === 'tasks' && '📋 Open Tasks'}
              {tab === 'collaborations' && '🤝 Active'}
              {tab === 'invitations' && '📨 Invitations'}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={styles.content}>
        {/* Overview Tab */}
        {activeTab === 'overview' && stats && (
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Workspace Overview</h2>
            <div style={styles.statsGrid}>
              <div style={styles.statCard}>
                <div style={styles.statLabel}>Active Collaborations</div>
                <div style={styles.statValue}>{stats.myCollaborationsCount || 0}</div>
              </div>
              <div style={styles.statCard}>
                <div style={styles.statLabel}>Pending Invitations</div>
                <div style={styles.statValue}>{stats.pendingInvitationsCount || 0}</div>
              </div>
              <div style={styles.statCard}>
                <div style={styles.statLabel}>Ideas Available</div>
                <div style={styles.statValue}>{ideas.length || 0}</div>
              </div>
              <div style={styles.statCard}>
                <div style={styles.statLabel}>Portfolio Items</div>
                <div style={styles.statValue}>{stats.myIdeasCount || 0}</div>
              </div>
            </div>

            <div style={styles.actionSection}>
              <h3 style={styles.actionTitle}>Quick Start</h3>
              <div style={styles.actions}>
                <button
                  onClick={() => navigate('/marketplace')}
                  style={styles.actionBtn}
                >
                  <span style={styles.actionIcon}>🔍</span>
                  <div>
                    <div style={styles.actionBtnTitle}>Browse Ideas</div>
                    <div style={styles.actionBtnDesc}>Find projects to collaborate on</div>
                  </div>
                </button>
                <button
                  onClick={() => navigate('/collaborators')}
                  style={styles.actionBtn}
                >
                  <span style={styles.actionIcon}>👥</span>
                  <div>
                    <div style={styles.actionBtnTitle}>Meet Creators</div>
                    <div style={styles.actionBtnDesc}>Connect with idea creators</div>
                  </div>
                </button>
                <button
                  onClick={() => navigate('/profile')}
                  style={styles.actionBtn}
                >
                  <span style={styles.actionIcon}>✏️</span>
                  <div>
                    <div style={styles.actionBtnTitle}>Edit Profile</div>
                    <div style={styles.actionBtnDesc}>Showcase your skills and experience</div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tasks/Available Ideas Tab */}
        {activeTab === 'tasks' && (
          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}>Open Tasks & Ideas</h2>
              <button
                onClick={() => navigate('/marketplace')}
                style={styles.viewAllBtn}
              >
                View All →
              </button>
            </div>
            {ideas.length === 0 ? (
              <div style={styles.emptyState}>
                <div style={styles.emptyIcon}>📭</div>
                <p style={styles.emptyTitle}>No open ideas at the moment</p>
                <p style={styles.emptyText}>Check back soon or browse all ideas</p>
              </div>
            ) : (
              <div style={styles.tasksList}>
                {ideas.slice(0, 6).map((idea: any) => (
                  <div key={idea._id} style={styles.taskCard}>
                    <div style={styles.taskHeader}>
                      <div>
                        <h3 style={styles.taskTitle}>{idea.title}</h3>
                        <p style={styles.taskCreator}>by {idea.creatorId?.username || 'Unknown'}</p>
                      </div>
                      {idea.category && <span style={styles.categoryTag}>{idea.category}</span>}
                    </div>
                    <p style={styles.taskDesc}>{idea.description?.substring(0, 100)}...</p>
                    <div style={styles.taskFooter}>
                      <div style={styles.taskMeta}>
                        {idea.valuation?.estimatedValue && (
                          <span style={styles.valuationBadge}>💰 ${idea.valuation.estimatedValue}</span>
                        )}
                      </div>
                      <div style={styles.taskActions}>
                        <button
                          onClick={() => navigate(`/ideas/${idea._id}`)}
                          style={styles.taskViewBtn}
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => navigate(`/collaborators?ideaId=${idea._id}`)}
                          style={styles.taskApplyBtn}
                        >
                          Apply
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Active Collaborations Tab */}
        {activeTab === 'collaborations' && (
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Active Collaborations</h2>
            {collaborations.length === 0 ? (
              <div style={styles.emptyState}>
                <div style={styles.emptyIcon}>🚀</div>
                <p style={styles.emptyTitle}>No active collaborations yet</p>
                <p style={styles.emptyText}>Accept invitations to start collaborating on ideas</p>
                <button
                  onClick={() => navigate('/marketplace')}
                  style={styles.exploreBtn}
                >
                  Explore Ideas
                </button>
              </div>
            ) : (
              <div style={styles.collabGrid}>
                {collaborations.map((collab: any) => (
                  <div key={collab._id} style={styles.collabCard}>
                    <div style={styles.collabCardHeader}>
                      <h3 style={styles.collabTitle}>{collab.ideaId?.title}</h3>
                      <span style={styles.roleBadge}>{collab.role}</span>
                    </div>
                    <p style={styles.collabCreator}>Working with: {collab.creatorId?.username}</p>
                    <p style={styles.collabDesc}>{collab.ideaId?.description?.substring(0, 100)}...</p>
                    <div style={styles.collabActions}>
                      <button
                        onClick={() => navigate(`/ideas/${collab.ideaId._id}`)}
                        style={styles.viewCollabBtn}
                      >
                        View Project
                      </button>
                      <button
                        onClick={() => navigate(`/messages/direct/${collab.creatorId._id}`)}
                        style={styles.messageBtn}
                      >
                        Message
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
            <h2 style={styles.sectionTitle}>Collaboration Invitations</h2>
            {invitations.length === 0 ? (
              <div style={styles.emptyState}>
                <div style={styles.emptyIcon}>📬</div>
                <p style={styles.emptyTitle}>No pending invitations</p>
                <p style={styles.emptyText}>You'll receive invitations when creators want to work with you</p>
              </div>
            ) : (
              <div style={styles.invitationsList}>
                {invitations.map((inv: any) => (
                  <div key={inv._id} style={styles.invitationCard}>
                    <div style={styles.invHeader}>
                      <div>
                        <h3 style={styles.invTitle}>{inv.ideaId?.title}</h3>
                        <p style={styles.invFrom}>
                          Invited by <strong>{inv.creatorId?.username}</strong>
                        </p>
                        {inv.role && <span style={styles.roleBadgeSmall}>{inv.role}</span>}
                      </div>
                    </div>
                    {inv.message && (
                      <div style={styles.messageBox}>
                        <p style={styles.messageText}>"{inv.message}"</p>
                      </div>
                    )}
                    <p style={styles.invDesc}>{inv.ideaId?.description?.substring(0, 120)}...</p>
                    <div style={styles.invFooter}>
                      <div style={styles.ideaLink}>
                        <button
                          onClick={() => navigate(`/ideas/${inv.ideaId._id}`)}
                          style={styles.linkBtn}
                        >
                          View Idea
                        </button>
                      </div>
                      <div style={styles.invActionButtons}>
                        <button
                          onClick={() => handleAcceptInvitation(inv._id)}
                          style={styles.acceptBtn}
                        >
                          Accept ✓
                        </button>
                        <button
                          onClick={() => handleRejectInvitation(inv._id)}
                          style={styles.declineBtn}
                        >
                          Decline
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
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
    backgroundColor: '#0a0a0a',
    color: '#fff',
    padding: '0',
  },
  header: {
    backgroundColor: '#111',
    borderBottom: '1px solid #222',
    padding: '32px 40px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '20px',
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: '32px',
    fontWeight: '700',
    margin: '0 0 8px 0',
    color: '#0099ff',
  },
  subtitle: {
    fontSize: '14px',
    color: '#999',
    margin: '0',
  },
  headerCTA: {
    padding: '10px 24px',
    backgroundColor: '#0099ff',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '14px',
  },
  tabsContainer: {
    borderBottom: '1px solid #222',
    backgroundColor: '#0a0a0a',
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
    padding: '14px 20px',
    backgroundColor: 'transparent',
    color: '#666',
    border: 'none',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '500',
    borderBottom: '2px solid transparent',
    transition: 'all 0.2s',
    letterSpacing: '0.3px',
  },
  tabActive: {
    color: '#0099ff',
    borderBottomColor: '#0099ff',
    fontWeight: '600',
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
    fontSize: '24px',
    fontWeight: '700',
    margin: '0',
    color: '#fff',
    letterSpacing: '-0.5px',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '16px',
    marginBottom: '40px',
  },
  statCard: {
    backgroundColor: '#111',
    border: '1px solid #222',
    borderRadius: '8px',
    padding: '20px',
    textAlign: 'center',
  },
  statLabel: {
    color: '#666',
    fontSize: '12px',
    margin: '0 0 12px 0',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    fontWeight: '500',
  },
  statValue: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#0099ff',
    margin: '0',
  },
  actionSection: {
    marginTop: '40px',
  },
  actionTitle: {
    fontSize: '16px',
    fontWeight: '600',
    marginBottom: '16px',
    margin: '0 0 16px 0',
  },
  actions: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '12px',
  },
  actionBtn: {
    backgroundColor: '#111',
    border: '1px solid #222',
    borderRadius: '8px',
    padding: '16px',
    cursor: 'pointer',
    display: 'flex',
    gap: '16px',
    alignItems: 'flex-start',
    transition: 'all 0.3s',
    textAlign: 'left',
  },
  actionIcon: {
    fontSize: '24px',
  },
  actionBtnTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#fff',
    margin: '0',
  },
  actionBtnDesc: {
    fontSize: '12px',
    color: '#666',
    margin: '4px 0 0 0',
  },
  tasksList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
  },
  taskCard: {
    backgroundColor: '#111',
    border: '1px solid #222',
    borderRadius: '8px',
    padding: '16px',
  },
  taskHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '12px',
  },
  taskTitle: {
    fontSize: '16px',
    fontWeight: '600',
    margin: '0 0 4px 0',
    color: '#fff',
  },
  taskCreator: {
    fontSize: '12px',
    color: '#666',
    margin: '0',
  },
  categoryTag: {
    fontSize: '11px',
    backgroundColor: '#222',
    color: '#999',
    padding: '4px 8px',
    borderRadius: '4px',
    fontWeight: '500',
  },
  taskDesc: {
    fontSize: '13px',
    color: '#999',
    margin: '0 0 12px 0',
    lineHeight: '1.4',
  },
  taskFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  taskMeta: {
    display: 'flex',
    gap: '8px',
  },
  valuationBadge: {
    fontSize: '12px',
    backgroundColor: 'rgba(0, 204, 102, 0.1)',
    color: '#00cc66',
    padding: '4px 8px',
    borderRadius: '4px',
    fontWeight: '500',
  },
  taskActions: {
    display: 'flex',
    gap: '8px',
  },
  taskViewBtn: {
    padding: '6px 12px',
    backgroundColor: 'transparent',
    color: '#0099ff',
    border: '1px solid #0099ff',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '11px',
    fontWeight: '600',
  },
  taskApplyBtn: {
    padding: '6px 12px',
    backgroundColor: '#0099ff',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '11px',
    fontWeight: '600',
  },
  collabGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '16px',
  },
  collabCard: {
    backgroundColor: '#111',
    border: '1px solid #222',
    borderRadius: '8px',
    padding: '20px',
  },
  collabCardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '12px',
  },
  collabTitle: {
    fontSize: '16px',
    fontWeight: '600',
    margin: '0',
    flex: 1,
  },
  roleBadge: {
    fontSize: '11px',
    backgroundColor: 'rgba(0, 153, 255, 0.2)',
    color: '#0099ff',
    padding: '4px 8px',
    borderRadius: '4px',
    fontWeight: '600',
    whiteSpace: 'nowrap',
  },
  collabCreator: {
    fontSize: '12px',
    color: '#666',
    margin: '0 0 8px 0',
  },
  collabDesc: {
    fontSize: '13px',
    color: '#999',
    margin: '0 0 16px 0',
    lineHeight: '1.4',
  },
  collabActions: {
    display: 'flex',
    gap: '8px',
  },
  viewCollabBtn: {
    flex: 1,
    padding: '8px 12px',
    backgroundColor: 'transparent',
    color: '#0099ff',
    border: '1px solid #0099ff',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '600',
  },
  messageBtn: {
    flex: 1,
    padding: '8px 12px',
    backgroundColor: '#0099ff',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '600',
  },
  invitationsList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
  },
  invitationCard: {
    backgroundColor: '#111',
    border: '1px solid #222',
    borderRadius: '8px',
    padding: '20px',
  },
  invHeader: {
    marginBottom: '12px',
  },
  invTitle: {
    fontSize: '16px',
    fontWeight: '600',
    margin: '0 0 4px 0',
    color: '#0099ff',
  },
  invFrom: {
    fontSize: '12px',
    color: '#666',
    margin: '0 0 8px 0',
  },
  roleBadgeSmall: {
    display: 'inline-block',
    fontSize: '10px',
    backgroundColor: '#222',
    color: '#999',
    padding: '2px 6px',
    borderRadius: '3px',
    fontWeight: '500',
  },
  messageBox: {
    backgroundColor: '#0a0a0a',
    border: '1px solid #222',
    borderRadius: '6px',
    padding: '12px',
    margin: '12px 0',
  },
  messageText: {
    fontSize: '13px',
    color: '#ccc',
    margin: '0',
    fontStyle: 'italic',
  },
  invDesc: {
    fontSize: '13px',
    color: '#999',
    margin: '0 0 16px 0',
    lineHeight: '1.4',
  },
  invFooter: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
  },
  ideaLink: {
    flex: 1,
  },
  linkBtn: {
    padding: '8px 16px',
    backgroundColor: 'transparent',
    color: '#0099ff',
    border: '1px solid #0099ff',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '600',
    width: '100%',
  },
  invActionButtons: {
    display: 'flex',
    gap: '8px',
  },
  acceptBtn: {
    padding: '8px 16px',
    backgroundColor: '#00cc66',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '600',
  },
  declineBtn: {
    padding: '8px 16px',
    backgroundColor: 'transparent',
    color: '#999',
    border: '1px solid #333',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '600',
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px 40px',
    backgroundColor: '#111',
    borderRadius: '8px',
    border: '1px dashed #222',
  },
  emptyIcon: {
    fontSize: '48px',
    marginBottom: '16px',
  },
  emptyTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#fff',
    margin: '0 0 8px 0',
  },
  emptyText: {
    color: '#666',
    fontSize: '13px',
    margin: '0 0 24px 0',
  },
  exploreBtn: {
    padding: '10px 24px',
    backgroundColor: '#0099ff',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '600',
  },
  viewAllBtn: {
    padding: '8px 16px',
    backgroundColor: '#0099ff',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '600',
  },
  loading: {
    color: '#999',
    textAlign: 'center',
    padding: '60px 40px',
  },
};
