import React from 'react';
import { Zap, Lock, Star } from 'lucide-react';

type BadgeType = 'premium' | 'coming-soon' | 'beta' | 'new';

interface FeatureBadgeProps {
  type: BadgeType;
  label?: string;
}

/**
 * FeatureBadge Component
 * Tags features with their status (Premium, Coming Soon, Beta, New)
 * Helps users understand feature availability and future pricing
 */
export function FeatureBadge({ type, label }: FeatureBadgeProps) {
  const badgeStyles: Record<BadgeType, { bg: string; text: string; icon: React.ReactNode; defaultLabel: string }> = {
    premium: {
      bg: 'bg-purple-100',
      text: 'text-purple-700',
      icon: <Zap className="w-3 h-3" />,
      defaultLabel: 'Premium',
    },
    'coming-soon': {
      bg: 'bg-blue-100',
      text: 'text-blue-700',
      icon: <Star className="w-3 h-3" />,
      defaultLabel: 'Coming Soon',
    },
    beta: {
      bg: 'bg-yellow-100',
      text: 'text-yellow-700',
      icon: <Zap className="w-3 h-3" />,
      defaultLabel: 'Beta',
    },
    new: {
      bg: 'bg-green-100',
      text: 'text-green-700',
      icon: <Star className="w-3 h-3" />,
      defaultLabel: 'New',
    },
  };

  const style = badgeStyles[type];

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${style.bg} ${style.text}`}
      title={`This is a ${label || style.defaultLabel.toLowerCase()} feature`}
    >
      {style.icon}
      {label || style.defaultLabel}
    </span>
  );
}
