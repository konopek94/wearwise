"use client";

import { useState, useEffect } from "react";
import InputForm from "./InputForm";
import ResultsCard from "./ResultsCard";
import HistoryList from "./HistoryList";
import Top10List from "./Top10List";
import LanguageSwitcher from "./LanguageSwitcher";
import { AnalysisResult, Dictionary } from "../types";
import { Locale } from "../i18n-config";

interface HomeContentProps {
  dictionary: Dictionary;
  lang: Locale;
}

export default function HomeContent({ dictionary, lang }: HomeContentProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<AnalysisResult[]>([]);

  useEffect(() => {
    const savedHistory = localStorage.getItem("wearwise_history");
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  const saveToHistory = (newResult: AnalysisResult) => {
    setHistory(prev => {
      const filtered = prev.filter(item => 
        !(item.product_name === newResult.product_name && item.brand === newResult.brand)
      );
      const newHistory = [newResult, ...filtered].slice(0, 20); // Keep last 20
      localStorage.setItem("wearwise_history", JSON.stringify(newHistory));
      return newHistory;
    });
  };

  const handleAnalyze = async (text: string) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept-Language": lang,
        },
        body: JSON.stringify({ text, lang }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || dictionary.error.analysisFailed);
      }

      const data = await response.json();
      setResult(data);
      saveToHistory(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : dictionary.error.analysisFailed);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectHistory = (selectedResult: AnalysisResult) => {
    setResult(selectedResult);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-end mb-4">
          <LanguageSwitcher />
        </div>
        
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
            {dictionary.title}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {dictionary.description}
          </p>
        </div>

        <InputForm 
          onAnalyze={handleAnalyze} 
          isLoading={isLoading} 
          dictionary={dictionary.inputForm} 
          lang={lang} 
          errorMessages={dictionary.error}
        />

        {error && (
          <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-md text-red-700 text-center max-w-2xl mx-auto">
            {error}
          </div>
        )}

        {result && <ResultsCard result={result} dictionary={dictionary.results} />}

        <HistoryList 
          history={history} 
          onSelect={handleSelectHistory} 
          dictionary={{ ...dictionary.history, verdicts: dictionary.results.verdicts }} 
        />
        
        <Top10List 
          onSelect={handleSelectHistory} 
          dictionary={{ ...dictionary.history, verdicts: dictionary.results.verdicts }} 
        />
      </div>
    </div>
  );
}
