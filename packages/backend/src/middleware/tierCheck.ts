import { Request, Response, NextFunction } from 'express';

/**
 * Tier Check Middleware
 * Validates user subscription tier for feature access
 *
 * Tiers:
 * - free: Basic features (Tier 1)
 * - explorer: Enhanced features (Tier 2)
 * - builder: Premium features (Tier 3)
 * - enterprise: Custom/unlimited
 */

type SubscriptionTier = 'free' | 'explorer' | 'builder' | 'enterprise';

const tierHierarchy: Record<SubscriptionTier, number> = {
  free: 0,
  explorer: 1,
  builder: 2,
  enterprise: 3,
};

/**
 * Get user's current tier (placeholder - replace with actual user lookup)
 */
async function getUserTier(userId: string): Promise<SubscriptionTier> {
  // TODO: Implement actual user lookup from database
  // For now, return 'free' tier
  // In production: const user = await User.findById(userId);
  // return user?.subscription?.tier || 'free';
  return 'free';
}

/**
 * Middleware to require minimum tier for endpoint
 * Usage: router.post('/endpoint', requireTier('explorer'), handler)
 */
export function requireTier(minimumTier: SubscriptionTier) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).userId;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Check if tier enforcement is enabled
      const tierPaywallsEnabled =
        process.env.TIER_PAYWALLS_ENABLED === 'true';

      if (!tierPaywallsEnabled) {
        // Paywalls disabled - allow all access (for development/beta)
        return next();
      }

      const userTier = await getUserTier(userId);
      const userTierLevel = tierHierarchy[userTier] || 0;
      const minimumTierLevel = tierHierarchy[minimumTier] || 0;

      if (userTierLevel < minimumTierLevel) {
        return res.status(403).json({
          error: 'Feature requires upgrade',
          requiredTier: minimumTier,
          currentTier: userTier,
          message: `This feature requires ${minimumTier === 'explorer' ? 'Explorer' : 'Builder'} plan or higher.`,
        });
      }

      next();
    } catch (error) {
      console.error('Tier check error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
}

/**
 * Check tier permissions without middleware
 */
export async function checkTierAccess(
  userId: string,
  requiredTier: SubscriptionTier
): Promise<boolean> {
  const tierPaywallsEnabled = process.env.TIER_PAYWALLS_ENABLED === 'true';

  if (!tierPaywallsEnabled) {
    return true; // No enforcement during beta
  }

  const userTier = await getUserTier(userId);
  const userTierLevel = tierHierarchy[userTier] || 0;
  const requiredTierLevel = tierHierarchy[requiredTier] || 0;

  return userTierLevel >= requiredTierLevel;
}

/**
 * Get tier feature access map
 */
const freeTierFeatures = [
  'createIdea',
  'viewIdea',
  'aiCoPilot',
  'aiExpand',
  'bioGenerator',
  'realTimeSuggestions',
  'basicTemplate',
];

const explorerTierFeatures = [
  ...freeTierFeatures,
  'marketAnalysis',
  'competitiveAnalysis',
  'teamRolesSuggester',
  'riskAssessment',
  'roadmapBuilder',
  'sectionQualityScorer',
  'progressiveDisclosure',
  'templateRecommender',
];

const builderTierFeatures = [
  ...explorerTierFeatures,
  'financialProjections',
  'pitchNarrativeGenerator',
  'tractionValidator',
  'fundUsagePlanner',
];

export const tierFeatures: Record<SubscriptionTier, string[]> = {
  free: freeTierFeatures,
  explorer: explorerTierFeatures,
  builder: builderTierFeatures,
  enterprise: [
    ...builderTierFeatures,
    'customIntegrations',
    'whiteLabel',
    'dedicatedSupport',
  ],
};
