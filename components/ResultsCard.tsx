import React from "react";
import { AnalysisResult, Dictionary } from "../types";

interface ResultsCardProps {
  result: AnalysisResult;
  dictionary: Dictionary["results"];
}

const ProgressBar = ({ value, label }: { value: number; label: string }) => {
  // Map 0-10 to percentage
  const percentage = (value / 10) * 100;
  
  let color = "bg-green-500";
  if (value < 4) color = "bg-red-500";
  else if (value < 7) color = "bg-yellow-500";

  return (
    <div className="mb-4">
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm font-medium text-gray-700">{value}/10</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div className={`h-2.5 rounded-full ${color}`} style={{ width: `${percentage}%` }}></div>
      </div>
    </div>
  );
};

export default function ResultsCard({ result, dictionary }: ResultsCardProps) {
  const getVerdictColor = (verdict: string) => {
    switch (verdict.toLowerCase()) {
      case "buy": return "bg-green-100 text-green-800 border-green-200";
      case "consider": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "avoid": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getVerdictLabel = (verdict: string) => {
    return dictionary.verdicts[verdict.toLowerCase()] || verdict;
  };

  const getMicroplasticsColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case "low": return "text-green-600";
      case "medium": return "text-yellow-600";
      case "high": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100 mt-8">
      <div className="p-6 border-b border-gray-100 flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{result.product_name || dictionary.unknownProduct}</h2>
          <p className="text-gray-500">{result.brand || dictionary.unknownBrand} • {result.category || dictionary.unknownCategory}</p>
        </div>
        <div className={`px-4 py-2 rounded-full border font-bold uppercase tracking-wider text-sm ${getVerdictColor(result.verdict)}`}>
          {getVerdictLabel(result.verdict)}
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{dictionary.scores}</h3>
          <ProgressBar label={dictionary.sustainability} value={result.scores.sustainability} />
          <ProgressBar label={dictionary.durability} value={result.scores.durability} />
          <ProgressBar label={dictionary.comfort} value={result.scores.comfort} />
          
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <span className="font-medium text-gray-700">{dictionary.microplasticsRisk}: </span>
            <span className={`font-bold capitalize ${getMicroplasticsColor(result.microplastics_risk)}`}>
              {result.microplastics_risk}
            </span>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{dictionary.materials}</h3>
          <ul className="space-y-2">
            {result.materials.map((mat, index) => (
              <li key={index} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
                <span className="text-gray-700">{mat.name}</span>
                <span className="font-medium text-gray-900">{mat.percentage}%</span>
              </li>
            ))}
            {result.materials.length === 0 && (
              <li className="text-gray-500 italic">{dictionary.noMaterials}</li>
            )}
          </ul>
        </div>
      </div>

      <div className="p-6 bg-gray-50 border-t border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{dictionary.summary}</h3>
        <p className="text-gray-700 leading-relaxed">{result.summary}</p>
      </div>
    </div>
  );
}