"use client";

import { useState } from "react";
import InputForm from "../components/InputForm";
import ResultsCard from "../components/ResultsCard";
import { AnalysisResult } from "../types";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (text: string) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to analyze product");
      }

      const data = await response.json();
      setResult(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
            WearWise
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Analyze your clothing for sustainability, durability, and microplastics risk.
            Type the materials or upload a photo of the label.
          </p>
        </div>

        <InputForm onAnalyze={handleAnalyze} isLoading={isLoading} />

        {error && (
          <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-md text-red-700 text-center max-w-2xl mx-auto">
            {error}
          </div>
        )}

        {result && <ResultsCard result={result} />}
      </div>
    </div>
  );
}