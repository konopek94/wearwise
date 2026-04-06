import { Redis } from "@upstash/redis";
import { AnalysisResult } from "../types";

export interface TopProduct {
  result: AnalysisResult;
  count: number;
}

// Fallback in-memory store for local dev when Redis is not configured
const localTopProducts: Map<string, TopProduct> = new Map();

// Initialize with some mock data so the Top 10 list isn't empty locally
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
  localTopProducts.set(key, { result: p, count: 100 - i * 10 });
});

const isRedisConfigured = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN;
const redis = isRedisConfigured ? Redis.fromEnv() : null;

export async function recordSearch(result: AnalysisResult) {
  const id = `${result.product_name}-${result.brand}`.toLowerCase();

  if (redis) {
    try {
      // Increment the score in the sorted set
      await redis.zincrby("wearwise:leaderboard", 1, id);
      // Store the actual product JSON separately
      await redis.hset("wearwise:products", { [id]: JSON.stringify(result) });
    } catch (error) {
      console.error("Redis Error (recordSearch):", error);
    }
  } else {
    // Local fallback
    if (localTopProducts.has(id)) {
      const existing = localTopProducts.get(id)!;
      existing.count += 1;
      existing.result = result;
    } else {
      localTopProducts.set(id, { result, count: 1 });
    }
  }
}

export async function getTop10(): Promise<AnalysisResult[]> {
  if (redis) {
    try {
      // Fetch top 10 IDs with highest score
      const topIds = await redis.zrange("wearwise:leaderboard", 0, 9, { rev: true });
      if (!topIds || topIds.length === 0) return [];

      // Fetch the full product JSON for those IDs
      const products = await Promise.all(
        topIds.map(async (id) => {
          // Depending on Upstash SDK version, it parses JSON automatically or returns a string
          const data = await redis.hget<string | object>("wearwise:products", String(id));
          if (typeof data === "string") return JSON.parse(data);
          return data;
        })
      );
      
      return products.filter((p): p is AnalysisResult => p !== null);
    } catch (error) {
      console.error("Redis Error (getTop10):", error);
      return [];
    }
  } else {
    // Local fallback
    const sorted = Array.from(localTopProducts.values()).sort((a, b) => b.count - a.count);
    return sorted.slice(0, 10).map(item => item.result);
  }
}