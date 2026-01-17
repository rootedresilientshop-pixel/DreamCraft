import React, { useState, useEffect } from 'react';
import FormSection from './FormSection';
import api from '../api';

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

interface TemplateData {
  _id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  sections: TemplateSectionData[];
  isDefault: boolean;
}

interface SectionDataItem {
  content: string;
  suggestion: string | null;
  loadingSuggestion: boolean;
  error: string | null;
  isValid: boolean;
}

interface TemplateFormProps {
  template: TemplateData;
  onSubmit: (formData: any) => Promise<void>;
  onCancel: () => void;
}

export default function TemplateForm({
  template,
  onSubmit,
  onCancel,
}: TemplateFormProps) {
  // State for each template section
  const [sectionData, setSectionData] = useState<Record<string, SectionDataItem>>(() => {
    const initial: Record<string, SectionDataItem> = {};
    template.sections.forEach((section) => {
      initial[section.id] = {
        content: '',
        suggestion: null,
        loadingSuggestion: false,
        error: null,
        isValid: false,
      };
    });
    return initial;
  });

  const [submitting, setSubmitting] = useState(false);
  const [generalError, setGeneralError] = useState('');
  const [showValidation, setShowValidation] = useState(false);

  // Calculate completion progress
  const completedSections = Object.entries(sectionData).filter(
    ([sectionId, data]) => {
      const section = template.sections.find((s) => s.id === sectionId);
      if (!section) return false;
      if (section.required && !data.content.trim()) return false;
      return true;
    }
  ).length;
  const progressPercent = Math.round((completedSections / template.sections.length) * 100);

  // Handle section content change
  const handleSectionChange = (sectionId: string, value: string) => {
    setSectionData((prev) => ({
      ...prev,
      [sectionId]: {
        ...prev[sectionId],
        content: value,
        error: null, // Clear error when user types
        suggestion: null, // Clear suggestion when user modifies
      },
    }));
  };

  // Get AI suggestion for a section
  const handleGetSuggestion = async (sectionId: string) => {
    const section = template.sections.find((s) => s.id === sectionId);
    if (!section) return;

    setSectionData((prev) => ({
      ...prev,
      [sectionId]: {
        ...prev[sectionId],
        loadingSuggestion: true,
      },
    }));

    try {
      const res = await api.getAISuggestions({
        title: '', // Will be filled by user
        description: sectionData[sectionId].content,
        category: template.category,
      });

      if (res.success && res.data) {
        // Extract a suggestion from the response
        // Prefer descriptionSuggestions, then other suggestions
        const suggestion =
          res.data.descriptionSuggestions?.[0] ||
          res.data.suggestions?.[0] ||
          'Consider adding more details to this section.';

        setSectionData((prev) => ({
          ...prev,
          [sectionId]: {
            ...prev[sectionId],
            suggestion,
            loadingSuggestion: false,
          },
        }));
      } else {
        setSectionData((prev) => ({
          ...prev,
          [sectionId]: {
            ...prev[sectionId],
            error: 'Failed to get suggestions. Try again.',
            loadingSuggestion: false,
          },
        }));
      }
    } catch (err: any) {
      setSectionData((prev) => ({
        ...prev,
        [sectionId]: {
          ...prev[sectionId],
          error: err.message || 'Error getting suggestions',
          loadingSuggestion: false,
        },
      }));
    }
  };

  // Use suggestion in the section
  const handleUseSuggestion = (sectionId: string, suggestion: string) => {
    setSectionData((prev) => ({
      ...prev,
      [sectionId]: {
        ...prev[sectionId],
        content: prev[sectionId].content + (prev[sectionId].content ? ' ' : '') + suggestion,
        suggestion: null,
      },
    }));
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string | null> = {};
    let isValid = true;

    template.sections.forEach((section) => {
      const data = sectionData[section.id];

      if (section.required && !data.content.trim()) {
        newErrors[section.id] = `${section.title} is required`;
        isValid = false;
      } else {
        newErrors[section.id] = null;
      }
    });

    setSectionData((prev) => ({
      ...prev,
      ...Object.keys(newErrors).reduce(
        (acc, key) => ({
          ...acc,
          [key]: {
            ...prev[key],
            error: newErrors[key],
          },
        }),
        {}
      ),
    }));

    return isValid;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError('');

    if (!validateForm()) {
      setShowValidation(true);
      return;
    }

    setSubmitting(true);

    try {
      // Combine sections into description or keep separate
      const title = template.name + ' Idea'; // User should override this
      const description = template.sections
        .map((section) => `**${section.title}**\n${sectionData[section.id].content}`)
        .join('\n\n');

      const formData = {
        title,
        description,
        category: template.category,
        visibility: 'private',
        templateUsed: template._id,
        sectionBreakdown: Object.fromEntries(
          template.sections.map((section) => [
            section.id,
            sectionData[section.id].content,
          ])
        ),
      };

      await onSubmit(formData);
    } catch (err: any) {
      setGeneralError(err.message || 'Failed to submit form');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.templateIcon}>{template.icon}</div>
          <div>
            <h2 style={styles.headerTitle}>{template.name}</h2>
            <p style={styles.headerSubtitle}>{template.description}</p>
          </div>
        </div>
        <button onClick={onCancel} style={styles.closeButton}>
          ✕
        </button>
      </div>

      {/* Progress Bar */}
      <div style={styles.progressContainer}>
        <div style={styles.progressLabel}>
          Sections: {completedSections}/{template.sections.length} ({progressPercent}%)
        </div>
        <div style={styles.progressBar}>
          <div
            style={{
              ...styles.progressFill,
              width: `${progressPercent}%`,
            }}
          />
        </div>
      </div>

      {/* General Error */}
      {generalError && (
        <div style={styles.generalError}>{generalError}</div>
      )}

      {/* Validation Prompt */}
      {showValidation && (
        <div style={styles.validationPrompt}>
          ⚠️ Please complete all required sections before submitting
        </div>
      )}

      {/* Form Sections */}
      <form onSubmit={handleSubmit} style={styles.form}>
        {template.sections.map((section) => (
          <FormSection
            key={section.id}
            section={section}
            value={sectionData[section.id].content}
            onChange={handleSectionChange}
            error={sectionData[section.id].error || undefined}
            suggestion={sectionData[section.id].suggestion || undefined}
            loadingSuggestion={sectionData[section.id].loadingSuggestion}
            onGetSuggestion={handleGetSuggestion}
            onUseSuggestion={handleUseSuggestion}
          />
        ))}

        {/* Submit Button */}
        <div style={styles.buttonGroup}>
          <button
            type="submit"
            disabled={submitting}
            style={{
              ...styles.submitButton,
              opacity: submitting ? 0.6 : 1,
              cursor: submitting ? 'not-allowed' : 'pointer',
            }}
          >
            {submitting ? '⏳ Creating Idea...' : '✓ Create Idea'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={submitting}
            style={{
              ...styles.cancelButton,
              opacity: submitting ? 0.6 : 1,
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

const styles: any = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingBottom: '16px',
    borderBottom: '1px solid #333',
    position: 'relative',
  },
  headerContent: {
    display: 'flex',
    gap: '16px',
    alignItems: 'flex-start',
  },
  templateIcon: {
    fontSize: '40px',
    lineHeight: 1,
    flex: '0 0 auto',
  },
  headerTitle: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#fff',
    margin: '0 0 4px 0',
  },
  headerSubtitle: {
    fontSize: '13px',
    color: '#888',
    margin: 0,
  },
  closeButton: {
    background: 'none',
    border: 'none',
    color: '#666',
    fontSize: '20px',
    cursor: 'pointer',
    padding: 0,
    transition: 'color 0.2s',
  },
  progressContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  progressLabel: {
    fontSize: '12px',
    color: '#888',
  },
  progressBar: {
    width: '100%',
    height: '6px',
    backgroundColor: '#222',
    borderRadius: '3px',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#6a0dad',
    transition: 'width 0.3s ease',
  },
  generalError: {
    backgroundColor: '#3d1f1f',
    border: '1px solid #7a3f3f',
    color: '#ff6666',
    padding: '12px',
    borderRadius: '6px',
    fontSize: '14px',
  },
  validationPrompt: {
    backgroundColor: '#3d2a1f',
    border: '1px solid #7a5a3f',
    color: '#ff9966',
    padding: '12px',
    borderRadius: '6px',
    fontSize: '13px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  buttonGroup: {
    display: 'flex',
    gap: '12px',
    marginTop: '16px',
  },
  submitButton: {
    flex: 1,
    padding: '12px 20px',
    backgroundColor: '#6a0dad',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  cancelButton: {
    flex: 1,
    padding: '12px 20px',
    backgroundColor: '#333',
    color: '#999',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
};
