import React from "react";
import { AnalysisResult, Dictionary } from "../types";
import SaveToClosetButton from "./SaveToClosetButton";

interface ResultsCardProps {
  result: AnalysisResult;
  dictionary: Dictionary["results"];
}

const ProgressBar = ({ value, label }: { value: number; label: string }) => {
  // Map 0-10 to percentage
  const percentage = (value / 10) * 100;
  
  let color = "bg-secondary-design";
  if (value < 4) color = "bg-error-design";
  else if (value < 7) color = "bg-tertiary-design";

  return (
    <div className="mb-6">
      <div className="flex justify-between mb-2">
        <span className="text-sm font-semibold text-primary-design uppercase tracking-wider">{label}</span>
        <span className="text-sm font-bold text-on-surface">{value}/10</span>
      </div>
      <div className="w-full bg-surface-low rounded-full h-3">
        <div className={`h-3 rounded-full ${color} shadow-sm transition-all duration-1000 ease-out`} style={{ width: `${percentage}%` }}></div>
      </div>
    </div>
  );
};

export default function ResultsCard({ result, dictionary }: ResultsCardProps) {
  const getVerdictStyle = (verdict: string) => {
    switch (verdict.toLowerCase()) {
      case "buy": return "bg-secondary-design/10 text-secondary-design border-secondary-design/20";
      case "consider": return "bg-tertiary-design/10 text-tertiary-design border-tertiary-design/20";
      case "avoid": return "bg-error-design/10 text-error-design border-error-design/20";
      default: return "bg-surface-highest/10 text-primary-design border-surface-highest/20";
    }
  };

  const getVerdictLabel = (verdict: string) => {
    return (dictionary.verdicts as Record<string, string>)[verdict.toLowerCase()] || verdict;
  };

  const getMicroplasticsStyle = (risk: string) => {
    switch (risk.toLowerCase()) {
      case "low": return "bg-secondary-design/5 text-secondary-design";
      case "medium": return "bg-tertiary-design/5 text-tertiary-design";
      case "high": return "bg-error-design/5 text-error-design";
      default: return "bg-surface-highest text-primary-design";
    }
  };

  return (
    <div className="w-full max-w-4xl bg-surface-lowest shadow-ambient rounded-lg overflow-hidden relative">
      <div className="p-10 flex flex-col sm:flex-row justify-between items-start gap-8">
        <div className="space-y-4">
          <h2 className="text-4xl sm:text-5xl font-bold text-on-surface tracking-tight leading-none">
            {result.product_name || dictionary.unknownProduct}
          </h2>
          <div className="flex flex-wrap gap-3 items-center text-primary-design">
            <span className="text-lg font-medium">{result.brand || dictionary.unknownBrand}</span>
            <span className="w-1.5 h-1.5 bg-surface-highest rounded-full"></span>
            <span className="text-lg font-light italic opacity-70">{result.category || dictionary.unknownCategory}</span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-4">
          <div className={`px-8 py-3 rounded-full border-2 font-black uppercase tracking-widest text-sm ${getVerdictStyle(result.verdict)}`}>
            {getVerdictLabel(result.verdict)}
          </div>
          <SaveToClosetButton result={result} />
        </div>
      </div>

      <div className="p-10 grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div className="space-y-10">
          <div>
            <h3 className="text-xs font-black text-primary-design uppercase tracking-[0.2em] mb-8">{dictionary.scores}</h3>
            <ProgressBar label={dictionary.sustainability} value={result.scores.sustainability} />
            <ProgressBar label={dictionary.durability} value={result.scores.durability} />
            <ProgressBar label={dictionary.comfort} value={result.scores.comfort} />
          </div>
          
          <div className={`p-6 rounded-lg flex items-center justify-between ${getMicroplasticsStyle(result.microplastics_risk)}`}>
            <span className="text-sm font-black uppercase tracking-widest opacity-60">{dictionary.microplasticsRisk}</span>
            <span className="font-bold capitalize text-lg">
              {result.microplastics_risk}
            </span>
          </div>
        </div>

        <div>
          <h3 className="text-xs font-black text-primary-design uppercase tracking-[0.2em] mb-8">{dictionary.materials}</h3>
          <ul className="space-y-4">
            {result.materials.map((mat, index) => (
              <li key={index} className="flex justify-between items-center group">
                <div className="flex items-center gap-4">
                  <span className="w-3 h-3 rounded-full bg-secondary-design/20 group-hover:bg-secondary-design transition-colors"></span>
                  <span className="text-lg font-medium text-on-surface">{mat.name}</span>
                </div>
                <div className="flex-1 border-b border-surface-low border-dotted mx-4 mb-1.5"></div>
                <span className="font-black text-on-surface tabular-nums">{mat.percentage}%</span>
              </li>
            ))}
            {result.materials.length === 0 && (
              <li className="text-primary-design italic opacity-60">{dictionary.noMaterials}</li>
            )}
          </ul>
        </div>
      </div>

      <div className="p-10 bg-surface-low/50 border-t border-surface-highest/10">
        <h3 className="text-xs font-black text-primary-design uppercase tracking-[0.2em] mb-4">{dictionary.summary}</h3>
        <p className="text-xl text-on-surface leading-relaxed font-light italic">
          &ldquo;{result.summary}&rdquo;
        </p>
      </div>
    </div>
  );
}