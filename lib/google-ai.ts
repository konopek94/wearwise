import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AnalysisResult } from "../types";

// Note: Ensure process.env.GEMINI_API_KEY is set in your environment
const ai = new GoogleGenAI({});

const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    product_name: { type: Type.STRING },
    brand: { type: Type.STRING },
    category: { type: Type.STRING },
    materials: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          percentage: { type: Type.NUMBER },
        },
        required: ["name", "percentage"],
      },
    },
    scores: {
      type: Type.OBJECT,
      properties: {
        sustainability: { type: Type.NUMBER, description: "Score from 0 to 10" },
        durability: { type: Type.NUMBER, description: "Score from 0 to 10" },
        comfort: { type: Type.NUMBER, description: "Score from 0 to 10" },
      },
      required: ["sustainability", "durability", "comfort"],
    },
    microplastics_risk: {
      type: Type.STRING,
      enum: ["low", "medium", "high"],
    },
    verdict: {
      type: Type.STRING,
      enum: ["buy", "consider", "avoid"],
    },
    summary: { type: Type.STRING },
  },
  required: [
    "product_name",
    "brand",
    "category",
    "materials",
    "scores",
    "microplastics_risk",
    "verdict",
    "summary",
  ],
};

export async function analyzeProduct(text: string): Promise<AnalysisResult> {
  const prompt = `
    Analyze the following text which describes a clothing or footwear product, potentially including its material composition (from user input or OCR of a clothing label).
    
    Extract the product name, brand, and category if available. If not, use "Unknown".
    Extract the materials and their percentages. Normalize material names (e.g., "cotton", "polyester", "recycled polyester"). If no percentages are given, estimate based on standard industry blends, but keep total at 100%.
    
    Evaluate the materials based on:
    - Sustainability: Is it eco-friendly, biodegradable, or recycled? (0-10)
    - Durability: Will it last long, resist wear and tear? (0-10)
    - Comfort: Is it breathable, soft, suitable for skin contact? (0-10)
    
    Determine the microplastics risk: "high" for synthetics like virgin polyester/nylon, "medium" for blends, "low" for 100% natural fibers.
    
    Provide a final verdict: "buy" (highly sustainable/durable), "consider" (acceptable compromises), or "avoid" (harmful materials, fast fashion indicators).
    
    Provide a brief summary (2-3 sentences) explaining your scores and verdict.

    Text to analyze:
    "${text}"
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        temperature: 0.2, // Low temperature for more deterministic output
      },
    });

    if (!response.text) {
      throw new Error("No response text from Google AI");
    }

    return JSON.parse(response.text) as AnalysisResult;
  } catch (error) {
    console.error("Error calling Google AI:", error);
    throw new Error("Failed to analyze product. Please try again.");
  }
}