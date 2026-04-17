import React, { useEffect, useState } from "react";
import { AnalysisResult, Dictionary } from "../types";

interface Top10ListProps {
  onSelect: (result: AnalysisResult) => void;
  dictionary: Dictionary["history"] & { verdicts: Dictionary["results"]["verdicts"] };
}

export default function Top10List({ onSelect, dictionary }: Top10ListProps) {
  const [topProducts, setTopProducts] = useState<AnalysisResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchTop10() {
      try {
        const response = await fetch("/api/top10");
        if (response.ok) {
          const data = await response.json();
          setTopProducts(data);
        }
      } catch (error) {
        console.error("Failed to fetch Top 10 products", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchTop10();
  }, []);

  if (isLoading) return <div className="mt-12 text-center text-xs font-black uppercase tracking-widest text-surface-highest">{dictionary.loadingTop}</div>;
  if (topProducts.length === 0) return null;

  const getVerdictStyle = (verdict: string) => {
    switch (verdict.toLowerCase()) {
      case 'buy': return 'bg-secondary-design/10 text-secondary-design';
      case 'consider': return 'bg-tertiary-design/10 text-tertiary-design';
      case 'avoid': return 'bg-error-design/10 text-error-design';
      default: return 'bg-surface-highest/20 text-primary-design';
    }
  };

  const getVerdictLabel = (verdict: string) => {
    return (dictionary.verdicts as Record<string, string>)?.[verdict.toLowerCase()] || verdict;
  };

  return (
    <div className="w-full">
      <h3 className="text-xs font-black text-primary-design uppercase tracking-[0.2em] mb-10">{dictionary.top10}</h3>
      <div className="space-y-4">
        {topProducts.map((item, index) => (
          <div 
            key={index}
            onClick={() => onSelect(item)}
            className="group p-6 bg-surface-lowest hover:bg-surface-low rounded-lg transition-all duration-300 cursor-pointer shadow-sm hover:shadow-ambient flex items-center justify-between"
          >
            <div className="flex items-center space-x-6">
              <span className="text-2xl font-black text-surface-highest group-hover:text-secondary-design/30 transition-colors w-8 tabular-nums">
                {String(index + 1).padStart(2, '0')}
              </span>
              <div className="space-y-1">
                <p className="text-lg font-bold text-on-surface group-hover:text-secondary-design transition-colors line-clamp-1">
                  {item.product_name || dictionary.unknownProduct}
                </p>
                <p className="text-sm text-primary-design font-light italic">
                  {item.brand || dictionary.unknownBrand}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest hidden sm:inline-block ${getVerdictStyle(item.verdict)}`}>
                {getVerdictLabel(item.verdict)}
              </span>
              <span className="text-surface-highest group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}