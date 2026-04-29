"use client";
import { useState, useMemo } from "react";
import { ClosetItem, Dictionary } from "../types";
import { calculateAnalytics } from "../lib/analytics";
import AnalyticsCards from "./AnalyticsCards";
import ResultsCard from "./ResultsCard";
import Navigation from "./Navigation";
import { Locale } from "../i18n-config";

export default function ClosetDashboard({ initialItems, dictionary, lang }: { initialItems: ClosetItem[], dictionary: Dictionary, lang: Locale }) {
  const [items, setItems] = useState(initialItems);
  const [activeTab, setActiveTab] = useState<"wardrobe" | "history">("wardrobe");

  const wardrobeItems = useMemo(() => items.filter(i => i.status === "wardrobe"), [items]);
  const historyItems = useMemo(() => items.filter(i => i.status === "history"), [items]);

  const displayedItems = activeTab === "wardrobe" ? wardrobeItems : historyItems;
  const analytics = useMemo(() => calculateAnalytics(wardrobeItems), [wardrobeItems]);

  const handleStatusChange = async (id: string, newStatus: "wardrobe" | "history") => {
    // Optimistic UI update
    setItems(prev => prev.map(item => item.id === id ? { ...item, status: newStatus } : item));
    
    try {
      const response = await fetch(`/api/closet/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (!response.ok) throw new Error("Failed to update status");
    } catch (error) {
      console.error(error);
      // Revert on failure
      setItems(prev => prev.map(item => item.id === id ? { ...item, status: items.find(i => i.id === id)?.status || newStatus } : item));
    }
  };

  const handleDelete = async (id: string) => {
    const itemToDelete = items.find(i => i.id === id);
    setItems(prev => prev.filter(item => item.id !== id));
    
    try {
      const response = await fetch(`/api/closet/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error("Failed to delete item");
    } catch (error) {
      console.error(error);
      // Revert on failure
      if (itemToDelete) {
        setItems(prev => [...prev, itemToDelete]);
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <Navigation dictionary={dictionary} lang={lang} />

      <h1 className="text-7xl font-bold text-on-surface mb-16 tracking-tighter">
        {dictionary.auth.closet}
      </h1>

      <div className="flex gap-8 mb-16 border-b border-surface-highest/10">
        <button
          onClick={() => setActiveTab("wardrobe")}
          className={`pb-4 text-xl font-bold transition-all ${activeTab === "wardrobe" ? "text-on-surface border-b-2 border-secondary-design" : "text-primary-design opacity-50"}`}
        >
          {dictionary.closet.myWardrobe} ({wardrobeItems.length})
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`pb-4 text-xl font-bold transition-all ${activeTab === "history" ? "text-on-surface border-b-2 border-secondary-design" : "text-primary-design opacity-50"}`}
        >
          {dictionary.closet.scanHistory} ({historyItems.length})
        </button>
      </div>

      {activeTab === "wardrobe" && <AnalyticsCards analytics={analytics} />}

      <div className="space-y-12">
        {displayedItems.map(item => (
          <ResultsCard
            key={item.id}
            result={item.data}
            dictionary={dictionary.results}
            lang={lang}
            itemId={item.id}
            status={item.status}
            onStatusChange={handleStatusChange}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
}
