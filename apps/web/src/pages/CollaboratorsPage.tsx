import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function CollaboratorsPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchSkill, setSearchSkill] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [invitedUsers, setInvitedUsers] = useState<Set<string>>(new Set());

  const handleSearch = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await api.searchCollaborators(searchQuery, searchSkill);
      if (res.success) {
        setResults(res.data || []);
      } else {
        setError(res.error || 'Failed to search collaborators');
      }
    } catch (err: any) {
      setError(err.message || 'Error searching collaborators');
    } finally {
      setLoading(false);
    }
  };

  const handleInvite = async (collaboratorId: string, username: string) => {
    // For demo, we'll just mark as invited without an idea
    // In a real app, user would select an idea first
    try {
      setInvitedUsers((prev) => new Set(prev).add(collaboratorId));
      // In production: call api.inviteCollaborator(collaboratorId, ideaId)
    } catch (err: any) {
      alert(`Failed to invite ${username}`);
      setInvitedUsers((prev) => {
        const newSet = new Set(prev);
        newSet.delete(collaboratorId);
        return newSet;
      });
    }
  };

  return (
    <div style={styles.container}>
      <button
        onClick={() => navigate('/dashboard')}
        style={{
          background: 'none',
          border: 'none',
          color: '#0099ff',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: '600',
          marginBottom: '20px',
        }}
      >
        ← Back to Dashboard
      </button>
      <div style={styles.header}>
        <h1 style={styles.title}>Find Collaborators</h1>
        <p style={styles.subtitle}>Search for talented collaborators to join your ideas</p>
      </div>

      <form onSubmit={handleSearch} style={styles.form}>
        <div style={styles.formRow}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Search by name</label>
            <input
              id="searchQuery"
              name="searchQuery"
              type="text"
              placeholder="Name or username..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={styles.input}
              disabled={loading}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Filter by skill</label>
            <select
              id="searchSkill"
              name="searchSkill"
              value={searchSkill}
              onChange={(e) => setSearchSkill(e.target.value)}
              style={styles.input}
              disabled={loading}
            >
              <option value="">All skills</option>
              <option value="Frontend Development">Frontend Development</option>
              <option value="Backend Development">Backend Development</option>
              <option value="Full Stack Development">Full Stack Development</option>
              <option value="Mobile Development">Mobile Development</option>
              <option value="UI/UX Design">UI/UX Design</option>
              <option value="Product Design">Product Design</option>
              <option value="Product Management">Product Management</option>
              <option value="Project Management">Project Management</option>
              <option value="Digital Marketing">Digital Marketing</option>
              <option value="Content Marketing">Content Marketing</option>
              <option value="Sales & Business Development">Sales & Business Development</option>
              <option value="Customer Success">Customer Success</option>
              <option value="Data Science">Data Science</option>
              <option value="DevOps & Infrastructure">DevOps & Infrastructure</option>
              <option value="Quality Assurance">Quality Assurance</option>
              <option value="Copywriting">Copywriting</option>
              <option value="Video Production">Video Production</option>
              <option value="Graphic Design">Graphic Design</option>
              <option value="Legal & Compliance">Legal & Compliance</option>
              <option value="Finance & Accounting">Finance & Accounting</option>
            </select>
          </div>

          <div style={styles.buttonWrapper}>
            <button
              type="submit"
              style={{
                ...styles.button,
                opacity: loading ? 0.7 : 1,
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
              disabled={loading}
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </div>

        {error && <div style={styles.error}>{error}</div>}

        <div style={styles.resultsSection}>
          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  style={{
                    backgroundColor: '#111',
                    border: '1px solid #333',
                    borderRadius: '8px',
                    padding: '20px',
                    animation: 'pulse 2s infinite',
                  }}
                >
                  <div style={{ display: 'flex', gap: '12px', marginBottom: '15px' }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      backgroundColor: '#333',
                    }} />
                    <div style={{ flex: 1 }}>
                      <div style={{
                        height: '16px',
                        backgroundColor: '#333',
                        borderRadius: '4px',
                        marginBottom: '8px',
                        width: '70%',
                      }} />
                      <div style={{
                        height: '12px',
                        backgroundColor: '#333',
                        borderRadius: '4px',
                        width: '50%',
                      }} />
                    </div>
                  </div>
                  <div style={{
                    height: '12px',
                    backgroundColor: '#333',
                    borderRadius: '4px',
                    marginBottom: '12px',
                  }} />
                  <div style={{
                    display: 'flex',
                    gap: '6px',
                    marginBottom: '15px',
                    flexWrap: 'wrap',
                  }}>
                    {[1, 2, 3].map((j) => (
                      <div
                        key={j}
                        style={{
                          height: '20px',
                          width: '60px',
                          backgroundColor: '#333',
                          borderRadius: '4px',
                        }}
                      />
                    ))}
                  </div>
                  <div style={{
                    height: '40px',
                    backgroundColor: '#333',
                    borderRadius: '6px',
                  }} />
                </div>
              ))}
              <style>{`
                @keyframes pulse {
                  0%, 100% { opacity: 1; }
                  50% { opacity: 0.6; }
                }
              `}</style>
            </div>
          ) : results.length === 0 && searchQuery ? (
            <div style={styles.placeholder}>
              <p style={styles.placeholderText}>No collaborators found. Try a different search term or skill.</p>
            </div>
          ) : results.length > 0 ? (
            <div>
              <p style={styles.resultCount}>Found {results.length} collaborator(s)</p>
              <div style={styles.gridContainer}>
                {results.map((user: any) => (
                  <div key={user._id} style={styles.card}>
                    <div style={styles.cardHeader}>
                      <div style={styles.avatar}>
                        {(user.profile?.firstName?.[0] || user.username?.[0] || 'C').toUpperCase()}
                      </div>
                      <div style={styles.cardTitle}>
                        <h3 style={styles.name}>
                          {user.profile?.firstName} {user.profile?.lastName}
                        </h3>
                        <p style={styles.username}>@{user.username}</p>
                      </div>
                    </div>

                    {user.profile?.bio && (
                      <p style={styles.bio}>{user.profile.bio}</p>
                    )}

                    {user.profile?.skills && user.profile.skills.length > 0 && (
                      <div style={styles.skills}>
                        {user.profile.skills.slice(0, 3).map((skill: string, idx: number) => (
                          <span key={idx} style={styles.skill}>
                            {skill}
                          </span>
                        ))}
                        {user.profile.skills.length > 3 && (
                          <span style={styles.skill}>+{user.profile.skills.length - 3}</span>
                        )}
                      </div>
                    )}

                    <button
                      onClick={() => handleInvite(user._id, user.username)}
                      disabled={invitedUsers.has(user._id)}
                      style={{
                        ...styles.inviteButton,
                        ...(invitedUsers.has(user._id) ? styles.inviteButtonDone : {}),
                      }}
                    >
                      {invitedUsers.has(user._id) ? '✓ Invited' : 'Invite'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : !searchQuery ? (
            <div style={styles.placeholder}>
              <p style={styles.placeholderText}>Start searching to find collaborators</p>
            </div>
          ) : null}
        </div>
      </form>
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
    marginBottom: '40px',
  },
  title: {
    fontSize: '32px',
    fontWeight: 'bold',
    marginBottom: '10px',
    marginTop: 0,
  },
  subtitle: {
    color: '#999',
    fontSize: '16px',
    marginBottom: 0,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  formRow: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
    alignItems: 'flex-end',
  },
  formGroup: {
    flex: 1,
    minWidth: '200px',
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    marginBottom: '8px',
    color: '#ddd',
  },
  input: {
    padding: '12px',
    backgroundColor: '#1a1a1a',
    border: '1px solid #333',
    borderRadius: '6px',
    color: '#fff',
    fontSize: '14px',
  },
  buttonWrapper: {
    display: 'flex',
    alignItems: 'flex-end',
  },
  button: {
    padding: '12px 24px',
    backgroundColor: '#0099ff',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px',
  },
  error: {
    backgroundColor: '#3d1f1f',
    border: '1px solid #7a3f3f',
    color: '#ff6666',
    padding: '12px',
    borderRadius: '6px',
    marginBottom: '20px',
    fontSize: '14px',
  },
  resultsSection: {
    marginTop: '30px',
  },
  loading: {
    color: '#999',
    textAlign: 'center' as const,
  },
  noResults: {
    color: '#999',
    textAlign: 'center' as const,
  },
  resultCount: {
    color: '#999',
    marginBottom: '20px',
    fontSize: '14px',
  },
  gridContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px',
  },
  card: {
    backgroundColor: '#111',
    border: '1px solid #333',
    borderRadius: '8px',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
  },
  cardHeader: {
    display: 'flex',
    gap: '12px',
    marginBottom: '15px',
  },
  avatar: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    backgroundColor: '#0099ff',
    color: '#000',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: '18px',
    flexShrink: 0,
  },
  cardTitle: {
    flex: 1,
  },
  name: {
    margin: '0 0 4px 0',
    fontSize: '16px',
    fontWeight: '600',
  },
  username: {
    margin: 0,
    fontSize: '12px',
    color: '#999',
  },
  bio: {
    color: '#ccc',
    fontSize: '13px',
    marginBottom: '12px',
    lineHeight: '1.4',
  },
  skills: {
    display: 'flex',
    gap: '6px',
    flexWrap: 'wrap',
    marginBottom: '15px',
  },
  skill: {
    backgroundColor: '#1a1a1a',
    color: '#0099ff',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    border: '1px solid #333',
  },
  inviteButton: {
    padding: '10px 16px',
    backgroundColor: '#00cc66',
    color: '#000',
    border: 'none',
    borderRadius: '6px',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '13px',
    transition: 'background-color 0.2s',
  },
  inviteButtonDone: {
    backgroundColor: '#669999',
    cursor: 'default',
  },
  placeholder: {
    textAlign: 'center' as const,
    padding: '40px 20px',
    backgroundColor: '#111',
    borderRadius: '8px',
  },
  placeholderText: {
    color: '#666',
    fontSize: '16px',
  },
};
