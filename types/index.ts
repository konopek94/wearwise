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

export interface Dictionary {
  title: string;
  description: string;
  inputForm: {
    label: string;
    placeholder: string;
    uploadButton: string;
    scanning: string;
    analyzeButton: string;
    analyzing: string;
  };
  results: {
    unknownProduct: string;
    unknownBrand: string;
    unknownCategory: string;
    scores: string;
    sustainability: string;
    durability: string;
    comfort: string;
    microplasticsRisk: string;
    materials: string;
    noMaterials: string;
    summary: string;
    verdicts: {
      buy: string;
      consider: string;
      avoid: string;
    };
  };
  history: {
    title: string;
    top10: string;
    loadingTop: string;
    unknownProduct: string;
    unknownBrand: string;
  };
  error: {
    ocrFailed: string;
    analysisFailed: string;
  };
}