import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

const getEnv = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return { 
      url: supabaseUrl || 'https://placeholder.supabase.co', 
      key: supabaseAnonKey || 'placeholder' 
    };
  }
  return { url: supabaseUrl, key: supabaseAnonKey };
};

export async function createServerClientSide() {
  const cookieStore = await cookies();
  const { url, key } = getEnv();

  return createServerClient(url, key, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value, ...options });
        } catch {
          // The `set` method was called from a Server Component.
        }
      },
      remove(name: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value: '', ...options });
        } catch {
          // The `remove` method was called from a Server Component.
        }
      },
    },
  });
}
