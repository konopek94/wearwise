"use client";
import { useState, useMemo } from "react";
import { ClosetItem, Dictionary } from "../types";
import { calculateAnalytics } from "../lib/analytics";
import AnalyticsCards from "./AnalyticsCards";
import ResultsCard from "./ResultsCard";
import AuthButton from "./AuthButton";
import LanguageSwitcher from "./LanguageSwitcher";
import { Locale } from "../i18n-config";
import Link from "next/link";

export default function ClosetDashboard({ initialItems, dictionary, lang }: { initialItems: ClosetItem[], dictionary: Dictionary, lang: Locale }) {
  const [items] = useState(initialItems);
  const analytics = useMemo(() => calculateAnalytics(items), [items]);

  return (
    <div className="max-w-5xl mx-auto">
      <div className="fixed top-6 right-6 z-50 glass px-6 py-3 rounded-full shadow-ambient flex items-center gap-6">
        <Link 
          href={`/${lang}`}
          className="px-4 py-1.5 text-[10px] font-black tracking-widest transition-all rounded-full text-primary-design hover:bg-surface-highest/10"
        >
          {dictionary.auth.home}
        </Link>
        <div className="w-px h-4 bg-surface-highest/30"></div>
        <AuthButton dictionary={dictionary.auth} lang={lang} />
        <div className="w-px h-4 bg-surface-highest/30"></div>
        <LanguageSwitcher />
      </div>

      <h1 className="text-7xl font-bold text-on-surface mb-16 tracking-tighter">
        {dictionary.auth.closet}
      </h1>
      <AnalyticsCards analytics={analytics} />
      <div className="space-y-12">
        {items.map(item => (
          <ResultsCard key={item.id} result={item.data} dictionary={dictionary.results} />
        ))}
      </div>
    </div>
  );
}
