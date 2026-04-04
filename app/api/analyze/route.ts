import { NextRequest, NextResponse } from "next/server";
import { analyzeProduct } from "../../../lib/google-ai";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text } = body;

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    const result = await analyzeProduct(text);
    
    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An unexpected error occurred" },
      { status: 500 }
    );
  }
}