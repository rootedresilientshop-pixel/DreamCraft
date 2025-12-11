import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function DashboardPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'ideas' | 'collaborations' | 'invitations'>('overview');
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
        api.getMyIdeas(),
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
        <p style={styles.loading}>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Dashboard</h1>
      </div>

      {/* Tabs */}
      <div style={styles.tabs}>
        {(['overview', 'ideas', 'collaborations', 'invitations'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              ...styles.tab,
              ...(activeTab === tab ? styles.tabActive : {}),
            }}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={styles.content}>
        {/* Overview Tab */}
        {activeTab === 'overview' && stats && (
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Overview</h2>
            <div style={styles.statsGrid}>
              <div style={styles.statCard}>
                <p style={styles.statLabel}>My Ideas</p>
                <p style={styles.statValue}>{stats.myIdeasCount}</p>
              </div>
              <div style={styles.statCard}>
                <p style={styles.statLabel}>Pending Requests</p>
                <p style={styles.statValue}>{stats.pendingCollaborationRequests}</p>
              </div>
              <div style={styles.statCard}>
                <p style={styles.statLabel}>Active Collaborations</p>
                <p style={styles.statValue}>{stats.myCollaborationsCount}</p>
              </div>
              <div style={styles.statCard}>
                <p style={styles.statLabel}>Pending Invitations</p>
                <p style={styles.statValue}>{stats.pendingInvitationsCount}</p>
              </div>
            </div>

            <div style={styles.quickActions}>
              <button
                onClick={() => navigate('/create-idea')}
                style={{ ...styles.actionBtn, backgroundColor: '#00cc66' }}
              >
                + Create Idea
              </button>
              <button
                onClick={() => navigate('/collaborators')}
                style={{ ...styles.actionBtn, backgroundColor: '#0099ff' }}
              >
                Find Collaborators
              </button>
            </div>
          </div>
        )}

        {/* Ideas Tab */}
        {activeTab === 'ideas' && (
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>My Ideas</h2>
            {ideas.length === 0 ? (
              <p style={styles.emptyText}>No ideas yet</p>
            ) : (
              <div style={styles.ideasList}>
                {ideas.map((idea: any) => (
                  <div key={idea._id} style={styles.ideaCard}>
                    <div>
                      <h3 style={styles.ideaTitle}>{idea.title}</h3>
                      <p style={styles.ideaDesc}>{idea.description?.substring(0, 100)}...</p>
                      <div style={styles.statsRow}>
                        <span>Pending: {idea.stats?.pendingRequests || 0}</span>
                        <span>Collaborators: {idea.stats?.activeCollaborators || 0}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => navigate(`/ideas/${idea._id}`)}
                      style={styles.viewBtn}
                    >
                      View
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Collaborations Tab */}
        {activeTab === 'collaborations' && (
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>My Collaborations</h2>
            {collaborations.length === 0 ? (
              <p style={styles.emptyText}>No active collaborations yet</p>
            ) : (
              <div style={styles.collabList}>
                {collaborations.map((collab: any) => (
                  <div key={collab._id} style={styles.collabCard}>
                    <div>
                      <h3 style={styles.collabTitle}>{collab.ideaId?.title}</h3>
                      <p style={styles.collabCreator}>Creator: {collab.creatorId?.username}</p>
                      <p style={styles.collabRole}>Role: {collab.role}</p>
                    </div>
                    <button
                      onClick={() => navigate(`/ideas/${collab.ideaId._id}`)}
                      style={styles.viewBtn}
                    >
                      View Idea
                    </button>
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
              <p style={styles.emptyText}>No pending invitations</p>
            ) : (
              <div style={styles.invitationsList}>
                {invitations.map((inv: any) => (
                  <div key={inv._id} style={styles.invitationCard}>
                    <div>
                      <h3 style={styles.invTitle}>{inv.ideaId?.title}</h3>
                      <p style={styles.invDesc}>{inv.ideaId?.description?.substring(0, 100)}...</p>
                      <p style={styles.invCreator}>From: {inv.creatorId?.username}</p>
                      {inv.message && <p style={styles.invMessage}>Message: {inv.message}</p>}
                    </div>
                    <div style={styles.invActions}>
                      <button
                        onClick={() => handleAcceptInvitation(inv._id)}
                        style={{ ...styles.invBtn, backgroundColor: '#00cc66' }}
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleRejectInvitation(inv._id)}
                        style={{ ...styles.invBtn, backgroundColor: '#ff6666' }}
                      >
                        Reject
                      </button>
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
    backgroundColor: '#000',
    color: '#fff',
    padding: '20px',
  },
  header: {
    marginBottom: '30px',
  },
  title: {
    fontSize: '32px',
    margin: '0',
    fontWeight: 'bold',
  },
  tabs: {
    display: 'flex',
    gap: '10px',
    marginBottom: '30px',
    borderBottom: '1px solid #333',
    paddingBottom: '0',
  },
  tab: {
    padding: '12px 20px',
    backgroundColor: 'transparent',
    color: '#999',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    borderBottom: '2px solid transparent',
    transition: 'all 0.2s',
  },
  tabActive: {
    color: '#0099ff',
    borderBottomColor: '#0099ff',
  },
  content: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
  section: {
    marginBottom: '40px',
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '20px',
    margin: '0 0 20px 0',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '15px',
    marginBottom: '30px',
  },
  statCard: {
    backgroundColor: '#111',
    border: '1px solid #333',
    borderRadius: '8px',
    padding: '20px',
    textAlign: 'center',
  },
  statLabel: {
    color: '#999',
    fontSize: '12px',
    margin: '0 0 10px 0',
    textTransform: 'uppercase',
  },
  statValue: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#0099ff',
    margin: '0',
  },
  quickActions: {
    display: 'flex',
    gap: '12px',
  },
  actionBtn: {
    padding: '12px 24px',
    border: 'none',
    borderRadius: '6px',
    color: '#000',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '14px',
  },
  ideasList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
  },
  ideaCard: {
    backgroundColor: '#111',
    border: '1px solid #333',
    borderRadius: '8px',
    padding: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ideaTitle: {
    fontSize: '16px',
    margin: '0 0 8px 0',
    fontWeight: 'bold',
  },
  ideaDesc: {
    color: '#999',
    fontSize: '13px',
    margin: '0 0 10px 0',
  },
  statsRow: {
    display: 'flex',
    gap: '20px',
    fontSize: '12px',
    color: '#666',
  },
  viewBtn: {
    padding: '8px 16px',
    backgroundColor: '#0099ff',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '600',
  },
  collabList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
  },
  collabCard: {
    backgroundColor: '#111',
    border: '1px solid #333',
    borderRadius: '8px',
    padding: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  collabTitle: {
    fontSize: '16px',
    margin: '0 0 8px 0',
    fontWeight: 'bold',
  },
  collabCreator: {
    color: '#999',
    fontSize: '13px',
    margin: '0 0 5px 0',
  },
  collabRole: {
    color: '#0099ff',
    fontSize: '13px',
    margin: '0',
  },
  invitationsList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
  },
  invitationCard: {
    backgroundColor: '#111',
    border: '1px solid #333',
    borderRadius: '8px',
    padding: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  invTitle: {
    fontSize: '16px',
    margin: '0 0 8px 0',
    fontWeight: 'bold',
  },
  invDesc: {
    color: '#999',
    fontSize: '13px',
    margin: '0 0 5px 0',
  },
  invCreator: {
    color: '#0099ff',
    fontSize: '13px',
    margin: '0 0 5px 0',
  },
  invMessage: {
    color: '#ccc',
    fontSize: '13px',
    fontStyle: 'italic',
    margin: '0',
  },
  invActions: {
    display: 'flex',
    gap: '8px',
  },
  invBtn: {
    padding: '8px 12px',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '600',
  },
  emptyText: {
    color: '#666',
    textAlign: 'center',
    padding: '40px',
    margin: '0',
  },
  loading: {
    color: '#999',
    textAlign: 'center',
    padding: '40px',
  },
};
