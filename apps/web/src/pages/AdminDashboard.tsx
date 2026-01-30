import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import DashboardFooter from '../components/DashboardFooter';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'invite-codes' | 'beta-users' | 'feedback'>('overview');
  const [stats, setStats] = useState<any>(null);
  const [betaStats, setBetaStats] = useState<any>(null);
  const [inviteCodes, setInviteCodes] = useState<any[]>([]);
  const [feedbackList, setFeedbackList] = useState<any[]>([]);
  const [feedbackStats, setFeedbackStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateCode, setShowCreateCode] = useState(false);
  const [newCodeForm, setNewCodeForm] = useState({
    maxUses: '',
    expiresAt: '',
    description: '',
  });
  const [creatingCode, setCreatingCode] = useState(false);

  useEffect(() => {
    // Check if user is admin
    const userData = localStorage.getItem('userData');
    if (!userData) {
      navigate('/login');
      return;
    }

    try {
      const user = JSON.parse(userData);
      if (user.userType !== 'admin') {
        navigate('/');
        return;
      }
    } catch {
      navigate('/login');
      return;
    }

    loadDashboardData();
  }, [navigate]);

  const loadDashboardData = async () => {
    setLoading(true);
    setError('');
    try {
      const [statsRes, betaRes, codesRes, feedbackRes, feedbackStatsRes] = await Promise.all([
        api.getAdminStats().catch(err => {
          console.error('Error loading stats:', err.response?.data || err.message);
          return { success: false, error: err.response?.data?.error || 'Failed to load stats' };
        }),
        api.getBetaUsers().catch(err => {
          console.error('Error loading beta users:', err.response?.data || err.message);
          return { success: false, error: err.response?.data?.error || 'Failed to load beta users' };
        }),
        api.listInviteCodes().catch(err => {
          console.error('Error loading invite codes:', err.response?.data || err.message);
          return { success: false, error: err.response?.data?.error || 'Failed to load invite codes' };
        }),
        api.listFeedback().catch(err => {
          console.error('Error loading feedback:', err.response?.data || err.message);
          return { success: false, error: err.response?.data?.error || 'Failed to load feedback' };
        }),
        api.getFeedbackStats().catch(err => {
          console.error('Error loading feedback stats:', err.response?.data || err.message);
          return { success: false, error: err.response?.data?.error || 'Failed to load feedback stats' };
        }),
      ]);

      if (statsRes.success) setStats(statsRes.data);
      if (betaRes.success) setBetaStats(betaRes.data);
      if (codesRes.success) setInviteCodes(codesRes.data);
      if (feedbackRes.success) setFeedbackList(feedbackRes.data);
      if (feedbackStatsRes.success) setFeedbackStats(feedbackStatsRes.data);

      // Check if any failed
      const failures = [statsRes, betaRes, codesRes, feedbackRes, feedbackStatsRes].filter(r => !r.success);
      if (failures.length > 0) {
        const errorMessages = failures.map(f => f.error).join(', ');
        setError(`Failed to load some data: ${errorMessages}`);
        console.error('Dashboard data load failures:', failures);
      }
    } catch (err) {
      console.error('Failed to load admin dashboard:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateInviteCode = async () => {
    setCreatingCode(true);
    try {
      const res = await api.createInviteCode(
        newCodeForm.maxUses ? parseInt(newCodeForm.maxUses) : -1,
        newCodeForm.expiresAt || undefined,
        newCodeForm.description || undefined
      );

      if (res.success) {
        setInviteCodes([res.data, ...inviteCodes]);
        setShowCreateCode(false);
        setNewCodeForm({ maxUses: '', expiresAt: '', description: '' });
        alert('Invite code created successfully!');
      } else {
        alert(res.error || 'Failed to create invite code');
      }
    } catch (err: any) {
      alert(err.message || 'Error creating invite code');
    } finally {
      setCreatingCode(false);
    }
  };

  const handleDeactivateCode = async (id: string) => {
    if (!window.confirm('Are you sure you want to deactivate this code?')) return;

    try {
      const res = await api.deactivateInviteCode(id);
      if (res.success) {
        setInviteCodes(inviteCodes.map(code => code._id === id ? res.data : code));
        alert('Invite code deactivated');
      } else {
        alert(res.error || 'Failed to deactivate code');
      }
    } catch (err: any) {
      alert(err.message || 'Error deactivating code');
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <p style={styles.loading}>Loading admin dashboard...</p>
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
        <h1 style={styles.title}>⚙️ Admin Dashboard</h1>
        <p style={styles.subtitle}>Manage beta access, invitations, and platform statistics</p>

        {error && (
          <div style={styles.errorBox}>
            <p style={styles.errorText}>{error}</p>
          </div>
        )}

        {/* Tabs */}
        <div style={styles.tabsContainer}>
          <div style={styles.tabs}>
            {(['overview', 'invite-codes', 'beta-users', 'feedback'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  ...styles.tab,
                  ...(activeTab === tab ? styles.tabActive : {}),
                }}
              >
                {tab === 'overview' && '📊 Overview'}
                {tab === 'invite-codes' && '🔑 Invite Codes'}
                {tab === 'beta-users' && '👥 Beta Users'}
                {tab === 'feedback' && '💬 Feedback'}
              </button>
            ))}
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && stats && (
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Platform Statistics</h2>

            <div style={styles.statsGrid}>
              <div style={styles.statCard}>
                <p style={styles.statLabel}>Total Users</p>
                <p style={styles.statValue}>{stats.users?.total || 0}</p>
              </div>
              <div style={styles.statCard}>
                <p style={styles.statLabel}>Creators</p>
                <p style={styles.statValue}>{stats.users?.creators || 0}</p>
              </div>
              <div style={styles.statCard}>
                <p style={styles.statLabel}>Collaborators</p>
                <p style={styles.statValue}>{stats.users?.collaborators || 0}</p>
              </div>
              <div style={styles.statCard}>
                <p style={styles.statLabel}>Beta Users</p>
                <p style={styles.statValue}>{stats.users?.betaUsers || 0}</p>
              </div>
              <div style={styles.statCard}>
                <p style={styles.statLabel}>Active Collaborations</p>
                <p style={styles.statValue}>{stats.collaborations?.active || 0}</p>
              </div>
              <div style={styles.statCard}>
                <p style={styles.statLabel}>Pending Collaborations</p>
                <p style={styles.statValue}>{stats.collaborations?.pending || 0}</p>
              </div>
            </div>
          </div>
        )}

        {/* Invite Codes Tab */}
        {activeTab === 'invite-codes' && (
          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}>Invite Code Management</h2>
              <button
                onClick={() => setShowCreateCode(!showCreateCode)}
                style={styles.createButton}
              >
                {showCreateCode ? 'Cancel' : '+ Create New Code'}
              </button>
            </div>

            {showCreateCode && (
              <div style={styles.formBox}>
                <h3 style={{ color: '#fff', marginTop: 0 }}>Create New Invite Code</h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <input
                    type="number"
                    placeholder="Max Uses (-1 for unlimited)"
                    value={newCodeForm.maxUses}
                    onChange={(e) => setNewCodeForm({ ...newCodeForm, maxUses: e.target.value })}
                    style={styles.input}
                  />

                  <input
                    type="datetime-local"
                    placeholder="Expires At"
                    value={newCodeForm.expiresAt}
                    onChange={(e) => setNewCodeForm({ ...newCodeForm, expiresAt: e.target.value })}
                    style={styles.input}
                  />

                  <textarea
                    placeholder="Description (optional)"
                    value={newCodeForm.description}
                    onChange={(e) => setNewCodeForm({ ...newCodeForm, description: e.target.value })}
                    style={{...styles.input, minHeight: '80px'}}
                  />

                  <button
                    onClick={handleCreateInviteCode}
                    disabled={creatingCode}
                    style={{
                      ...styles.submitButton,
                      opacity: creatingCode ? 0.7 : 1,
                      cursor: creatingCode ? 'not-allowed' : 'pointer',
                    }}
                  >
                    {creatingCode ? 'Creating...' : 'Create Code'}
                  </button>
                </div>
              </div>
            )}

            <div style={styles.codesList}>
              {inviteCodes.length === 0 ? (
                <p style={{ color: '#999' }}>No invite codes yet</p>
              ) : (
                inviteCodes.map((code: any) => (
                  <div key={code._id} style={styles.codeItem}>
                    <div style={styles.codeInfo}>
                      <p style={styles.codeValue}>Code: <strong>{code.code}</strong></p>
                      <p style={styles.codeDetail}>
                        Created: {new Date(code.createdAt).toLocaleDateString()}
                      </p>
                      <p style={styles.codeDetail}>
                        Uses: {code.usedBy?.length || 0} / {code.maxUses === -1 ? 'Unlimited' : code.maxUses}
                      </p>
                      {code.expiresAt && (
                        <p style={styles.codeDetail}>
                          Expires: {new Date(code.expiresAt).toLocaleDateString()}
                        </p>
                      )}
                      {code.description && (
                        <p style={styles.codeDetail}>
                          Description: {code.description}
                        </p>
                      )}
                    </div>
                    <div style={styles.codeActions}>
                      <span
                        style={{
                          ...styles.statusBadge,
                          backgroundColor: code.isActive ? '#00cc66' : '#666',
                        }}
                      >
                        {code.isActive ? 'Active' : 'Inactive'}
                      </span>
                      {code.isActive && (
                        <button
                          onClick={() => handleDeactivateCode(code._id)}
                          style={styles.deactivateButton}
                        >
                          Deactivate
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Beta Users Tab */}
        {activeTab === 'beta-users' && betaStats && (
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Beta User Statistics</h2>

            <div style={styles.statsGrid}>
              <div style={styles.statCard}>
                <p style={styles.statLabel}>Total Beta Users</p>
                <p style={styles.statValue}>{betaStats.totalBetaUsers || 0}</p>
              </div>
              <div style={styles.statCard}>
                <p style={styles.statLabel}>Beta Percentage</p>
                <p style={styles.statValue}>{betaStats.betaUserPercentage}%</p>
              </div>
              <div style={styles.statCard}>
                <p style={styles.statLabel}>Active Codes</p>
                <p style={styles.statValue}>{betaStats.activeInviteCodes || 0}</p>
              </div>
              <div style={styles.statCard}>
                <p style={styles.statLabel}>Total Codes</p>
                <p style={styles.statValue}>{betaStats.totalInviteCodes || 0}</p>
              </div>
            </div>

            <h3 style={styles.recentTitle}>Recent Beta Users</h3>
            <div style={styles.usersList}>
              {betaStats.recentUsers?.length === 0 ? (
                <p style={{ color: '#999' }}>No recent beta users</p>
              ) : (
                betaStats.recentUsers?.map((user: any) => (
                  <div key={user._id} style={styles.userItem}>
                    <div>
                      <p style={styles.userName}>{user.username}</p>
                      <p style={styles.userEmail}>{user.email}</p>
                      <p style={styles.userType}>Type: {user.userType}</p>
                    </div>
                    <p style={styles.joinDate}>
                      Joined: {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Feedback Tab */}
        {activeTab === 'feedback' && (
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Community Feedback Management</h2>

            {feedbackStats && (
              <div style={styles.statsGrid}>
                <div style={styles.statCard}>
                  <p style={styles.statLabel}>Total Feedback</p>
                  <p style={styles.statValue}>{feedbackStats.total || 0}</p>
                </div>
                <div style={styles.statCard}>
                  <p style={styles.statLabel}>Open</p>
                  <p style={styles.statValue}>{feedbackStats.byStatus?.open || 0}</p>
                </div>
                <div style={styles.statCard}>
                  <p style={styles.statLabel}>In Progress</p>
                  <p style={styles.statValue}>{feedbackStats.byStatus?.inProgress || 0}</p>
                </div>
                <div style={styles.statCard}>
                  <p style={styles.statLabel}>Resolved</p>
                  <p style={styles.statValue}>{feedbackStats.byStatus?.resolved || 0}</p>
                </div>
              </div>
            )}

            <div style={styles.feedbackList}>
              {feedbackList.length === 0 ? (
                <p style={{ color: '#999' }}>No feedback yet</p>
              ) : (
                feedbackList.slice(0, 10).map((item: any) => (
                  <div
                    key={item._id}
                    style={styles.feedbackListItem}
                    onClick={() => navigate(`/feedback/${item._id}`)}
                  >
                    <div style={styles.feedbackListInfo}>
                      <p style={styles.feedbackListTitle}>{item.title}</p>
                      <p style={styles.feedbackListCategory}>{item.category} • {item.status}</p>
                      <p style={styles.feedbackListUser}>by {item.userId?.username}</p>
                    </div>
                    <div style={styles.feedbackListMeta}>
                      <span style={styles.upvoteBadge}>👍 {item.upvotes}</span>
                      <span
                        style={{
                          ...styles.priorityBadge,
                          backgroundColor:
                            item.priority === 'critical' ? '#ff6b6b' :
                            item.priority === 'high' ? '#ff9999' :
                            item.priority === 'medium' ? '#ffaa00' : '#00cc66',
                        }}
                      >
                        {item.priority}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <button
              onClick={() => navigate('/feedback')}
              style={styles.viewAllButton}
            >
              View All Feedback →
            </button>
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
  tabsContainer: {
    marginBottom: '30px',
    borderBottom: '1px solid #333',
  },
  tabs: {
    display: 'flex',
    gap: '0',
  },
  tab: {
    padding: '12px 20px',
    backgroundColor: 'transparent',
    border: 'none',
    color: '#999',
    cursor: 'pointer',
    fontSize: '14px',
    borderBottom: '2px solid transparent',
    transition: 'all 0.3s ease',
  },
  tabActive: {
    color: '#0099ff',
    borderBottomColor: '#0099ff',
  },
  section: {
    marginBottom: '30px',
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#fff',
    marginBottom: '20px',
    margin: '0 0 20px 0',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
    marginBottom: '20px',
  },
  statCard: {
    backgroundColor: '#1a1a1a',
    border: '1px solid #333',
    borderRadius: '8px',
    padding: '20px',
    textAlign: 'center',
  },
  statLabel: {
    color: '#999',
    fontSize: '12px',
    textTransform: 'uppercase',
    margin: '0 0 8px 0',
  },
  statValue: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#00cc66',
    margin: 0,
  },
  formBox: {
    backgroundColor: '#1a1a1a',
    border: '1px solid #333',
    borderRadius: '8px',
    padding: '20px',
    marginBottom: '20px',
  },
  input: {
    width: '100%',
    padding: '10px',
    backgroundColor: '#0a0a0a',
    border: '1px solid #333',
    borderRadius: '6px',
    color: '#fff',
    fontSize: '14px',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
  },
  submitButton: {
    padding: '10px 20px',
    backgroundColor: '#00cc66',
    color: '#000',
    border: 'none',
    borderRadius: '6px',
    fontWeight: '600',
  },
  createButton: {
    padding: '10px 20px',
    backgroundColor: '#0099ff',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px',
  },
  codesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  codeItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    border: '1px solid #333',
    borderRadius: '8px',
    padding: '16px',
  },
  codeInfo: {
    flex: 1,
  },
  codeValue: {
    color: '#0099ff',
    fontWeight: '600',
    margin: '0 0 8px 0',
    fontSize: '14px',
  },
  codeDetail: {
    color: '#999',
    fontSize: '12px',
    margin: '4px 0',
  },
  codeActions: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
  },
  statusBadge: {
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: '600',
    color: '#fff',
  },
  deactivateButton: {
    padding: '6px 12px',
    backgroundColor: '#666',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '600',
  },
  recentTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#fff',
    margin: '20px 0 12px 0',
  },
  usersList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  userItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    border: '1px solid #333',
    borderRadius: '8px',
    padding: '16px',
  },
  userName: {
    color: '#fff',
    fontWeight: '600',
    margin: '0 0 4px 0',
    fontSize: '14px',
  },
  userEmail: {
    color: '#0099ff',
    fontSize: '12px',
    margin: '0 0 4px 0',
  },
  userType: {
    color: '#999',
    fontSize: '12px',
    margin: 0,
  },
  joinDate: {
    color: '#666',
    fontSize: '12px',
    margin: 0,
  },
  loading: {
    textAlign: 'center',
    color: '#999',
    padding: '40px',
    fontSize: '16px',
  },
  feedbackList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '20px',
  },
  feedbackListItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    border: '1px solid #333',
    borderRadius: '8px',
    padding: '12px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  feedbackListInfo: {
    flex: 1,
  },
  feedbackListTitle: {
    color: '#fff',
    fontWeight: '600',
    margin: '0 0 4px 0',
    fontSize: '14px',
  },
  feedbackListCategory: {
    color: '#999',
    fontSize: '12px',
    margin: '0 0 4px 0',
  },
  feedbackListUser: {
    color: '#0099ff',
    fontSize: '12px',
    margin: 0,
  },
  feedbackListMeta: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
  },
  upvoteBadge: {
    fontSize: '12px',
    color: '#0099ff',
    fontWeight: '600',
  },
  priorityBadge: {
    fontSize: '11px',
    fontWeight: '600',
    color: '#fff',
    padding: '2px 6px',
    borderRadius: '3px',
  },
  viewAllButton: {
    width: '100%',
    padding: '10px',
    backgroundColor: '#0099ff',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px',
  },
};
