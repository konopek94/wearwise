"use client";
import { useState, useMemo } from "react";
import { ClosetItem, Dictionary } from "../types";
import { calculateAnalytics } from "../lib/analytics";
import AnalyticsCards from "./AnalyticsCards";
import ResultsCard from "./ResultsCard";

export default function ClosetDashboard({ initialItems, dictionary }: { initialItems: ClosetItem[], dictionary: Dictionary }) {
  const [items] = useState(initialItems);
  const analytics = useMemo(() => calculateAnalytics(items), [items]);

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-7xl font-bold text-on-surface mb-16 tracking-tighter">Your Closet</h1>
      <AnalyticsCards analytics={analytics} />
      <div className="space-y-12">
        {items.map(item => (
          <ResultsCard key={item.id} result={item.data} dictionary={dictionary.results} />
        ))}
      </div>
    </div>
  );
}
