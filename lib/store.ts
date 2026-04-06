import { AnalysisResult } from "../types";

export interface TopProduct {
  result: AnalysisResult;
  count: number;
}

// In-memory store (resets on serverless cold starts, suitable for MVP)
const topProducts: Map<string, TopProduct> = new Map();

// Initialize with some mock data so the Top 10 list isn't empty initially
const mockProducts: AnalysisResult[] = [
  {
    product_name: "Organic Cotton T-Shirt",
    brand: "Patagonia",
    category: "Clothing",
    materials: [{ name: "Organic Cotton", percentage: 100 }],
    scores: { sustainability: 9, durability: 7, comfort: 9 },
    microplastics_risk: "low",
    verdict: "buy",
    summary: "Excellent choice made from 100% organic cotton, highly sustainable and comfortable."
  },
  {
    product_name: "Recycled Polyester Fleece",
    brand: "The North Face",
    category: "Outerwear",
    materials: [{ name: "Recycled Polyester", percentage: 100 }],
    scores: { sustainability: 7, durability: 8, comfort: 8 },
    microplastics_risk: "high",
    verdict: "consider",
    summary: "Durable and uses recycled materials, but presents a high risk of shedding microplastics when washed."
  },
  {
    product_name: "Fast Fashion Denim Jeans",
    brand: "Zara",
    category: "Clothing",
    materials: [{ name: "Cotton", percentage: 80 }, { name: "Elastane", percentage: 20 }],
    scores: { sustainability: 4, durability: 6, comfort: 7 },
    microplastics_risk: "medium",
    verdict: "avoid",
    summary: "Low sustainability score due to conventional cotton and synthetic elastane blend which hinders recycling."
  }
];

mockProducts.forEach((p, i) => {
  const key = `${p.product_name}-${p.brand}`.toLowerCase();
  topProducts.set(key, { result: p, count: 100 - i * 10 }); // Decreasing mock counts
});

export function recordSearch(result: AnalysisResult) {
  const key = `${result.product_name}-${result.brand}`.toLowerCase();
  if (topProducts.has(key)) {
    const existing = topProducts.get(key)!;
    existing.count += 1;
    existing.result = result; // Keep most recent analysis
  } else {
    topProducts.set(key, { result, count: 1 });
  }
}

export function getTop10(): AnalysisResult[] {
  const sorted = Array.from(topProducts.values()).sort((a, b) => b.count - a.count);
  return sorted.slice(0, 10).map(item => item.result);
}