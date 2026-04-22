"use client";

import { useState, useEffect } from "react";
import InputForm from "./InputForm";
import ResultsCard from "./ResultsCard";
import HistoryList from "./HistoryList";
import Top10List from "./Top10List";
import LanguageSwitcher from "./LanguageSwitcher";
import { AnalysisResult, Dictionary } from "../types";
import { Locale } from "../i18n-config";
import { supabase } from "../lib/supabase";

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
    const migrate = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const localHistory = localStorage.getItem("wearwise_history");
      if (session && localHistory) {
        try {
          const items = JSON.parse(localHistory);
          if (items.length > 0) {
            await supabase.from('closet_items').insert(
              items.map((item: AnalysisResult) => ({
                user_id: session.user.id,
                product_name: item.product_name,
                brand: item.brand,
                category: item.category,
                verdict: item.verdict,
                microplastics_risk: item.microplastics_risk,
                data: item
              }))
            );
          }
          localStorage.removeItem("wearwise_history");
          setHistory([]);
        } catch (e) {
          console.error("Failed to migrate history", e);
        }
      }
    };
    migrate();
  }, []);

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
    <div className="min-h-screen bg-surface py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="fixed top-6 right-6 z-50 glass px-4 py-2 rounded-full shadow-ambient">
          <LanguageSwitcher />
        </div>
        
        <div className="mb-24 text-left max-w-3xl">
          <h1 className="text-6xl sm:text-7xl font-bold text-on-surface mb-8 tracking-tighter">
            {dictionary.title}
          </h1>
          <p className="text-2xl text-primary-design leading-relaxed font-light">
            {dictionary.description}
          </p>
        </div>

        <div className="space-y-32">
          <section>
            <InputForm 
              onAnalyze={handleAnalyze} 
              isLoading={isLoading} 
              dictionary={dictionary.inputForm} 
              lang={lang} 
              errorMessages={dictionary.error}
            />

            {error && (
              <div className="mt-12 p-6 bg-error-design/10 border-l-4 border-error-design rounded-r-lg text-error-design font-medium max-w-2xl">
                {error}
              </div>
            )}
          </section>

          {result && (
            <section className="animate-in fade-in slide-in-from-bottom-8 duration-700">
              <ResultsCard result={result} dictionary={dictionary.results} />
            </section>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 pt-12 border-t border-surface-highest/20">
            <HistoryList history={history} onSelect={handleSelectHistory} dictionary={{ ...dictionary.history, verdicts: dictionary.results.verdicts }} />
            <Top10List onSelect={handleSelectHistory} dictionary={{ ...dictionary.history, verdicts: dictionary.results.verdicts }} />
          </div>
        </div>
      </div>
    </div>
  );
}
