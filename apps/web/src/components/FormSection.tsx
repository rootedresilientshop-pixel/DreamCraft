import React, { useState } from 'react';

interface TemplateSectionData {
  id: string;
  title: string;
  description: string;
  placeholder: string;
  hints?: string[];
  warnings?: string[];
  wordCountTarget?: number;
  required: boolean;
}

interface FormSectionProps {
  section: TemplateSectionData;
  value: string;
  onChange: (sectionId: string, value: string) => void;
  error?: string;
  suggestion?: string;
  loadingSuggestion?: boolean;
  onGetSuggestion: (sectionId: string) => Promise<void>;
  onUseSuggestion: (sectionId: string, suggestion: string) => void;
}

export default function FormSection({
  section,
  value,
  onChange,
  error,
  suggestion,
  loadingSuggestion = false,
  onGetSuggestion,
  onUseSuggestion,
}: FormSectionProps) {
  const [expandedHints, setExpandedHints] = useState(false);
  const wordCount = value.trim().split(/\s+/).filter(w => w.length > 0).length;
  const isLowOnWords = section.wordCountTarget && wordCount < section.wordCountTarget * 0.5;
  const isSufficientWords = section.wordCountTarget && wordCount >= section.wordCountTarget * 0.8;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(section.id, e.target.value);
  };

  const wordCountColor = () => {
    if (!section.wordCountTarget) return '#999';
    if (isSufficientWords) return '#66ff99';
    if (isLowOnWords) return '#ff9966';
    return '#999';
  };

  return (
    <div style={styles.container}>
      {/* Section Header */}
      <div style={styles.header}>
        <div style={styles.titleRow}>
          <h3 style={styles.title}>
            {section.required ? (
              <span style={{ color: '#ff6666' }}>●</span>
            ) : (
              <span style={{ color: '#666' }}>○</span>
            )}{' '}
            {section.title}
          </h3>
        </div>
        <p style={styles.description}>{section.description}</p>
      </div>

      {/* Hints */}
      {section.hints && section.hints.length > 0 && (
        <div style={styles.hintsContainer}>
          <button
            type="button"
            onClick={() => setExpandedHints(!expandedHints)}
            style={styles.hintsToggle}
          >
            💡 Tips ({section.hints.length})
          </button>
          {expandedHints && (
            <ul style={styles.hintsList}>
              {section.hints.map((hint, idx) => (
                <li key={idx} style={styles.hint}>
                  {hint}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Word Target Info */}
      {section.wordCountTarget && (
        <div style={styles.targetInfo}>
          <span style={styles.targetLabel}>Target:</span>
          <span style={styles.targetValue}>~{section.wordCountTarget} words</span>
        </div>
      )}

      {/* Textarea */}
      <textarea
        value={value}
        onChange={handleChange}
        placeholder={section.placeholder}
        style={{
          ...styles.textarea,
          ...(error ? styles.textareaError : {}),
        }}
      />

      {/* Word Counter */}
      <div style={styles.counterContainer}>
        <span style={{ color: wordCountColor() }}>
          {wordCount}/{section.wordCountTarget || '∞'} words
        </span>
        {isSufficientWords && (
          <span style={styles.completionBadge}>✓ Good</span>
        )}
        {isLowOnWords && section.wordCountTarget && (
          <span style={styles.warningBadge}>⚠ More needed</span>
        )}
      </div>

      {/* Error Message */}
      {error && <div style={styles.error}>{error}</div>}

      {/* AI Suggestion Button */}
      <button
        type="button"
        onClick={() => onGetSuggestion(section.id)}
        disabled={loadingSuggestion}
        style={{
          ...styles.suggestionButton,
          opacity: loadingSuggestion ? 0.6 : 1,
          cursor: loadingSuggestion ? 'not-allowed' : 'pointer',
        }}
      >
        {loadingSuggestion ? '✨ Getting suggestion...' : '✨ Get AI Suggestion'}
      </button>

      {/* AI Suggestion Display */}
      {suggestion && (
        <div style={styles.suggestionBox}>
          <div style={styles.suggestionLabel}>💡 AI Suggestion:</div>
          <div style={styles.suggestionText}>{suggestion}</div>
          <div style={styles.suggestionActions}>
            <button
              type="button"
              onClick={() => {
                onUseSuggestion(section.id, suggestion);
              }}
              style={{
                ...styles.suggestionActionButton,
                ...styles.useButton,
              }}
            >
              Use This
            </button>
            <button
              type="button"
              onClick={() => onGetSuggestion(section.id)}
              style={{
                ...styles.suggestionActionButton,
                ...styles.regenerateButton,
              }}
            >
              Regenerate
            </button>
            <button
              type="button"
              onClick={() => {
                // Clear suggestion by calling onUseSuggestion with empty
                // Parent component should handle clearing suggestion
              }}
              style={{
                ...styles.suggestionActionButton,
                ...styles.dismissButton,
              }}
            >
              ✕ Dismiss
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles: any = {
  container: {
    backgroundColor: '#1a1a1a',
    border: '1px solid #333',
    borderRadius: '8px',
    padding: '20px',
    marginBottom: '16px',
  },
  header: {
    marginBottom: '16px',
  },
  titleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  title: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#fff',
    margin: '0 0 8px 0',
  },
  description: {
    fontSize: '14px',
    color: '#aaa',
    margin: 0,
  },
  hintsContainer: {
    marginBottom: '12px',
  },
  hintsToggle: {
    background: 'none',
    border: 'none',
    color: '#6a0dad',
    cursor: 'pointer',
    padding: 0,
    fontSize: '13px',
    fontWeight: '600',
    transition: 'color 0.2s',
  },
  hintsList: {
    listStyle: 'none',
    padding: '8px 0 0 0',
    margin: 0,
  },
  hint: {
    fontSize: '13px',
    color: '#888',
    marginBottom: '4px',
    paddingLeft: '20px',
    position: 'relative' as const,
  },
  targetInfo: {
    display: 'flex',
    gap: '8px',
    fontSize: '12px',
    marginBottom: '12px',
  },
  targetLabel: {
    color: '#666',
  },
  targetValue: {
    color: '#0099ff',
    fontWeight: '600',
  },
  textarea: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#111',
    border: '1px solid #333',
    borderRadius: '6px',
    color: '#fff',
    fontSize: '14px',
    fontFamily: 'inherit',
    resize: 'vertical' as const,
    minHeight: '120px',
    boxSizing: 'border-box' as const,
    transition: 'border-color 0.2s',
  },
  textareaError: {
    borderColor: '#7a3f3f',
    backgroundColor: '#1f1a1a',
  },
  counterContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '12px',
    color: '#666',
    marginTop: '8px',
    marginBottom: '12px',
  },
  completionBadge: {
    backgroundColor: '#1f3d2f',
    color: '#66ff99',
    padding: '2px 8px',
    borderRadius: '3px',
    fontSize: '11px',
    fontWeight: '600',
  },
  warningBadge: {
    backgroundColor: '#3d2a1f',
    color: '#ff9966',
    padding: '2px 8px',
    borderRadius: '3px',
    fontSize: '11px',
    fontWeight: '600',
  },
  error: {
    backgroundColor: '#3d1f1f',
    border: '1px solid #7a3f3f',
    color: '#ff6666',
    padding: '8px 12px',
    borderRadius: '4px',
    fontSize: '12px',
    marginBottom: '12px',
  },
  suggestionButton: {
    width: '100%',
    padding: '10px 12px',
    backgroundColor: '#6a0dad',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    marginBottom: '12px',
  },
  suggestionBox: {
    backgroundColor: '#2a2a4d',
    border: '1px solid #6a0dad',
    borderRadius: '6px',
    padding: '12px',
    marginTop: '12px',
  },
  suggestionLabel: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#6a0dad',
    marginBottom: '8px',
  },
  suggestionText: {
    fontSize: '13px',
    color: '#ccc',
    backgroundColor: '#1a1a2f',
    padding: '8px',
    borderRadius: '4px',
    marginBottom: '8px',
    lineHeight: '1.5',
  },
  suggestionActions: {
    display: 'flex',
    gap: '6px',
    flexWrap: 'wrap' as const,
  },
  suggestionActionButton: {
    padding: '6px 12px',
    border: 'none',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  useButton: {
    backgroundColor: '#6a0dad',
    color: '#fff',
  },
  regenerateButton: {
    backgroundColor: '#444',
    color: '#ccc',
  },
  dismissButton: {
    backgroundColor: 'transparent',
    border: '1px solid #666',
    color: '#999',
  },
};
