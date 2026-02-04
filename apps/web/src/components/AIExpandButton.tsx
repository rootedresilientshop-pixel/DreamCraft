import React, { useState } from 'react';
import { Wand2, Copy, Check } from 'lucide-react';
import { FeatureBadge } from './FeatureBadge';

interface AIExpandButtonProps {
  fieldName: string;
  currentValue: string;
  onExpand: (expandedValue: string) => void;
  disabled?: boolean;
  showBadge?: boolean;
}

/**
 * AIExpandButton Component
 * "✨ Expand with AI" button that generates suggestions for text fields
 * Usage: Add next to title, description, or template section textareas
 */
export function AIExpandButton({
  fieldName,
  currentValue,
  onExpand,
  disabled = false,
  showBadge = false,
}: AIExpandButtonProps) {
  const [loading, setLoading] = useState(false);
  const [showSuggestion, setShowSuggestion] = useState(false);
  const [suggestion, setSuggestion] = useState('');
  const [copied, setCopied] = useState(false);

  const handleExpand = async () => {
    if (!currentValue.trim() || loading) return;

    setLoading(true);
    try {
      const response = await fetch('/api/ai/expand', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          fieldName,
          currentValue,
        }),
      });

      if (!response.ok) throw new Error('Failed to expand');

      const data = await response.json();
      setSuggestion(data.expanded);
      setShowSuggestion(true);
    } catch (error) {
      console.error('Expand error:', error);
      // Fallback: show generic suggestion
      setSuggestion('Unable to generate suggestion. Please try again.');
      setShowSuggestion(true);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = () => {
    onExpand(suggestion);
    setShowSuggestion(false);
    setSuggestion('');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(suggestion);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (showSuggestion) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-2">
        <div className="flex items-start justify-between mb-2">
          <span className="text-xs font-semibold text-blue-900">
            AI Suggestion
          </span>
          <button
            onClick={() => setShowSuggestion(false)}
            className="text-blue-600 hover:text-blue-800 text-xs"
          >
            ✕
          </button>
        </div>
        <p className="text-sm text-blue-900 mb-3 leading-relaxed">
          {suggestion}
        </p>
        <div className="flex gap-2">
          <button
            onClick={handleAccept}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1 rounded transition-colors"
          >
            Use This
          </button>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm px-3 py-1 rounded transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                Copied
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleExpand}
        disabled={disabled || loading || !currentValue.trim()}
        className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
        title="Expand with AI assistance"
      >
        <Wand2 className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        {loading ? 'Expanding...' : 'Expand with AI'}
      </button>
      {showBadge && <FeatureBadge type="beta" label="Free" />}
    </div>
  );
}
