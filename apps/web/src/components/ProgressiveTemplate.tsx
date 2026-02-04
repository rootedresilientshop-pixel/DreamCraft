import React, { useState, ReactNode } from 'react';
import { ChevronDown, Lock } from 'lucide-react';
import { FeatureBadge } from './FeatureBadge';

export interface TemplateSection {
  id: string;
  title: string;
  description: string;
  content?: string;
  isComplete?: boolean;
  unlocksAfter?: string; // ID of previous section that must be complete
}

interface ProgressiveTemplateProps {
  sections: TemplateSection[];
  visibleCount?: number;
  onSectionChange?: (sectionId: string, content: string) => void;
  children?: ReactNode;
}

/**
 * ProgressiveTemplate Component
 * Progressive disclosure UI - shows N sections at a time
 * Unlocks additional sections as user completes each one
 */
export function ProgressiveTemplate({
  sections,
  visibleCount = 3,
  onSectionChange,
}: ProgressiveTemplateProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>(
    sections[0]?.id || null
  );
  const [completedSections, setCompletedSections] = useState<Set<string>>(
    new Set()
  );
  const [sectionContent, setSectionContent] = useState<Record<string, string>>(
    {}
  );

  // Determine which sections should be visible
  const getVisibleSections = () => {
    let visibleCount_ = visibleCount;
    const visible: TemplateSection[] = [];

    for (let i = 0; i < sections.length && visible.length < visibleCount_; i++) {
      const section = sections[i];

      // Check if dependencies are met
      if (section.unlocksAfter) {
        if (!completedSections.has(section.unlocksAfter)) {
          continue;
        }
      }

      visible.push(section);
    }

    return visible;
  };

  const handleSectionContent = (sectionId: string, content: string) => {
    setSectionContent((prev) => ({ ...prev, [sectionId]: content }));
    onSectionChange?.(sectionId, content);

    // Mark as complete if content has minimum length
    if (content.trim().length > 20) {
      setCompletedSections((prev) => new Set(prev).add(sectionId));
    }
  };

  const visibleSections = getVisibleSections();

  return (
    <div className="space-y-4">
      {/* Progress Overview */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-gray-900">Template Progress</h3>
            <FeatureBadge type="premium" label="Explorer" />
          </div>
          <span className="text-xs font-semibold text-blue-600">
            {completedSections.size} / {sections.length} sections
          </span>
        </div>
        <div className="w-full h-2 bg-gray-300 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all"
            style={{
              width: `${(completedSections.size / sections.length) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Visible Sections */}
      <div className="space-y-3">
        {visibleSections.map((section) => (
          <div
            key={section.id}
            className={`border rounded-lg overflow-hidden transition-all ${
              expandedSection === section.id
                ? 'ring-2 ring-blue-500 border-blue-300'
                : 'border-gray-300'
            }`}
          >
            {/* Section Header */}
            <button
              onClick={() =>
                setExpandedSection(
                  expandedSection === section.id ? null : section.id
                )
              }
              className={`w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors ${
                completedSections.has(section.id) ? 'bg-green-50' : ''
              }`}
            >
              <div className="flex items-center gap-3 text-left">
                <div className="flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold">
                  {completedSections.has(section.id) ? (
                    <span className="text-green-600">✓</span>
                  ) : (
                    <span className="text-gray-500">
                      {sections.indexOf(section) + 1}
                    </span>
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900">
                    {section.title}
                  </h4>
                  <p className="text-xs text-gray-600">{section.description}</p>
                </div>
              </div>
              <ChevronDown
                className={`w-5 h-5 text-gray-600 transition-transform ${
                  expandedSection === section.id ? 'transform rotate-180' : ''
                }`}
              />
            </button>

            {/* Section Content */}
            {expandedSection === section.id && (
              <div className="border-t border-gray-200 p-4 bg-white space-y-3">
                <textarea
                  value={sectionContent[section.id] || ''}
                  onChange={(e) =>
                    handleSectionContent(section.id, e.target.value)
                  }
                  placeholder={`Write about ${section.title.toLowerCase()}...`}
                  className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
                <div className="flex items-center justify-between text-xs text-gray-600">
                  <span>
                    {(sectionContent[section.id] || '').length} characters
                  </span>
                  <span>
                    {(sectionContent[section.id] || '').split(/\s+/).length}{' '}
                    words
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Locked Sections Preview */}
      {sections.length > visibleSections.length && (
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-2 text-sm text-gray-700 mb-2">
            <Lock className="w-4 h-4" />
            <span className="font-semibold">
              {sections.length - visibleSections.length} more sections coming
            </span>
          </div>
          <div className="space-y-2">
            {sections.slice(visibleSections.length).map((section) => (
              <div
                key={section.id}
                className="text-xs text-gray-600 flex items-start gap-2"
              >
                <Lock className="w-3 h-3 mt-0.5 flex-shrink-0" />
                <span>
                  {section.title}
                  {section.unlocksAfter && ' (unlock by completing previous)'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
