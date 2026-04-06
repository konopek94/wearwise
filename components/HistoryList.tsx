import React from "react";
import { AnalysisResult } from "../types";

interface HistoryListProps {
  history: AnalysisResult[];
  onSelect: (result: AnalysisResult) => void;
}

export default function HistoryList({ history, onSelect }: HistoryListProps) {
  if (history.length === 0) return null;

  return (
    <div className="mt-12 w-full max-w-2xl mx-auto">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Searches</h3>
      <div className="bg-white shadow-sm rounded-xl overflow-hidden border border-gray-100">
        <ul className="divide-y divide-gray-100">
          {history.map((item, index) => (
            <li 
              key={index}
              onClick={() => onSelect(item)}
              className="px-6 py-4 hover:bg-gray-50 cursor-pointer transition-colors duration-150 flex items-center justify-between"
            >
              <div>
                <p className="text-sm font-medium text-gray-900">{item.product_name || "Unknown Product"}</p>
                <p className="text-xs text-gray-500">{item.brand || "Unknown Brand"}</p>
              </div>
              <div className="flex items-center space-x-3">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium uppercase tracking-wider ${
                  item.verdict === 'buy' ? 'bg-green-100 text-green-800' :
                  item.verdict === 'consider' ? 'bg-yellow-100 text-yellow-800' :
                  item.verdict === 'avoid' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {item.verdict}
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