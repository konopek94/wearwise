import React from "react";
import { AnalysisResult, Dictionary } from "../types";

interface HistoryListProps {
  history: AnalysisResult[];
  onSelect: (result: AnalysisResult) => void;
  dictionary: Dictionary["history"] & { verdicts: Dictionary["results"]["verdicts"] };
}

export default function HistoryList({ history, onSelect, dictionary }: HistoryListProps) {
  if (history.length === 0) return null;

  const getVerdictLabel = (verdict: string) => {
    return (dictionary.verdicts as Record<string, string>)?.[verdict.toLowerCase()] || verdict;
  };

  return (
    <div className="mt-12 w-full max-w-2xl mx-auto">
      <h3 className="text-xl font-bold text-gray-900 mb-4">{dictionary.title}</h3>
      <div className="bg-white shadow-sm rounded-xl overflow-hidden border border-gray-100">
        <ul className="divide-y divide-gray-100">
          {history.map((item, index) => (
            <li 
              key={index}
              onClick={() => onSelect(item)}
              className="px-6 py-4 hover:bg-gray-50 cursor-pointer transition-colors duration-150 flex items-center justify-between"
            >
              <div>
                <p className="text-sm font-medium text-gray-900">{item.product_name || dictionary.unknownProduct}</p>
                <p className="text-xs text-gray-500">{item.brand || dictionary.unknownBrand}</p>
              </div>
              <div className="flex items-center space-x-3">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium uppercase tracking-wider ${
                  item.verdict === 'buy' ? 'bg-green-100 text-green-800' :
                  item.verdict === 'consider' ? 'bg-yellow-100 text-yellow-800' :
                  item.verdict === 'avoid' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {getVerdictLabel(item.verdict)}
                </span>
                <span className="text-gray-400 text-sm">→</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}