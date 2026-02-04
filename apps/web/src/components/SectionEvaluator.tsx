import React, { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { FeatureBadge } from './FeatureBadge';

interface EvaluationResult {
  score: number;
  strengths: string[];
  improvements: string[];
  suggestions: string[];
  completeness: 'incomplete' | 'partial' | 'complete';
}

interface SectionEvaluatorProps {
  sectionName: string;
  content: string;
  debounceMs?: number;
}

/**
 * SectionEvaluator Component
 * Real-time quality scoring for business plan sections
 * Shows completion meter, strengths, and improvement suggestions
 */
export function SectionEvaluator({
  sectionName,
  content,
  debounceMs = 1500,
}: SectionEvaluatorProps) {
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(
    null
  );

  useEffect(() => {
    // Clear previous timeout
    if (debounceTimeout) clearTimeout(debounceTimeout);

    // Don't evaluate empty content
    if (!content.trim()) {
      setEvaluation(null);
      return;
    }

    // Set new debounce timeout
    const timeout = setTimeout(async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/ai/evaluate-section', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({
            sectionName,
            content,
          }),
        });

        if (!response.ok) throw new Error('Evaluation failed');

        const data = await response.json();
        setEvaluation(data);
      } catch (error) {
        console.error('Section evaluation error:', error);
      } finally {
        setLoading(false);
      }
    }, debounceMs);

    setDebounceTimeout(timeout);

    return () => clearTimeout(timeout);
  }, [content, sectionName, debounceMs]);

  if (!evaluation) return null;

  const getCompletenessColor = (completeness: string) => {
    switch (completeness) {
      case 'complete':
        return 'bg-green-100 border-green-300';
      case 'partial':
        return 'bg-yellow-100 border-yellow-300';
      default:
        return 'bg-red-100 border-red-300';
    }
  };

  const getCompletenessIcon = (completeness: string) => {
    switch (completeness) {
      case 'complete':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'partial':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-red-600" />;
    }
  };

  return (
    <div className={`border rounded-lg p-3 ${getCompletenessColor(evaluation.completeness)}`}>
      {/* Header with score */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {getCompletenessIcon(evaluation.completeness)}
          <span className="text-sm font-semibold text-gray-900">
            Section Quality
          </span>
          <FeatureBadge type="premium" label="Explorer" />
        </div>
        <div className="flex items-center gap-2">
          <div className="w-16 h-2 bg-gray-300 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 transition-all"
              style={{ width: `${evaluation.score}%` }}
            />
          </div>
          <span className="text-sm font-bold text-gray-900">
            {evaluation.score}%
          </span>
        </div>
      </div>

      {/* Strengths */}
      {evaluation.strengths.length > 0 && (
        <div className="mb-2">
          <p className="text-xs font-semibold text-gray-700 mb-1">Strengths:</p>
          <ul className="text-xs text-gray-700 space-y-0.5 ml-2">
            {evaluation.strengths.slice(0, 2).map((strength, i) => (
              <li key={i}>✓ {strength}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Improvements */}
      {evaluation.improvements.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-700 mb-1">
            Could improve:
          </p>
          <ul className="text-xs text-gray-700 space-y-0.5 ml-2">
            {evaluation.improvements.slice(0, 2).map((improvement, i) => (
              <li key={i}>→ {improvement}</li>
            ))}
          </ul>
        </div>
      )}

      {loading && (
        <p className="text-xs text-gray-600 mt-2">Re-evaluating...</p>
      )}
    </div>
  );
}
