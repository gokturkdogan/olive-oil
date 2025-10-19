// Loyalty tier thresholds (in cents/kuruş)
export const LOYALTY_THRESHOLDS = {
  GOLD: 500000,      // 5000 TL
  PLATINUM: 1000000, // 10000 TL
  DIAMOND: 1500000,  // 15000 TL
} as const;

// Tier labels
export const LOYALTY_LABELS = {
  STANDARD: "Standart",
  GOLD: "Gold",
  PLATINUM: "Platinum",
  DIAMOND: "Diamond",
} as const;

// Tier colors for badges
export const LOYALTY_COLORS = {
  STANDARD: "bg-gray-100 text-gray-800 border-gray-300",
  GOLD: "bg-amber-100 text-amber-800 border-amber-300",
  PLATINUM: "bg-slate-100 text-slate-800 border-slate-400",
  DIAMOND: "bg-blue-100 text-blue-800 border-blue-400",
} as const;

// Tier discount percentages
export const LOYALTY_DISCOUNTS = {
  STANDARD: 0,
  GOLD: 5,
  PLATINUM: 10,
  DIAMOND: 15,
} as const;

type LoyaltyTierType = keyof typeof LOYALTY_LABELS;

/**
 * Calculate loyalty tier based on total spent
 */
export function calculateLoyaltyTier(totalSpent: number): LoyaltyTierType {
  if (totalSpent >= LOYALTY_THRESHOLDS.DIAMOND) {
    return "DIAMOND";
  } else if (totalSpent >= LOYALTY_THRESHOLDS.PLATINUM) {
    return "PLATINUM";
  } else if (totalSpent >= LOYALTY_THRESHOLDS.GOLD) {
    return "GOLD";
  }
  return "STANDARD";
}

/**
 * Get next tier info
 */
export function getNextTierInfo(currentTier: LoyaltyTierType, totalSpent: number) {
  const tiers = [
    { tier: "GOLD" as LoyaltyTierType, threshold: LOYALTY_THRESHOLDS.GOLD },
    { tier: "PLATINUM" as LoyaltyTierType, threshold: LOYALTY_THRESHOLDS.PLATINUM },
    { tier: "DIAMOND" as LoyaltyTierType, threshold: LOYALTY_THRESHOLDS.DIAMOND },
  ];

  for (const { tier, threshold } of tiers) {
    if (totalSpent < threshold) {
      return {
        nextTier: tier,
        nextThreshold: threshold,
        remaining: threshold - totalSpent,
        progress: (totalSpent / threshold) * 100,
      };
    }
  }

  return null; // Already at highest tier
}


