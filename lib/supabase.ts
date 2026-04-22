import { createBrowserClient } from '@supabase/ssr';

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

// For browser-side usage
export const createClient = () => {
  const { url, key } = getEnv();
  return createBrowserClient(url, key);
};

// Maintain the old singleton for now as a browser client
export const supabase = (function() {
  const { url, key } = getEnv();
  return createBrowserClient(url, key);
})();
