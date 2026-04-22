import { ClosetItem, WardrobeAnalytics } from '../types';

const NATURAL_MATERIALS = new Set(['cotton', 'linen', 'wool', 'silk', 'hemp']);

export function calculateAnalytics(items: ClosetItem[]): WardrobeAnalytics {
  if (items.length === 0) {
    return {
      sustainabilityScore: 0,
      naturalPercentage: 0,
      syntheticPercentage: 0,
      riskProfile: {
        low: 0,
        medium: 0,
        high: 0
      }
    };
  }

  const totalItems = items.length;

  const result = items.reduce(
    (acc, item) => {
      // 1. Sustainability Score
      acc.totalSustainability += item.data.scores?.sustainability || 0;

      // 2. Natural Percentage
      const itemNatural = (item.data.materials || [])
        .filter(m => NATURAL_MATERIALS.has(m.name.toLowerCase()))
        .reduce((sum, m) => sum + m.percentage, 0);
      acc.totalNaturalPercentage += itemNatural;

      // 3. Risk Profile
      const risk = item.microplastics_risk || 'low';
      acc.riskCounts[risk] = (acc.riskCounts[risk] || 0) + 1;

      return acc;
    },
    {
      totalSustainability: 0,
      totalNaturalPercentage: 0,
      riskCounts: { low: 0, medium: 0, high: 0 } as Record<'low' | 'medium' | 'high', number>
    }
  );

  const naturalPercentage = Math.round(result.totalNaturalPercentage / totalItems);

  return {
    sustainabilityScore: Math.round(result.totalSustainability / totalItems),
    naturalPercentage,
    syntheticPercentage: 100 - naturalPercentage,
    riskProfile: {
      low: Math.round((result.riskCounts.low / totalItems) * 100),
      medium: Math.round((result.riskCounts.medium / totalItems) * 100),
      high: Math.round((result.riskCounts.high / totalItems) * 100)
    }
  };
}
