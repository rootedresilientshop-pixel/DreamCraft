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
  const [showValidation, setShowValidation] = useState(false);
  const [validation, setValidation] = useState<any>(null);
  const [loadingValidation, setLoadingValidation] = useState(false);
  const [suggestions, setSuggestions] = useState<any>(null);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGetSuggestions = async () => {
    setLoadingSuggestions(true);
    try {
      const res = await api.getAISuggestions(formData);
      if (res.success) {
        setSuggestions(res.data);
      }
    } catch (err) {
      console.error('Failed to get suggestions:', err);
    } finally {
      setLoadingSuggestions(false);
    }
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

      // First create the idea
      const createRes = await api.createIdea(formData);

      if (createRes.success || createRes.data) {
        const ideaId = createRes.data._id;

        // Then validate it with AI
        setLoadingValidation(true);
        try {
          const validationRes = await api.validateAndScoreIdea(ideaId);
          if (validationRes.success) {
            setValidation(validationRes.data);
            setShowValidation(true);
          }
        } catch (err) {
          console.error('Validation failed:', err);
          // Don't fail the whole flow if validation fails
        } finally {
          setLoadingValidation(false);
        }

        setSuccess(true);
        // Reset form
        setFormData({
          title: '',
          description: '',
          category: 'Technology',
          visibility: 'private',
        });

        // If no validation or after 3 seconds, redirect
        if (!showValidation) {
          setTimeout(() => {
            if (onSuccess) {
              onSuccess(createRes.data);
            } else {
              window.location.href = '/';
            }
          }, 1000);
        }
      } else {
        setError(createRes.error || 'Failed to create idea');
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

          {/* AI Suggestions Button */}
          <div style={{ marginTop: '10px' }}>
            <button
              type="button"
              onClick={handleGetSuggestions}
              style={{
                ...styles.button,
                backgroundColor: '#6a0dad',
                color: '#fff',
                padding: '8px 16px',
                fontSize: '13px',
              }}
              disabled={loadingSuggestions || !formData.title || !formData.description}
            >
              {loadingSuggestions ? '✨ Getting AI Suggestions...' : '✨ Get AI Suggestions'}
            </button>
          </div>

          {/* Display Suggestions */}
          {suggestions && (
            <div style={{
              backgroundColor: '#1a1a3d',
              border: '1px solid #6a0dad',
              borderRadius: '8px',
              padding: '16px',
              marginTop: '16px',
            }}>
              <h3 style={{ color: '#ddd', fontSize: '16px', marginTop: 0 }}>💡 AI Suggestions</h3>

              {suggestions.titleSuggestions?.length > 0 && (
                <div style={{ marginBottom: '12px' }}>
                  <strong style={{ color: '#aaa' }}>Title Ideas:</strong>
                  <ul style={{ marginTop: '8px', paddingLeft: '20px' }}>
                    {suggestions.titleSuggestions.map((s: string, i: number) => (
                      <li key={i} style={{ color: '#ccc', marginBottom: '4px' }}>{s}</li>
                    ))}
                  </ul>
                </div>
              )}

              {suggestions.descriptionSuggestions?.length > 0 && (
                <div style={{ marginBottom: '12px' }}>
                  <strong style={{ color: '#aaa' }}>Add to Description:</strong>
                  <ul style={{ marginTop: '8px', paddingLeft: '20px' }}>
                    {suggestions.descriptionSuggestions.map((s: string, i: number) => (
                      <li key={i} style={{ color: '#ccc', marginBottom: '4px' }}>{s}</li>
                    ))}
                  </ul>
                </div>
              )}

              {suggestions.categorySuggestion && (
                <div>
                  <strong style={{ color: '#aaa' }}>Suggested Category:</strong>
                  <span style={{ color: '#6a0dad', marginLeft: '8px' }}>{suggestions.categorySuggestion}</span>
                </div>
              )}
            </div>
          )}

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

        {/* Validation Results Modal */}
        {showValidation && validation && (
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
            }}>
              <h2 style={{ color: '#fff', marginTop: 0 }}>🎯 AI Validation Results</h2>

              <div style={{
                fontSize: '48px',
                textAlign: 'center',
                color: validation.score >= 70 ? '#66ff99' : validation.score >= 40 ? '#ffaa00' : '#ff6666',
                margin: '20px 0',
              }}>
                {validation.score}/100
              </div>

              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ color: '#66ff99', fontSize: '16px' }}>✅ Strengths</h3>
                <ul style={{ paddingLeft: '20px' }}>
                  {validation.strengths?.map((s: string, i: number) => (
                    <li key={i} style={{ color: '#ccc', marginBottom: '8px' }}>{s}</li>
                  ))}
                </ul>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ color: '#ff6666', fontSize: '16px' }}>⚠️ Weaknesses</h3>
                <ul style={{ paddingLeft: '20px' }}>
                  {validation.weaknesses?.map((w: string, i: number) => (
                    <li key={i} style={{ color: '#ccc', marginBottom: '8px' }}>{w}</li>
                  ))}
                </ul>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ color: '#0099ff', fontSize: '16px' }}>💡 Suggestions</h3>
                <ul style={{ paddingLeft: '20px' }}>
                  {validation.suggestions?.map((s: string, i: number) => (
                    <li key={i} style={{ color: '#ccc', marginBottom: '8px' }}>{s}</li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => {
                  setShowValidation(false);
                  if (onSuccess) {
                    onSuccess(validation);
                  } else {
                    window.location.href = '/';
                  }
                }}
                style={{
                  ...styles.button,
                  ...styles.submitButton,
                  width: '100%',
                }}
              >
                Continue to Dashboard
              </button>
            </div>
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
