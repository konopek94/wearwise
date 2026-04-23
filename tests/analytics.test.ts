import { describe, it, expect } from 'vitest';
import { calculateAnalytics } from '../lib/analytics';
import { ClosetItem } from '../types';

describe('calculateAnalytics', () => {
  const mockItems: ClosetItem[] = [
    {
      id: '1',
      user_id: 'u1',
      product_name: 'Cotton T-Shirt',
      brand: 'Brand A',
      category: 'T-Shirt',
      verdict: 'buy',
      microplastics_risk: 'low',
      status: 'wardrobe',
      created_at: new Date().toISOString(),
      data: {
        product_name: 'Cotton T-Shirt',
        brand: 'Brand A',
        category: 'T-Shirt',
        materials: [{ name: 'Cotton', percentage: 100 }],
        scores: { sustainability: 90, durability: 80, comfort: 95 },
        microplastics_risk: 'low',
        verdict: 'buy',
        summary: 'Great item'
      }
    },
    {
      id: '2',
      user_id: 'u1',
      product_name: 'Poly Blend Jacket',
      brand: 'Brand B',
      category: 'Jacket',
      verdict: 'avoid',
      microplastics_risk: 'high',
      status: 'wardrobe',
      created_at: new Date().toISOString(),
      data: {
        product_name: 'Poly Blend Jacket',
        brand: 'Brand B',
        category: 'Jacket',
        materials: [
          { name: 'Polyester', percentage: 80 },
          { name: 'Wool', percentage: 20 }
        ],
        scores: { sustainability: 30, durability: 70, comfort: 50 },
        microplastics_risk: 'high',
        verdict: 'avoid',
        summary: 'Avoid this'
      }
    }
  ];

  it('calculates analytics correctly for a collection of items', () => {
    const result = calculateAnalytics(mockItems);

    // sustainabilityScore: (90 + 30) / 2 = 60
    expect(result.sustainabilityScore).toBe(60);

    // naturalPercentage:
    // Item 1: 100% (Cotton)
    // Item 2: 20% (Wool)
    // Average: (100 + 20) / 2 = 60
    expect(result.naturalPercentage).toBe(60);

    // syntheticPercentage: 100 - 60 = 40
    expect(result.syntheticPercentage).toBe(40);

    // riskProfile: 1 low, 0 medium, 1 high
    // percentages: 50% low, 0% medium, 50% high
    expect(result.riskProfile).toEqual({
      low: 50,
      medium: 0,
      high: 50
    });
  });

  it('handles empty collection', () => {
    const result = calculateAnalytics([]);
    expect(result.sustainabilityScore).toBe(0);
    expect(result.naturalPercentage).toBe(0);
    expect(result.syntheticPercentage).toBe(0);
    expect(result.riskProfile).toEqual({
      low: 0,
      medium: 0,
      high: 0
    });
  });

  it('handles items with no materials or all synthetic materials', () => {
    const syntheticItems: ClosetItem[] = [
      {
        id: '1',
        user_id: 'u1',
        product_name: 'Polyester T-Shirt',
        brand: 'Brand A',
        category: 'T-Shirt',
        verdict: 'avoid',
        microplastics_risk: 'high',
        status: 'wardrobe',
        created_at: new Date().toISOString(),
        data: {
          product_name: 'Polyester T-Shirt',
          brand: 'Brand A',
          category: 'T-Shirt',
          materials: [{ name: 'Polyester', percentage: 100 }],
          scores: { sustainability: 10, durability: 90, comfort: 40 },
          microplastics_risk: 'high',
          verdict: 'avoid',
          summary: 'Synthetic'
        }
      },
      {
        id: '2',
        user_id: 'u1',
        product_name: 'Unknown Item',
        brand: 'Brand B',
        category: 'Unknown',
        verdict: 'consider',
        microplastics_risk: 'medium',
        status: 'wardrobe',
        created_at: new Date().toISOString(),
        data: {
          product_name: 'Unknown Item',
          brand: 'Brand B',
          category: 'Unknown',
          materials: [], // Empty materials
          scores: { sustainability: 50, durability: 50, comfort: 50 },
          microplastics_risk: 'medium',
          verdict: 'consider',
          summary: 'No materials listed'
        }
      }
    ];

    const result = calculateAnalytics(syntheticItems);

    expect(result.naturalPercentage).toBe(0);
    expect(result.syntheticPercentage).toBe(100);
    expect(result.riskProfile).toEqual({
      low: 0,
      medium: 50,
      high: 50
    });
  });
});
