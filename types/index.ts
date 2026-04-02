export interface Material {
  name: string;
  percentage: number;
}

export interface Scores {
  sustainability: number;
  durability: number;
  comfort: number;
}

export interface AnalysisResult {
  product_name: string;
  brand: string;
  category: string;
  materials: Material[];
  scores: Scores;
  microplastics_risk: "low" | "medium" | "high";
  verdict: "buy" | "consider" | "avoid";
  summary: string;
}