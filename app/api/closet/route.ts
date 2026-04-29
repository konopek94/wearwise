import { NextResponse } from "next/server";
import { createServerClientSide } from "../../../lib/supabase-server";

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");

  if (!status || !["history", "wardrobe"].includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const supabase = await createServerClientSide();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { error } = await supabase
    .from("closet_items")
    .delete()
    .eq("user_id", user.id)
    .eq("status", status);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
