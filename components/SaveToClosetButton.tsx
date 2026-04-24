"use client";
import { useState } from "react";
import { supabase } from "../lib/supabase";
import { AnalysisResult } from "../types";

export default function SaveToClosetButton({ result, dictionary }: { result: AnalysisResult; dictionary: any }) {
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
       window.location.href = "/login";
       return;
    }

    try {
      // Check if item already exists in history
      const { data: existing } = await supabase
        .from('closet_items')
        .select('id, status')
        .eq('user_id', session.user.id)
        .eq('product_name', result.product_name)
        .eq('brand', result.brand)
        .maybeSingle();

      if (existing) {
        // Item exists, promote it to wardrobe if it's in history
        if (existing.status === 'history') {
          const { error } = await supabase
            .from('closet_items')
            .update({ status: 'wardrobe' })
            .eq('id', existing.id);
          if (!error) setSaved(true);
        } else {
          // Already in wardrobe
          setSaved(true);
        }
      } else {
        // Item doesn't exist, insert it as wardrobe
        const { error } = await supabase.from('closet_items').insert({
          user_id: session.user.id,
          product_name: result.product_name,
          brand: result.brand,
          category: result.category,
          verdict: result.verdict,
          microplastics_risk: result.microplastics_risk,
          status: 'wardrobe',
          data: result
        });
        if (!error) setSaved(true);
      }
    } catch (error) {
      console.error("Error saving to closet:", error);
    }

    setLoading(false);
  };

  return (
    <button
      onClick={handleSave}
      disabled={saved || loading}
      className={`px-8 py-3 rounded-full font-bold uppercase tracking-widest text-sm transition-all ${
        saved ? "bg-secondary-design/20 text-secondary-design" : "bg-on-surface text-surface-lowest shadow-ambient active:scale-95"
      }`}
    >
      {loading ? dictionary?.saving || "Saving..." : saved ? dictionary?.addedToCloset || "Added to Closet" : dictionary?.addToCloset || "Add to Closet"}
    </button>
  );
}
