import React, { useEffect, useState } from "react";
import { AnalysisResult } from "../types";

interface Top10ListProps {
  onSelect: (result: AnalysisResult) => void;
}

export default function Top10List({ onSelect }: Top10ListProps) {
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

  if (isLoading) return <div className="mt-12 text-center text-sm text-gray-500">Loading top products...</div>;
  if (topProducts.length === 0) return null;

  return (
    <div className="mt-12 w-full max-w-2xl mx-auto">
      <h3 className="text-xl font-bold text-gray-900 mb-4">🏆 Top 10 Searched Products</h3>
      <div className="bg-white shadow-sm rounded-xl overflow-hidden border border-gray-100">
        <ul className="divide-y divide-gray-100">
          {topProducts.map((item, index) => (
            <li 
              key={index}
              onClick={() => onSelect(item)}
              className="px-6 py-4 hover:bg-gray-50 cursor-pointer transition-colors duration-150 flex items-center justify-between"
            >
              <div className="flex items-center space-x-4">
                <span className="text-lg font-bold text-gray-400 w-6 text-center">{index + 1}</span>
                <div>
                  <p className="text-sm font-medium text-gray-900">{item.product_name || "Unknown Product"}</p>
                  <p className="text-xs text-gray-500">{item.brand || "Unknown Brand"}</p>
                </div>
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