import { NextResponse } from "next/server";
import { getTop10 } from "../../../lib/store";

export async function GET() {
  try {
    const top10 = await getTop10();
    return NextResponse.json(top10);
  } catch (error: unknown) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}