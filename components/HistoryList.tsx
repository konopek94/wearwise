import React from "react";
import { AnalysisResult, Dictionary } from "../types";

interface HistoryListProps {
  history: AnalysisResult[];
  onSelect: (result: AnalysisResult) => void;
  dictionary: Dictionary["history"] & { verdicts: Dictionary["results"]["verdicts"] };
}

export default function HistoryList({ history, onSelect, dictionary }: HistoryListProps) {
  if (history.length === 0) return null;

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
      <h3 className="text-xs font-black text-primary-design uppercase tracking-[0.2em] mb-10">{dictionary.title}</h3>
      <div className="space-y-4">
        {history.map((item, index) => (
          <div 
            key={index}
            onClick={() => onSelect(item)}
            className="group p-6 bg-surface-lowest hover:bg-surface-low rounded-lg transition-all duration-300 cursor-pointer shadow-sm hover:shadow-ambient flex items-center justify-between"
          >
            <div className="space-y-1">
              <p className="text-lg font-bold text-on-surface group-hover:text-secondary-design transition-colors">
                {item.product_name || dictionary.unknownProduct}
              </p>
              <p className="text-sm text-primary-design font-light italic">
                {item.brand || dictionary.unknownBrand}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${getVerdictStyle(item.verdict)}`}>
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