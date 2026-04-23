import { NextResponse } from "next/server";
import { createServerClientSide } from "../../../../lib/supabase-server";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { status } = await req.json();

  if (!status || !['history', 'wardrobe'].includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const supabase = await createServerClientSide();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  const { error } = await supabase
    .from('closet_items')
    .update({ status })
    .eq('id', id)
    .eq('user_id', user.id); // Explicit user check for defense in depth

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createServerClientSide();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  const { error } = await supabase
    .from('closet_items')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id); // Explicit user check for defense in depth

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
