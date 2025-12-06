import React, { useState } from 'react';
import api from '../api';

export default function CreateIdeaPage({ onSuccess }: any) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Technology',
    visibility: 'private',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // Validate required fields
      if (!formData.title.trim() || !formData.description.trim()) {
        setError('Title and description are required');
        setLoading(false);
        return;
      }

      const res = await api.createIdea(formData);

      if (res.success || res.data) {
        setSuccess(true);
        // Reset form
        setFormData({
          title: '',
          description: '',
          category: 'Technology',
          visibility: 'private',
        });
        // Call callback or redirect after 1 second
        setTimeout(() => {
          if (onSuccess) {
            onSuccess(res.data);
          } else {
            window.location.href = '/';
          }
        }, 1000);
      } else {
        setError(res.error || 'Failed to create idea');
      }
    } catch (err: any) {
      setError(err.message || 'Error creating idea');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Create New Idea</h1>
        <p style={styles.subtitle}>Share your innovation with the world</p>

        {error && <div style={styles.error}>{error}</div>}
        {success && <div style={styles.success}>✓ Idea created successfully! Redirecting...</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Title *</label>
            <input
              id="title"
              type="text"
              name="title"
              placeholder="Enter idea title"
              value={formData.title}
              onChange={handleChange}
              maxLength={100}
              style={styles.input}
              disabled={loading}
              required
            />
            <span style={styles.charCount}>{formData.title.length}/100</span>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Description *</label>
            <textarea
              id="description"
              name="description"
              placeholder="Describe your idea in detail"
              value={formData.description}
              onChange={handleChange}
              maxLength={1000}
              rows={6}
              style={{ ...styles.input, ...styles.textarea }}
              disabled={loading}
              required
            />
            <span style={styles.charCount}>{formData.description.length}/1000</span>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Category</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              style={styles.input}
              disabled={loading}
            >
              <option value="Technology">Technology</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Finance">Finance</option>
              <option value="Education">Education</option>
              <option value="Entertainment">Entertainment</option>
              <option value="E-Commerce">E-Commerce</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Visibility</label>
            <select
              id="visibility"
              name="visibility"
              value={formData.visibility}
              onChange={handleChange}
              style={styles.input}
              disabled={loading}
            >
              <option value="private">Private (only you)</option>
              <option value="public">Public (visible in marketplace)</option>
            </select>
          </div>

          <div style={styles.buttonGroup}>
            <button
              type="submit"
              style={{
                ...styles.button,
                ...styles.submitButton,
                opacity: loading ? 0.7 : 1,
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Idea'}
            </button>
            <button
              type="button"
              onClick={() => window.history.back()}
              style={{
                ...styles.button,
                ...styles.cancelButton,
              }}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
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
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#111',
    borderRadius: '12px',
    padding: '40px',
    width: '100%',
    maxWidth: '600px',
    border: '1px solid #333',
  },
  title: {
    fontSize: '32px',
    fontWeight: 'bold',
    marginBottom: '10px',
    marginTop: 0,
    color: '#fff',
  },
  subtitle: {
    color: '#999',
    marginBottom: '30px',
    fontSize: '16px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
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
    fontFamily: 'inherit',
    transition: 'border-color 0.2s',
  },
  textarea: {
    resize: 'vertical' as const,
    minHeight: '150px',
  },
  charCount: {
    fontSize: '12px',
    color: '#666',
    marginTop: '4px',
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
  success: {
    backgroundColor: '#1f3d2f',
    border: '1px solid #3f7a54',
    color: '#66ff99',
    padding: '12px',
    borderRadius: '6px',
    marginBottom: '20px',
    fontSize: '14px',
  },
  buttonGroup: {
    display: 'flex',
    gap: '12px',
    marginTop: '20px',
  },
  button: {
    padding: '12px 20px',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    flex: 1,
  },
  submitButton: {
    backgroundColor: '#0099ff',
    color: '#fff',
  },
  cancelButton: {
    backgroundColor: '#333',
    color: '#fff',
  },
};
