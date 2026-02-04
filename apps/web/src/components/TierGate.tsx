import React, { ReactNode } from 'react';
import { Lock } from 'lucide-react';

interface TierGateProps {
  requiredTier: 'free' | 'explorer' | 'builder' | 'enterprise';
  userTier: 'free' | 'explorer' | 'builder' | 'enterprise';
  featureName: string;
  children: ReactNode;
}

const tierNames = {
  free: 'Free',
  explorer: 'Explorer',
  builder: 'Builder',
  enterprise: 'Enterprise',
};

const tierHierarchy = {
  free: 0,
  explorer: 1,
  builder: 2,
  enterprise: 3,
};

/**
 * TierGate Component
 * Wraps features that require certain subscription tiers
 * Shows "Coming Soon" badge for features user doesn't have access to
 */
export function TierGate({
  requiredTier,
  userTier,
  featureName,
  children,
}: TierGateProps) {
  const userTierLevel = tierHierarchy[userTier] || 0;
  const requiredTierLevel = tierHierarchy[requiredTier] || 0;

  // Check if tier paywalls are enabled (from localStorage or env)
  const paywallsEnabled =
    localStorage.getItem('TIER_PAYWALLS_ENABLED') === 'true';

  // If paywalls disabled or user has access, render children
  if (!paywallsEnabled || userTierLevel >= requiredTierLevel) {
    return <>{children}</>;
  }

  // Otherwise, show locked feature UI
  return (
    <div className="relative opacity-60 pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-50 rounded-lg flex items-center justify-center z-10">
        <div className="text-center">
          <Lock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm font-medium text-gray-600 mb-1">
            {featureName}
          </p>
          <p className="text-xs text-gray-500 mb-3">Coming Soon</p>
          <p className="text-xs text-gray-600">
            Available in <strong>{tierNames[requiredTier]}</strong> plan
          </p>
        </div>
      </div>
      <div className="opacity-30">{children}</div>
    </div>
  );
}
