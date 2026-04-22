import { ClosetItem, WardrobeAnalytics } from '../types';

const NATURAL_MATERIALS = ['cotton', 'linen', 'wool', 'silk', 'hemp'];

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

  // 1. Sustainability Score (Average)
  const totalSustainability = items.reduce(
    (acc, item) => acc + (item.data.scores?.sustainability || 0),
    0
  );
  const sustainabilityScore = Math.round(totalSustainability / totalItems);

  // 2. Natural & Synthetic Percentages
  // For each item, sum its natural materials. Then average those sums across items.
  const totalNaturalPercentage = items.reduce((acc, item) => {
    const itemNatural = (item.data.materials || [])
      .filter(m => NATURAL_MATERIALS.includes(m.name.toLowerCase()))
      .reduce((sum, m) => sum + m.percentage, 0);
    return acc + itemNatural;
  }, 0);

  const naturalPercentage = Math.round(totalNaturalPercentage / totalItems);
  const syntheticPercentage = 100 - naturalPercentage;

  // 3. Risk Profile (Distribution)
  const riskCounts = items.reduce(
    (acc, item) => {
      const risk = item.microplastics_risk || 'low';
      acc[risk] = (acc[risk] || 0) + 1;
      return acc;
    },
    { low: 0, medium: 0, high: 0 } as Record<string, number>
  );

  const riskProfile = {
    low: Math.round((riskCounts.low / totalItems) * 100),
    medium: Math.round((riskCounts.medium / totalItems) * 100),
    high: Math.round((riskCounts.high / totalItems) * 100)
  };

  return {
    sustainabilityScore,
    naturalPercentage,
    syntheticPercentage,
    riskProfile
  };
}
