"use client";
import { useState } from "react";
import { supabase } from "../lib/supabase";
import { AnalysisResult } from "../types";

export default function SaveToClosetButton({ result }: { result: AnalysisResult }) {
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
       window.location.href = "/login";
       return;
    }
    const { error } = await supabase.from('closet_items').insert({
      user_id: session.user.id,
      product_name: result.product_name,
      brand: result.brand,
      category: result.category,
      verdict: result.verdict,
      microplastics_risk: result.microplastics_risk,
      data: result
    });
    setLoading(false);
    if (!error) setSaved(true);
  };

  return (
    <button 
      onClick={handleSave}
      disabled={saved || loading}
      className={`px-8 py-3 rounded-full font-bold uppercase tracking-widest text-sm transition-all ${
        saved ? "bg-secondary-design/20 text-secondary-design" : "bg-on-surface text-surface-lowest shadow-ambient active:scale-95"
      }`}
    >
      {loading ? "Saving..." : saved ? "Added to Closet" : "Add to Closet"}
    </button>
  );
}
