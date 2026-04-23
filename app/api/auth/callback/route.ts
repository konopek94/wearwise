import { NextResponse } from 'next/server';
import { createServerClientSide } from '../../../../lib/supabase-server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/closet';
  const lang = searchParams.get('lang') ?? 'en';

  if (code) {
    const supabase = await createServerClientSide();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}/${lang}${next}`);
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/${lang}/login?error=auth-code-error`);
}
