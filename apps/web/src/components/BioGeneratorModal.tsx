import React, { useState } from 'react';
import { X, Loader } from 'lucide-react';
import { FeatureBadge } from './FeatureBadge';

interface BioGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBioGenerated: (bio: string) => void;
}

const questions = [
  'What is your primary skill or area of expertise?',
  'What types of projects are you most passionate about?',
  'What is your career goal or what do you want to achieve?',
];

/**
 * BioGeneratorModal Component
 * Interview-based bio generator for collaborators
 * Asks 3 questions and generates a professional bio
 */
export function BioGeneratorModal({
  isOpen,
  onClose,
  onBioGenerated,
}: BioGeneratorModalProps) {
  const [step, setStep] = useState(0); // 0-2: questions, 3: result
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(false);
  const [bio, setBio] = useState('');
  const [canCopy, setCanCopy] = useState(false);

  if (!isOpen) return null;

  const handleAnswerChange = (value: string) => {
    setAnswers({ ...answers, [step]: value });
  };

  const handleNext = async () => {
    if (step < 2) {
      if (answers[step]?.trim()) {
        setStep(step + 1);
      }
    } else {
      // Generate bio
      setLoading(true);
      try {
        const response = await fetch('/api/ai/generate-bio', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({
            answers: {
              question1: answers[0],
              question2: answers[1],
              question3: answers[2],
            },
          }),
        });

        if (!response.ok) throw new Error('Failed to generate bio');

        const data = await response.json();
        setBio(data.bio);
        setStep(3);
        setCanCopy(true);
      } catch (error) {
        console.error('Bio generation error:', error);
        setBio('Unable to generate bio. Please try again.');
        setStep(3);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleAcceptBio = () => {
    onBioGenerated(bio);
    onClose();
  };

  const handleRegenerate = () => {
    setBio('');
    setStep(2); // Go back to last question
    setCanCopy(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(bio);
    setCanCopy(false);
    setTimeout(() => setCanCopy(true), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-xl font-bold text-gray-900">
                Generate Your Bio
              </h2>
              <FeatureBadge type="beta" label="Free" />
            </div>
            <p className="text-sm text-gray-600">
              {step <= 2
                ? `Question ${step + 1} of ${questions.length}`
                : 'Your Generated Bio'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {step <= 2 ? (
            <div className="space-y-4">
              <p className="text-lg font-medium text-gray-900">
                {questions[step]}
              </p>
              <textarea
                value={answers[step] || ''}
                onChange={(e) => handleAnswerChange(e.target.value)}
                placeholder="Your answer..."
                className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
              <p className="text-xs text-gray-500">
                {answers[step]?.length || 0} characters
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm leading-relaxed text-gray-900">
                  {bio}
                </p>
              </div>
              <p className="text-xs text-gray-600">
                Review your bio and make changes if needed. You can always edit
                it further after accepting.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t">
          {step <= 2 ? (
            <>
              {step > 0 && (
                <button
                  onClick={() => setStep(step - 1)}
                  className="flex-1 px-4 py-2 text-gray-700 hover:text-gray-900 border border-gray-300 rounded-lg transition-colors"
                >
                  Back
                </button>
              )}
              <button
                onClick={handleNext}
                disabled={loading || !answers[step]?.trim()}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Generating...
                  </>
                ) : step === 2 ? (
                  'Generate Bio'
                ) : (
                  'Next'
                )}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleRegenerate}
                className="flex-1 px-4 py-2 text-gray-700 hover:text-gray-900 border border-gray-300 rounded-lg transition-colors"
              >
                Regenerate
              </button>
              <button
                onClick={handleCopy}
                className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg transition-colors"
              >
                {canCopy ? 'Copied!' : 'Copy'}
              </button>
              <button
                onClick={handleAcceptBio}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Use This Bio
              </button>
            </>
          )}
          {step > 0 && step !== 3 && (
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-900"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
