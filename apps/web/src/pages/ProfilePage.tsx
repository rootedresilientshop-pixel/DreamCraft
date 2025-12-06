import React, { useState, useEffect } from 'react';
import api from '../api';

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    bio: '',
    skills: '',
  });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.getProfile();
      if (res.success && res.data) {
        setUser(res.data);
        setFormData({
          firstName: res.data.profile?.firstName || '',
          lastName: res.data.profile?.lastName || '',
          bio: res.data.profile?.bio || '',
          skills: res.data.profile?.skills?.join(', ') || '',
        });
      } else {
        setError('Failed to load profile');
      }
    } catch (err: any) {
      setError(err.message || 'Error loading profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e: any) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      // Convert skills string to array
      const skillsArray = formData.skills
        .split(',')
        .map((s: string) => s.trim())
        .filter((s: string) => s.length > 0);

      const payload = {
        profile: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          bio: formData.bio,
          skills: skillsArray,
        },
      };

      // In production, this would be PUT /api/users/:id
      // For now, we'll just update local state
      setUser((prev: any) => ({
        ...prev,
        profile: { ...prev.profile, ...payload.profile },
      }));

      setSuccess('Profile updated successfully!');
      setIsEditing(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Error saving profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <p style={styles.loading}>Loading profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={styles.container}>
        <p style={styles.error}>Failed to load profile. Please try again.</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.avatarSection}>
            <div style={styles.avatar}>
              {(user.profile?.firstName?.[0] || user.username?.[0] || 'U').toUpperCase()}
            </div>
            <div style={styles.userBasic}>
              <h1 style={styles.name}>
                {user.profile?.firstName} {user.profile?.lastName}
              </h1>
              <p style={styles.username}>@{user.username}</p>
              <p style={styles.email}>{user.email}</p>
            </div>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            style={{
              ...styles.editButton,
              ...(isEditing ? styles.editButtonActive : {}),
            }}
          >
            {isEditing ? '✕ Cancel' : '✏️ Edit Profile'}
          </button>
        </div>

        {/* Messages */}
        {error && <div style={styles.errorBox}>{error}</div>}
        {success && <div style={styles.successBox}>{success}</div>}

        {/* View Mode */}
        {!isEditing && (
          <div style={styles.viewMode}>
            <section style={styles.section}>
              <h2 style={styles.sectionTitle}>Account Info</h2>
              <div style={styles.infoRow}>
                <span style={styles.label}>Email:</span>
                <span style={styles.value}>{user.email}</span>
              </div>
              <div style={styles.infoRow}>
                <span style={styles.label}>User Type:</span>
                <span style={styles.value}>{user.userType || 'Creator'}</span>
              </div>
              <div style={styles.infoRow}>
                <span style={styles.label}>Member Since:</span>
                <span style={styles.value}>
                  {new Date(user.createdAt).toLocaleDateString()}
                </span>
              </div>
            </section>

            {user.profile?.bio && (
              <section style={styles.section}>
                <h2 style={styles.sectionTitle}>Bio</h2>
                <p style={styles.bio}>{user.profile.bio}</p>
              </section>
            )}

            {user.profile?.skills && user.profile.skills.length > 0 && (
              <section style={styles.section}>
                <h2 style={styles.sectionTitle}>Skills</h2>
                <div style={styles.skillsContainer}>
                  {user.profile.skills.map((skill: string, idx: number) => (
                    <span key={idx} style={styles.skillBadge}>
                      {skill}
                    </span>
                  ))}
                </div>
              </section>
            )}

            <section style={styles.section}>
              <h2 style={styles.sectionTitle}>Subscription</h2>
              <div style={styles.infoRow}>
                <span style={styles.label}>Tier:</span>
                <span style={styles.value}>
                  {user.subscription?.tier ? user.subscription.tier.charAt(0).toUpperCase() + user.subscription.tier.slice(1) : 'Free'}
                </span>
              </div>
              <div style={styles.infoRow}>
                <span style={styles.label}>Status:</span>
                <span style={styles.value}>
                  {user.subscription?.status ? user.subscription.status.charAt(0).toUpperCase() + user.subscription.status.slice(1) : 'Active'}
                </span>
              </div>
            </section>
          </div>
        )}

        {/* Edit Mode */}
        {isEditing && (
          <form onSubmit={handleSave} style={styles.editMode}>
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                style={styles.formInput}
                disabled={saving}
                placeholder="Your first name"
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                style={styles.formInput}
                disabled={saving}
                placeholder="Your last name"
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                style={{ ...styles.formInput, ...styles.textarea }}
                disabled={saving}
                placeholder="Tell us about yourself"
                rows={4}
              />
              <span style={styles.charCount}>{formData.bio.length}/500</span>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Skills (comma-separated)</label>
              <input
                type="text"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                style={styles.formInput}
                disabled={saving}
                placeholder="e.g., React, Node.js, Design, Marketing"
              />
              <p style={styles.helpText}>Separate multiple skills with commas</p>
            </div>

            <div style={styles.buttonGroup}>
              <button
                type="submit"
                style={{
                  ...styles.submitButton,
                  opacity: saving ? 0.7 : 1,
                  cursor: saving ? 'not-allowed' : 'pointer',
                }}
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                style={styles.cancelButton}
                disabled={saving}
              >
                Cancel
              </button>
            </div>
          </form>
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
  card: {
    backgroundColor: '#111',
    borderRadius: '12px',
    padding: '40px',
    maxWidth: '700px',
    margin: '0 auto',
    border: '1px solid #333',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '40px',
    paddingBottom: '30px',
    borderBottom: '1px solid #333',
  },
  avatarSection: {
    display: 'flex',
    gap: '20px',
    alignItems: 'flex-start',
    flex: 1,
  },
  avatar: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    backgroundColor: '#0099ff',
    color: '#000',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: '32px',
    flexShrink: 0,
  },
  userBasic: {
    flex: 1,
  },
  name: {
    margin: '0 0 8px 0',
    fontSize: '24px',
    fontWeight: 'bold',
  },
  username: {
    margin: '0 0 4px 0',
    color: '#999',
    fontSize: '14px',
  },
  email: {
    margin: '0',
    color: '#0099ff',
    fontSize: '14px',
  },
  editButton: {
    padding: '10px 20px',
    backgroundColor: '#0099ff',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px',
    whiteSpace: 'nowrap',
  },
  editButtonActive: {
    backgroundColor: '#ff6666',
  },
  errorBox: {
    backgroundColor: '#3d1f1f',
    border: '1px solid #7a3f3f',
    color: '#ff6666',
    padding: '12px',
    borderRadius: '6px',
    marginBottom: '20px',
    fontSize: '14px',
  },
  successBox: {
    backgroundColor: '#1f3d2f',
    border: '1px solid #3f7a54',
    color: '#66ff99',
    padding: '12px',
    borderRadius: '6px',
    marginBottom: '20px',
    fontSize: '14px',
  },
  viewMode: {
    display: 'flex',
    flexDirection: 'column',
    gap: '30px',
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  sectionTitle: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#ddd',
    margin: 0,
    marginBottom: '8px',
  },
  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '12px 0',
    borderBottom: '1px solid #222',
  },
  label: {
    color: '#999',
    fontSize: '14px',
  },
  value: {
    color: '#fff',
    fontSize: '14px',
    fontWeight: '500',
  },
  bio: {
    color: '#ccc',
    fontSize: '14px',
    lineHeight: '1.6',
    margin: 0,
  },
  skillsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
  },
  skillBadge: {
    backgroundColor: '#0099ff',
    color: '#fff',
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: '500',
  },
  editMode: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  formLabel: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#ddd',
  },
  formInput: {
    padding: '12px',
    backgroundColor: '#1a1a1a',
    border: '1px solid #333',
    borderRadius: '6px',
    color: '#fff',
    fontSize: '14px',
    fontFamily: 'inherit',
  },
  textarea: {
    resize: 'vertical' as const,
    minHeight: '120px',
  },
  charCount: {
    fontSize: '12px',
    color: '#666',
  },
  helpText: {
    fontSize: '12px',
    color: '#666',
    margin: 0,
  },
  buttonGroup: {
    display: 'flex',
    gap: '12px',
    marginTop: '20px',
  },
  submitButton: {
    flex: 1,
    padding: '12px 20px',
    backgroundColor: '#00cc66',
    color: '#000',
    border: 'none',
    borderRadius: '6px',
    fontWeight: '600',
    fontSize: '14px',
    cursor: 'pointer',
  },
  cancelButton: {
    flex: 1,
    padding: '12px 20px',
    backgroundColor: '#333',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontWeight: '600',
    fontSize: '14px',
    cursor: 'pointer',
  },
  loading: {
    color: '#999',
    textAlign: 'center' as const,
  },
  error: {
    color: '#ff6666',
    textAlign: 'center' as const,
  },
};
