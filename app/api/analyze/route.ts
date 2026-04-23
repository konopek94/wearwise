import { NextRequest, NextResponse } from "next/server";
import { analyzeProduct } from "../../../lib/google-ai";
import { recordSearch } from "../../../lib/store";
import { createServerClientSide } from "../../../lib/supabase-server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text, lang } = body;

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    const result = await analyzeProduct(text, lang);
    
    // Record search globally
    recordSearch(result);

    // Auto-save to history if user is logged in
    const supabase = await createServerClientSide();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      // Basic deduplication check
      const { data: existing } = await supabase
        .from('closet_items')
        .select('id')
        .eq('user_id', user.id)
        .eq('product_name', result.product_name)
        .eq('brand', result.brand)
        .maybeSingle();

      if (!existing) {
        await supabase.from('closet_items').insert({
          user_id: user.id,
          product_name: result.product_name,
          brand: result.brand,
          category: result.category,
          verdict: result.verdict,
          microplastics_risk: result.microplastics_risk,
          status: 'history', // Auto-saved as history
          data: result
        });
      }
    }
    
    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An unexpected error occurred" },
      { status: 500 }
    );
  }
}